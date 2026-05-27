---
title: "growable_fixed_array"
free: true
---

`src/builtins/growable-fixed-array.tq` の全 48 行が namespace 全体を含みます。中心になるのが struct `GrowableFixedArray` で、`Push` は `EnsureCapacity` の後に `array.objects[length++] = obj` というインライン書き込み、`ResizeFixedArray` は `ExtractFixedArray` で新しい容量へのコピーを行います。

`EnsureCapacity` の成長率は `current + (current >> 1) + 16`、つまり 1.5 倍に +16 を足す形です。初期は `kEmptyFixedArray` で容量 0 なので、最初の `Push` で 16 になり、次のリサイズで `16 + 8 + 16 = 40`、その次で `40 + 20 + 16 = 76`、と段階的に増えていきます。

array-flat.tq の `CalculateFlattenedLengthFast` と `TryFastFlat` では、再帰深さを表す手動スタックとしてこのコンテナを使っています。各段の `(currentArray, nextIndex, currentDepth)` の三つ組を `Push` し、リーフから戻るときに `Pop` する、というシンプルな使い方です。
