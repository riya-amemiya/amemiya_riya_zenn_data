---
title: "CalculateFlattenedLengthFast の詳細"
free: true
---

## PACKED 数値配列での早期短絡

`CalculateFlattenedLengthFast` は、ソース全体が `PACKED_SMI_ELEMENTS` か `PACKED_DOUBLE_ELEMENTS` のいずれかなら、要素を一切走査せずに `sourceLength` をそのまま返します。

```
if (sourceKind == ElementsKind::PACKED_SMI_ELEMENTS ||
    sourceKind == ElementsKind::PACKED_DOUBLE_ELEMENTS) {
  return FlattenedLengthResult{length: sourceLength, targetKind: sourceKind};
}
```

これが安全な根拠は二つあります。一つは、`FixedDoubleArray` と `FixedArray<Smi>` には JSArray も JSProxy も格納できないという事実です。Smi は即値の数値、float64 はビット列で、サブ配列が `PACKED_SMI` なら全要素は Smi、`PACKED_DOUBLE` なら全要素は `float64_or_undefined_or_hole` のいずれかに限られます。したがって `depth > 0` であっても再帰する必要がなく、長さをそのまま結果に積めば済みます。もう一つは、Packed の場合に `array.length` と実要素数が厳密に一致するという点です。

サブ配列での短絡もほぼ同じ形で実装されています。要素 element が `PACKED_SMI` または `PACKED_DOUBLE` の JSArray なら、`seenSmi = true` または `seenDouble = true` を立てて `subLen = elementArray.length` を加算するだけで済みます。

HOLEY 派生をこの短絡から外している理由も二つあります。第一に、HOLEY では穴 (`TheHole` または `kDoubleHole`) が物理的に格納されているため、その分 `length` には穴の数も含まれてしまいます。仕様 `FlattenIntoArray` は `HasProperty` が false ならインデックスをスキップする動作なので、HOLEY で `subLen = array.length` を採用すると flat 結果の長さを過大に算出してしまいます。第二パスで確保した `FixedArray` / `FixedDoubleArray` の末尾に穴が残ったまま `NewJSArray` を返すか、`targetIndex != flattenedLength` の整合性チェックで `goto Bailout` する、というどちらかの結果に陥ります。第二の理由は `V8_ENABLE_UNDEFINED_DOUBLE` 機能の影響で、`HOLEY_DOUBLE_ELEMENTS` では `FixedDoubleArray` に `undefined` ビットパターンを直接格納できるようになりました。これを PACKED Double と誤分類すると、第二パスの `UnsafeCast<Number>(element)` で `element` が `Undefined` のときにキャストが失敗します。`test/mjsunit/regress/regress-crbug-488366773.js` がまさにこの crash 修正の regression test で、`Object.defineProperty(a, '1', { get: function() {} })` で穴に getter を付けた後 `a.slice()` で HOLEY_DOUBLE を作り、`.flat()` で `undefined` を含んだ結果が返ることを確認しています。

## target ElementsKind の判定

走査中に観測した leaf 要素の型を `seenSmi`、`seenDouble`、`seenObject` の三つの bool フラグで記録していきます。降下中に要素 element が JSArray なら子に潜るので型は問いません。子に潜らないケースで型判定を行い、`!IsNumber(element)` なら `seenObject`、`!TaggedIsSmi(element)` (つまり `IsNumber` かつ `!Smi` なので HeapNumber) なら `seenDouble`、`TaggedIsSmi(element)` なら `seenSmi`、というカスケードになっています。

最終的な判定は単純です。`seenObject` が立っていれば `PACKED_ELEMENTS`、それ以外で `seenDouble` なら `PACKED_DOUBLE_ELEMENTS`、それ以外は `PACKED_SMI_ELEMENTS` を選びます。この順序は ElementsKind の格納能力の包含関係に対応しています。Object スロットは任意の tagged ポインタを保持できるため Smi も HeapNumber も収まる最広の入れ物で、Double は Smi の値を float64 として保持できるので Smi より広く、Smi が最狭です。

このロジックは `test/mjsunit/array-flat-elements-kind.js` で網羅的にテストされています。`[[1],[1.1]].flat()` は Smi と double を含むサブ配列の混合なので結果は DOUBLE、`[[1],[[1.1]]].flat()` は外側 Smi と内側に double 配列を含むため depth 1 ではネスト配列 (JSArray) が leaf として残って結果は OBJECT、`[[1, "hello"]].flat()` は文字列を含むので OBJECT、という具合に、fast path の `seenObject` / `seenDouble` フラグが期待通りに検出することを確かめる構成になっています。
