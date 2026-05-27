---
title: "コミット史と性能改善の経緯"
free: true
---

ローカルリポジトリは shallow clone (boundary `33ca8a4017b75d3c7e81f0f88760fe1871b016bf`、2026-05-21、深さ 50) のため `array-flat.tq` のローカル履歴は途中までしか取れませんが、GitHub と Gerrit を経由してすべてのコミットを追跡できます。

## Torque 移行と初期バグ修正 (2023)

最初のコミットは `bbe112245dbfb472a8a818901c20037a7b39438f` (2023-12-01、JianxiaoLuIntel @ Intel、refs/heads/main@{#91307}) です。タイトルは「[builtin][tq] Optimize Array.prototype.flat」(Bug v8:14306) で、array-flat.tq ファイルの誕生コミットです。コミットメッセージには「Migrate the code to tq, add the fast path for FastJSArray using FastJSArrayWitness. Observe 4x improvement from the micro-benchmark mentioned in the issue.」と書かれています。`src/builtins/builtins-array-gen.cc` の `ArrayFlattenAssembler` (CSA 直書きの C++ 実装) から Torque への移行と、`FastJSArrayWitness` を使った fast path の導入で 4 倍の性能向上を達成しました。修正範囲は 8 ファイル、`+270/-267` 行で、`BUILD.bazel` / `BUILD.gn` / `builtins-array-gen.cc` / `builtins-definitions.h` / `base.tq` / `debug-evaluate.cc` / `array-flat.tq` (新規) の変更を含みます。レビュアーは Toon Verwaest と Igor Sheludko、Chromium Gerrit CL は 4899797 です。

その直後にバグ修正が三つ続きます。

`d429a146004aefa3161e87813bbfe749bb6a5002` (2023-12-05、Igor Sheludko、refs/heads/main@{#91350}) は「[builtin][tq] Fix Array.prototype.flat」(Bug v8:14306、chromium:1507416) で、最初の Torque 実装が「反復中に配列長が変わる」ケースで境界外読み出しを起こす問題を直しました。「Ensure that we haven't walked beyond a possibly updated length」というコメントとともに、`if (smiSourceIndex >= fastOW.Get().length) goto Bailout` が追加されています。

`05122fe4bfb06db1f0d7799da30b989d09cedced` (2023-12-06、Igor Sheludko、refs/heads/main@{#91367}) は「[builtin][tq] Fix Array.prototype.flat again」で、`d429a14` の修正が「配列が反復中に伸びる」ケースを壊した regression を直すパッチです。

`cf3e066e73eb0ca1dea0694aba33aa62777abef6` (2023-12-07、Igor Sheludko、refs/heads/main@{#91407}) は「[builtin][tq] Fix bad DCHECK in Array.prototype.flat」(Bug chromium:1509252 追加) で、`05122fe` で追加した `dcheck(sourceLength == fastSource.length)` が「depth 引数評価中に length が増える」シナリオで偽になる問題を直し、`dcheck(Is<Smi>(sourceLength))` への置き換えを行いました。

## 二パス高速路の導入 (2026)

`3eed742a70b10c8344023361ef7a292f20b6a33b` (2026-02-27、Riya Amemiya、refs/heads/main@{#105498}) は「[array] Add Torque fast path for Array.prototype.flat」で、この本でリファレンスとしている二パス高速路の本体です。コミットメッセージには「Add a fast path for Array.prototype.flat in Torque/CSA that uses a 2-pass approach: first compute the output length, then preallocate and write directly. This avoids runtime call overhead and is modeled after JSC's implementation but adapted for V8's elements/protector model.」と書かれています。

ここで述べられている設計上の前提条件は、スタックベースの反復走査で任意深さに対応すること、`NoElements` と `ArraySpecies` の各 protector が有効であること、proxy / accessor / 独自要素を含まないこと、ネストした配列も FastJSArray であること、外れた場合は既存スローパスへフォールバックすること、という五点です。「Performance improvement for large arrays(20M) is 3x~16x (in a single-run benchmark)」と報告されていて、`src/builtins/array-flat.tq` に `+344` 行、`test/mjsunit/array-flat-elements-kind.js` を `+48` 行新規追加した変更です。レビュワーは Olivier Flückiger と Leszek Swirski、Chromium Gerrit CL は 7526287、Chrome 147 (V8 14.7) で出荷されました。

`d14414bf2b18380bb76412058add2458b91f561a` (2026-03-02、Igor Sheludko、refs/heads/main@{#105522}) は「[cleanup] Unify all references to JS spec and proposals, pt.1」 (Bug 488059578) で、コメント中の URL を `https://tc39.es/...` 形式に統一する no-logic-change の変更です。array-flat.tq の `https://tc39.es/proposal-flatMap/#sec-FlattenIntoArray` や `https://tc39.es/proposal-flatMap/#sec-Array.prototype.flat` などのコメントがこのコミットの結果です。

`0232ed8f7c196b1acc21834a1f2c5d85fa866d6f` (2026-03-03、Riya Amemiya、refs/heads/main@{#105553}) は「[array] Fix flat fast path crash on HOLEY_DOUBLE with undefined」(Bug 488366773、488586038、489008235) で、ClusterFuzz が見つけた crash を 3 件まとめて修正しました。`CalculateFlattenedLengthFast` の early return を「真に packed な要素種別だけ」に限定し、HOLEY_DOUBLE_ELEMENTS が `V8_ENABLE_UNDEFINED_DOUBLE` 配下で undefined を含み得る、という事実が PACKED_DOUBLE 第二パスで `UnsafeCast<Number>` を crash させる問題を取り除いた変更です。修正範囲は `+5/-13` 行で、`GetPackedElementsKind()` ヘルパー macro を削除して `elements_kind` を直接参照する形に整理しました。同コミットで `regress-crbug-488366773.js` が追加されています。

`df80f04ef10c1ea9e52f6aee569094307341b737` (2026-04-27、Arash Kazemi、refs/heads/main@{#106826}) は「[sandbox] Convert FixedArray::length from Smi to uint32_t」 (Bug 375937549) で、array-flat.tq は `FixedArray::length` の型変更に伴う巻き込み修正です。

## ベンチマーク結果

性能改善のベンチマークは d8 で 20,000 outer × 1,024 chunks (約 20M 要素、depth=1) を 50 回中央値で取得しています。SMI は 181.06ms → 39.32ms (4.6 倍)、DOUBLE は 224.80ms → 48.21ms (4.7 倍)、OBJECT (文字列) は 190.80ms → 79.56ms (2.4 倍) という結果が報告されています。
