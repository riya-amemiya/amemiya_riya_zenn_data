---
title: "Copilotの裏側"
emoji: "🤖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["github", "githubcopilot", "ai"]
published: true
publication_name: "gmomedia"
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

## 概要

CyberAgentとGitHubの共催で開催されたGitHub Copilotのイベントに参加してきました。
Copilotの裏側を知ることができたので、その内容を共有します。

## Copilotの裏側

### Copilotが目指しているもの

Copilotは品質よりも速さを重視しています。
いかにエンジニアの待ち時間を減らすかを重視しているようです。

### 利用しているモデル

GPT-3.5turboの派生版であるSahara-baseというモデルを利用しており、Copilot ChatはGPT-3.5turboを利用しています。

### チューニング

ファインチューニングよりもプロンプトで結構チューニングしているようです。

### プロンプトについて

開かれているタブ(最大20個)の中から、関連性の高いコードをプロンプトに渡しており、直近開いていたタブのコードが優先されます。
現在のカーソルより上のコードの方が優先してプロンプトに渡されます。
類似性や関連性を元に探索するため、命名規則やコーディングスタイルが統一されているほど、より良い結果が得られます。
ファイルパスなどもプロンプトに渡しているようです。

### プロンプトの例

内部はLLMなので、やはり英語の方が精度はいいです。
ChatGPTなどにも言えることですが、具体例を挙げると精度を上げることができます。
例えば以下のようなコードがあったとします。

```ts
const isNumber = (value: unknown): value is number => typeof value === 'number';
```

雑なコメントで指示を出すと、以下のようなコードが生成されます。

```ts
// testを書く
describe("isNumber", () => {
  it("should return true when give number", () => {
    expect(isNumber(1)).toBe(true);
  });

  it("should return false when give string", () => {
    expect(isNumber("1")).toBe(false);
  });
});
```

具体的にどのようなケースをテストするかを指示すると、以下のようなコードが生成されます。

```ts
// testを書く
// NaN、Infinity、-Infinity、[]など数値計算に使えないものはfalse
test("isNumber", () => {
  expect(isNumber(1)).toBe(true);
  expect(isNumber("1")).toBe(false);
  expect(isNumber(NaN)).toBe(false);
  expect(isNumber(Infinity)).toBe(false);
  expect(isNumber(-Infinity)).toBe(false);
  expect(isNumber([])).toBe(false);
  expect(isNumber({})).toBe(false);
  expect(isNumber(null)).toBe(false);
  expect(isNumber(undefined)).toBe(false);
  expect(isNumber(true)).toBe(false);
  expect(isNumber(false)).toBe(false);
  expect(isNumber(Symbol())).toBe(false);
});
```

これでかなり網羅的なテストが生成されました。
先ほどのテストでは気づけなかった、`NaN` や `Infinity` などがJSではnumber型になってしまう問題もテストできています。
DBの場合はマイグレーションファイル、TypeScriptやCなどは型定義ファイルを開いておくと、より良い結果が得られます。
コメントにコピペで他ファイルの関数を埋め込むのもかなり効果的です。

## Copilotの今後

エラー検知やリファクタリングやコードレビュー、ドキュメント生成など、様々な機能が追加される予定です。

## まとめ

色々書きましたが、Copilotは誰が使っても同じような品質のコードの生成を目指しているので、あまり深く考えずに使うのが良いと思います。
下記URLからCopilotの各種機能のWaitlistに登録できます。
ドキュメントやコードレビューはWaitlist受付中です！

https://githubnext.com/
