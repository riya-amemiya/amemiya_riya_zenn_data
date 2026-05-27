---
title: "実装の進化"
free: true
---

`Array.prototype.flat` の実装は、設計上意味のある三つの転換点を経て現在の形に到達しています。

## CSA から Torque への移行 (2023)

最初の大きな変化は、`src/builtins/builtins-array-gen.cc` の `ArrayFlattenAssembler` という CSA 直書きの C++ 実装から、`src/builtins/array-flat.tq` という Torque 実装への移行です。同時に `FastJSArrayWitness` を使った fast path が導入され、これだけでマイクロベンチマーク上で 4 倍の改善が報告されました。

ただし最初の Torque 実装には、反復中に source 配列の長さが変わるケースで境界外読み出しを起こすバグがありました。getter で配列を縮めたり、mapper の副作用で伸ばしたり、`depth` 引数の評価中に長さが変わったり、というシナリオです。fix は段階的に行われ、最終形では `fastSource.length` を直接ループ条件にせず、`fastOW.Get().length` の都度比較に変わりました。`Recheck` がレシーバの map と protector の状態しか見ない設計と組み合わさって、現在の bailout 構造が固まっています。

## 二パス高速路の導入 (2026)

次の大きな変化は、`TryFastFlat` と `CalculateFlattenedLengthFast` による二パス高速路の追加です。Torque 化された仕様準拠経路はそのままに、その手前に「最終長と target ElementsKind を一回目で確定し、二回目で一度だけ確保して値を流し込む」という別経路が挟まる形になりました。

設計上の前提は五つあります。スタックベースの反復走査で任意深さに対応すること、`NoElementsProtector` と `ArraySpeciesProtector` が有効であること、proxy / accessor / 独自要素を含まないこと、ネストした配列も `FastJSArray` であること、外れた場合は既存の slow path に滑らかにフォールバックすること、という条件のもとで成立します。20M 要素規模のベンチマークでは SMI 配列で約 4.6 倍、DOUBLE 配列で約 4.7 倍、文字列を含む OBJECT 配列で約 2.4 倍の改善が出ています。

## HOLEY_DOUBLE + undefined クラッシュ修正

この高速路にはひとつ落とし穴がありました。`V8_ENABLE_UNDEFINED_DOUBLE` 機能が有効なビルドでは、`HOLEY_DOUBLE_ELEMENTS` の `FixedDoubleArray` に `undefined` ビットパターンを直接格納できます。当初の `CalculateFlattenedLengthFast` は holey も含めて早期 return を行っていたため、`undefined` を含む holey double が PACKED_DOUBLE 第二パスの `UnsafeCast<Number>` に流れ込み、ClusterFuzz が三件のクラッシュを発見しました。

修正は短く、早期 return を「真に packed な要素種別」(PACKED_SMI と PACKED_DOUBLE) だけに限定するというものです。これによってホット経路の単純さを保ちつつ、新しい undefined-in-double セマンティクスとの衝突を回避しました。
