---
title: "え？まだgit checkoutしてるの？"
emoji: "🗂"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["git"]
published: true
publication_name: "gmomedia"
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

## え？まだgit checkoutしてるの？

git checkoutといえば、ブランチを切り替えたり、git addしたファイルを元に戻したりするコマンドですが、それはもう古いです。
実は2019年8月リリースのgit 2.23からgit switchとgit restoreが追加されました。
知らなかった人も多いのではないでしょうか？(恥ずかしながら私は知らなかった...)
「先輩、checkoutってなんすか？」と後輩に聞かれる前に、この記事を読んでgit switchとgit restoreを使いこなしましょう。

## git switch

git switchはブランチを切り替えるコマンドです。
git checkoutと同じように使えますが、コマンド名がわかりやすくなりました。

詳しい使い方は以下のリンクを参照してください。
https://git-scm.com/docs/git-switch

基本的な使い方は以下の通りです。

### ブランチを切り替える

```bash
git switch <branch>
```

### 新しいブランチを作成して切り替える

```bash
git switch -c <branch>
```

### ブランチを上書きして切り替える

-cを間違えて大文字にしてしまうと、同じ名前のブランチがある場合に上書きしてしまいます。

```bash
git switch -C <branch>
```

### ブランチを切り替える(変更を保存せず)

```bash
git switch -d <branch>
```

### 強制的に新しいブランチに切り替える

```bash
git switch -f <branch>
```

### 一個前のブランチに切り替える

```bash
git switch -
```

## git restore

git restoreはファイルを元に戻すコマンドです。
git checkoutと同じように使えますが、コマンド名がわかりやすくなりました。

詳しい使い方は以下のリンクを参照してください。
https://git-scm.com/docs/git-restore

基本的な使い方は以下の通りです。

### ファイルを元に戻す

```bash
git restore <file>
```

### Staging状態のファイルを元に戻す(git addした後のファイルを元に戻す)

git resetと同じように使えます。

```bash
git restore --staged <file>
```

### 拡張子を指定してファイルを元に戻す

```bash
git restore '*.txt'
```

### 指定したコミットの状態に戻す

地味に挙動が違って、git checkoutはStaging状態に戻りますが、git restoreはUnstaging状態に戻ります。

```bash
git restore -s <commit hash> <file>
```

## まとめ

以上、git switchとgit restoreの使い方について説明しました。
git 2.23から追加されたコマンドなので、知らない人も多いと思いますが、これを機に使いこなしてみてください。
