---
title: "高速パス TryFastFlat の二パス設計"
free: true
---

`TryFastFlat` は二つのパスから成ります。最初のパスで `CalculateFlattenedLengthFast` が最終長と target ElementsKind を確定し、第二のパスで一度だけバッキングストアを確保して値を流し込む、という構成です。

## なぜ二パスなのか

一パスで済ませようとすると、`growable_fixed_array::GrowableFixedArray` で要素を訪問するたび `Push` する形になります。このコンテナの成長則は `new_capacity = current_capacity + (current_capacity >> 1) + 16` で、`JSObject::NewElementsCapacity` と同じ係数 1.5 の幾何級数です。償却計算量こそ O(n) ですが、その過程で要素の再配置 (`ExtractFixedArray`) が複数回発生し、書き込み総コストは `O(n log_{1.5}(n))` 程度のメモリトラフィックになります。さらに、結果サイズが事前に分からないため、最終的に `GrowableFixedArray.ToJSArray` で必要長まで切り詰めるコピーも追加で必要です。

二パス案だと走査は 2 回になりますが、各セルへの書き込みは 1 回ずつになり、再配置や末尾の縮小コピーは発生しません。さらに重要な利点が、ElementsKind を一回目の走査で確定できる点にあります。`FixedDoubleArray` のビット表現は `float64_or_undefined_or_hole` で tagged ポインタと互換性がないため、growable で `Object` を集めてから `PACKED_DOUBLE_ELEMENTS` に変換する場合は、すべての値を `Number → float64` で変換しながら専用配列にコピーする三回目のパスが避けられません。事前に長さと kind を決めてしまえば、第二パスで `AllocateFixedDoubleArrayWithHoles(SmiUntag(flattenedLength))` を呼び、`doubleElements.values[targetIndex] = Convert<float64_or_undefined_or_hole>(UnsafeCast<Number>(element))` の一行で tagged Number を直接 float64 表現に書き込めます。boxing も unboxing も完全に消えるわけで、これが二パスを選んだ最大の理由です。

## 反復化と明示スタック

仕様の `FlattenIntoArray` は自分自身を再帰的に呼びます。そのまま実装すると、`FlattenIntoArrayWithoutMapFn` のような Torque builtin が深さの分だけ JS / C++ スタックフレームを積むことになります。一段あたり数百バイトを使うので、深い入れ子では `SIGSEGV` を起こすか、`PerformStackCheck` で `RangeError` が投げられるかのどちらかに行き着きます。

`TryFastFlat` の中では、二重 while ループを三箇所で同じパターンで使っています。内側ループは要素を線形に処理しますが、配列に出会ったら `(currentArray, nextIndex, currentDepth)` の三タプルを `stack.Push` し、内部状態を子配列に書き換えて `break` で内側を抜けて再走査に入ります。子の走査が終わると外側ループの末尾で 3 ポップして親に戻る、というやり方です。これは末尾呼び出し最適化と同等の効果を、手書きの状態機械として実現したものになります。

明示スタックの占有メモリは、1 エントリあたり Object ポインタ 1 つで、最大 3072 エントリ分です。実体は `GrowableFixedArray` の `EnsureCapacity` 経由で確保されるため、64 ビットビルドで 24 KB に収まります。深さ 1024 段の C++/JS スタックフレームと比較すると差は明らかで、フレーム一つあたり Torque builtin の引数 (target、source、sourceLength、start、depth、hasMapper、mapfn、thisArgs の 8 個) と保存レジスタ、戻りアドレス等で軽く数百バイトはかかります。再帰では数百 KB から MB オーダーに膨らみ OS のガードページに達して `SIGSEGV` になりますが、明示スタックはヒープ上にあるため `kMaxFlatFastStackEntries` で上限を固定でき、超えても `goto Bailout` で slow path に逃がせます。

## kMaxFlatFastStackEntries = 3072

定数宣言には「Fast path safety valve: avoid unbounded explicit stack growth on cyclic nesting by bailing out to the slow path after a fixed depth. 3 entries per depth: array, index, depth (depth limit = 1024)」というコメントが付いています。深さ 1024 段に、一段あたり 3 値で 3072、という計算です。

サイクル `a.push(a)` のような自己参照配列でも、fast path はバイアウトせず探索を続けます。`a` を一階層降りるごとにスタックに 3 エントリ積み、`currentDepth` を 1 ずつ減らしていく動きです。`a.flat(Infinity)` は `depthSmi = kSmiMax` に切り上げられるため、`stack.length >= kMaxFlatFastStackEntries` のチェックがスタック深さ 1024 で必ず先に発火します。バイアウト後は slow path に切り替わり、`FlattenIntoArraySlow` の再帰がスタックを食い始めます。やがて `FlattenIntoArrayWithoutMapFn` の冒頭で呼ばれる `PerformStackCheck` が `address_of_jslimit` と現在の `sp` を比較し、限界に達した時点で `Runtime::kStackGuard` を呼んで `RangeError("Maximum call stack size exceeded")` が投げられます。これが `test/mjsunit/regress/regress-8708.js` の `--stack-size=100` 環境で `assertThrows(() => array.flat(Infinity), RangeError)` が成立する流れです。

## PerformStackCheck が二箇所にある理由

`PerformStackCheck` は `CalculateFlattenedLengthFast` の冒頭と、`FlattenIntoArrayWithoutMapFn` builtin の冒頭の二箇所で呼ばれます。これは、それぞれが本質的に独立したパスを通るからです。

`CalculateFlattenedLengthFast` 自体は再帰しない反復実装ですが、呼び出し元の `TryFastFlat` がさらに上位の Torque builtin から呼ばれているため、その時点で残りのネイティブスタックが浅い状況もあり得ます。明示スタックでヒープを 24 KB まで食いつつ、`growable_fixed_array::NewGrowableFixedArray` の確保や `AllocateFixedArrayWithHoles` の確保で GC が走る可能性もあります。GC ハンドラ自体がスタックを消費するため、関数頭で `PerformStackCheck` を入れて事前に余裕を確認しておく、という設計になっています。

`FlattenIntoArrayWithoutMapFn` 側のチェックは別の理由から必要です。ソースコメントに「This builtin might get called recursively, check stack for overflow manually as it has stub linkage」と明記されている通り、Torque の `builtin` 宣言はスタブリンケージで呼ばれます。JS フレームではなく内部 ABI で動くため、JS 関数呼び出し境界で V8 が自動挿入する stack guard は通りません。`FlattenIntoArraySlow` が `FlattenIntoArrayWithoutMapFn` を再帰呼び出しするため、入れ子配列の各層でこの builtin が呼ばれることになります。仕様準拠の再帰下降路で唯一のチェックポイントがこの builtin のエントリで、ここで `PerformStackCheck` を欠かすと深い入れ子で V8 自身が `SIGSEGV` を起こしてしまいます。

`FlattenIntoArrayWithMapFn` 側に明示の `PerformStackCheck` がないのは、`flatMap` の仕様が depth = 1 固定で再帰しないからです。

## PerformStackCheck の中身

`PerformStackCheck` の宣言は `src/builtins/base.tq` の `extern macro PerformStackCheck(implicit context: Context)(): void;` で、実装は `src/codegen/code-stub-assembler.cc` にあります。

```
void CodeStubAssembler::PerformStackCheck(TNode<Context> context) {
  Label ok(this), stack_check_interrupt(this, Label::kDeferred);
  TNode<UintPtrT> stack_limit = UncheckedCast<UintPtrT>(
      Load(MachineType::Pointer(),
           ExternalConstant(ExternalReference::address_of_jslimit(isolate()))));
  TNode<BoolT> sp_within_limit = StackPointerGreaterThan(stack_limit);
  Branch(sp_within_limit, &ok, &stack_check_interrupt);
  BIND(&stack_check_interrupt);
  CallRuntime(Runtime::kStackGuard, context);
  Goto(&ok);
  BIND(&ok);
}
```

JS スタックリミットは Isolate ごとに一つ持っていて、`isolate->stack_guard()->jslimit()` の値を外部参照経由でロードします。スレッドのスタックで「これ以下を割ったらスタックオーバーフロー」というアドレスです。`StackPointerGreaterThan(stack_limit)` は SP > stack_limit、つまり「まだ余裕がある」を真にして、偽なら deferred な `stack_check_interrupt` ブロックに飛んで `Runtime::kStackGuard` を呼びます。deferred ラベルなので通常パスは直線的に `ok` に進み、機械コード上は条件分岐と通常パスがフォールスルーで一直線に並ぶ形になります。
