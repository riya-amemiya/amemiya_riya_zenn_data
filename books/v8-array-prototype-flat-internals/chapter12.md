---
title: "flat と concat の意味論的差異"
free: true
---

flat / flatMap が `@@isConcatSpreadable` を使わず `IsArray` で配列性を判定する設計は、`Array.prototype.concat` との対比で見ると本質が分かりやすくなります。

concat は仕様で `IsConcatSpreadable(E)` を呼び、`@@isConcatSpreadable` が true、または undefined のとき (デフォルトで IsArray が真) に配列扱いします。さらに flat は「配列要素のみをフラット化し、それ以外は単独要素として書く」のに対して、concat は配列引数を unpacking しつつ非配列引数は単独要素として連結する、という違いがあります。穴の扱いも対照的で、flat と flatMap は穴をスキップして compact しますが、concat は spread される配列内の穴を保持します。後者は `HasProperty` を経由しないためです。

具体例で見ると差がはっきりします。`[1, , 3].flat()` は `[1, 3]` を返して穴が消えます。一方 `[].concat([1, , 3])` は `[1, undefined, 3]` ではなく `[1, empty, 3]`、つまり穴を保持した配列を返します。素のスロットコピーが行われるからです。array-like の扱いにも違いがあって、flat は `IsArray` で false が返る array-like (例えば `{length: 2, 0: 'a', 1: 'b'}`) を単独要素として書き込みますが、concat は `@@isConcatSpreadable: true` を付ければ array-like も unpacking する余地を与えます。

V8 の fast 実装側でも、この意味論の違いがそのまま型に反映されています。flat の `FastJSArrayForCopy` は `ArraySpeciesProtector` のみで守られていますが、concat の `FastJSArrayForConcat` はさらに `IsConcatSpreadableProtector` まで含めて守られていて、より厳しい型で要素アクセスを最適化しています。`src/builtins/array-concat.tq` がその使用例です。両者のアーキテクチャ差はこの一点に集約されています。
