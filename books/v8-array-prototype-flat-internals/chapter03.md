---
title: "JSArray と FixedArray、FixedDoubleArray の物理表現"
free: true
---

V8 の配列は二つのオブジェクトの組み合わせで表現されます。`JSArray` が論理的な配列の外殻、`FixedArray` または `FixedDoubleArray` がバッキングストアです。

## JSArray のヘッダ構造

定義は `src/objects/js-array.h` と `src/objects/js-array.tq` に分かれて置かれています。継承チェインは `HeapObject → JSReceiver → JSObject → JSArray` で、各レイヤが 1 スロットずつフィールドを足していくため、JSArray のヘッダはちょうど 4 スロット構成になります。

オフセット 0 に `map`、続いて `JSReceiver` 由来の `properties_or_hash`、`JSObject` 由来の `elements`、最後に `JSArray` 固有の `length` が並びます。1 スロットは `kTaggedSize` で、ポインタ圧縮を有効にした 64 ビットビルドなら 4 バイト、非圧縮なら 8 バイトです。ヘッダ全体は前者で 16 バイト、後者で 32 バイトになります。

`elements` は `TaggedMember<FixedArrayBase>` 型で、`FixedArray`、`FixedDoubleArray`、`NumberDictionary`、`SloppyArgumentsElements` といったバッキングストアへの tagged ポインタを保持します。`length` は `TaggedMember<Number>` 型で、通常は Smi ですが、`Array(n)` の `n` が Smi 範囲を超えると HeapNumber になることもあります。とはいえ `kMaxArrayLength = kMaxUInt32` という ECMA 由来の上限が `src/objects/js-array.h` で固められているため、現実には Smi で収まります。

`map` フィールドが担う役割は重要です。ElementsKind、prototype、named property のレイアウトを一手に表現する mediator として働きます。6 種類の fast ElementsKind それぞれに対応する初期 Map は、`NativeContext` のスロット `JS_ARRAY_PACKED_SMI_ELEMENTS_MAP_INDEX` から `JS_ARRAY_HOLEY_DOUBLE_ELEMENTS_MAP_INDEX` まで隣接配置されています。`ArrayMapIndex(kind) = int{kind} + FIRST_JS_ARRAY_MAP_SLOT` で添字が出るのはこのおかげで、Torque マクロ `LoadJSArrayElementsMap(targetKind, LoadNativeContext(context))` が成立する根拠になります。

## FixedArray の物理レイアウト

`src/objects/fixed-array.h` の `class FixedArray : public TaggedArrayBase<FixedArray, Object>` が本体です。レイアウトは `HeapObject` 部分の map word に続いて `uint32_t length_;` が来て、必要に応じて 4 バイトの `optional_padding_` が入ります。ポインタ圧縮なしの 64 ビットビルドでは、8 バイトの map word と 4 バイトの length に対して 4 バイトの padding を補って 8 バイト境界を保ちます。圧縮ありなら map word が 4 バイトなので、padding なしでちょうど 8 バイトに収まります。公式名は `kFixedArrayHeaderSize = 2 * kApiTaggedSize` です。

ヘッダの直後に `FLEXIBLE_ARRAY_MEMBER(TaggedMember<Object>, objects);` が続きます。各スロットは `kTaggedSize` バイトで、圧縮時 4 バイト、非圧縮時 8 バイトです。`objects[i]` のアドレスは `OFFSET_OF_DATA_START(FixedArray) + i * kTaggedSize` で計算され、Torque の `.objects[]` 演算子は `LoadFixedArrayElement` / `StoreFixedArrayElement` の extern macro に展開されます。

write barrier の挙動も覚えておくと、後の最適化議論が理解しやすくなります。デフォルトは要素型が Smi 専用なら `SKIP_WRITE_BARRIER`、それ以外は `UPDATE_WRITE_BARRIER` です。`PACKED_SMI_ELEMENTS` のバッキングストアは FixedArray ですが、値が全部 Smi なのでスロット書き込み時の世代間ポインタ追跡を省略できます。これがホットパスでのコスト差を生む大きな要因になります。

容量上限は `kMaxFixedArrayCapacity` で、通常モードで 128 * 1024 * 1024 個、`V8_LOWER_LIMITS_MODE_BOOL` モードで 16 * 1024 * 1024 個です。

COW (copy-on-write) は専用の ElementsKind を持ちません。`PACKED_SMI_ELEMENTS` や `PACKED_ELEMENTS` のまま、バッキング FixedArray の Map が `fixed_array_map` ではなく `fixed_cow_array_map` ROOT になっている、というだけの違いです。書き込み前に `EnsureWriteableFastElements` を呼んで `elements.map != kCOWMap` を確認し、COW なら `ExtractFixedArray` で実コピーしてから書き込む、という流れになります。

## FixedDoubleArray の物理レイアウト

`PACKED_DOUBLE_ELEMENTS` と `HOLEY_DOUBLE_ELEMENTS` のバッキングストアは `FixedDoubleArray` です。`src/objects/fixed-array.h` の `class FixedDoubleArray : public PrimitiveArrayBase<FixedDoubleArray, double>` がそれにあたります。ヘッダレイアウトは FixedArray と同じで、データ領域だけが `FLEXIBLE_ARRAY_MEMBER(ElementMemberT, values);` (`ElementMemberT = UnalignedDoubleMember`) に差し替わります。

各 double スロットは正確に 8 バイトです。alignment は `alignof(Tagged_t)` (圧縮時 4 バイト、非圧縮時 8 バイト) で、タグなしの生 IEEE 754 double がインラインで詰まります。Smi のような unbox / box を経由しないため、純粋な数値計算では tagged 配列より遥かに効率的です。GC 観点でも、`BodyDescriptor` 上では tagged ポインタを含まないリーフ型として扱われるため、スキャン対象に入らず GC コストが下がります。

hole の表現には専用のシグナル NaN ビットパターン `kHoleNanInt64 = 0xFFF7FFFF_FFF7FFFF` を使います。`set_the_hole(index)` がこの値を 64 ビットストアで書き、`is_the_hole(index)` は同じビットパターンとの完全一致比較を行います。普通の NaN を入れようとしたときは `set(index, value)` 側で `std::isnan(value)` を見て `std::numeric_limits<double>::quiet_NaN()` に置換し、hole と被らないように正規化します。`V8_ENABLE_UNDEFINED_DOUBLE` を有効にしたビルドでは、`kUndefinedNanInt64 = 0xFFF6FFFF_FFF6FFFF` という別のシグナル NaN を `undefined` の表現として追加で使い分けます。

## Smi とポインタ圧縮

`src/objects/smi.h` の `class Smi : public AllStatic` が定義する Smi は、ヒープに存在しない即値です。tagged ポインタの最下位ビット (`kSmiTag = 0`) が 0 のものを Smi、1 のものを HeapObject として区別します。

範囲はプラットフォームで異なります。32 ビット環境、または 64 ビット環境でポインタ圧縮ありの場合は `SmiTagging<4>` が使われ、`kSmiShiftSize = 0`、`kSmiValueSize = 31` で `[31-bit signed int][tag bit = 0]` というビットパターンになります。範囲は `[-2^30, 2^30 - 1]` です。64 ビットで圧縮なしの場合は `SmiTagging<8>` が使われ、`kSmiShiftSize = 31`、`kSmiValueSize = 32` で `[32-bit signed int][31 bits zero padding][tag bit = 0]` というレイアウトを取ります。範囲は 32 ビット signed 整数全域です。

`FromIntptr` の実装は単純で、`int smi_shift_bits = kSmiTagSize + kSmiShiftSize; return Tagged<Smi>((value << smi_shift_bits) | kSmiTag);` です。圧縮ありなら 1 ビット左シフトしてタグ 0 を付けるだけで Smi が出来上がります。

ポインタ圧縮が有効なときは、`Tagged_t = uint32_t` で `kTaggedSize = 4` になります。1 個の tagged 値が 4 バイトに圧縮され、上位 32 ビットは ptr-compr cage のベースアドレスから復元する形です。Smi タグも圧縮された 32 ビット内で完結します。

Smi タグを bit 0 = 0 にしている理由は二つあります。第一に、Smi 同士の加減算をタグを剥がさずに行える点。第二に、ヒープオブジェクトのアドレスが偶数アライン (`kHeapObjectTagMask` で 2 ビット確保されているため実際は 4 バイトアライン以上) になることで、下位ビットをタグとして使える点です。これが `FixedArray::objects[]` のスロットで Smi と HeapObject の区別を write barrier 判定に組み込める仕組みになっています。

## HeapNumber

Smi に収まらない数値、つまり 32 ビット範囲を超える整数、すべての小数、NaN、Infinity 等は `HeapNumber` というヒープ割り当て型で保持されます。`src/objects/heap-number.h` の `class HeapNumber : public PrimitiveHeapObject` です。レイアウトは `HeapObject` ヘッダの直後に `UnalignedDoubleMember value_` を一つ持つだけで、圧縮ありの 64 ビットビルドでは `value_` が 4 バイト境界に置かれた double として `base::ReadUnalignedValue<double>` で読み出されます。

GC 視点では、HeapNumber は payload に tagged ポインタを含みません。`BodyDescriptor` は map word だけスキャンすればよいリーフ型として扱われます。HeapNumber 自体は不変ではなく `set_value` / `set_value_as_bits` でビットパターンを書き換えられますが、配列要素として扱うときの問題は別にあります。Smi が HeapNumber にプロモートされるたびに新しい HeapNumber が allocate されるため、数値計算で配列を使うなら `FixedDoubleArray` 直接の `PACKED_DOUBLE_ELEMENTS` の方が遥かに効率的です。flat の高速パスが `seenDouble` を検出して `PACKED_DOUBLE_ELEMENTS` をターゲットに選ぶ大きな動機がここにあります。
