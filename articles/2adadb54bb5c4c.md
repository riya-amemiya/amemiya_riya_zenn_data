---
title: "ローカルホストを実機でデバッグする(Mac and iPhone)"
emoji: "🐕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["debug", "mac", "localhost","iphone"]
published: true
publication_name: "gmomedia"
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

## 前提条件

- MacとiPhoneが同じネットワークに接続されている
- 有線でMacとiPhoneを接続している

## 環境

記事執筆時の環境は以下の通りです。

- Mac OS Monterey 12.6.7
- Mac OS 13.4.1
- iOS 16.6

## MacのIPアドレスを確認する

メモしておくアドレスが2つあります。

### iPhoneからMacにアクセスするためのアドレス

`システム環境設定 > 共有` からアドレスを確認します。
Ventureの場合は、`一般 > 共有 > ローカルホスト名` から確認できます。
以下のようなアドレスが表示されます。

:::details 画像

![](/images/2adadb54bb5c4c/mac_address.png)

:::

```txt
次のアドレスでこのコンピューターにアクセスできます:[hostname].local
```

### プロキシを設定するためのアドレス

`システム環境設定 > ネットワーク > Wi-Fi` からアドレスを確認します。
Ventureの場合は、`システム環境設定 > ネットワーク > Wi-Fi > 詳細` から確認できます。
以下のようなアドレスが表示されます。

:::details 画像

![](/images/2adadb54bb5c4c/mac_wifi.jpg)

:::

```txt
IPアドレスXXX.XXX.XXX.XXXが設定されています。
```

## iPhoneのWifiのプロキシを設定する

Wifiの設定から、プロキシを手動に変更します。

`wifi横のiマーク > プロキシを構成 > 手動`

:::details 画像

![](/images/2adadb54bb5c4c/iphone_wifi.jpg)

![](/images/2adadb54bb5c4c/iphone_wifi2.jpg)

![](/images/2adadb54bb5c4c/iphone_wifi3.jpg)

:::

以下の設定をします。

- サーバー: XXX.XXX.XXX.XXX
- ポート: (アプリによって異なります, 例: 3000)
- 認証: オフ

## Macでサーバーを起動する

今回はRailsを例にあげますが、他でも同じようにできます。
`0.0.0.0` にバインドすることで、iPhoneからアクセスできるようになります。
ただし、ipアドレスを知っている人は誰でもアクセスできるので、フリーWifiなどでは注意が必要です。

```bash
bundle exec rails s -b 0.0.0.0
```

## iPhoneからMacにアクセスする

iPhoneからMacにアクセスします。
Safariで以下のアドレスにアクセスします。

```txt
http://[hostname].local:[ポート]
```

しばらく待って接続に失敗した場合は、リロードすると接続できることがあります。

## コンソールも見たい場合

Safariの開発者ツールを使うことで、コンソールも見ることができます。
iPhoneの設定から、Safariの設定を開きます。
詳細から、Webインスペクタをオンにします。
その後、MacでSafariを開き、画面上のツールバーから、`開発 > [iPhoneの名前] > [サイト名]` から開発者ツールを開きます。

:::details 画像

![](/images/2adadb54bb5c4c/web.png)

![](/images/2adadb54bb5c4c/web2.png)

:::

これで実機で動かしながら、コンソールやCSSをいじることができます！

## おわりに

以上でローカルホストを実機でデバッグする方法を紹介しました。

- PCなら動くのに、実機では動かない
- PCのデベロッパーツールではスタイルが崩れなかったのに、実機では崩れている
- テスト環境にいちいちデプロイするのが面倒

などの問題があった場合に、この方法を使ってデバッグしてみてください。
