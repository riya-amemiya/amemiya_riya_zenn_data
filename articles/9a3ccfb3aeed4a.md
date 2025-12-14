---
title: "RxJSを基礎から理解する - すべてがストリームという世界観"
emoji: "🌊"
type: "tech"
topics: ["rxjs", "javascript", "typescript", "reactiveprogramming"]
published: false
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

RxJSを学ぶとき、多くの人がObservableやOperatorの使い方から入ります。しかし、RxJSの本質は「すべてがストリームである」という世界観にあります。
この記事では、RxJSの核心である「すべてがストリーム」という概念を中心にRxJSの基礎を解説します。

## ストリームという考え方

### 従来のプログラミングとの違い

従来のプログラミングでは、データは「点」として扱われます。

```javascript
let count = 0;
count = count + 1;
console.log(count);
```

変数 `count` は、ある瞬間の値を保持しています。過去の値も、将来の値も知りません。

リアクティブプログラミングでは、データは「線」として扱われます。時間軸上に並んだ値の連続、これがストリームです。

```txt
時間 -->
値:  0 --- 1 --- 2 --- 3 --- ...
```

この視点の転換が、RxJSを理解する鍵です。

### なぜストリームで考えるのか

Excelのスプレッドシートを想像してください。セルA1に数値を入れ、セルA2に `=A1*2` という数式を書くと、A1を変更するたびにA2は自動的に更新されます。

これがリアクティブプログラミングの本質です。「A1が変わったらA2を更新する」というコードを書く必要はありません。関係性を宣言するだけで、変化は自動的に伝播します。

RxJSはこの考え方をJavaScriptに持ち込みます。

### すべてがストリームになる

「すべてがストリーム」とは、あらゆるデータソースをストリームとして統一的に扱えるということです。

クリックイベント：

```txt
時間 -->
click --- click -------- click --- ...
```

HTTPレスポンス：

```txt
時間 -->
-------- response |
```

タイマー：

```txt
時間 -->
--- 0 --- 1 --- 2 --- 3 --- ...
```

WebSocketメッセージ：

```txt
時間 -->
-- msg -- msg ---- msg -- msg --- ...
```

これらは本来、別々のAPIで扱う必要がありました。

- `addEventListener`
- `fetch`
- `setInterval`
- `WebSocket`

RxJSはこれらをすべてObservableという単一の抽象化で扱います。

## RxJSの基本概念

### Observableが発行する3種類のもの

Observableは時間とともにデータを発行するものです。発行できるものは3種類あります。

- next: 通常の値で、発行されるたびにサブスクライバーに渡されます
- error: エラーが発生したことを通知します。さまざまな異常状態を表現でき、発行されるとストリームは終了します
- complete: そのストリームが正常に終了したことを通知します。発行されるとストリームは終了します

### Observableは遅延評価される

Observableの重要な特性は遅延評価です。
subscribeされるまで何も起きません。

```typescript
import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
  console.log('実行開始');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.complete();
});

console.log('subscribe前');
observable.subscribe(value => console.log(value));
console.log('subscribe後');
```

出力：

```txt
subscribe前
実行開始
1
2
subscribe後
```

Promiseは作成した瞬間に実行が始まりますが、Observableは購読されるまで待機します。
これにより、ストリームの定義と実行を分離できます。

### Observerはデータを受け取る

Observerはデータを受け取る側です。3つのコールバック関数で構成されます。

```typescript
const observer = {
  next: (value: number) => console.log('値:', value),
  error: (err: Error) => console.error('エラー:', err),
  complete: () => console.log('完了')
};

observable.subscribe(observer);
```

すべてのコールバックを定義する必要はありません。必要なものだけ指定できます。

```typescript
observable.subscribe({
  next: (value) => console.log(value)
});

observable.subscribe(value => console.log(value));
```

### Subscriptionで購読を管理する

Subscriptionは購読を管理するオブジェクトです。`unsubscribe()` で購読を解除できます。

```typescript
const subscription = observable.subscribe(value => console.log(value));

subscription.unsubscribe();
```

購読解除を忘れるとメモリリークの原因になります。特にコンポーネントのライフサイクルがある環境（Angular、Reactなど）では、コンポーネント破棄時に必ず解除が必要です。

複数のSubscriptionをまとめて管理できます。

```typescript
const subscription = new Subscription();

subscription.add(observable1.subscribe(console.log));
subscription.add(observable2.subscribe(console.log));

subscription.unsubscribe();
```

### Subjectは発行と購読を両方できる

Subjectは自分で値を発行でき、かつ購読もできる特殊なObservableです。

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe(v => console.log('A:', v));
subject.subscribe(v => console.log('B:', v));

subject.next(1);
subject.next(2);
```

複数の購読者に同じ値をマルチキャストできます。通常のObservableがユニキャスト（各購読者が独立した実行を持つ）なのに対し、Subjectはマルチキャスト（すべての購読者が同じ実行を共有）です。

### BehaviorSubjectは最新値を保持する

初期値を持ち、購読時に最新値を即座に受け取れます。状態管理に適しています。

```typescript
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject<number>(0);

subject.subscribe(v => console.log('A:', v));

subject.next(1);

subject.subscribe(v => console.log('B:', v));
```

### ReplaySubjectは過去の値を再生する

指定したバッファサイズ分の過去の値を保持し、新しい購読者に再生します。

```typescript
import { ReplaySubject } from 'rxjs';

const subject = new ReplaySubject<number>(2);

subject.next(1);
subject.next(2);
subject.next(3);

subject.subscribe(console.log);
```

バッファサイズが2なので、購読時には直近の2つの値（2と3）のみが再生されます。

## オペレーター

オペレーターはストリームを変換する純粋関数です。元のストリームを変更せず、新しいストリームを返します。

### 変換系オペレーター

#### map: 各値を変換

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 10)
).subscribe(console.log);
```

#### switchMap: 内部Observableをキャンセルして切り替え

新しい値が来たら前の処理をキャンセルして切り替えます。

```typescript
import { interval } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

interval(500).pipe(
  take(3),
  switchMap(() => interval(100).pipe(take(5)))
).subscribe(console.log);
```

#### mergeMap: 内部Observableを並列処理

すべての内部Observableを同時に購読します。

```typescript
import { interval } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

interval(500).pipe(
  take(3),
  mergeMap(() => interval(100).pipe(take(5)))
).subscribe(console.log);
```

#### concatMap: 内部Observableを順番に処理

前の処理が完了するまで次の処理を待ち、順序を保証して処理します。

```typescript
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

from([1, 2, 3]).pipe(
  concatMap(x => of(x).pipe(delay(1000)))
).subscribe(console.log);
```

### フィルタリング系オペレーター

#### filter: 条件に合う値のみ通す

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log);
```

#### debounceTime: 一定時間入力がないときに発行

連続した入力の最後だけを処理したい場合に使います。

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

fromEvent(input, 'input').pipe(
  debounceTime(300)
).subscribe(console.log);
```

#### distinctUntilChanged: 前回と異なる値のみ発行

同じ値が連続する場合に重複を除去します。

```typescript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 3, 1).pipe(
  distinctUntilChanged()
).subscribe(console.log);
```

#### take: 最初のn個で完了

無限ストリームを有限にしたい場合に使います。

```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(
  take(3)
).subscribe(console.log);
```

### 結合系オペレーター

#### merge: 複数ストリームを統合

いずれかのストリームから値が発行されるたびに出力します。

```typescript
import { merge, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

const a$ = interval(1000).pipe(map(x => `A${x}`), take(3));
const b$ = interval(1500).pipe(map(x => `B${x}`), take(3));

merge(a$, b$).subscribe(console.log);
```

#### combineLatest: 各ストリームの最新値を組み合わせ

いずれかのストリームが値を発行するたびに、すべてのストリームの最新値を配列で出力します。

```typescript
import { combineLatest, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const name$ = of('田中');
const age$ = of(30).pipe(delay(1000));

combineLatest([name$, age$]).subscribe(([name, age]) => {
  console.log(`${name}さん、${age}歳`);
});
```

#### forkJoin: すべて完了後に最終値を取得

Promise.all()に似ています。

```typescript
import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';

forkJoin({
  a: of(1).pipe(delay(1000)),
  b: of(2).pipe(delay(500))
}).subscribe(console.log);
```

## PromiseとObservableの比較

| 項目 | Promise | Observable |
|-----|---------|-----------|
| 値の数 | 1つ | 0個以上 |
| 実行タイミング | 即時 | subscribe時 |
| キャンセル | AbortControllerが必要 | unsubscribe()で可 |
| オペレーター | 限定的 | 100以上 |

Promiseは単発の非同期処理に、Observableは継続的なデータストリームに適しています。

## まとめ

RxJSの本質は「すべてがストリーム」という統一的な視点です。イベント、HTTPリクエスト、タイマー、WebSocketなど、あらゆる非同期データソースを同じ抽象化で扱えます。

オペレーターを組み合わせることで、複雑な非同期処理を宣言的に記述できます。最初は学習コストがありますが、一度理解すれば強力なツールになります。

## 参考リンク

- [RxJS公式ドキュメント](https://rxjs.dev/)
- [Learn RxJS](https://www.learnrxjs.io/)
- [ReactiveX](https://reactivex.io/)
