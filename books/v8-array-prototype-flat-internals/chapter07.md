---
title: "TryFastFlat の第二パス"
free: true
---

`TryFastFlat` の本体は、第一パスが返した `FlattenedLengthResult` (length と targetKind) を元に、バッキングストアを一回だけ確保して値を流し込みます。targetKind に応じて経路が二つに分かれます。

## PACKED_DOUBLE 専用経路

`targetKind == ElementsKind::PACKED_DOUBLE_ELEMENTS` の場合は専用の分岐に入ります。最初に `AllocateFixedDoubleArrayWithHoles(SmiUntag(flattenedLength))` で `FixedDoubleArray` を確保するのが入口です。

このマクロの動作は二段階で、まず `AllocateFixedArray(PACKED_DOUBLE_ELEMENTS, capacity, flags)` を呼んでから `FillFixedArrayWithValue(PACKED_DOUBLE_ELEMENTS, ..., RootIndex::kTheHoleValue)` を呼びます。実体は `StoreDoubleHole` で、`kHoleNanInt64` ビットパターン (`0xFFF7FFFF_FFF7FFFF`) を 64 ビットストアで書き込みます。

値を格納する一行は次のようになっています。

```
doubleElements.values[targetIndex] =
    Convert<float64_or_undefined_or_hole>(UnsafeCast<Number>(element));
```

tagged Number の `element` を `Convert<float64_or_undefined_or_hole>` で float64 表現に変換し、`FixedDoubleArray::values[]=` operator で生 float64 を書き込む形です。

tagged 経路と比較したときの速度差にはいくつかの要因があります。第一に、`FixedArray<Object>` 経由なら tagged Number (Smi または HeapNumber ポインタ) をそのまま `objects` セルに書き込むことになるため、結果を `PACKED_DOUBLE_ELEMENTS` の JSArray にしたければ後段で全要素を unbox する追加パスが必要になります。第二に、HeapNumber は 1 個 16 バイトの独立ヒープオブジェクトなので、leaf に float64 値が n 個あれば最悪 16n バイトの HeapNumber 群と 8n バイトの tagged ポインタ配列、合計 24n バイトと、プロモーション用 write barrier のコストを支払うことになります。`FixedDoubleArray` 直書きなら 8n バイトのみで、HeapNumber アロケーションは 0、write barrier も不要 (double セルは GC ルートとして辿られないため) です。第三に、SIMD やストアバッファ的な観点でも、連続 8 バイト書き込みのほうがハードウェア的に効率的です。

## PACKED_ELEMENTS / PACKED_SMI_ELEMENTS 経路

一般経路は `NewFlatVector(flattenedLength)` で FixedArray を確保するところから始まります。マクロ本体は `length > 0 ? AllocateFixedArrayWithHoles(SmiUntag(length)) : kEmptyFixedArray` の三項演算で、結果を `FlatVector` struct にラップして返します。

`AllocateFixedArrayWithHoles` の動作も二段階で、`AllocateFixedArray(PACKED_ELEMENTS, capacity, flags)` で領域を取った後、`FillFixedArrayWithValue(PACKED_ELEMENTS, ..., RootIndex::kTheHoleValue)` で全スロットを `the_hole_value` ROOT で初期化します。`the_hole_value` は read-only space に置かれた `TheHole` シングルトンへのポインタで、世代間ポインタを作らないため write barrier も不要です。

値の書き込みは `vector.StoreResult(targetIndex, element);` の一行で、`FlatVector` の macro 経由で `fixedArray.objects[index] = result` を実行します。最後に `vector.CreateJSArray(info.targetKind)` で対応 Map を `LoadJSArrayElementsMap(targetKind, LoadNativeContext(context))` から取り、`NewJSArray(map, fixedArray)` を組み立てて返す流れになります。

## 結果検証

両経路の終盤に `if (targetIndex != flattenedLength) goto Bailout` の整合性チェックが配置されています。第一パスで計算した長さと第二パスで実際に書き込んだ件数が食い違ったときの最後の安全弁です。get accessor 実行中に配列の状態が変わるなど、Recheck で捕捉できなかった微妙な差分が出たときの保険として効きます。
