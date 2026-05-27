---
title: "growable_fixed_array"
free: true
---

`src/builtins/growable-fixed-array.tq` の全 48 行が namespace 全体を含みます。中心となるのが struct `GrowableFixedArray` です。

## API の構造

| メソッド | 動作 |
| --- | --- |
| `Push(obj)` | `EnsureCapacity` の後、`array.objects[length++] = obj` を実行 |
| `EnsureCapacity` | 容量不足なら `ResizeFixedArray` を呼ぶ |
| `ResizeFixedArray` | `ExtractFixedArray` で新容量へコピー |
| `ToJSArray` | 最終長に切り詰めた `JSArray` を返す |

## 成長則

容量の増加則は `new_capacity = current + (current >> 1) + 16` で、係数 1.5 の幾何級数に固定オフセット +16 を足す形です。初期は `kEmptyFixedArray` で容量 0 なので、最初の `Push` で 16 にジャンプし、そこから 1.5 倍 + 16 で広がっていきます。

| Push 回数 (合計要素数) | リサイズ発生 | 確保後の容量 |
| --- | --- | --- |
| 1 | 発生 | 16 |
| 17 | 発生 | 40 (16 + 8 + 16) |
| 41 | 発生 | 76 (40 + 20 + 16) |
| 77 | 発生 | 130 (76 + 38 + 16) |
| 131 | 発生 | 217 (130 + 65 + 16) |

償却計算量は O(n) ですが、各リサイズで `ExtractFixedArray` による既存要素のコピーが発生するため、書き込み総コストは `O(n log_{1.5} n)` 程度のメモリトラフィックになります。

## array-flat での使い方

array-flat.tq では `GrowableFixedArray` を結果配列のためには使っていません。`TryFastFlat` の二パス設計が長さを事前に確定するので、結果バッキングは一回の `AllocateFixedArrayWithHoles` または `AllocateFixedDoubleArrayWithHoles` で済むからです。

その代わり `GrowableFixedArray` は、再帰深さを表現する手動スタックとして使われます。

| 用途 | 内容 |
| --- | --- |
| 各段の保存 | `(currentArray, nextIndex, currentDepth)` の三つ組を `Push` |
| 子のリーフから戻るとき | 三つ `Pop` して親の状態を復元 |
| 上限 | `kMaxFlatFastStackEntries = 3072` (深さ 1024 × 3 値) |

ヒープ上で増減するため、JS / C++ ネイティブスタックを使う場合のガードページ問題を回避できます。
