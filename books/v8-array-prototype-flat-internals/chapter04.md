---
title: "ElementsKind とその遷移"
free: true
---

`src/objects/elements-kind.h` の `enum ElementsKind : uint8_t` が ElementsKind 全体の定義です。値は Map の `bit_field2` 内に 6 ビットで格納されます。

fast 系の値は 0 から順に並んでいます。`PACKED_SMI_ELEMENTS = 0`、`HOLEY_SMI_ELEMENTS = 1`、`PACKED_ELEMENTS = 2`、`HOLEY_ELEMENTS = 3`、`PACKED_DOUBLE_ELEMENTS = 4`、`HOLEY_DOUBLE_ELEMENTS = 5` です。この並びには二つの設計意図があります。一つは packed と holey を隣同士に置いて packed → holey が `+1` (`kFastElementsKindPackedToHoley`) で表せる点、もう一つは奇数なら holey、偶数なら packed という対応で `IsHoleyElementsKind` が `kind % 2 == 1` で済む点です。

それぞれの意味は次のようになります。`PACKED_SMI_ELEMENTS` は Smi のみを格納し穴がない状態で、バッキングは `FixedArray` ですが各スロットには tagged Smi が直接埋め込まれます。`HOLEY_SMI_ELEMENTS` は Smi と `the_hole` だけを格納する `FixedArray` です。`PACKED_ELEMENTS` は任意の `JSAny` を格納し穴がない状態、`HOLEY_ELEMENTS` はそこに `the_hole` も許す `FixedArray` を表します。`PACKED_DOUBLE_ELEMENTS` と `HOLEY_DOUBLE_ELEMENTS` はバッキングが `FixedDoubleArray` で、Smi / HeapNumber を意識せず生の double をインラインで詰めます。`DICTIONARY_ELEMENTS` はバッキングを `NumberDictionary` ハッシュテーブルに切り替えた slow パスで、配列が sparse になる、巨大すぎる、`Object.defineProperty` で記述子付きの要素を入れる、といった理由で fast から落とされたときに使われます。

遷移規則 (`IsMoreGeneralElementsKindTransition`) は格子状で、一方向にしか進みません。`PACKED_SMI → HOLEY_SMI → HOLEY_DOUBLE → HOLEY_ELEMENTS` の道を辿り、`PACKED_DOUBLE` は `HOLEY_DOUBLE` か `PACKED/HOLEY_ELEMENTS` への遷移しか許されません。最終端は `HOLEY_ELEMENTS` (`TERMINAL_FAST_ELEMENTS_KIND`) です。double と tagged のあいだはバッキングストアの型自体が変わるため別経路 (`GrowCapacityAndConvert`) を通り、それ以外の同じ表現幅での遷移は Map を差し替えるだけで済みます。

PACKED と HOLEY の差は実装上きわめて重要です。コンパイラがロード時の hole チェックを省略できるかどうか、というのが本質です。PACKED であれば hole が混ざらないことが Map レベルで保証されているため、TurboFan と Maglev は分岐なしの単純ロードを発行できます。HOLEY だと毎回 hole 比較が必要になり、結果が hole なら slow path に飛ばす経路を残さなければなりません。flat の結果が常に PACKED 系になるのは、後段のコードでこの最適化を享受させたいからで、`CalculateFlattenedLengthFast` は `seenObject` / `seenDouble` / `seenSmi` フラグを観測した最終結果として `PACKED_ELEMENTS` / `PACKED_DOUBLE_ELEMENTS` / `PACKED_SMI_ELEMENTS` のいずれかを選んで返します。

## hole の二つの表現

V8 における hole は「配列のそのインデックスに値が一度も書かれていない」状態を表すマーカーです。tagged な世界では `TheHole` という HeapObject シングルトン (`src/objects/hole.h`) として、`the_hole_value` という名前で read-only roots に登録されています。double の世界では HeapObject を置けないため、シグナル NaN の特定ビットパターン `kHoleNanInt64 = 0xFFF7FFFF_FFF7FFFF` を hole として転用します。

V8 が hole と undefined を区別する根拠は次の通りです。tagged 配列の `the_hole_value` はユーザコードから観測できない特別な HeapObject (`Hole` 型) で、`undefined_value` (Undefined 型) とは別のシングルトンであり、map も型も別物です。`LoadElementNoHole<FixedArray>` (`src/objects/js-array.tq`) では typeswitch で `TheHole` ケースを `IfHole` ラベルへ分岐させ、ユーザに返す前に必ず undefined への置換か飛ばすかが選択されます。double 配列でも `LoadElementNoHole<FixedDoubleArray>` が `kHoleNanInt64` を検出して同様に `IfHole` に飛ばします。

flat が hole を飛ばす実装は素直です。`fastOW.LoadElementNoHole(index) otherwise FoundHole` でロードを試み、hole なら `FoundHole` ラベルに飛んで `index++; continue;` で次の要素に進みます。ソースが HOLEY_* であっても、結果配列は穴のない PACKED_* になるのはこの挙動が効いているためで、仕様の「`HasProperty` で false なら飛ばす」と完全に整合します。

## kEmptyFixedArray シングルトン

`src/heap/setup-heap-internal.cc` で 1 回だけ確保される `empty_fixed_array` ROOT が `kEmptyFixedArray` の本体です。`AllocateRaw(FixedArray::SizeFor(0), AllocationType::kReadOnly)` で read-only space にヘッダだけのインスタンスを確保し、map を `fixed_array_map` にセット、length を 0、padding をクリアします。read-only space に置かれているため、全 Isolate と全 NativeContext からシングルトンとして共有でき、write barrier も不要で、GC で移動することもありません。

Torque からは `const kEmptyFixedArray: EmptyFixedArray = EmptyFixedArrayConstant();` (`src/builtins/base.tq`) として参照できます。flat の `NewFlatVector` では `length > 0 ? AllocateFixedArrayWithHoles(...) : kEmptyFixedArray` の三項演算でこの最適化を組み込んでいます。さらに `TryFastFlat` の早期分岐では、`flattenedLength == 0` のとき PACKED_SMI 用 map と `kEmptyFixedArray` を直接組み立てて `NewJSArray` で返してしまいます。

## NoElementsProtector

`src/execution/protectors.h` の `V(NoElements, NoElementsProtector, no_elements_protector)` として定義された Isolate-wide のセルが NoElementsProtector です。`kProtectorValid = 1` の間は「`Array.prototype` および `Object.prototype` に index 付き property (要素) が追加されていない」ことを保証します。誰かが `Array.prototype[42] = 'x'` のような操作を行うと `Invalidate` され、その後その Isolate では `kProtectorInvalid = 0` になって二度と戻りません。

このプロテクタが有効である限り、`FastJSArray` 上で hole を読んだ場合の prototype chain look-up を省略できます。hole がそのまま `undefined` として扱われる、あるいは flat の場合スキップされる、という挙動を信頼できるからです。flat の fast path は `FastJSArrayForReadWitness.Recheck()` で毎ループ `IsNoElementsProtectorCellInvalid()` を確認し、無効化された瞬間に bailout します。

`ArraySpeciesProtector` も同じ枠組みで、`Array[Symbol.species]` および `Array.prototype.constructor` の改変を検知します。flat の fast path はレシーバを `Cast<FastJSArrayForCopy>` でキャストしますが、`FastJSArrayForCopy` の型定義 (`src/objects/js-array.tq`) が「`FastJSArray` かつ ArraySpeciesProtector が intact」を要求するため、species がいじられた瞬間に CastError が発生し fast path 全体が bailout する形になります。
