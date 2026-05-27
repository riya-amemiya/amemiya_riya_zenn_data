---
title: "JSArray と FixedArray、FixedDoubleArray の物理表現"
free: true
---

V8 の配列は二つのオブジェクトの組み合わせで表現されます。`JSArray` が論理的な配列の外殻、`FixedArray` または `FixedDoubleArray` がバッキングストアです。

## JSArray のヘッダレイアウト

継承チェインは `HeapObject → JSReceiver → JSObject → JSArray` で、各レイヤが 1 スロットずつフィールドを足していくため、JSArray のヘッダはちょうど 4 スロット構成になります。

| オフセット | フィールド | 由来 | 型 |
| --- | --- | --- | --- |
| 0 | `map` | `HeapObject` | `TaggedMember<Map>` |
| 1 | `properties_or_hash` | `JSReceiver` | tagged |
| 2 | `elements` | `JSObject` | `TaggedMember<FixedArrayBase>` |
| 3 | `length` | `JSArray` | `TaggedMember<Number>` |

1 スロットは `kTaggedSize` で、ビルド構成によってサイズが変わります。

| ビルド構成 | スロットサイズ | ヘッダ全体 |
| --- | --- | --- |
| 64bit + ポインタ圧縮 | 4 バイト | 16 バイト |
| 64bit 非圧縮 | 8 バイト | 32 バイト |

`elements` は `FixedArray` / `FixedDoubleArray` / `NumberDictionary` / `SloppyArgumentsElements` などのバッキングストアへの tagged ポインタです。`length` は通常 Smi で、`kMaxArrayLength = kMaxUInt32` という ECMA 由来の上限内に収まります。

`map` フィールドの役割は重要です。ElementsKind、prototype、named property のレイアウトを一手に表現する mediator として働きます。6 種類の fast ElementsKind それぞれに対応する初期 Map は、`NativeContext` のスロット `JS_ARRAY_PACKED_SMI_ELEMENTS_MAP_INDEX` から `JS_ARRAY_HOLEY_DOUBLE_ELEMENTS_MAP_INDEX` まで隣接配置されているため、`ArrayMapIndex(kind) = int{kind} + FIRST_JS_ARRAY_MAP_SLOT` で添字が引けます。これが Torque マクロ `LoadJSArrayElementsMap(targetKind, LoadNativeContext(context))` が成立する根拠です。

## FixedArray の物理レイアウト

`HeapObject` の map word に続いて `uint32_t length_;` が来ます。各スロットは `kTaggedSize` で、`objects[i]` のアドレスは `OFFSET_OF_DATA_START(FixedArray) + i * kTaggedSize` です。

```
+----------------+ offset 0
| map word       |  kTaggedSize
+----------------+
| length (u32)   |  4 bytes
+----------------+
| optional pad   |  0 or 4 bytes
+----------------+ kFixedArrayHeaderSize
| objects[0]     |  kTaggedSize
| objects[1]     |
| ...            |
+----------------+
```

write barrier の挙動を意識しておくと、後段の最適化議論が追いやすくなります。

| 配列の要素種別 | バッキング Map | write barrier |
| --- | --- | --- |
| Smi 専用 (PACKED_SMI など) | `fixed_array_map` | `SKIP_WRITE_BARRIER` |
| 一般 tagged (PACKED など) | `fixed_array_map` | `UPDATE_WRITE_BARRIER` |
| COW | `fixed_cow_array_map` | 書き込み前に `ExtractFixedArray` で実コピー |

容量上限は `kMaxFixedArrayCapacity` で、通常モードで `128 * 1024 * 1024` 個、`V8_LOWER_LIMITS_MODE_BOOL` モードで `16 * 1024 * 1024` 個です。

## FixedDoubleArray の物理レイアウト

`PACKED_DOUBLE_ELEMENTS` と `HOLEY_DOUBLE_ELEMENTS` のバッキングは `FixedDoubleArray` です。ヘッダレイアウトは FixedArray と共通で、データ領域だけ `UnalignedDoubleMember values[]` に差し替わります。

| 項目 | FixedArray | FixedDoubleArray |
| --- | --- | --- |
| スロット幅 | `kTaggedSize` (4 または 8 バイト) | 8 バイト固定 |
| 格納値 | tagged ポインタまたは Smi | 生の IEEE 754 double |
| GC スキャン | tagged を辿る | スキャン対象外 (リーフ) |
| hole | `the_hole_value` (`Hole` HeapObject) | `kHoleNanInt64` (シグナル NaN) |

`kHoleNanInt64` は `(uint64_t(0xFFF7FFFF) << 32) | 0xFFF7FFFF = 0xFFF7FFFF_FFF7FFFF` で、`set_the_hole(index)` がこの値を 64 ビットストアで書き、`is_the_hole(index)` は同じビットパターンとの完全一致で判定します。普通の NaN を入れようとしたときは `set(index, value)` 側で `std::isnan(value)` を見て `std::numeric_limits<double>::quiet_NaN()` に置換し、hole と被らないように正規化します。`V8_ENABLE_UNDEFINED_DOUBLE` を有効にしたビルドでは `kUndefinedNanInt64 = 0xFFF6FFFF_FFF6FFFF` という別のシグナル NaN を `undefined` の表現として追加で使い分けます。

## Smi とポインタ圧縮

Smi は heap に存在しない即値で、tagged ポインタの最下位ビット (`kSmiTag = 0`) が 0 のものが Smi、1 のものが HeapObject として区別されます。

| プラットフォーム | 表現 | 値範囲 |
| --- | --- | --- |
| 32bit、または 64bit + 圧縮 (`SmiTagging<4>`) | `[31bit signed int][tag=0]` | `[-2^30, 2^30 - 1]` |
| 64bit 非圧縮 (`SmiTagging<8>`) | `[32bit signed int][31bit pad][tag=0]` | 32bit signed 整数全域 |

`FromIntptr` の実装は単純です。

```cpp
int smi_shift_bits = kSmiTagSize + kSmiShiftSize;
return Tagged<Smi>((value << smi_shift_bits) | kSmiTag);
```

ポインタ圧縮が有効なときは `Tagged_t = uint32_t` で `kTaggedSize = 4` になり、1 個の tagged 値が 4 バイトに圧縮されます。上位 32 ビットは ptr-compr cage のベースアドレスから復元します。

bit 0 = 0 を Smi タグに採用している理由は二つあります。一つは、Smi 同士の加減算をタグを剥がさずに行える点。もう一つは、ヒープオブジェクトのアドレスが偶数アラインになることで下位ビットをタグとして使える点で、これが `FixedArray::objects[]` のスロットで Smi と HeapObject の区別を write barrier 判定に組み込める仕組みになっています。

## HeapNumber

Smi に収まらない数値、つまり 32 ビット範囲を超える整数、すべての小数、NaN、Infinity 等は `HeapNumber` というヒープ割り当て型で保持されます。レイアウトは `HeapObject` ヘッダの直後に `UnalignedDoubleMember value_` を一つ持つだけです。

| 観点 | HeapNumber | FixedDoubleArray のスロット |
| --- | --- | --- |
| 値あたりサイズ | 16 バイト (ヘッダ + double) | 8 バイト |
| GC への影響 | リーフだがヘッダがスキャン対象 | スキャン対象外 |
| 値の入れ替え | 新規確保 + write barrier | インライン書き込みのみ |

数値計算で `FixedDoubleArray` 直接の `PACKED_DOUBLE_ELEMENTS` の方が遥かに効率的なのはこの差のためで、flat の高速パスが `seenDouble` を検出して `PACKED_DOUBLE_ELEMENTS` をターゲットに選ぶ大きな動機がここにあります。
