---
title: "マネジメントされる側の仕事は「文句」を言うこと"
emoji: "💬"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["1on1", "キャリア", "マネジメント"]
published: false
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

ダイニーで一番若いエンジニアのriya amemiya(21歳)です。
2026年11月13日に、次のイベントでこの記事と同じタイトルのLTをしました。

https://kichijojipm.connpass.com/event/409593/

私自身もマネジメントされる側の一人です。

その立場から書くと、1on1で部下がやる仕事は進捗の報告ではなく、文句や違和感、本音を上司に伝えることです。

## 進捗報告で終わる1on1

「最近どう？」
「進捗は順調です」

このやり取りだけで終わる1on1は、よくあります。
時間が余っても今やっているタスクの説明で埋まり、上司はチケットを読めば分かる内容を聞くことになります。

進捗を伝えるだけなら、Slackやチケットで足ります。
1on1は本来、部下のために確保された時間です。
部下のための時間なので、何を話すかは部下の側が決められます。
その時間で話す価値があるのは、上司がまだ知らないことです。

## 上司に見えていないもの

上司には、部下の仕事の多くが見えています。
チケットがどこまで進んだか、Slackで誰と何を話しているか、どんなコードを書いたかは、見ようと思えば見られます。

一方で、このフローは無駄だと思っていること、今のタスクに納得していないこと、この先やりたい仕事は、見ようとしても見えません。
どれも本人の頭の中にしかなく、口に出さない限りどこにも残りません。

```html-embed
<div class="fig">
  <div class="col">
    <div class="title">上司から見えている</div>
    <ul class="items">
      <li>チケットの進み具合</li>
      <li>Slackでのやり取り</li>
      <li>書いたコード</li>
    </ul>
  </div>
  <div class="col unseen">
    <div class="title">言わないと見えない</div>
    <ul class="items">
      <li>無駄だと思っていること</li>
      <li>納得していないこと</li>
      <li>この先やりたいこと</li>
    </ul>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 16px;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .col { padding: 14px 18px; border: 2px solid var(--line); border-radius: 10px; }
  .unseen { border: 2px dashed var(--accent); background: var(--accent-bg); }
  .title { margin-bottom: 4px; font-size: 13px; }
  .unseen .title { color: var(--accent); }
  .items { margin: 0; padding: 0; list-style: none; }
  .items li { padding: 6px 0; border-bottom: 1px solid var(--line); }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr; }
  }
</style>
```

1on1で話すのは、この見えていない側です。
この記事ではそれをまとめて「文句」と呼びます。

## 文句が仕事になる理由

文句と聞くと、言わないほうがいいものに思えます。
しかし現場で感じる違和感や不満は、会社にとって貴重な一次情報です。
どこに無駄があるかに最初に気づくのは、毎日そこで手を動かしている本人だからです。

しかも上司はその情報を欲しがっています。
評価する立場にいる上司は部下に気を使いますし、部下が評価者に本音を言いにくいことも分かっています。
だから部下の本音を引き出そうと必死です。

聞きたがっている相手に話すので、部下が遠慮する理由はありません。
文句や違和感を堂々と言えるのは、部下の特権です。

会社にとって一番の損失は、黙って我慢していた人が突然辞めることです。
黙って我慢している人は、上司からは順調に働いている人と同じに見えます。
不満があったと会社が知るのは、退職を切り出されたときです。

同じ不満でも、1on1で言っておけば会社には直す機会があります。
不満をぶつけることは、それだけで会社への貢献になります。

```html-embed
<div class="fig">
  <div class="lane">
    <div class="name">黙る</div>
    <ol class="steps">
      <li><span class="step">違和感</span></li>
      <li><span class="step">我慢</span></li>
      <li><span class="step bad">突然辞める</span></li>
    </ol>
  </div>
  <div class="lane">
    <div class="name">言う</div>
    <ol class="steps">
      <li><span class="step">違和感</span></li>
      <li><span class="step">1on1でぶつける</span></li>
      <li><span class="step good">会社への貢献</span></li>
    </ol>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    display: grid;
    gap: 16px;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .lane { display: grid; grid-template-columns: 3em 1fr; align-items: center; gap: 16px; }
  .name { color: var(--accent); }
  .steps, .steps li { display: flex; align-items: center; gap: 8px; }
  .steps { margin: 0; padding: 0; list-style: none; }
  .steps li + li::before { content: "→"; }
  .step { padding: 6px 14px; border: 2px solid var(--line); border-radius: 10px; }
  .bad { border-color: var(--fg); background: var(--fg); color: var(--bg); }
  .good { border-color: var(--accent); background: var(--accent-bg); color: var(--accent); }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr 1fr; }
    .lane { grid-template-columns: 1fr; justify-items: center; align-content: start; gap: 8px; }
    .steps, .steps li { flex-direction: column; gap: 4px; }
    .steps li + li::before { content: "↓"; }
    .step { text-align: center; }
  }
</style>
```

本人にしかできず、会社が必要としていることなので、私は文句を言うことを仕事だと考えています。

## 黙っていると決まるキャリア

文句を言わずにいると、会社より先に本人が困ります。

上司はエスパーではないので、やりたいことは言わなければ伝わりません。
部下の希望を知らない上司は、会社が標準として求めるキャリアに沿って仕事を任せます。
悪意があるわけではなく、ほかに判断の材料がないからです。

会社の期待と自分のやりたいことは、たとえば次のようにずれます。

|          | 会社の期待         | 自分のやりたいこと |
| -------- | ------------------ | ------------------ |
| キャリア | マネジメントに進む | ずっと技術特化     |
| 領域     | 今のプロダクト     | 新規基盤や別の言語 |

黙っていれば、表の「会社の期待」のとおりに話が進みます。
意思表示をしない限り、会社が求める標準のキャリアパスがデフォルトになります。

```html-embed
<div class="fig">
  <div class="tree">
    <div class="start">今の自分</div>
    <div class="branches">
      <div class="branch">
        <div class="how">何も言わない</div>
        <div class="end">会社が求める<wbr>標準の<wbr>キャリアパス</div>
      </div>
      <div class="branch alt">
        <div class="how">意思表示する</div>
        <div class="end">自分の<wbr>やりたい道</div>
      </div>
    </div>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .tree { max-width: 560px; }
  .start { padding: 10px 16px; border: 2px solid var(--fg); border-radius: 10px; text-align: center; }
  .branches { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .branch { --path: var(--accent); --stroke: solid; display: flex; flex-direction: column; align-items: center; }
  .alt { --path: var(--line); --stroke: dashed; }
  .how { position: relative; padding: 24px 0 30px; font-size: 13px; }
  .how::before, .how::after { content: ""; position: absolute; left: calc(50% - 2px); height: 20px; border-left: 4px var(--stroke) var(--path); }
  .how::before { top: 0; }
  .how::after { bottom: 6px; }
  .end { position: relative; width: 100%; padding: 10px 14px; border: 2px var(--stroke) var(--path); border-radius: 10px; background: var(--accent-bg); color: var(--accent); text-align: center; word-break: keep-all; overflow-wrap: anywhere; }
  .end::before { content: ""; position: absolute; top: -10px; left: calc(50% - 7px); border: 7px solid transparent; border-top: 8px solid var(--path); border-bottom: 0; }
  .alt .end { background: var(--bg); color: var(--fg); }
</style>
```

## 上司が動ける形で伝える

文句を言って評価が下がるのは、愚痴のまま言ったときです。
上司に動いてもらうための伝え方は、次の3つです。

### 話したいことを先に書く

話したいことは自分で先に1on1のドキュメントに書いておいてください。
アジェンダが空のまま始まると、上司は進捗を聞いて時間を埋めることになります。
先に書いてあれば、1on1はその話題から始まります。

書くのは、上司に考えてもらう必要がある話題です。
たとえばキャリアの方向性の相談や、今のタスクに対する違和感です。
進捗を書く必要はありません。

報告に使う時間は0分にして、全部の時間を壁打ちと交渉に使ってください。
壁打ちは考えを上司に聞いてもらって整理すること、交渉はやりたいことを通すために上司と話すことです。
残りの2つは、その交渉のやり方です。

### 愚痴を課題に言い換える

文句をそのまま口にすると、愚痴になります。

> このフロー無駄多すぎてやってられないです

気持ちは伝わりますが、言われた上司は次に何をすればいいのか分かりません。
上司にできるのは、話を聞くことまでです。

同じ不満を、原因、影響、やりたいことの順に言い直すと、次のようになります。

```html-embed
<div class="fig">
  <div class="name">ただの文句</div>
  <p class="quote">このフロー<wbr>無駄多すぎて<wbr>やってられないです</p>
  <div class="name">上司を動かす言い方</div>
  <dl class="parts">
    <dt>原因</dt>
    <dd>このフローのせいで</dd>
    <dt>影響</dt>
    <dd>開発速度が<wbr>落ちていて<wbr>ストレスなので</dd>
    <dt>やりたいこと</dt>
    <dd>自動化するか<wbr>無くす方に<wbr>動かしたいです</dd>
  </dl>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: start;
    gap: 20px 24px;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .name { padding-top: 10px; color: var(--accent); }
  .quote, .parts dd { justify-self: start; margin: 0; padding: 8px 14px; border: 2px solid var(--line); border-radius: 10px; word-break: keep-all; overflow-wrap: anywhere; }
  .parts { display: grid; grid-template-columns: max-content 1fr; align-items: center; gap: 8px 12px; margin: 0; }
  .parts dt { font-size: 13px; color: var(--accent); }
  .parts dd { border-color: var(--accent); background: var(--accent-bg); }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr; gap: 6px; }
    .name { padding-top: 0; }
    .quote { margin-bottom: 12px; }
  }
</style>
```

言い直したほうには、何が原因で、何が起きていて、どうしたいのかが入っています。
影響を開発速度で説明しているので、チームの問題として伝わります。
どうしたいのかまで言ってあれば、上司の仕事は許可を出すか、足りないものを調整するかのどちらかです。

ほかの不満も同じ形に言い換えられます。

```html-embed
<div class="fig">
  <input type="radio" name="tab" id="t1" checked>
  <input type="radio" name="tab" id="t2">
  <input type="radio" name="tab" id="t3">
  <div class="tabs">
    <label for="t1">レビュー待ち</label>
    <label for="t2">会議の多さ</label>
    <label for="t3">オンコール</label>
  </div>
  <div class="panel p1">
    <div class="name">ただの文句</div>
    <p class="quote">レビュー遅すぎて<wbr>仕事にならないです</p>
    <div class="name">上司を動かす言い方</div>
    <dl class="parts">
      <dt>原因</dt>
      <dd>レビューの担当が<wbr>決まっていないせいで</dd>
      <dt>影響</dt>
      <dd>PRが何日も止まって<wbr>リリースが<wbr>遅れているので</dd>
      <dt>やりたいこと</dt>
      <dd>レビュー当番を<wbr>決めたいです</dd>
    </dl>
  </div>
  <div class="panel p2">
    <div class="name">ただの文句</div>
    <p class="quote">会議多すぎて<wbr>手を動かす時間が<wbr>ないです</p>
    <div class="name">上司を動かす言い方</div>
    <dl class="parts">
      <dt>原因</dt>
      <dd>出なくてもいい<wbr>定例が多いせいで</dd>
      <dt>影響</dt>
      <dd>まとまった作業時間が<wbr>取れず<wbr>実装が進まないので</dd>
      <dt>やりたいこと</dt>
      <dd>出る会議を<wbr>一緒に見直したいです</dd>
    </dl>
  </div>
  <div class="panel p3">
    <div class="name">ただの文句</div>
    <p class="quote">オンコール<wbr>しんどすぎます</p>
    <div class="name">上司を動かす言い方</div>
    <dl class="parts">
      <dt>原因</dt>
      <dd>対応のいらない<wbr>アラートが多いせいで</dd>
      <dt>影響</dt>
      <dd>夜中に起こされて<wbr>次の日の作業に<wbr>響いているので</dd>
      <dt>やりたいこと</dt>
      <dd>アラートの条件を<wbr>見直す時間がほしいです</dd>
    </dl>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    position: relative;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .fig input { position: absolute; opacity: 0; pointer-events: none; }
  .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .tabs label { padding: 6px 14px; border: 2px solid var(--line); border-radius: 999px; font-size: 14px; cursor: pointer; }
  #t1:checked ~ .tabs label[for="t1"],
  #t2:checked ~ .tabs label[for="t2"],
  #t3:checked ~ .tabs label[for="t3"] { border-color: var(--accent); background: var(--accent); color: var(--bg); }
  #t1:focus-visible ~ .tabs label[for="t1"],
  #t2:focus-visible ~ .tabs label[for="t2"],
  #t3:focus-visible ~ .tabs label[for="t3"] { outline: 2px solid var(--accent); outline-offset: 2px; }
  .panel { display: none; grid-template-columns: max-content 1fr; align-items: start; gap: 20px 24px; }
  #t1:checked ~ .p1, #t2:checked ~ .p2, #t3:checked ~ .p3 { display: grid; }
  .name { padding-top: 10px; color: var(--accent); }
  .quote, .parts dd { justify-self: start; margin: 0; padding: 8px 14px; border: 2px solid var(--line); border-radius: 10px; word-break: keep-all; overflow-wrap: anywhere; }
  .parts { display: grid; grid-template-columns: max-content 1fr; align-items: center; gap: 8px 12px; margin: 0; }
  .parts dt { font-size: 13px; color: var(--accent); }
  .parts dd { border-color: var(--accent); background: var(--accent-bg); }
  @media (max-width: 640px) {
    .fig { padding: 14px; }
    .tabs { gap: 6px; margin-bottom: 14px; }
    .tabs label { padding: 4px 10px; font-size: 13px; }
    .panel { grid-template-columns: 1fr; gap: 6px; }
    .name { padding-top: 0; }
    .quote { margin-bottom: 8px; }
  }
</style>
```

### やりたいことを会社の成果に繋げる

会社の期待と自分のやりたいことがずれているなら、そのズレも上司に正直に話してください。
隠したままでは、会社が求める標準のキャリアパスで話が進みます。

ただし「マネジメントには進みたくありません」とだけ言うと、上司は代わりに何を任せればいいのか分かりません。
落としどころは上司と一緒に探してください。

自分のやりたいことは自分がいちばん知っていて、会社が何を求めているかは上司のほうが知っています。
2つが重なるところは、両方の情報がないと見つかりません。

```html-embed
<div class="fig">
  <div class="venn" role="img" aria-label="会社の求める道と自分のやりたい道が重なる部分が落としどころ">
    <div class="circle company"></div>
    <div class="circle me"></div>
    <div class="label company">会社の<br>求める道</div>
    <div class="label both">落とし<br>どころ</div>
    <div class="label me">自分の<br>やりたい道</div>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --accent: #1d5fd1;
    --company-bg: rgba(36, 55, 98, 0.06);
    --me-bg: rgba(29, 95, 209, 0.12);
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.4;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --accent: #8ab8ff;
    --company-bg: rgba(230, 237, 249, 0.08);
    --me-bg: rgba(138, 184, 255, 0.18);
  }
  .fig, .fig * { box-sizing: border-box; }
  .venn { position: relative; width: 100%; max-width: 400px; aspect-ratio: 8 / 5; }
  .circle { position: absolute; top: 0; width: 62.5%; height: 100%; border-radius: 50%; }
  .circle.company { left: 0; border: 3px solid var(--fg); background: var(--company-bg); }
  .circle.me { left: 37.5%; border: 3px solid var(--accent); background: var(--me-bg); }
  .label { position: absolute; top: 50%; text-align: center; white-space: nowrap; transform: translate(-50%, -50%); }
  .label.company { left: 18.75%; }
  .label.both { left: 50%; color: var(--accent); }
  .label.me { left: 81.25%; }
  @media (max-width: 640px) {
    .fig { font-size: 13px; }
  }
</style>
```

相談するときは、次のように聞けます。

> 私はXに興味がある
> これをチームや会社の成果に繋げるなら
> どんなミッションに落とし込めますか？

Xには自分のやりたいことを入れてください。
この聞き方では、やりたいことの許可を求めるのではなく、会社の成果に繋げる方法を尋ねています。
そのため、上司は可否を決める側から一緒に方法を考える側に回ります。

キャリアパスの調整は上司の大事な仕事なので、遠慮なく巻き込んでください。

## 受け取った上司ができること

課題の形で渡した不満は、上司にとっても扱いやすい相談です。
上司の仕事は部下のブロッカーを取り除くことです。
原因と影響とやりたいことがそろった不満は、そのまま上司が取り除くべきブロッカーになります。

愚痴のままの不満を受け取った上司は、何が原因で何に困っているのかを聞き出すところから始めることになります。
課題の形で受け取れば、上司はその場で次の手を選べます。
どの手を選ぶかは、その課題を上司の権限で片づけられるかどうか次第です。

```html-embed
<div class="fig">
  <div class="start">課題の形で渡された不満</div>
  <div class="down" aria-hidden="true">↓</div>
  <ul class="cases">
    <li class="case">
      <div class="when">上司が<wbr>決められる</div>
      <div class="act">その場で<wbr>許可する</div>
      <div class="ex">例 出なくていい<wbr>定例を外す</div>
    </li>
    <li class="case">
      <div class="when">今の仕事と<wbr>取り合いになる</div>
      <div class="act">優先順位を<wbr>組み替える</div>
      <div class="ex">例 アラートの見直しを<wbr>先にやる</div>
    </li>
    <li class="case">
      <div class="when">上司だけでは<wbr>決められない</div>
      <div class="act">上の人や<wbr>他チームに<wbr>持ち上げる</div>
      <div class="ex">例 レビューの体制を<wbr>部署で決める</div>
    </li>
  </ul>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .start { padding: 10px 16px; border: 2px solid var(--fg); border-radius: 10px; text-align: center; }
  .down { padding: 2px 0; color: var(--accent); text-align: center; }
  .cases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 0; padding: 0; list-style: none; }
  .case { padding: 12px 14px; border: 2px solid var(--line); border-radius: 10px; word-break: keep-all; overflow-wrap: anywhere; }
  .when { font-size: 13px; color: var(--accent); }
  .act { margin-top: 2px; }
  .ex { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--line); font-size: 13px; font-weight: 400; }
  @media (max-width: 640px) {
    .cases { grid-template-columns: 1fr; gap: 8px; }
    .case { padding: 8px 12px; }
    .ex { margin-top: 4px; padding-top: 4px; }
  }
</style>
```

上司だけでは決められない課題でも、影響がチームの成果で説明してあれば、上司はその説明をそのまま上の人や他チームに持っていけます。
課題の形で渡すことは、上司に動く口実を渡すことでもあります。

## 言ったあとの1on1

課題を渡したら、次の1on1の最初にその課題がどうなったかを確かめてください。
上司はほかのメンバーやチームの仕事も抱えているので、一度聞いた課題でも後回しになることがあります。
渡したまま確かめなければ、言わなかったときと同じ結果で終わることもあります。

```html-embed
<div class="fig">
  <div class="cycle" role="img" aria-label="課題を渡す、上司が動く、次の1on1で確かめる、結果を伝える、を1on1のたびに繰り返す">
    <div class="node n1">課題を渡す</div>
    <div class="arrow a1">→</div>
    <div class="node n2">上司が動く</div>
    <div class="arrow a2">↓</div>
    <div class="node n3">次の1on1で<wbr>確かめる</div>
    <div class="arrow a3">←</div>
    <div class="node n4">結果を伝える</div>
    <div class="arrow a4">↑</div>
    <div class="center">1on1の<wbr>たびに</div>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .cycle { display: grid; grid-template-columns: 1fr 5em 1fr; align-items: center; gap: 8px 12px; max-width: 480px; }
  .node { padding: 10px 12px; border: 2px solid var(--line); border-radius: 10px; text-align: center; word-break: keep-all; overflow-wrap: anywhere; }
  .n3 { border-color: var(--accent); background: var(--accent-bg); color: var(--accent); }
  .arrow { color: var(--accent); text-align: center; }
  .center { font-size: 13px; text-align: center; word-break: keep-all; overflow-wrap: anywhere; }
  .n1 { grid-area: 1 / 1; }
  .a1 { grid-area: 1 / 2; }
  .n2 { grid-area: 1 / 3; }
  .a2 { grid-area: 2 / 3; }
  .n3 { grid-area: 3 / 3; }
  .a3 { grid-area: 3 / 2; }
  .n4 { grid-area: 3 / 1; }
  .a4 { grid-area: 2 / 1; }
  .center { grid-area: 2 / 2; }
  @media (max-width: 640px) {
    .fig { padding: 14px; font-size: 14px; }
    .cycle { grid-template-columns: 1fr 4em 1fr; gap: 6px; }
    .node { padding: 8px; }
    .center { font-size: 12px; }
  }
</style>
```

確かめたときの答えによって、次に話すことが変わります。

上司が動いてくれていたなら、何が変わったかを伝えてください。
対応した結果が返ってくると、上司は自分の動きが役に立ったと分かり、次の課題も受け取りやすくなります。

自分でやると決めたことがあるなら、そのあとどうなったかを話してください。
これはタスクの進捗報告とは別で、前回の1on1で決めたことの続きです。

課題が止まっているなら、理由を上司に聞いてください。
理由ごとの次の手は次の節で書きます。

## 言いにくいとき

ここまでの伝え方を知っていても、文句を言いにくい場面はあります。

### 上司自身が不満の原因のとき

上司のやり方への不満も、上司の行動を原因の欄に置けば、ほかの不満と同じ形で伝えられます。
たとえば1on1のリスケが続いているなら、「リスケが続いて相談したいことが溜まっているので、1on1の時間を固定したいです」と言えます。

上司本人に言いにくい内容なら、上司の上司や人事に相談してもかまいません。

### 言っても変わらなかったとき

一度言って変わらなかったときは、なぜ変わらないのかを上司に聞いてください。
上司の権限で決められないのか、ほかの仕事を優先したのかで、次にやることが変わります。

上司の権限で決められないなら、上司から上の人に持ち上げてもらうよう頼めます。
ほかの仕事を優先したのなら、影響を数字や具体例で補って、もう一度相談できます。
レビュー待ちで止まったPRの数や、オンコールで夜中に起こされた回数は、上司が優先順位を見直すときの材料です。

何度伝えても変わらないなら、その会社でやりたいことができるかを考え直す材料になります。
言うべきことを言ったうえでの結論なので、会社にとっても突然の退職にはなりません。

### 評価が下がるのが怖いとき

文句を言ったら評価が下がるのでは、と心配になるかもしれません。
評価が心配なときほど、課題の形で伝えてください。
原因と影響とやりたいことがそろった不満は、チームをよくするための提案として受け取られやすくなります。

黙って我慢しても、我慢したことは上司に見えないので、評価にはつながりません。

## 会社と上司の使い方

3つの伝え方はどれも上司に動いてもらうための方法です。
アジェンダで上司に考えさせ、課題を渡して上司を動かし、キャリアの相談に上司を巻き込みます。

会社と上司は自分のキャリアのためのリソースだと、私は考えています。
上司も、会社の看板も、社内のリソースも、自分の市場価値を上げる道具として使えます。
会社の名前で登壇することも、業務時間や予算を使うことも、詳しい同僚に聞くことも、その使い方です。

```html-embed
<div class="fig">
  <div class="name">される側</div>
  <div class="rel">
    <span class="node">上司</span>
    <span class="verb">マネジメントする</span>
    <span class="node">自分</span>
  </div>
  <div class="name">利用する側</div>
  <div class="rel">
    <span class="node me">自分</span>
    <span class="verb">利用する</span>
    <span class="targets">
      <span class="node">上司</span>
      <span class="node">会社の看板</span>
      <span class="node">社内のリソース</span>
    </span>
  </div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --line: #7f8fb0;
    --accent: #1d5fd1;
    --accent-bg: #edf4ff;
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 16px 20px;
    padding: 20px;
    background: var(--bg);
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  [data-theme="dark"] .fig {
    --bg: #101827;
    --fg: #e6edf9;
    --line: #5f7196;
    --accent: #8ab8ff;
    --accent-bg: #1a2c4c;
  }
  .fig, .fig * { box-sizing: border-box; }
  .name { color: var(--accent); }
  .rel { display: flex; align-items: center; gap: 10px; }
  .verb { font-size: 13px; white-space: nowrap; }
  .verb::after { content: " →"; }
  .node { padding: 6px 14px; border: 2px solid var(--line); border-radius: 10px; white-space: nowrap; }
  .node.me { border-color: var(--accent); background: var(--accent-bg); color: var(--accent); }
  .targets { display: flex; flex-wrap: wrap; gap: 8px; }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr; gap: 6px; }
    .rel + .name { margin-top: 10px; }
  }
</style>
```

道具として使うといっても、会社に損をさせるわけではありません。
不満は課題として渡し、やりたいことは会社の成果に繋がるように相談するので、会社の側にも得があります。

マネジメントされる側から、マネジメントを利用する側に回りましょう。
本音を言い合える関係のほうが、評価も働きやすさも手に入ります。

## 次の1on1で言うこと

1on1のドキュメントに次のひな形を貼っておくと、話したいことを書き始めやすくなります。

```markdown
## 前回の続き
- 渡した課題:
- どうなったか:

## 違和感があること
- 原因:
- 影響:
- やりたいこと:

## キャリアの相談
- 興味があること:
- 会社の成果に繋げるなら:
```

前回の続きを先頭に置いたのは、渡した課題を1on1の最初に確かめるためです。

3つの伝え方を一度に全部やる必要も、ひな形の欄を毎回すべて埋める必要もありません。
次の1on1で、まずは1つだけ「実は…」と違和感を口に出してみてください。
