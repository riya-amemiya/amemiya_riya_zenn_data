---
title: "FlattenIntoArraySlow と仕様準拠"
free: true
---

`FlattenIntoArraySlow` は仕様文のステップ番号 (a, b, i, ii, iii ...) をコメントとして残しながら、ECMA の擬似コードを逐語的に Torque に書き下した実装です。

## 仕様操作との対応

| 仕様の操作 | Torque での呼び出し | 動作 |
| --- | --- | --- |
| `HasProperty(source, P)` | `HasProperty(source, sourceIndex)` | proxy なら `[[HasProperty]]` トラップ、通常オブジェクトでも `LookupIterator` 起動 |
| `Get(source, P)` | `GetProperty(source, sourceIndex)` | generic な property lookup、getter / proxy / prototype chain を辿る |
| `IsArray(element)` | `ArrayIsArray_Inline(element)` | JSArray は直接 true、JSProxy は `runtime::ArrayIsArray` で C++ ランタイムに降りる |
| `CreateDataPropertyOrThrow` | `FastCreateDataProperty(target, targetIndex, element)` | append 専用 fast path とそれ以外の slow path に内部分岐 |
| 再帰呼び出し | `FlattenIntoArrayWithoutMapFn` builtin | 各層で fast→slow 二段構成を再起動 |

## fast path との性能差の出どころ

slow path がなぜ遅いかを切り分けると、四つの要因に分かれます。

| 要因 | fast path | slow path |
| --- | --- | --- |
| 要素アクセス | `LoadElementNoHole` 単発 (tagged ロード) | `HasProperty` + `GetProperty` の 2 回 `LookupIterator` |
| 配列判定 | Map レベルの型ガード | `runtime::ArrayIsArray` の C++ ランタイム呼び出し |
| 再帰のコスト | 反復化済み (明示スタック) | builtin 呼び出しのフレーム作成 + `PerformStackCheck` を毎階層 |
| 書き込み先 | 事前確保した `FixedArray` / `FixedDoubleArray` への直書き | `PACKED_SMI` から始まる空配列に `CreateDataProperty` で逐次追加 |

最後の点が地味に効いていて、`ArraySpeciesCreate(context, o, 0)` で作られた長さ 0 の `PACKED_SMI` 配列に対して `FastCreateDataProperty` を 1 要素ずつ呼ぶ構造です。Define Own Property 経由なので、デフォルトの fast property add でも内部で `LookupIterator` を使い、要素ごとに ElementsKind 遷移と elements backing store の拡張・再配置が起こりうる、というのが現実的なコスト構造です。

## FastCreateDataProperty の内部分岐

| 経路 | 発火条件 | 処理 |
| --- | --- | --- |
| append fast path | receiver が `FastJSArray`、key が non-negative Smi、index が length 以下、value の型が elements kind と整合 | append または index への直接書き込み |
| Slow ラベル | 上記の条件を一つでも満たさない | `CreateDataProperty(receiver, key, value)` ランタイム呼び出し |

Smi elements で value が Smi でない、double elements で value が Number でない、といったケースが Slow に落ちる典型例で、ElementsKind 遷移を避ける作りになっています。
