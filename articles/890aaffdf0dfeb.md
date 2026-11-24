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

この記事はそのスライドの内容を文章にしたものです。
1on1を受ける側、つまりマネジメントされる側の人に向けて書いています。

1on1が進捗報告で終わっているなら、その時間で文句や違和感、本音を上司に伝えてください。
マネジメントされる側にとっては、それを言うことが仕事です。

## 進捗報告で終わる1on1

よくある1on1は、上司の「最近どう？」に「進捗は順調です」と答えて終わります。
進捗を共有するだけなら、Slackやチケットで足ります。

1on1は上司に進捗を報告する時間でも、お説教を聞く時間でもありません。
本来はメンバーのために確保された枠です。

## 1on1で話すこと

メンバーのための枠で話すのは、文句や違和感、本音です。
これらを堂々と言えることは部下の特権です。

上司は評価権を持っているぶん、部下に気を使います。
部下の本音を引き出そうと必死です。
上司のほうが本音を聞きたがっているので、部下は遠慮せずに言えます。

現場で感じる違和感や不満は、会社にとって貴重な一次情報です。
会社にとって一番の損失は、黙って我慢していた人が突然辞めることです。
不満を1on1でぶつけること自体が、会社への貢献になります。

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

上司はエスパーではないので、言わなければやりたいことは伝わりません。
黙っていると、会社の都合のいい枠にはめられます。

会社の期待と自分のやりたいことは、たとえば次のようにずれます。

|          | 会社の期待         | 自分のやりたいこと |
| -------- | ------------------ | ------------------ |
| キャリア | マネジメントに進む | ずっと技術特化     |
| 領域     | 今のプロダクト     | 新規基盤や別の言語 |

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

スライドでは伝え方を3つのハック術として紹介しました。

### ハック術1 アジェンダを自分で作る

1on1のドキュメントには話したいことを自分で先に書いてください。
テーマは上司に考えさせるものを選びましょう。

上司に任せたアジェンダは進捗確認になりがちです。
自分で作れば、キャリアの方向性の相談や、今のタスクに対する違和感を入れられます。

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

上司の仕事は部下のブロッカーを取り除くことです。
不満を課題にして渡せば、上司が動く口実になります。

### ハック術3 共通項を上司と探す

会社の求める道と自分のやりたい道がずれているなら、そのズレを上司に正直に話してください。
落としどころは上司と一緒に考えましょう。

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

キャリアパスの調整は上司の大事な仕事なので、遠慮なく巻き込んでください。

## 会社と上司は何のためにいるのか

会社と上司は自分のキャリアのためのリソースです。
上司も、会社の看板も、社内のリソースも、自分の市場価値を上げる道具として使えます。

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

マネジメントされる側から、マネジメントを利用する側に回りましょう。
本音を言い合える関係のほうが、評価も働きやすさも手に入ります。

## 次の1on1でやること

次の1on1で、まずは1つ「実は…」と違和感をぶつけてみてください。
