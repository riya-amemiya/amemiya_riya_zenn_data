---
title: "Bailout の分類"
free: true
---

fast path の中で `goto Bailout` が発火する箇所は、性質ごとに分類するとおおまかに七種類に分かれます。

最初の分類は map 変異の検出です。`fastOW.Recheck() otherwise goto Bailout` が `CalculateFlattenedLengthFast` と `TryFastFlat` の三つの走査ループそれぞれに置かれていて、内部では `stable.map != map` または `IsNoElementsProtectorCellInvalid()` を検査します。getter コールバックの中で `Object.setPrototypeOf` などにより配列の形が変わったケースを捕捉する役割です。

次が length 切り詰めの検出です。`if (index >= fastOW.Get().length) goto Bailout` が同じ三箇所に並んでいて、getter 内で `arr.length = 3` のように配列長を縮められたケースを補足します。`regress-crbug-1507416.js` の TestShrink ケースがこの経路を踏みます。

Smi オーバーフローの検出は `math::TrySmiAdd` と `math::TrySmiSub` の `otherwise goto Bailout` で行われます。長さ計算や target / source index の進行で使われていて、Smi が 32 ビット環境では 31 ビット幅しかないため、非常に大きい結果配列で発火する可能性があります。とはいえ深さ 1024 の制限が事前に効くことが多く、実際に発火する頻度は低めです。

スタック溢れの検出は `if (stack.length >= kMaxFlatFastStackEntries) goto Bailout` で、深さ 1024 を超える入れ子で発火します。サイクル `a.push(a)` がここを引きます。

Cast 失敗系は多岐にわたります。`Cast<FastJSArrayForRead>(source)`、子要素の `Cast<FastJSArrayForRead>(element)`、`elementArray.length` の `Cast<Smi>`、各種 currentLength のキャスト、スタックポップ時の再キャスト、`Cast<FastJSArrayForCopy>(receiver)` など、走査中に ElementsKind が遷移して `FastJSArray*` 型ガードを満たさなくなったケース、length が Smi 範囲外になったケース、入力 receiver が proxy だったケースなどを一括で捕捉します。

Proxy 専用の早期 bailout も独立して用意されています。`if (currentDepth > 0 && Is<JSProxy>(element)) goto Bailout` が三つの走査ループに置かれていて、depth > 0 で要素が proxy のときに発火します。proxy は `IsArray` で配列と判定されうるため、fast path で proxy のトラップを発火させないように slow path に逃がす設計です。depth == 0 なら要素はそのままコピーされるだけで配列扱いされないので、proxy でも bailout は発生しません。

整合性の最終チェックが `if (targetIndex != flattenedLength) goto Bailout` です。第一パスで計算した長さと第二パスで実際に書き込んだ件数の食い違いを検出する、最後の安全弁になります。

double 配列の第二パスでは、`if (Convert<intptr>(targetIndex) >= doubleElements.length_intptr) goto Bailout` の境界チェックも入っています。通常パスでは同じく `vector.fixedArray.length_intptr` との比較で発火します。

`FlattenIntoArrayFast` 側の Bailout は形が少し違っていて、`(Number, Number)` 引数を取って `targetIndex` と `smiSourceIndex` を呼び出し元に返す仕様です。`FlattenIntoArray` 側の label Bailout でこの値を受け取り、走査済み要素を slow path が再走査しないで済むよう、その進捗から再開します。発火箇所は、source が FastJSArray でないとき、Recheck 失敗時、length 切り詰めの検出時の三つです。
