---
title: "FlattenIntoArraySlow と仕様準拠"
free: true
---

`FlattenIntoArraySlow` は仕様文のステップ番号 (a, b, i, ii, iii, ...) をそのままコメントとして残しながら、ECMA の擬似コードを逐語的に Torque に書き下した実装です。

property の存在確認には `HasProperty(source, sourceIndex)` を呼びます。これは仕様の `HasProperty` 抽象操作で、proxy なら `[[HasProperty]]` トラップが発火し、通常オブジェクトでもプロトタイプチェーンを辿る `LookupIterator` が走ります。

値の取得は `GetProperty(source, sourceIndex)` です。これも generic な property lookup で、proxy トラップ、getter、プロトタイプチェーン経由のフォールバックがすべて扱われます。`IsArray` 判定は `ArrayIsArray_Inline(element)` で行われ、JSArray なら直接 true、JSProxy なら `runtime::ArrayIsArray` で C++ ランタイムに降りてハンドラチェーンを辿り、それ以外は false が返ります。

fast path との比較で、slow path がなぜ遅くなるのか、その原因を整理しておきます。第一に、要素アクセスごとに少なくとも `HasProperty` と `GetProperty` の 2 回の `LookupIterator` が起動します。tagged pointer の add とロードで済む fast path の `LoadElementNoHole` と比べると、ひと桁以上重い処理です。第二に、`IsArray` 判定が proxy 経路では `runtime::ArrayIsArray` のランタイム呼び出しを伴います。ランタイム呼び出しは C++ stub への遷移コストが大きく、これだけで数十ナノ秒オーダーかかります。第三に、再帰呼び出しが `FlattenIntoArrayWithoutMapFn` builtin への明示呼び出しになっており、builtin の呼び出しコスト (パラメータ詰め替え、フレーム作成、`PerformStackCheck`) を毎階層支払う形になります。第四に、ElementsKind 最適化が一切効きません。結果格納先は `ArraySpeciesCreate(context, o, 0)` で作られた長さ 0 の `PACKED_SMI` 配列で、そこに `FastCreateDataProperty(target, targetIndex, element)` を 1 要素ずつ呼んで書き込みます。Define Own Property 経由なので、デフォルトの fast property add でも内部で `LookupIterator` を使い、要素ごとに ElementsKind 遷移と elements backing store の拡張・再配置が起こりうる、というのが現実的なコスト構造です。

`FastCreateDataProperty` 自体は append 専用の fast path とそれ以外の slow path に分かれています。fast path は receiver が `FastJSArray`、key が non-negative Smi、index が length 以下、という条件をすべて満たすときに、`array.length` と等しければ append、そうでなければ index への直接書き込みを行います。`Smi` elements で value も Smi でなければスローへ、`double` elements で Number でなければスローへ、というふうに kind 遷移を避ける作りになっています。スローパスは label Slow に集約されて、最後は `CreateDataProperty(receiver, key, value)` ランタイムが呼ばれます。
