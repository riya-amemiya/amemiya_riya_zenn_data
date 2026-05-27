---
title: "flat と concat の意味論的差異"
free: true
---

flat / flatMap が `@@isConcatSpreadable` を使わず `IsArray` で配列性を判定する設計は、`Array.prototype.concat` との対比で見ると性質がはっきりします。

## 仕様レベルの違い

| 観点 | `Array.prototype.flat` | `Array.prototype.concat` |
| --- | --- | --- |
| 配列判定の基準 | `IsArray(element)` (Array exotic または Array を包む Proxy) | `IsConcatSpreadable(E)` (`@@isConcatSpreadable` 経由) |
| 引数の扱い | 全要素を順に走査、配列のみ平坦化 | 配列引数は unpacking、非配列は単独要素として連結 |
| 穴の扱い | `HasProperty` で false なら飛ばす (compact 化) | 素のスロットコピー (穴を保持) |
| array-like の扱い | `IsArray` false なら単独要素として書く | `@@isConcatSpreadable: true` を付ければ unpacking 可能 |

## 具体例での挙動の対比

| 入力 | `.flat()` | `.concat()` |
| --- | --- | --- |
| `[1, , 3]` を flatten | `[1, 3]` (穴が消える) | `[].concat([1, , 3])` → `[1, empty, 3]` (穴を保持) |
| `{length: 2, 0: 'a', 1: 'b'}` を平坦化 | 単独要素として書かれる | `@@isConcatSpreadable: true` を付与すれば unpacking |

## 実装側の型ガードの違い

意味論の違いはそのまま型ガードに反映されています。

| メソッド | 使う型 | 守る protector |
| --- | --- | --- |
| `flat` のレシーバ | `FastJSArrayForCopy` | `NoElementsProtector`、`ArraySpeciesProtector` |
| `flat` の子配列 | `FastJSArrayForRead` | `NoElementsProtector` |
| `concat` のレシーバと引数 | `FastJSArrayForConcat` | `NoElementsProtector`、`ArraySpeciesProtector`、`IsConcatSpreadableProtector` |

`concat` は `IsConcatSpreadable` を経由するぶん protector が一つ増え、それが intact である間は `@@isConcatSpreadable` のルックアップを省略できる、という構造になっています。`src/builtins/array-concat.tq` がこの型を使う代表例です。両者のアーキテクチャ差はこの一点に集約されます。
