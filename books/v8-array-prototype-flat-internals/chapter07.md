---
title: "TryFastFlat の第二パス"
free: true
---

第一パスが返した `FlattenedLengthResult` (length と targetKind) を元に、バッキングストアを一回だけ確保して値を流し込みます。targetKind に応じて経路が二つに分かれます。

## 経路の振り分け

| target ElementsKind | 確保するバッキング | 値の書き込み |
| --- | --- | --- |
| `PACKED_DOUBLE_ELEMENTS` | `FixedDoubleArray` | `Convert<float64_or_undefined_or_hole>` で float64 直書き |
| `PACKED_ELEMENTS` / `PACKED_SMI_ELEMENTS` | `FixedArray` (または `kEmptyFixedArray`) | tagged をそのまま `objects[]` に書き込み |

## PACKED_DOUBLE 経路

`AllocateFixedDoubleArrayWithHoles(SmiUntag(flattenedLength))` で `FixedDoubleArray` を確保し、全スロットを `kHoleNanInt64` で初期化したうえで値を直接書き込みます。

```
doubleElements.values[targetIndex] =
    Convert<float64_or_undefined_or_hole>(UnsafeCast<Number>(element));
```

tagged 経由でなく `FixedDoubleArray` 直書きを選ぶことで、複数のコストが消えます。

| 観点 | tagged 経由で構築 | `FixedDoubleArray` 直書き |
| --- | --- | --- |
| HeapNumber アロケーション | 値 n 個あたり最悪 16n バイト | 0 |
| 配列本体のサイズ | tagged ポインタ配列で 8n バイト | 8n バイトの生 double |
| 合計メモリ | 最悪 24n バイト + write barrier | 8n バイト |
| 後処理 | 全要素 unbox する追加パスが必要 | 不要 |
| ハードウェア親和性 | tagged ポインタ書き込み | 連続 8 バイト書き込み |

## PACKED_ELEMENTS / PACKED_SMI_ELEMENTS 経路

一般経路は `NewFlatVector(flattenedLength)` で FixedArray を確保するところから始まります。マクロ本体は次のとおりです。

```
length > 0 ? AllocateFixedArrayWithHoles(SmiUntag(length))
           : kEmptyFixedArray
```

`AllocateFixedArrayWithHoles` は `AllocateFixedArray` の後に `FillFixedArrayWithValue(..., RootIndex::kTheHoleValue)` で全スロットを `the_hole_value` で初期化します。`the_hole_value` は read-only space のシングルトンなので、初期化時の write barrier も不要です。

値の書き込みは `vector.StoreResult(targetIndex, element);` の一行で `fixedArray.objects[index] = result` を実行します。最後に `vector.CreateJSArray(info.targetKind)` で対応 Map を `LoadJSArrayElementsMap(targetKind, LoadNativeContext(context))` から取り、`NewJSArray(map, fixedArray)` を組み立てて返します。

## 結果検証

両経路の終盤に整合性チェックが置かれています。

```
if (targetIndex != flattenedLength) goto Bailout;
```

第一パスで計算した長さと第二パスで実際に書き込んだ件数が食い違ったときの最後の安全弁です。get accessor 実行中に配列の状態が変わるなど、Recheck で捕捉できなかった微妙な差分が出たときの保険として効きます。
