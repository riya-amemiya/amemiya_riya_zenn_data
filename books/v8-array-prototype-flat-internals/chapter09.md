---
title: "Bailout の分類"
free: true
---

fast path で `goto Bailout` が発火する箇所は、性質ごとに七種類に分類できます。

## 発火条件の一覧

| 分類 | 発火条件 | 想定シナリオ |
| --- | --- | --- |
| Map 変異検出 | `fastOW.Recheck()` で `stable.map != map` または `IsNoElementsProtectorCellInvalid()` | getter 内で `Object.setPrototypeOf` などにより配列の形が変わった |
| Length 切り詰め | `if (index >= fastOW.Get().length)` | getter 内で `arr.length = 3` のように長さを縮めた (`regress-crbug-1507416` TestShrink) |
| Smi オーバーフロー | `math::TrySmiAdd` / `TrySmiSub` の `otherwise goto Bailout` | 巨大な結果配列で targetIndex や targetLength が Smi 範囲を超える |
| スタック溢れ | `stack.length >= kMaxFlatFastStackEntries` | 深さ 1024 超の入れ子、サイクル `a.push(a)` |
| Cast 失敗 | `Cast<FastJSArrayForRead>` / `Cast<FastJSArrayForCopy>` / `Cast<Smi>` 等の失敗 | ElementsKind が遷移して fast 型ガードを外れた、length が非 Smi、receiver が proxy |
| Proxy 早期 bailout | `currentDepth > 0 && Is<JSProxy>(element)` | 平坦化対象になりうる proxy 要素 (depth == 0 ならコピー対象なのでスキップ) |
| 整合性チェック | `targetIndex != flattenedLength` | 第一パスと第二パスで書き込み件数が食い違った |

## 第二パスの境界チェック

第二パスではバッキング容量との比較が追加で入ります。

| 経路 | 境界チェック |
| --- | --- |
| PACKED_DOUBLE | `Convert<intptr>(targetIndex) >= doubleElements.length_intptr` |
| 通常 | `Convert<intptr>(targetIndex) >= vector.fixedArray.length_intptr` |

## FlattenIntoArrayFast 側の Bailout の特殊性

仕様準拠経路の中の fast 区間 (`FlattenIntoArrayFast`) は、Bailout ラベルに `(targetIndex, sourceIndex)` の二つの `Number` 引数を持たせる珍しい設計です。

```mermaid
flowchart LR
    FF[FlattenIntoArrayFast] -->|Bailout(target, source)| FS[FlattenIntoArraySlow]
    FS -->|残りの進捗から再開| End[戻り値]
```

走査済みの要素を slow path が再走査しないよう、進捗位置を引数で受け渡す形になっています。発火箇所は次の三つです。

| 発火箇所 | 条件 |
| --- | --- |
| 入口 | source が `FastJSArray` でない |
| ループ内 | `Recheck` 失敗 |
| ループ内 | `smiSourceIndex >= fastOW.Get().length` |
