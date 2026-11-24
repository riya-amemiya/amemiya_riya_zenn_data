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

この記事はそのLTの内容を、マネジメントされる側の人に向けて文章にしたものです。
私自身もマネジメントされる側の一人です。

1on1が進捗報告で終わっているなら、その時間で文句や違和感、本音を上司に伝えてください。
マネジメントされる側にとっては、それを言うことが仕事です。

## 進捗報告で終わる1on1

よくある1on1は、上司の「最近どう？」に「進捗は順調です」と答えて終わります。
時間が余っても、話すことを用意していなければ今のタスクの説明で埋まりがちです。

進捗を共有するだけなら、Slackやチケットで足ります。
誰が何をどこまで進めたかは、上司がそれを読めば分かります。

1on1は上司に進捗を報告する時間でも、お説教を聞く時間でもありません。
本来はメンバーのために確保された枠です。
その枠を進捗報告で使い切ると、メンバーは自分のための時間を上司のために使ったことになります。

## 1on1で話すこと

メンバーのための枠で話すのは、文句や違和感、本音です。
どれもSlackやチケットには書かれないので、本人が口に出さない限り上司には伝わりません。

それを堂々と言えるのは部下の特権です。
上司は評価権を持っているぶん、部下に気を使います。
部下の本音を引き出そうと必死です。
聞きたがっている相手に話すので、部下が遠慮する理由はありません。

文句を言うと、会社の役にも立ちます。
どこに無駄があるかに最初に気づくのは、現場で手を動かしている本人です。
だから現場で感じる違和感や不満は、会社にとって貴重な一次情報です。

会社にとって一番の損失は、黙って我慢していた人が突然辞めることです。
黙って我慢している人は、上司からは順調に働いている人と同じに見えます。
会社が不満を知るのは退職を切り出されたときで、それまで直す機会がありません。

同じ違和感でも、1on1でぶつけておけば会社には直す機会ができます。
不満をぶつけること自体が、会社への貢献になります。

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

## 言わないとどうなるか

言わないままでいると、会社だけでなく本人も損をします。

上司はエスパーではないので、やりたいことは言わなければ伝わりません。
黙っていると、会社の都合のいい枠にはめられます。
上司に悪意があるからではなく、部下の希望を知らなければ、会社の期待に沿って任せる仕事を考えるしかないからです。

会社の期待と自分のやりたいことは、たとえば次のようにずれます。

|          | 会社の期待         | 自分のやりたいこと |
| -------- | ------------------ | ------------------ |
| キャリア | マネジメントに進む | ずっと技術特化     |
| 領域     | 今のプロダクト     | 新規基盤や別の言語 |

言わなければ、表の「会社の期待」のとおりに話が進みます。
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

## どう伝えるか

言い方を間違えると、文句を言っても不満が多い人だと思われて終わります。
LTでは伝え方を3つのハック術として紹介しました。

### ハック術1 アジェンダを自分で作る

話したいことは自分で先に1on1のドキュメントに書いておいてください。
アジェンダが空のまま始まると、上司は進捗を聞いて時間を埋めることになります。
先に書いてあれば、1on1はその話題から始まります。

テーマは上司に考えさせるものを選びましょう。
たとえばキャリアの方向性の相談や、今のタスクに対する違和感です。
どちらも進捗確認と違って、上司が聞いて終わりにできず、考えて返す必要のある話題です。

```html-embed
<div class="fig">
  <div class="doc">
    <div class="title">上司が作るアジェンダ</div>
    <ul class="items">
      <li>進捗確認</li>
    </ul>
  </div>
  <div class="doc mine">
    <div class="title">自分で作るアジェンダ</div>
    <ul class="items">
      <li>キャリアの方向性について相談</li>
      <li>今のタスクに対する違和感</li>
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
  .doc { padding: 14px 18px; border: 2px solid var(--line); border-radius: 10px; }
  .mine { border-color: var(--accent); background: var(--accent-bg); }
  .title { margin-bottom: 4px; font-size: 13px; color: var(--accent); }
  .items { margin: 0; padding: 0; list-style: none; }
  .items li { padding: 6px 0; border-bottom: 1px solid var(--line); }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr; }
  }
</style>
```

進捗の報告に使う時間は0分にして、全部の時間を壁打ちと交渉に使いましょう。
交渉で使うのが、残りの2つのハック術です。

```html-embed
<div class="fig">
  <div class="name">今までの1on1</div>
  <div class="bar report">進捗報告</div>
  <div class="name">これからの1on1</div>
  <div class="bar talk">壁打ちと交渉</div>
</div>
<style>
  .fig {
    --bg: #ffffff;
    --fg: #243762;
    --accent: #1d5fd1;
    --muted-bg: #e3e8f2;
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 14px 20px;
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
    --accent: #8ab8ff;
    --muted-bg: #2a3650;
  }
  .fig, .fig * { box-sizing: border-box; }
  .name { color: var(--accent); }
  .bar { display: flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 8px; }
  .report { background: var(--muted-bg); }
  .talk { background: var(--accent); color: var(--bg); }
  @media (max-width: 640px) {
    .fig { grid-template-columns: 1fr; gap: 6px; }
    .report { margin-bottom: 10px; }
  }
</style>
```

### ハック術2 不満を課題に変える

不満は感情的な愚痴ではなく、組織の課題として相談してください。

たとえば「このフロー無駄多すぎてやってられないです」は、ただの文句です。
言われた上司には、何が原因で、どうなれば解決なのかが分かりません。
上司にできるのは話を聞くことまでです。

同じ不満でも、原因、影響、やりたいことの順に言い直すと、上司を動かす言い方になります。

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

言い直したほうは、ただの文句と違って、影響を開発速度というチームの成果で説明し、どうしたいのかも自分で言っています。

上司の仕事は部下のブロッカーを取り除くことです。
原因と影響がそろった不満は、上司が取り除くべきブロッカーになります。
不満を課題にして渡せば、上司が動く口実になります。

### ハック術3 共通項を上司と探す

会社の求める道と自分のやりたい道がずれているなら、そのズレを上司に正直に話してください。
ズレを隠したままだと、先ほど書いたとおり、会社が求める標準のキャリアパスで話が進みます。

落としどころは上司と一緒に考えましょう。
自分のやりたいことは自分がいちばん知っていて、会社が何を求めているかは上司のほうが知っています。
重なる部分を見つけるには、両方の情報が要ります。

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
先ほどの表の例なら、新規基盤や別の言語です。

この聞き方では、やりたいことの許可を求めるのではなく、会社の成果に繋げる方法を尋ねています。
そのため、上司は可否を決める側から一緒に方法を考える側に回ります。

キャリアパスの調整は上司の大事な仕事なので、遠慮なく巻き込んでください。

## 会社と上司は何のためにいるのか

会社と上司は自分のキャリアのためのリソースです。
3つのハック術はどれも上司の力を自分のキャリアのために使う方法でした。
上司だけでなく、会社の看板も、社内のリソースも、自分の市場価値を上げる道具として使えます。

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

## 次の1on1でやること

3つのハック術を一度に全部やる必要はありません。
次の1on1で、まずは1つ「実は…」と違和感をぶつけてみてください。
