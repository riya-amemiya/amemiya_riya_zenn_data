---
title: "全体まとめと主要参照ファイル"
free: true
---

V8 における `Array.prototype.flat` は三段階の進化を経て現在の形に至っています。2018 年に CSA (`src/builtins/builtins-array-gen.cc::ArrayFlattenAssembler`) として誕生し、2023 年 12 月の bbe1122 で Torque (`src/builtins/array-flat.tq`) に移行し FastJSArrayWitness 経路で 4 倍速くなり、2026 年 2 月の 3eed742 で二パス TryFastFlat と CalculateFlattenedLengthFast による ElementsKind ベースの最終長算出が導入されてさらに 4.6 から 4.7 倍高速化された、という流れです。

現行 (HEAD 0ade545a) の実装は 610 行の単一ファイルに収まっており、3072 エントリのスタック上限と複数の bailout 経路、`FastJSArrayForCopy` および `FastJSArrayForReadWitness` による protector ガード、ElementsKind 単一化、という三本柱で仕様等価性とパフォーマンスを両立しています。

設計の美しさは、要素を支える土台の整合性にあります。ElementsKind の整数値が NativeContext の Map スロットインデックスと一対一対応している、PACKED と HOLEY の判定が `kind % 2` で済む、`the_hole` と `kHoleNanInt64` で hole を tagged / double 両方の世界で表現できる、`kEmptyFixedArray` を read-only シングルトンとして全 JSArray に共有させる、そして protector による「楽観的仮定の検証可能化」によって、仕様の動的意味論を「intact なら fast、破られたら bailout」という二元論に圧縮できている、というところまでが連動して効いています。flat の二パス設計はこの土台の上に「事前計測してから一回確保」というシンプルな最適化を載せただけで、4 倍を超える速度向上を達成しているわけです。

仕様準拠の状況は、test262 完全合格、V8 固有テストは harmony 四点、elements-kind 一点、regression 三点、wasm 連携六点が CI で通過、というのが現在の状態です。

## 主要参照ファイル一覧

実装本体は `src/builtins/array-flat.tq` の全 610 行です。型階層と Witness は `src/objects/js-array.tq`、Cast は `src/builtins/cast.tq`、`FastCreateDataProperty` は `src/builtins/base.tq`、`GrowableFixedArray` は `src/builtins/growable-fixed-array.tq` に置かれています。

Smi 演算、`PerformStackCheck`、`ArraySpeciesCreate` の CSA 実装は `src/codegen/code-stub-assembler.cc` にあります。Protector は `src/execution/protectors.h`、ElementsKind は `src/objects/elements-kind.h`、`FixedArray` と `FixedDoubleArray` は `src/objects/fixed-array.h`、Smi は `src/objects/smi.h` と `include/v8-internal.h`、`kHoleNanInt64` は `src/common/globals.h`、NativeContext の配列 Map スロットは `src/objects/contexts.h`、builtin の登録は `src/init/bootstrapper.cc`、副作用フリー登録は `src/debug/debug-evaluate.cc`、エラーメッセージは `src/common/message-template.h` です。

テストは `test/mjsunit/array-flat-elements-kind.js`、`test/mjsunit/harmony/array-flat.js`、`test/mjsunit/harmony/array-flatMap.js`、`test/mjsunit/harmony/array-flat-species.js`、`test/mjsunit/harmony/array-flatMap-species.js`、`test/mjsunit/regress/regress-8708.js`、`test/mjsunit/regress/regress-crbug-1507416.js`、`test/mjsunit/regress/regress-crbug-488366773.js`、そして `test/mjsunit/wasm/` 配下の resizable buffer 連携 6 ファイルです。

外部資料としては ECMAScript 仕様 (https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.flat)、V8 v6.9 リリースノート (https://v8.dev/blog/v8-release-69)、ElementsKind 解説 (https://v8.dev/blog/elements-kinds)、flat / flatMap 機能ページ (https://v8.dev/features/array-flat-flatmap)、MDN (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)、Zenn 記事 (https://zenn.dev/dinii/articles/675d47a6c21c83)、Gerrit CL (https://chromium-review.googlesource.com/c/v8/v8/+/7526287)、v8-dev メーリングリスト (http://www.mail-archive.com/v8-dev@googlegroups.com/msg162734.html) を参考にしました。
