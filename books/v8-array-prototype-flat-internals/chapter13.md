---
title: "Torque から機械語までの変換パイプライン"
free: true
---

Torque は V8 が自分の builtin を書くために作った DSL です。ソースは `src/torque/` 配下の C++ 実装で、ビルド時の独立した実行可能ファイルとして動き、`.tq` ファイルを CSA を呼び出す C++ コード (`*-tq-csa.cc`、`*-tq-csa.h`) へ変換します。詳細は `docs/torque/architecture.md` と `docs/torque/user-manual.md` に書かれています。

修飾子の意味を、array-flat.tq 冒頭の `transitioning macro ArrayIsArray_Inline(implicit context: Context)(element: JSAny): Boolean` を例にして整理しておきます。

`macro` はインライン展開される関数で、Torque コンパイラがその本体を呼び出し側の CSA コードに展開します。ABI 境界を越える呼び出しは発生しません。一方 `builtin` は単一のコードオブジェクトに集約されたコードで、呼ぶ側はそのアドレスに通常のコールを発行します。array-flat.tq の `FlattenIntoArrayWithoutMapFn` がこの形で、`PerformStackCheck()` を呼びつつ自身を間接的に再帰させるため、独立した stack frame を持つ必要があり、`builtin` が選ばれているわけです。

`javascript builtin` は JavaScript の呼び出し規約 (this、arguments、target、newTarget) で呼ばれることを示します。array-flat.tq の `transitioning javascript builtin ArrayPrototypeFlat(js-implicit context: NativeContext, receiver: JSAny)(...arguments): JSAny` がそれで、`js-implicit` は native context、レシーバ、ターゲット、newTarget の四つだけ受けられる特殊な暗黙パラメタです。V8 では builtin closure に native context が直接埋め込まれているため、`NativeContext` を直接受け取ることで `LoadNativeContext(context)` を一度省ける、という小さな最適化が効きます。

`implicit context: Context` のほうは Scala 風の暗黙パラメタで、呼び出し側のスコープに同名の値が存在すれば自動的に渡されます。CSA への lowering 時には explicit 引数と一緒に並べられて、単一の C++ 関数引数列になります。

`transitioning` 修飾子は transient type の安全性を支える根幹です。これは「この macro / builtin は任意の JS を実行しうる」という情報をコンパイラに伝えるためのマーカーです。`Call(callback)` のようなもの、`runtime::*` のような C++ への呼び出し、ユーザ定義 getter を踏むあらゆる操作が transitioning に該当します。Torque の型システムは、transient type の値 (`FastJSArray`、`FastJSArrayForRead` など) を transitioning な呼び出しをまたいで使うことをコンパイル時に禁じます。array-flat のトップレベルがすべて `transitioning` 修飾されているのは、mapper コールバック、getter、proxy trap、`runtime::ArrayIsArray` の呼び出しなど、JS の挙動が連鎖する可能性のあるすべての箇所をコンパイラに認識させるためです。

`labels Bailout` はローカルな非局所ジャンプを表します。generated CSA コードでは `CodeStubAssemblerLabel*` がそのマクロのシグネチャに引数として追加されます。`CalculateFlattenedLengthFast(...) labels Bailout` は、呼び出し側で `otherwise Bailout` を書くことで bailout 先のブロックを必須にし、マクロ内では `goto Bailout` でその外側のブロックへ脱出する仕掛けです。fast path 用のマクロが「失敗時は呼び出し側がスローパスに落とす」という制御フローを ABI コストなしで表現できる仕組みになっています。

CSA は `src/codegen/code-stub-assembler.h` の `class V8_EXPORT_PRIVATE CodeStubAssembler : public compiler::CodeAssembler, public TorqueGeneratedExportedMacrosAssembler` として宣言されている `compiler::CodeAssembler` の派生クラスです。`CodeAssembler` 自体は TurboFan のグラフを直接組み立てるための C++ ファサードで、内部に `std::unique_ptr<RawMachineAssembler> raw_assembler_;` と `JSGraph* jsgraph_;` を持っています。

Torque から CSA への変換の流れは次のようになります。`src/torque/torque-compiler.cc` の `CompileCurrentAst` がエントリで、`PredeclarationVisitor::Predeclare`、`PredeclarationVisitor::ResolvePredeclarations`、`DeclarationVisitor::Visit`、`TypeOracle::FinalizeAggregateTypes`、`ImplementationVisitor::VisitAllDeclarables` という順序で処理が進みます。`ImplementationVisitor` は AST を CFG (`src/torque/cfg.h`) に変換し、CFG のブロックには `instructions.h` で定義された低水準命令 (Branch、Goto、CallCsaMacro、CallBuiltin、Return、LoadReference、StoreReference、UnsafeCast など) が並びます。

CSA バックエンドの実体は `src/torque/csa-generator.cc` です。`CSAGenerator::EmitGraph` がブロックを走査し、各命令を `EmitInstruction` のオーバーロード群が C++ ソースとして書き出します。生成物は `out/<config>/gen/torque-generated/src/builtins/array-flat-tq-csa.cc` のようなファイルで、`mksnapshot` のビルドに含まれます。`mksnapshot` 実行時に、これらの C++ 関数が `CodeAssemblerState` を介して `RawMachineAssembler` にノードを追加します。これが sea-of-nodes 表現の本体で、`JSGraph` に集約されます。

sea-of-nodes は compiler 配下の TurboFan 表現で、ノードが演算を、エッジが control flow と data flow をそれぞれ別に持ち、同じノードが両方の依存を表現できる構造です。Torque の Branch は最終的に IfTrue / IfFalse ノードに、Goto は Merge / Phi の組み合わせに、Call は Call ノードと effect / control エッジに、Load は Load と memory effect エッジに、というふうに降りていきます。

そのあとは `CodeAssemblerCompilationJob` (`src/compiler/code-assembler-compilation-job.h`) がバックエンド (instruction selection、register allocation、code emission) を回します。instruction selection は `src/compiler/backend/<arch>/instruction-selector-<arch>.cc` でアーキテクチャ依存、register allocation は `src/compiler/backend/register-allocator.cc`、code emission が最終的にバイト列を吐き、`mksnapshot` がそれをスナップショットに焼きます。起動時にはこれが復元され、`Builtins::code(Builtin::kArrayPrototypeFlat)` で取り出せる Code オブジェクトとして JS から呼べる状態になります。

## TrySmiAdd / TrySmiSub

宣言は `src/builtins/math.tq` の `extern macro TrySmiAdd(Smi, Smi): Smi labels Overflow;` で、実体は `src/codegen/code-stub-assembler.cc` です。Smi の機械表現はプラットフォームによって二通りあり、振る舞いが少し異なります。64 ビットポインタプラットフォームの `SmiValuesAre32Bits()` のケースでは、Smi は上位 32 ビットに整数値を持つ tagged word で、下位 32 ビットは tag (0) です。この場合は IntPtrAdd 一発で済み、CPU の overflow フラグを利用する `IntPtrAddWithOverflow` を呼んで overflow を見ます。32 ビットプラットフォーム、または 64 ビットでも Smi が 31 ビットのケースでは、タグビット 1 つを除いた 31 ビットに値が入っているため、一旦 int32 にトランケートしてから `Int32AddWithOverflow` で計算し、結果を tagged 形式に戻します。

`Int32AddWithOverflow` は machine operator で、x64 でいえば `addl` 命令の OF フラグを Boolean として project する仕組みになります。オーバーフロー時には `GotoIf(overflow, if_overflow)` で渡された `Label*` (Torque から見れば bailout label) に飛びます。array-flat.tq では `math::TrySmiAdd(targetLength, subLen) otherwise goto Bailout` の形で書かれていて、Smi 範囲を超えそうな加算が即 bailout で slow path に任される仕掛けです。fast path は Smi 演算と branch だけで構成され、boxing も Number への upgrade も発生しません。

## ArraySpeciesCreate

宣言は `src/builtins/base.tq` の `extern macro ArraySpeciesCreate(Context, JSAny, Number): JSReceiver;`、実装は `src/codegen/code-stub-assembler.cc` です。最終的には runtime call `Runtime_ArraySpeciesConstructor` が `Object::ArraySpeciesConstructor` を呼び出す形になります。

この関数の論理は ECMA-262 22.1.3.2 `ArraySpeciesCreate` の要約です。`o` が JSArray で initial array prototype を持ち、`Protectors::IsArraySpeciesLookupChainIntact(isolate)` が真なら、すぐに `isolate->array_function()` (デフォルトの Array コンストラクタ) を返します。これが fast path です。そうでなければ `o.constructor` を取り、さらにその `[Symbol.species]` を取り、non-undefined な constructor が得られればそれを使う、という流れになります。
