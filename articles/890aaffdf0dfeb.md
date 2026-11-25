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

この記事はそのLTの内容に説明を足して書き直したものです。
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
LTでは上司に動いてもらうための伝え方を3つ紹介しました。

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

ほかの不満も同じ形にできます。
「レビューが遅くてつらい」なら、「レビュー待ちでPRが止まり、リリースが遅れているので、レビュー当番を決めたいです」と言えます。

上司の仕事は部下のブロッカーを取り除くことです。
課題の形で渡された不満は、上司が取り除くべきブロッカーになり、上司が動く口実にもなります。

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

LTでは次の聞き方を紹介しました。

> 私はXに興味がある
> これをチームや会社の成果に繋げるなら
> どんなミッションに落とし込めますか？

Xには自分のやりたいことを入れてください。
この聞き方では、やりたいことの許可を求めるのではなく、会社の成果に繋げる方法を尋ねています。
そのため、上司は可否を決める側から一緒に方法を考える側に回ります。

キャリアパスの調整は上司の大事な仕事なので、遠慮なく巻き込んでください。

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

3つを一度に全部やる必要はありません。
次の1on1で、まずは1つだけ「実は…」と違和感を口に出してみてください。
