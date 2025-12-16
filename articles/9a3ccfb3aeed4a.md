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

初期値を持ち、購読時に最新値を即座に受け取れます。

```typescript
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject<number>(0);

subject.subscribe(v => console.log('A:', v));

subject.next(1);

subject.subscribe(v => console.log('B:', v));
```

BehaviorSubjectは「現在の状態」をストリームとして表現します。アプリケーションの状態は時間とともに変化する値の連続であり、これもまたストリームです。

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

バッファサイズが2なので、購読時には直近の2つの値（2と3）のみが再生されます。ReplaySubjectは「過去のイベント履歴」をストリームとして扱いたい場合に使います。

### Subjectがストリームの世界をつなぐ

Subjectの本質的な役割は、命令的なコードとストリームの世界をつなぐ架け橋です。

既存のコールバックベースのAPIや、フレームワーク固有のイベントシステムなど、直接Observableとして扱えないデータソースがあります。Subjectを使えば、それらを手動でストリームに変換できます。

```typescript
const buttonClicks$ = new Subject<MouseEvent>();

legacyButton.onClick = (event) => {
  buttonClicks$.next(event);
};

buttonClicks$.pipe(
  debounceTime(300)
).subscribe(handleClick);
```

「すべてがストリーム」という世界観において、Subjectはストリームではないものをストリーム化する変換器としての役割を持ちます。

## オペレーターが実現する合成の力

オペレーターはストリームを変換する純粋関数です。元のストリームを変更せず、新しいストリームを返します。

ここで重要なのは、オペレーターの個々のAPIを覚えることではありません。「すべてがストリーム」という統一的な抽象化があるからこそ、あらゆるデータソースに対して同じオペレーターを適用できるという点です。

### 異なるデータソースに同じ処理を適用できる

クリックイベント、HTTPレスポンス、WebSocketメッセージ、これらは本来異なるAPIで扱う必要がありました。しかしすべてがObservableになれば、同じオペレーターで処理できます。

```typescript
import { fromEvent, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

const transform = <T>(source$: Observable<T>) => source$.pipe(
  filter(x => x != null),
  take(10)
);

transform(fromEvent(button, 'click'));
transform(interval(1000));
transform(webSocketMessages$);
```

データソースが何であれ、ストリームとして扱えばすべて同じ方法で変換できます。これがストリームという抽象化の力です。

### ストリームの結合で複雑な要件を宣言的に記述する

複数のストリームを組み合わせることで、複雑な要件を宣言的に表現できます。

「ユーザー情報と設定の両方が揃ったら画面を表示する」という要件を考えてみます。

```typescript
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

const user$ = fetchUser();
const settings$ = fetchSettings();

combineLatest([user$, settings$]).pipe(
  filter(([user, settings]) => user != null && settings != null)
).subscribe(([user, settings]) => {
  renderScreen(user, settings);
});
```

命令的に書けば、どちらが先に返ってくるかを管理し、両方揃ったかをフラグで追跡する必要があります。ストリームの結合を使えば、その複雑さは抽象化の中に隠れます。

### 時間を扱う処理もストリームで統一される

debounceTime、throttleTime、delayといったオペレーターは、時間という概念をストリームの中で扱います。

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

const search$ = fromEvent(input, 'input').pipe(
  debounceTime(300),
  map(e => e.target.value),
  distinctUntilChanged(),
  switchMap(query => fetchSearchResults(query))
);
```

「入力が300ms止まったら検索」「前回と同じ値なら無視」「新しい検索が始まったら前の検索をキャンセル」といった時間に関する要件が、すべてストリームの変換として表現されています。setTimeoutやフラグ管理は不要です。

### ストリーム間の関係を宣言する

switchMap、mergeMap、concatMapは、ストリームとストリームの関係を定義します。

switchMapは「新しい値が来たら前の処理を捨てる」という関係です。検索のオートコンプリートで、ユーザーが入力を続けたら前の検索結果は不要になる、という要件に対応します。

mergeMapは「すべて並列に処理する」という関係です。ファイルのアップロードで、複数ファイルを同時に処理したい場合に使います。

concatMapは「順番を保証して処理する」という関係です。順序が重要な操作、たとえばデータベースへの書き込みで使います。

これらの違いは、どのオペレーターを選ぶかという一点に集約されます。処理の関係性を変えたければ、オペレーターを変えるだけです

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
