---
title: "ECMAScript 仕様アルゴリズム"
free: true
---

仕様 `Array.prototype.flat ( [ depth ] )` は、本体と抽象操作 `FlattenIntoArray` の二段構成になっています。

本体は 7 ステップです。受信者を `ToObject` でオブジェクト化し、`length` を `ToLength` で正規化、`depth` の既定値を 1 とおいて、引数が undefined でなければ `ToInteger` で整数化します。続いて `ArraySpeciesCreate(O, 0)` で空の結果配列を確保し、`FlattenIntoArray(A, O, sourceLen, 0, depthNum)` を実行、最後にその結果配列を返します。

抽象操作 `FlattenIntoArray(target, source, sourceLen, start, depth [, mapperFunction, thisArg])` の流れはもう少し細かいです。`targetIndex` を `start`、`sourceIndex` を 0 で初期化し、`sourceIndex < sourceLen` の間ループします。各反復で `P = ToString(sourceIndex)` を作り、`HasProperty(source, P)` が真のときだけ `Get(source, P)` で値を取り出します。mapper が指定されていれば、その場で `Call(mapperFunction, thisArg, « element, sourceIndex, source »)` の結果に置き換えます。

`shouldFlatten` は false で初期化し、`depth > 0` のときだけ `IsArray(element)` の結果で更新します。`shouldFlatten` が真なら `elementLen = ToLength(Get(element, "length"))` を求めて `FlattenIntoArray` を再帰し、戻ってきた `targetIndex` を採用します。偽なら `targetIndex >= 2^53-1` を超えていないかを確認し、`CreateDataPropertyOrThrow(target, ToString(targetIndex), element)` で書き込んでから `targetIndex` を一つ進めます。各反復の末尾で `sourceIndex` を 1 進め、ループを抜けたら `targetIndex` を返します。

この仕様には四つの本質的性質があります。第一に、`HasProperty` を通すため穴がスキップされ、`[1, , 3].flat()` は `[1, 3]` を返します。第二に、対象配列の判定に `@@isConcatSpreadable` ではなく `IsArray`、つまり Array exotic か、それを包む Proxy かを問うようになっており、これが `Array.prototype.concat` との大きな意味論の違いを生みます。第三に、結果配列の生成が `ArraySpeciesCreate` 経由のため `Symbol.species` をサポートします。第四に、`targetIndex >= 2^53-1`、つまり `Number.MAX_SAFE_INTEGER` を超える書き込みは `TypeError` でブロックされる安全弁が組み込まれています。

V8 はこのエラー文面を `FlattenPastSafeLength` として `src/common/message-template.h` 行 620 に定義しています。「Flattening % elements on an array-like of length % is disallowed, as the total surpasses 2**53-1」という文面で、Torque 側からは `kFlattenPastSafeLength` という名前で参照され、array-flat.tq の fast 側と slow 側の両方で送出されます。

仕様の `IsArray` 抽象操作は、array-flat.tq 冒頭の `ArrayIsArray_Inline` マクロが対応します。要素が `JSArray` なら直接 `True`、`JSProxy` なら `runtime::ArrayIsArray` で C++ ランタイムに降りて Proxy 内部のターゲットまで追跡、それ以外は `False` です。Proxy が JSArray をラップしているケースで `Array.isArray` が true を返す、という仕様の微妙な振る舞いをそのまま吸収する仕掛けになっています。

`depth` の境界処理は仕様には明示されていない実装上の工夫です。array-flat.tq では `Cast<PositiveSmi>` が成功すれば `depthSmi` としてそのまま使い、失敗した場合は `depthNum <= 0` なら 0、それ以外なら `kSmiMax` で切り上げる二段の分岐に落とします。`Infinity` は `ToInteger` 後も `Number(Infinity)` のままで `PositiveSmi` キャストが必ず失敗するため、`kSmiMax` (32 ビットでは 2^30-1、64 ビット非圧縮で 2^31-1) に丸められます。ソース側にコメントが残されている通り、`kSmiMax` に到達する前にスタックオーバーフローで止まるため、観測可能な差は発生しません。
