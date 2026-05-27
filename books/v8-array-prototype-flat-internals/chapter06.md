---
title: "CalculateFlattenedLengthFast の詳細"
free: true
---

第一パスを担う `CalculateFlattenedLengthFast` は、最終長と target ElementsKind を一回の走査で確定します。

## PACKED 数値配列での早期短絡

ソース全体が `PACKED_SMI_ELEMENTS` か `PACKED_DOUBLE_ELEMENTS` のいずれかなら、要素を一切走査せずに `sourceLength` をそのまま返します。

```
if (sourceKind == ElementsKind::PACKED_SMI_ELEMENTS ||
    sourceKind == ElementsKind::PACKED_DOUBLE_ELEMENTS) {
  return FlattenedLengthResult{length: sourceLength, targetKind: sourceKind};
}
```

なぜ Packed だけで安全かというと、根拠が二つ揃っているからです。

| 根拠 | 内容 |
| --- | --- |
| 格納値の制約 | `FixedDoubleArray` と `FixedArray<Smi>` には JSArray も JSProxy も入らない |
| 長さの精度 | Packed の `array.length` は実要素数と厳密に一致 |

サブ配列での短絡もほぼ同じパターンで、要素 element が `PACKED_SMI` または `PACKED_DOUBLE` の JSArray なら `seenSmi = true` または `seenDouble = true` を立てて `subLen = elementArray.length` を加算するだけで済みます。

## HOLEY 派生を短絡対象から外す理由

`HOLEY_*` がこの早期 return から除外されている理由は二つあります。

| 理由 | 詳細 |
| --- | --- |
| 長さの過大算出 | `length` が穴を数えるため flat 結果より大きくなり、第二パスで `targetIndex != flattenedLength` の不変条件を破る |
| `V8_ENABLE_UNDEFINED_DOUBLE` との衝突 | `HOLEY_DOUBLE_ELEMENTS` は `undefined` ビットパターンを格納できるため、PACKED_DOUBLE と誤分類されると第二パスの `UnsafeCast<Number>(element)` が失敗する |

後者は `regress-crbug-488366773.js` で押さえられている crash で、`Object.defineProperty(a, '1', { get: function() {} })` で穴に getter を付けた後、`a.slice()` で HOLEY_DOUBLE を作り、`.flat()` を呼んだときに `undefined` が PACKED_DOUBLE 経路に流れ込んで落ちる、という症状でした。修正は早期 return を Packed のみに限定するというものです。

## target ElementsKind の判定

走査中に観測した leaf 要素の型を三つの bool フラグで記録します。

| フラグ | 立つ条件 |
| --- | --- |
| `seenSmi` | `TaggedIsSmi(element)` が真 |
| `seenDouble` | `IsNumber(element)` かつ `!TaggedIsSmi(element)` (HeapNumber) |
| `seenObject` | `!IsNumber(element)` |

最終的な target ElementsKind は格納能力の包含関係で決まります。Object スロットは任意の tagged を保持できるため最広、Double は Smi の値を float64 として保持できるので Smi より広く、Smi が最狭です。

| フラグの状態 | target ElementsKind |
| --- | --- |
| `seenObject` | `PACKED_ELEMENTS` |
| `seenObject` なし、`seenDouble` あり | `PACKED_DOUBLE_ELEMENTS` |
| `seenObject` も `seenDouble` もなし | `PACKED_SMI_ELEMENTS` |

## テストケースとの対応

`test/mjsunit/array-flat-elements-kind.js` がこのロジックを網羅的に検証しています。

| 入力 | 期待 target ElementsKind | 理由 |
| --- | --- | --- |
| `[1].flat()` | SMI | 全要素 Smi |
| `[1.1].flat()` | DOUBLE | HeapNumber を含む |
| `[[1],[1.1]].flat()` | DOUBLE | Smi が double に収まる |
| `[[1],[[1.1]]].flat()` | OBJECT | depth 1 で内側配列が leaf として残る |
| `[[1, "hello"]].flat()` | OBJECT | 文字列を含む |

`%HasSmiElements` / `%HasDoubleElements` / `%HasObjectElements` の native アサーションで結果配列の ElementsKind を確認しています。
