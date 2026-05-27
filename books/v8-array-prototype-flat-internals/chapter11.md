---
title: "flatMap との関係とコンパイル時特殊化"
free: true
---

`ArrayPrototypeFlatMap` は、仕様の上では `FlattenIntoArray` を depth = 1 固定で mapperFunction 付きで呼ぶエイリアスです。

## flat と flatMap の対比

| 項目 | flat | flatMap |
| --- | --- | --- |
| JS エントリ | `ArrayPrototypeFlat` | `ArrayPrototypeFlatMap` |
| 内部呼び出し | `FlattenIntoArrayWithoutMapFn` | `FlattenIntoArrayWithMapFn` |
| depth | 引数で受ける (既定 1、Infinity 可) | 1 固定 |
| mapper | なし | 必須 |
| 専用 fast path (`TryFastFlat`) | あり | なし (dispatcher の `FlattenIntoArrayFast` に直接入る) |
| 任意深さ対応 | 明示スタックで反復化 | 再帰不要 |

## hasMapper による生成コード分岐

dispatcher の `FlattenIntoArray` は `hasMapper: constexpr bool` というコンパイル時定数を引数に取ります。`FlattenIntoArrayFast` と `FlattenIntoArraySlow` の内部で次のガードが入ります。

```
if constexpr (hasMapper) {
  element = Call(context, mapfn, thisArgs, element, sourceIndex, source);
}
```

`if constexpr` は Torque のコンパイル時条件分岐で、false の場合は当該ブロックが生成コードからまるごと消えます。

| 呼び出し側 | dispatcher への引数 | 機械語に残るもの |
| --- | --- | --- |
| `FlattenIntoArrayWithoutMapFn` | `(..., false, Undefined, Undefined)` | mapper 関連のコード一切なし |
| `FlattenIntoArrayWithMapFn` | `(..., true, mapfn, t)` | `Call` 命令と mapfn / thisArgs を保持するレジスタ |

二つの builtin はそれぞれ独立した機械語コードを持つため、flat 経由のコードに mapper のオーバーヘッドが一切載らない構造になっています。

## TryFastFlat を共有しない理由

`TryFastFlat` は mapper を受け取らず flat 専用です。flatMap が `TryFastFlat` を経由せず dispatcher の `FlattenIntoArrayFast` に直接入る背景には、depth = 1 という固定値があります。任意深さに対応する明示スタックや、長さの事前計測といった複雑な仕掛けが flatMap には不要なので、共有しない方が実装も生成コードもシンプルになります。
