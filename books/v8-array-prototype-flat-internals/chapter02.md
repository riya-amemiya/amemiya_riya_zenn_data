---
title: "ECMAScript 仕様アルゴリズム"
free: true
---

仕様の `Array.prototype.flat ( [ depth ] )` は本体 7 ステップと、抽象操作 `FlattenIntoArray` の二段構成です。

## 本体 7 ステップ

| ステップ | 内容 |
| --- | --- |
| 1 | `O = ToObject(this value)` |
| 2 | `sourceLen = ToLength(Get(O, "length"))` |
| 3 | `depthNum = 1` (既定値) |
| 4 | `depth` が undefined でなければ `depthNum = ToInteger(depth)` |
| 5 | `A = ArraySpeciesCreate(O, 0)` |
| 6 | `FlattenIntoArray(A, O, sourceLen, 0, depthNum)` |
| 7 | A を返す |

## FlattenIntoArray の擬似コード

```
FlattenIntoArray(target, source, sourceLen, start, depth [, mapper, thisArg]):
  targetIndex = start
  sourceIndex = 0
  while sourceIndex < sourceLen:
    P = ToString(sourceIndex)
    if HasProperty(source, P):
      element = Get(source, P)
      if mapper:
        element = Call(mapper, thisArg, [element, sourceIndex, source])
      shouldFlatten = false
      if depth > 0:
        shouldFlatten = IsArray(element)
      if shouldFlatten:
        elementLen = ToLength(Get(element, "length"))
        targetIndex = FlattenIntoArray(target, element, elementLen,
                                       targetIndex, depth - 1)
      else:
        if targetIndex >= 2^53 - 1: throw TypeError
        CreateDataPropertyOrThrow(target, ToString(targetIndex), element)
        targetIndex += 1
    sourceIndex += 1
  return targetIndex
```

## 仕様が持つ四つの本質的性質

| 性質 | 帰結 |
| --- | --- |
| `HasProperty` 経由でアクセス | 穴がスキップされ `[1, , 3].flat()` が `[1, 3]` を返す |
| 配列判定が `IsArray` | `@@isConcatSpreadable` ではなく Array exotic または Array を包む Proxy のみ平坦化対象 |
| 結果生成が `ArraySpeciesCreate` | `Symbol.species` をサポート |
| `targetIndex >= 2^53-1` で `TypeError` | `Number.MAX_SAFE_INTEGER` を超える書き込みをブロック |

`TypeError` の文面は `src/common/message-template.h` で `FlattenPastSafeLength` として定義されていて、「Flattening % elements on an array-like of length % is disallowed, as the total surpasses 2**53-1」が出ます。Torque 側からは `kFlattenPastSafeLength` という名前で参照され、fast 側と slow 側の両方から送出されます。

## IsArray 抽象操作の実装

`ArrayIsArray_Inline` マクロが対応します。

| 要素の型 | 結果 |
| --- | --- |
| `JSArray` | `True` を直接返す |
| `JSProxy` | `runtime::ArrayIsArray` で C++ ランタイムに降りて Proxy 内部を辿る |
| その他 | `False` |

Proxy が JSArray をラップするケースで `Array.isArray` が true を返す、という仕様の振る舞いをそのまま吸収する仕掛けになっています。

## depth 引数の境界処理

仕様には明示されていない実装上の工夫として、`depth` を `Cast<PositiveSmi>` で受け取る試みがあります。

| `depthNum` の値 | 採用される `depthSmi` |
| --- | --- |
| `PositiveSmi` で表せる範囲 | そのまま `depthSmi` |
| `depthNum <= 0` | 0 |
| それ以外 (`Infinity` を含む) | `kSmiMax` |

`Infinity` は `ToInteger` 後も `Number(Infinity)` のままなので `PositiveSmi` キャストが必ず失敗し `kSmiMax` に丸められます。ソース側のコメントが述べる通り、`kSmiMax` に到達する前にスタックオーバーフローで止まるため、観測可能な差は発生しません。
