---
title: "flatMap との関係とコンパイル時特殊化"
free: true
---

`ArrayPrototypeFlatMap` は、仕様の上では `FlattenIntoArray` を depth = 1 固定で mapperFunction 付きで呼ぶエイリアスです。array-flat.tq の `FlattenIntoArrayWithMapFn(a, o, len, 0, 1, mapfn, t)` が、その仕様を一対一でなぞる形になっています。

dispatcher の `FlattenIntoArray` は `hasMapper: constexpr bool` というコンパイル時定数を引数に取り、これを `FlattenIntoArrayFast` と `FlattenIntoArraySlow` の両方に渡します。両方のマクロの内部には `if constexpr (hasMapper) { element = Call(context, mapfn, thisArgs, element, sourceIndex, source); }` というガードがあって、`if constexpr` は Torque のコンパイル時条件分岐なので、false の場合は当該ブロックが生成コードからまるごと消えます。

具体的には、`FlattenIntoArrayWithoutMapFn` は dispatcher を `FlattenIntoArray(..., false, Undefined, Undefined)` という形で呼ぶため、特殊化された生成コードに Call 命令は現れず、mapfn と thisArgs を保持するレジスタやスタックスロットも生成されません。一方 `FlattenIntoArrayWithMapFn` は `true, mapfn, t` を渡すので、別の特殊化が生成されます。結果として二つの builtin はそれぞれ独立した機械語コードを持ち、flat 経由のコードに mapper 関連のオーバーヘッドはまったく載らない構造です。

ただし、`TryFastFlat` 自体は mapper を受け取らない flat 専用の直接実装である点には注意が必要です。flatMap 側は dispatcher の `FlattenIntoArrayFast` に直接入り、そこで `if constexpr (hasMapper)` 分岐を経由します。これは、flatMap の depth = 1 という制約があるため、再帰や `TryFastFlat` のような明示スタックを必要としない、という設計判断によるものです。
