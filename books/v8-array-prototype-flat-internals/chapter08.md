---
title: "FastJSArrayWitness と Cast 階層"
free: true
---

## 透過型の階層

`src/objects/js-array.tq` には、fast 配列を表す transient 型が四つ宣言されています。

```
transient type FastJSArray extends JSArray;
transient type FastJSArrayForRead extends JSArray;
transient type FastJSArrayForCopy extends FastJSArray;
transient type FastJSArrayForConcat extends FastJSArrayForCopy;
```

実際の判定ロジックは `src/builtins/cast.tq` に集約されています。

`Cast<FastJSArray>` は、`IsForceSlowPath()` を確認した後、`Is<JSArray>(o)` であること、`IsFastElementsKind(elementsKind)` であること、prototype が initial array prototype であること、`IsNoElementsProtectorCellInvalid()` が偽であることを順に検証します。`IsForceSlowPath` は `--force-slow-path` フラグでデバッグ時に強制的に slow path を取らせるためのバルブで、production ビルドでは消えます。`IsFastElementsKind` は ElementsKind が fast 系六種類のいずれかであることを確認するもので、`PACKED_SMI`、`HOLEY_SMI`、`PACKED`、`HOLEY`、`PACKED_DOUBLE`、`HOLEY_DOUBLE` のうちどれかであれば真です。prototype 検査は、user-mutated された prototype だと getter が存在しうるため、initial prototype に限ることで proto chain の getter 不在を保証する役割を持ちます。

`Cast<FastJSArrayForRead>` は条件が少し緩く、`IsForceSlowPath()` の検査がなく、elements kind は `LAST_ANY_NONEXTENSIBLE_ELEMENTS_KIND` までを許容します。frozen array や sealed array まで含むため、fast に読めるが書き込めないケースまでカバーする型です。

`Cast<FastJSArrayForCopy>` は `Cast<FastJSArray>` に `IsArraySpeciesProtectorCellInvalid()` のチェックを足したものです。ArraySpecies protector が無効化されているのは、誰かが `Array[Symbol.species]` を再定義したり、prototype の `constructor` をいじったりしたケースです。intact のままなら、`o` から新しい配列を作るときに `o.constructor[@@species]` を見に行く必要がなく、デフォルトの `Array` を使えるという保証になります。

`FastJSArrayForConcat` はさらに `IsConcatSpreadableProtector` も加えて守られています。flat はこの型を使わず、concat 専用です。これが flat と concat の根本的なアーキテクチャ差を生む土台になっています。

array-flat.tq の `TryFastFlat` では、レシーバを `Cast<FastJSArrayForCopy>` でキャストする一方、再帰的に降りる子配列は `Cast<FastJSArrayForRead>` にしています。これは意味論を正確に反映した使い分けです。レシーバ側は flat の戻り値が `Array` インスタンスであることを保証するため species protector の検査が必要ですが、子配列は値を取り出すだけで新しい配列を作るわけではないため species を気にする必要がなく、frozen な配列が来ても読めれば十分なので ForRead で足ります。

## Witness パターン

transitioning な呼び出しを越えても fast path の前提条件を維持するための仕組みが Witness です。`FastJSArrayWitness` と `FastJSArrayForReadWitness` の二種類が `src/objects/js-array.tq` に用意されています。

`FastJSArrayWitness` のフィールド構成は次の通りです。

```
const stable: JSArray;
unstable: FastJSArray;
const map: Map;
const hasDoubles: bool;
const hasSmis: bool;
arrayIsPushable: bool;
```

`stable` は非 transient な `JSArray` として保持する「いつでも読める」ハンドルです。`unstable` は transient な `FastJSArray` 型で、transitioning な呼び出しの直後には型システムから消えます。透過型の前提を取り戻したいときに呼ぶのが `Recheck()` です。

```
macro Recheck(): void labels CastError {
  if (this.stable.map != this.map) goto CastError;
  if (IsNoElementsProtectorCellInvalid()) goto CastError;
  this.unstable = %RawDownCast<FastJSArray>(this.stable);
}
```

検査しているのは二つだけです。witness 作成時の map と現在の map が一致していること、そして `NoElementsProtector` が依然として有効であること。V8 の map モデルでは ElementsKind は map のフィールドに含まれていて、elements pointer 自体は別フィールドですが、map が同じであれば「fast elements、initial array prototype、hole の挙動が同一」という不変条件は引き継がれます。

長さの直接チェックはここでは行われず、`if (index >= fastOW.Get().length) goto Bailout;` のような形で呼び出し側に明示的に書きます。elements pointer は再取得されますが、map が同じであれば FixedArray と FixedDoubleArray の選別は不変なので、`hasDoubles` のような情報を const として保持しても問題ありません。

`FastJSArrayForReadWitness` は書き込み能力のないバージョンで、`Push` も `ChangeLength` も持たず、`LoadElementNoHole` だけが提供されます。array-flat の hot loop で使われているのは主にこちらで、再帰的にサブ配列を読みに行くため複数の witness を併用する必要があり、frozen / sealed elements も含めて読めるだけで十分という事情に合っています。

このパターンが副作用のある状況で安全に動く根拠を整理しておきます。mapper コールバックや getter は任意の JS を実行しうるので、map を変えたり、prototype に property を追加したり、length を切り詰めたりする可能性があります。witness の `Recheck()` は元の map と現在の map を一致確認するだけのシンプルな処理ですが、もし JS が map を transition させていれば不一致で `CastError` ラベルへ飛び、呼び出し側はそこで bailout します。array-flat.tq の `FlattenIntoArrayFast` では Call の前に `fastOW.Recheck() otherwise goto Bailout(targetIndex, smiSourceIndex);` を入れ、その直後に `if (smiSourceIndex >= fastOW.Get().length) goto Bailout(...)` も別途確認します。Recheck は length を再検証しないため、この追加チェックが必要になります。
