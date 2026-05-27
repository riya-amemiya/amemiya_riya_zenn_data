---
title: "全体像"
free: true
---

V8 の `Array.prototype.flat` 本体は、`src/builtins/array-flat.tq` という 610 行の Torque ファイル一つに収まっています。エントリポイントから内部マクロまでが一枚で完結しており、構造を追いやすい構成になっています。

JS から呼び出される入口は `ArrayPrototypeFlat` builtin です。ここで仕様前段にあたる処理、すなわち受信者の `ToObject`、`length` の取得、`depth` の整数化を済ませたうえで、`TryFastFlat` という Torque マクロに制御を渡します。これが高速パスの試行です。

`TryFastFlat` が前提条件を満たせず `SlowFastPath` ラベルへ脱出したときは、仕様忠実なフォールバック経路に切り替わります。`ArraySpeciesCreate` で結果配列を確保し、`FlattenIntoArrayWithoutMapFn` builtin を呼ぶ流れです。

`FlattenIntoArrayWithoutMapFn` 自体もさらに二段構えを持ちます。まず `FlattenIntoArrayFast` を試行し、その内部で `Bailout(targetIndex, sourceIndex)` ラベルに飛んだときは、走査済みの進捗を引数で受け取った `FlattenIntoArraySlow` がそこから引き継ぎます。入れ子配列を再帰下降する仕様準拠の経路では、各層で `FlattenIntoArrayWithoutMapFn` が再帰的に呼ばれるため、fast→slow の二段構成も層ごとに再起動する形になります。

`flatMap` 側は別エントリの `ArrayPrototypeFlatMap` builtin として独立していて、`FlattenIntoArrayWithMapFn` を経由します。ただし dispatcher の `FlattenIntoArray` 自体は flat と共通で、`hasMapper: constexpr bool` というコンパイル時定数で mapper の有無を切り分ける設計です。`flat` から呼ばれる経路では mapper 関連のコードが Torque の段階で完全に消えるため、機械語に余計なコストは乗りません。

builtin の登録は `src/init/bootstrapper.cc` の `SimpleInstallFunction` で行われ、`Array.prototype.flat` が length 0、`Array.prototype.flatMap` が length 1 として `Array.prototype` に並びます。`src/debug/debug-evaluate.cc` では両 builtin が副作用フリーとして登録されているため、デバッガからの評価でも安全に呼び出せます。
