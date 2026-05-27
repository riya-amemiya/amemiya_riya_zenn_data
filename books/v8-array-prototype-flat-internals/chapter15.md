---
title: "テストカバレッジ"
free: true
---

V8 のローカルテストは大きく三系統に分かれます。harmony 配下の元来の機能テスト、regression テスト、そして WebAssembly の resizable buffer 連携テストです。test262 (`test/test262/data/test/built-ins/Array/prototype/flat/`) は本リポジトリには未同期ですが、tc39/test262 の external リポジトリ経由で CI で実行されていて、V8 は仕様準拠で完全合格しています。

## harmony テスト

`test/mjsunit/harmony/array-flat.js` (Copyright 2018) は仕様の基本契約をすべて網羅しています。`Array.prototype.flat.length === 0`、`name === 'flat'`、depth 引数の各種型 (Infinity、-Infinity、0、true、false、null、undefined、''、'foo'、/./、[]、{}、`new Proxy({}, {})`、関数、String) の処理、Symbol() と `Object.create(null)` での TypeError、`length: 'wat'` を持つ array-like、`get length()` の評価回数、property descriptor (`writable: true, enumerable: false, configurable: true`) の確認、といった具合です。

`test/mjsunit/harmony/array-flatMap.js` は flatMap の `length === 1` を確認したうえで、mapper 関数のスプレッド (`[1,2,3,4].flatMap(e => [e, e**2])`)、各種値での自己同型、非関数の TypeError、null / undefined receiver の TypeError、`length: 'wat'` の array-like、thisArg バインディング、length getter の副作用順序、property descriptor を確かめます。

`test/mjsunit/harmony/array-flat-species.js` と `array-flatMap-species.js` は `class MyArray extends Array { static get [Symbol.species]() { return Array; } }` のケースと `return this;` のケースとで、結果が MyArray インスタンスになるかを切り分けて検査します。

`test/mjsunit/array-flat-elements-kind.js` (Copyright 2025、3eed742 で追加) は ElementsKind の正確な決定をネイティブ関数 `%HasSmiElements` / `%HasDoubleElements` / `%HasObjectElements` で確かめるテストです。`[1].flat()` は SMI、`[1.1].flat()` は DOUBLE、`[[1],[1.1]].flat()` は DOUBLE (SMI が double に収まる)、`[[1],[[1.1]]].flat()` は OBJECT (内側配列がオブジェクト扱い)、`[["hello"]].flat()` は OBJECT、といった ElementsKind 推論を網羅します。

## regression テスト

regression テストは三つあります。

`test/mjsunit/regress/regress-8708.js` (Copyright 2019、`--stack-size=100` フラグ付き) は循環ネスト `array.splice(1, 0, array); array.flat(Infinity)` で `RangeError` (stack overflow) が投げられることを確かめます。現在は `kMaxFlatFastStackEntries = 3072` でも検知され、fallback 後の再帰呼び出し中の `PerformStackCheck()` で確実に補足される構造です。

`test/mjsunit/regress/regress-crbug-1507416.js` (Copyright 2023) は、最初の Torque 実装で見つかった三つの観測可能バグを一度に押さえる test です。TestGrow ケースは `[0,1,2,3].flatMap(e => { array[4] = 42; return e; })` で、mapper の副作用で配列が伸びても最初の四要素しか平坦化されないこと (仕様の `for sourceIndex < sourceLen` 不変条件) を確認します。TestGrow2 ケースは depth 引数評価中に配列が伸びる (`valueOf` で push) パターン、TestShrink は `array.length = 3` で配列を縮めるケースです。これらは初期の Torque 実装が `fastSource.length` をループ条件に直接使ったために起きた境界外読み出しで、d429a14 と 05122fe の段階的修正で `fastOW.Get().length` の都度比較に変わりました。

`test/mjsunit/regress/regress-crbug-488366773.js` (Copyright 2026) は HOLEY_DOUBLE + undefined クラッシュ修正の regression test です。`Object.defineProperty(a, '1', { get: function() {} })` で穴に getter を付け、`a.slice()` で HOLEY_DOUBLE_ELEMENTS かつ undefined を持つ配列を作り、`.flat()` で crash しないことを確かめます。`V8_ENABLE_UNDEFINED_DOUBLE` のもとで FixedDoubleArray に undefined を sentinel として格納できる新機能が、`CalculateFlattenedLengthFast` の早期 return を holey も含めて行っていたために PACKED_DOUBLE 第二パスの `UnsafeCast<Number>(undefined)` で crash していた、その問題を fix した代表テストです。

## wasm 連携テスト

`test/mjsunit/wasm/memory-resizable-buffer-array-flat-grows-detaches.js` ほか五ファイル (`memory-resizable-buffer-array-flat-flatmap-from.js`、`memory-resizable-buffer-array-flatmap-grows-detaches.js`、`shared-memory-resizable-buffer-array-flat-flatmap-from.js`、`shared-memory-resizable-buffer-array-flatmap-grows.js`、`shared-memory-resizable-buffer-array-flat-grows.js`) は、WebAssembly 共有または通常の ResizableArrayBuffer を裏に持つ TypedArray を receiver にして flat / flatMap を呼んだ際の振る舞いを確かめます。depth や mapper の `valueOf` 内で `rab.resize()` や `%ArrayBufferDetachForceWasm(rab)` が発火しても安全に動くこと、というのが主な検査対象です。
