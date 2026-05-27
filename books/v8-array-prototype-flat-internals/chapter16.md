---
title: "まとめ"
free: true
---

V8 の `Array.prototype.flat` は三段階の進化を経て現在の形に至っています。CSA で誕生したあと、Torque に移行して `FastJSArrayWitness` 経路を獲得し、最後に二パス構成の `TryFastFlat` と `CalculateFlattenedLengthFast` が加わって ElementsKind ベースの最終長算出が可能になりました。

現行実装は 610 行の単一ファイルに収まっています。3072 エントリの明示スタック、複数の bailout 経路、`FastJSArrayForCopy` と `FastJSArrayForReadWitness` による protector ガード、ElementsKind の単一化、という四つの仕掛けで、仕様等価性とパフォーマンスを同時に成立させている形です。

設計の見どころは、要素を支える土台の整合性にあります。ElementsKind の整数値が NativeContext の Map スロットインデックスと一対一対応している、PACKED と HOLEY の判定が `kind % 2` で済む、`the_hole` と `kHoleNanInt64` で hole を tagged / double 両方の世界で表現できる、`kEmptyFixedArray` を read-only シングルトンとして全 JSArray に共有させる、そして protector による「楽観的仮定の検証可能化」によって仕様の動的意味論を「intact なら fast、破られたら bailout」という二元論に圧縮できている、というところまでが連動して効いています。flat の二パス設計はこの土台の上に「事前計測してから一回確保」というシンプルな最適化を載せただけで、4 倍を超える速度向上を達成しているわけです。
