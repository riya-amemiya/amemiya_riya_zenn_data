---
title: "RFC 5321/5322に沿ったEmail正規表現を書く"
emoji: "⛳"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["regex", "email", "rfc", "typescript"]
published: false
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

後述しますが、RFCに厳密に沿ったバリデーションはお勧めしません。

以下の正規表現が最も一般的なemail正規表現で、HTML仕様書にも記載されています。

```regex
/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

:::message alert
本記事ではRFCに厳密に沿ったバリデーションを作ってみようという趣旨なので、最終的な成果物は実用的ではないということを記載しておきます。
また、testは入念に書いていますが、RFCに100%厳密に沿っている保証はありません。
もし抜け漏れがあればコメントやGitHubでご指摘いただけますと幸いです。
:::

:::details RFC 5321とRFC 5322の正規表現ネタバレ

### RFC 5321 Regex

```regex
/^(?=.{1,256}$)(?=(?:[^@]{1,64})@)(?!.*\.\.)(?<local>(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\[\s\S]){0,62}"))@(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])$/
```

### RFC 5322 Regex

```regex
/^(?=.{1,998}$)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<local>"(?:[^"\\]|\\[\s\S]){0,62}"(?:\."(?:[^"\\]|\\[\s\S]){0,62}")*|"(?:[^"\\]|\\[\s\S]){0,62}"(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*(?:\."(?:[^"\\]|\\[\s\S]){0,62}")+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*@(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*$/
```

:::

## 2. 一般的なemail正規表現（HTML仕様）

HTML仕様書の「4.10.5.1.5 Email state (type=email)」に、メールアドレスの正規表現が定義されています。

https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)

```regex
/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

ブラウザなどもこの仕様に基づいてバリデーションを行っているため、おそらく世界で最も広く使われているemailの正規表現と言えるでしょう。

### HTML仕様がRFCに違反している理由

しかし、HTML仕様書には以下のような記述があります：

> この要件は、RFC 5322 への意図的な違反です。RFC 5322 はEメールアドレスの構文を定義していますが、その内容は（"@"文字より前は）厳格すぎると同時に、（"@"文字より後は）曖昧すぎ、さらに（ほとんどのユーザーには馴染みのない方法でのコメント、空白文字、引用符付き文字列を許可するという点で）緩すぎるため、ここで実用的に用いるには適していません。

つまり、HTML仕様は**意図的にRFC 5322に違反**しています。
馴染みのない構文や厳格すぎる要件を設けているため、実用的には使いにくいということです。
しかし、今回はタイトル通りRFCに厳密に沿ったバリデーションを作りたいので、何がいけないのかを詳しくみていきましょう。

## 3. メールアドレスRFCの基礎知識

### メールアドレスRFCの歴史

メールアドレスのフォーマットは、以下の流れで標準化されてきました：

- **RFC 822**（1982年）: 初期のメッセージフォーマット標準
- **RFC 2822**（2001年）: RFC 822の近代化版
- **RFC 5322**（2008年）: 現行のメッセージフォーマット標準

本記事では、現行の**RFC 5322**と**RFC 5321**（SMTPプロトコル）の2つを扱います。

### RFC 5322とRFC 5321：定義している範囲の違い

メールアドレスに関する2つの主要なRFCは、それぞれ異なる側面を定義しています：

#### RFC 5322（メッセージフォーマット）

- メールの「内容」、特にヘッダーのフォーマットを定義
- `To:`, `From:` などのヘッダーに記述されるメールアドレスの「構文」を定義
- より柔軟で表現力のある構文を許可（quoted-string、コメントなど）

#### RFC 5321（SMTPプロトコル）

- メールの「転送」プロトコル（SMTP）を定義
- `MAIL FROM:`, `RCPT TO:` コマンドで使用されるアドレスの構文を定義
- DNS解決可能なドメイン名のみを許可

#### 重要な違い

フォーマットとして正しいこと（RFC 5322）と、実際に転送できること（RFC 5321）は異なります。

例えば、`user@example!com` はRFC 5322の構文上は有効ですが、RFC 5321ではDNS解決が必要なため転送できません。そのため、RFC 5321の方がより厳格な制約を持っています。

## 4. RFC 5321準拠の正規表現を作る

RFC 5321は、SMTPで実際に転送できるメールアドレスの形式を定義しています。HTML仕様の正規表現をベースに、段階的にRFC 5321に準拠させていきます。

### 基本構造の理解

RFC 5321のメールアドレスは、以下の基本構造を持ちます：

```text
local-part "@" domain
```

- `local-part`: 最大64文字
- `domain`: 最大255文字
- パス全体: 最大256文字

### local-partの実装

RFC 5321のセクション4.1.2では、`local-part` は `dot-atom / quoted-string` と定義されています。

#### dot-atom形式

`dot-atom` は、RFC 5322の `atext` を使用できます。`atext` には以下の文字が含まれます：

- 英数字: `A-Z`, `a-z`, `0-9`
- 記号: ! # $ % & ' * + - / = ? ^ _` { | } ~

ドット（`.`）で区切ることができますが、**連続するドットや先頭・末尾のドットは許可されません**。

実は `+` を使ったエイリアス機能（例: `user+alias@example.com`）はRFCで定義されていないGmailなどが独自に拡張した機能です

`dot-atom` の正規表現：

```regex
[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*
```

#### quoted-string形式

RFC 5321では、RFC 5322で定義されている `quoted-string`（引用符付き文字列）もサポートしています。これにより、通常は許可されない文字を含めることができます：

```text
"user"@example.com
"user.name"@example.com
"user@domain"@example.com
```

`quoted-string` の正規表現：

```regex
"(?:[^"\\]|\\[\s\S]){0,62}"
```

RFC 5321の `local-part` は、これらを組み合わせた形式になります：

```regex
(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\[\s\S]){0,62}")
```

### domainの実装（DNS制約）

RFC 5321のdomainは、DNSで解決可能な名前でなければなりません。RFC 1035に従い、以下の制約があります：

- 使用可能な文字: 英数字（`A-Z`, `a-z`, `0-9`）とハイフン（`-`）のみ
- ハイフンは先頭と末尾には使用できない
- 各ラベルは最大63文字
- ドメイン全体は最大255文字
- 最低1つのドット（`.`）が必要（TLDが必要）

正規表現では以下のように表現できます：

```regex
[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+
```

### domain-literalの実装（IPアドレス）

RFC 5321では、DNSの代わりにIPアドレスを直接指定する `domain-literal` も許可されています：

```text
user@[192.168.0.1]
user@[IPv6:2001:db8::1]
```

これを正規表現で表現すると：

```regex
\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\]
```

### 連続ドットの禁止

連続するドット（`..`）は許可されないため、これも先読みアサーションで除外します：

```regex
(?!.*\.\.)
```

### 長さ制限

RFC 5321では、パス全体の長さが最大256文字、local-partが最大64文字と定義されています。これは `<user@example.com>` のような形式を含むため、実質的にはメールアドレス自体は254文字程度が上限になります。

長さ制限は、正規表現の先頭で先読みアサーション（lookahead）を使用して実装します：

```regex
(?=.{1,256}$)(?=(?:[^@]{1,64})@)
```

### RFC 5321の最終的な正規表現

これらを組み合わせると、RFC 5321準拠の正規表現が完成します：

```regex
/^(?=.{1,256}$)(?=(?:[^@]{1,64})@)(?!.*\.\.)(?<local>(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\[\s\S]){0,62}"))@(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])$/
```

## 5. RFC 5322準拠の正規表現を作る

RFC 5322は、メールヘッダーに記述されるメールアドレスのフォーマットを定義しており、RFC 5321よりも柔軟な構文を許可しています。

### quoted-stringの実装

RFC 5322の最大の特徴は、`local-part` に `quoted-string`（引用符付き文字列）を使用できることです。これにより、通常は許可されない文字（スペース、ドット、アットマークなど）を含めることができます。

#### quoted-stringの例

```text
"user name"@example.com
"user..dots"@example.com
"user@domain"@example.com
```

quoted-stringの中では、バックスラッシュ（`\`）でエスケープができます：

```text
"user\"quote"@example.com
"user\\backslash"@example.com
```

quoted-stringの正規表現：

```regex
"(?:[^"\\]|\\[\s\S]){0,62}"
```

### mixed形式（quoted-stringとatextの混在）

RFC 5322では、quoted-stringとatextを `.` で連結した混在形式も許可されています：

```text
"first".last@example.com
first."last"@example.com
```

この柔軟性により、local-partの定義は複雑になります。以下の4つのパターンをサポートする必要があります：

1. `"quoted"."quoted"...` - quoted-stringのみ
2. `"quoted".atext.atext...` - quoted-stringで開始、atextで終了
3. `atext.atext..."quoted"` - atextで開始、quoted-stringで終了
4. `atext.atext...` - atextのみ

これらを正規表現で表現すると：

```regex
(?<local>"(?:[^"\\]|\\[\s\S]){0,62}"(?:\."(?:[^"\\]|\\[\s\S]){0,62}")*|"(?:[^"\\]|\\[\s\S]){0,62}"(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*(?:\."(?:[^"\\]|\\[\s\S]){0,62}")+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)
```

### コメント対応

RFC 5322では、メールアドレスの様々な箇所にコメントや空白を挿入できます：

```text
user(comment)@example.com
(comment)user@example.com
user@(comment)example.com
user@example.(comment)com
user @ example.com
```

コメントは丸括弧（`()`）で囲まれ、ネストも可能です。また、コメント内ではバックスラッシュ（`\`）でエスケープができます。

コメントの正規表現：

```regex
(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*
```

これを `@` の前後、local-partとdomainの周り、さらにdomainのドット（`.`）の前後に配置します。

domainにコメント対応を追加した例：

```regex
(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])
```

### 長さ制限の調整

RFC 5322では、RFC 5321のようなパス全体の長さ制限はありませんが、実装上の制限として998文字が推奨されています。

```regex
(?=.{1,998}$)
```

### RFC 5322の最終的な正規表現

これらを組み合わせると、RFC 5322準拠の正規表現が完成します：

```regex
/^(?=.{1,998}$)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<local>"(?:[^"\\]|\\[\s\S]){0,62}"(?:\."(?:[^"\\]|\\[\s\S]){0,62}")*|"(?:[^"\\]|\\[\s\S]){0,62}"(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*(?:\."(?:[^"\\]|\\[\s\S]){0,62}")+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*@(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*$/
```

### テスト結果

実装した正規表現に対して、RFC仕様に基づいた包括的なテストを実行した結果、全てのテストケースが合格しました：

```bash
$ bun test src/test/email.test.ts
bun test v1.3.1

 42 pass
 0 fail
 193 expect() calls
Ran 42 tests across 1 file. [19.00ms]
```

:::details test code

```typescript
import { describe, expect, it } from "bun:test";

export type ValidationLevel = "rfc5321" | "rfc5322";

interface ValidationOptions {
  level: ValidationLevel;
}

const EMAIL_PATTERNS: Record<ValidationLevel, RegExp> = {
  rfc5321:
    /^(?=.{1,256}$)(?=(?:[^@]{1,64})@)(?!.*\.\.)(?<local>(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\[\s\S]){0,62}"))@(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])$/,
  rfc5322:
    /^(?=.{1,998}$)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<local>"(?:[^"\\]|\\[\s\S]){0,62}"(?:\."(?:[^"\\]|\\[\s\S]){0,62}")*|"(?:[^"\\]|\\[\s\S]){0,62}"(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:\.[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*(?:\."(?:[^"\\]|\\[\s\S]){0,62}")+|[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64}(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]{1,64})*)(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*@(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*(?<domain>[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*\.(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+|\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:]+)\])(?:\s|\((?:[^()\\]|\\[\s\S])*(?:\((?:[^()\\]|\\[\s\S])*\)(?:[^()\\]|\\[\s\S])*)*\))*$/,
} as const;

export const validateEmail = (email: string, options: ValidationOptions) => {
  const { level } = options;
  const pattern = EMAIL_PATTERNS[level];
  const match = pattern.exec(email);

  return {
    valid: match !== null,
    parts: match?.groups
      ? {
          local: match.groups.local,
          domain: match.groups.domain,
        }
      : undefined,
  };
};

describe("email validation", () => {
  describe("rfc5321 level", () => {
    it("validates with different RFC compliance levels", () => {
      expect(
        validateEmail("test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321 allows RFC 5322 special characters in local-part but not in domain", () => {
      expect(
        validateEmail("user@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user+tag@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user.name@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user!test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user#test@example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@exam!ple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam#ple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@localhost", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("validates domain name rules more strictly (RFC 1035/5321)", () => {
      expect(
        validateEmail("user@-example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example-.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com-", { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const longLabel = "a".repeat(64);
      expect(
        validateEmail(`user@${longLabel}.com`, { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const longDomain = `user@example.${"a".repeat(250)}.com`;
      expect(validateEmail(longDomain, { level: "rfc5321" }).valid).toBeFalsy();

      const exactLabel = "a".repeat(63);
      expect(
        validateEmail(`user@${exactLabel}.com`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      expect(
        validateEmail("user@123.example.com", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("handles domain literals (IP addresses) correctly based on RFC 5321/5322 level", () => {
      expect(
        validateEmail("user@[192.168.0.1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321: path length (max 256 octets)", () => {
      const d63 = "a".repeat(63);
      const domain249 = `${d63}.${d63}.${d63}.${"a".repeat(57)}`;
      expect(domain249.length).toBe(249);

      const local5 = "a".repeat(5);
      expect(
        validateEmail(`${local5}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local6 = "a".repeat(6);
      expect(
        validateEmail(`${local6}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local7 = "a".repeat(7);
      expect(
        validateEmail(`${local7}@${domain249}`, { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321: local-part length (max 64 octets)", () => {
      const local64 = "a".repeat(64);
      expect(
        validateEmail(`${local64}@example.com`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local65 = "a".repeat(65);
      expect(
        validateEmail(`${local65}@example.com`, { level: "rfc5321" }).valid,
      ).toBeFalsy();

      const local32dot31 = `${"a".repeat(32)}.${"a".repeat(31)}`;
      expect(local32dot31.length).toBe(64);
      expect(
        validateEmail(`${local32dot31}@example.com`, { level: "rfc5321" }).valid,
      ).toBeTruthy();

      const local33dot31 = `${"a".repeat(33)}.${"a".repeat(31)}`;
      expect(local33dot31.length).toBe(65);
      expect(
        validateEmail(`${local33dot31}@example.com`, { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("all levels reject consecutive dots", () => {
      expect(
        validateEmail("user..name@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("levels with length checks enforce 998 char total limit", () => {
      const veryLongEmail = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(veryLongEmail, { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321/5322: handles domain literals correctly", () => {
      expect(
        validateEmail("user@[192.168.1.1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 1035: should reject domain labels starting or ending with a hyphen", () => {
      expect(
        validateEmail("user@-example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example-.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects strings with invalid control characters on stricter levels", () => {
      expect(
        validateEmail("user\n@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\n", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\nuser@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\nple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user\r@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\r", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\ruser@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\rple.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects malformed domain structures across all levels", () => {
      expect(validateEmail("user@", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@.", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@..", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("user@...", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("user@.domain.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@domain..example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("rejects completely invalid strings across all levels", () => {
      expect(
        validateEmail("not-an-email-at-all", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("12345", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("!@#$%^&*()", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("random string with spaces", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("just-text", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("<script>alert('xss')</script>", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("../../../etc/passwd", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("SELECT * FROM users", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("null", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("undefined", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("true", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("false", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("{}", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("[]", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("0", { level: "rfc5321" }).valid).toBeFalsy();
      expect(validateEmail("NaN", { level: "rfc5321" }).valid).toBeFalsy();
    });

    it("rejects email-like but invalid strings across all levels", () => {
      expect(
        validateEmail("no-at-sign.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("multiple@@at@signs.example.com", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("@no-local-part.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("no-domain@", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("..consecutive@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("trailing..dots@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@.leading-domain.example.com", {
          level: "rfc5321",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@trailing-dot.example.com.", { level: "rfc5321" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@domain..consecutive.example.com", {
          level: "rfc5321",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("@@@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(validateEmail("user@@@", { level: "rfc5321" }).valid).toBeFalsy();
      expect(
        validateEmail("@domain.example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("handles Punycode (IDN) addresses", () => {
      const punycodeEmail = "user@xn--bcher-kva.com";
      expect(
        validateEmail(punycodeEmail, { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321: supports quoted-string in local-part", () => {
      expect(
        validateEmail('"user"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user.name"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user@domain"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user with space"@example.com', { level: "rfc5321" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5321: rejects leading/trailing dots in dot-atom local-part", () => {
      expect(
        validateEmail(".user@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user.@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });

    it("RFC 5321: rejects comments", () => {
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com(comment)", { level: "rfc5321" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@(comment)[127.0.0.1]", { level: "rfc5321" }).valid,
      ).toBeFalsy();
    });
  });

  describe("rfc5322 level", () => {
    it("validates with different RFC compliance levels", () => {
      expect(
        validateEmail("test@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322 accepts all special characters from RFC", () => {
      const rfc5322ValidChars = "!#$%&'*+/=?^_`{|}~-";
      expect(
        validateEmail(`user${rfc5322ValidChars[0]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[1]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[2]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[3]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[4]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[5]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[6]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[7]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[8]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[9]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[10]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[11]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[12]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[13]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[14]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[15]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail(`user${rfc5322ValidChars[16]}test@example.com`, {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
    });

    it("all levels reject consecutive dots", () => {
      expect(
        validateEmail("user..name@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("all levels reject leading/trailing dots in local part", () => {
      expect(
        validateEmail(".user@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user.@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("all levels respect local part length limit of 64 chars", () => {
      const longLocal = `${"a".repeat(65)}@example.com`;
      expect(validateEmail(longLocal, { level: "rfc5322" }).valid).toBeFalsy();
    });

    it("levels with length checks enforce 998 char total limit", () => {
      const veryLongEmail = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(veryLongEmail, { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("handles quoted strings correctly based on RFC 5322 level", () => {
      expect(
        validateEmail('"user with space"@example.com', { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user..dots"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('".leadingdot"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"trailingdot."@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user\\"quote"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"user\\\\backslashes"@example.com', { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
    });

    it("handles domain literals (IP addresses) correctly based on RFC 5321/5322 level", () => {
      expect(
        validateEmail("user@[192.168.0.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("handles comments correctly based on RFC 5322 level", () => {
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();

      const parts = validateEmail("user(comment)@example.com", {
        level: "rfc5322",
      });
      expect(parts.valid).toBeTruthy();

      const parts2 = validateEmail("user@(comment)example.com", {
        level: "rfc5322",
      });
      expect(parts2.valid).toBeTruthy();
      expect(parts2.parts?.domain).toBe("example.com");
    });

    it("RFC 5322: handles quoted strings with special characters", () => {
      expect(
        validateEmail('"@+;,"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"test@test"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('"a\\ b"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: empty quoted string in local-part is valid", () => {
      expect(
        validateEmail('""@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles various comment placements", () => {
      expect(
        validateEmail("(comment)user@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user(comment)@example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@example.com(comment)", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@(comment)[127.0.0.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles nested comments and comments around dots", () => {
      expect(
        validateEmail("user(comment(nested))@example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("first.(comment)last@example.com", { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@example.(comment)com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles comments with quoted characters", () => {
      expect(
        validateEmail("user(a\\(b\\)c)@example.com", { level: "rfc5322" })
          .valid,
      ).toBeTruthy();
    });

    it("RFC 5321/5322: handles domain literals correctly", () => {
      expect(
        validateEmail("user@[192.168.1.1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@[IPv6:2001:db8::1]", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322 obsolete: handles mixed quoted and unquoted local-parts", () => {
      expect(
        validateEmail('"first".last@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail('first."last"@example.com', { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: handles extra whitespace around @", () => {
      expect(
        validateEmail("user  @  example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: should handle comments within the domain part", () => {
      expect(
        validateEmail("user@example.(comment)com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("RFC 5322: should handle whitespace around the '@' symbol", () => {
      expect(
        validateEmail("user @example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user@ example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
      expect(
        validateEmail("user @ example.com", { level: "rfc5322" }).valid,
      ).toBeTruthy();
    });

    it("rejects strings with invalid control characters on stricter levels", () => {
      expect(
        validateEmail("user\n@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\n", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\nuser@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\nple.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user\r@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@example.com\r", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("\ruser@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@exam\rple.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects emails with excessive length violations on levels with length checks", () => {
      const tooLongLocal = `${"a".repeat(65)}@example.com`;
      expect(
        validateEmail(tooLongLocal, { level: "rfc5322" }).valid,
      ).toBeFalsy();

      const tooLongTotal = `${"a".repeat(990)}@example.com`;
      expect(
        validateEmail(tooLongTotal, { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects malformed domain structures across all levels", () => {
      expect(validateEmail("user@", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@.", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@..", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("user@...", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("user@.domain.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@domain..example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });

    it("rejects completely invalid strings across all levels", () => {
      expect(
        validateEmail("not-an-email-at-all", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("12345", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("!@#$%^&*()", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("random string with spaces", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("just-text", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("<script>alert('xss')</script>", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("../../../etc/passwd", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("SELECT * FROM users", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("null", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("undefined", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("true", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("false", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("{}", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("[]", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("0", { level: "rfc5322" }).valid).toBeFalsy();
      expect(validateEmail("NaN", { level: "rfc5322" }).valid).toBeFalsy();
    });

    it("rejects email-like but invalid strings across all levels", () => {
      expect(
        validateEmail("no-at-sign.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("multiple@@at@signs.example.com", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("@no-local-part.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("no-domain@", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("..consecutive@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("trailing..dots@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@.leading-domain.example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@trailing-dot.example.com.", { level: "rfc5322" })
          .valid,
      ).toBeFalsy();
      expect(
        validateEmail("local@domain..consecutive.example.com", {
          level: "rfc5322",
        }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("user@@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(
        validateEmail("@@@example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
      expect(validateEmail("user@@@", { level: "rfc5322" }).valid).toBeFalsy();
      expect(
        validateEmail("@domain.example.com", { level: "rfc5322" }).valid,
      ).toBeFalsy();
    });
  });
});
```

:::

テストケースには以下のような項目が含まれています：

- 基本的なメールアドレスの検証
- `atext` の特殊文字対応（!#$%&'*+/=?^_`{|}~-）
- quoted-string対応（RFC 5322のみ）
- コメント対応（RFC 5322のみ）
- domain-literal（IPアドレス）対応
- DNS制約の検証（RFC 5321）
- 長さ制限の検証
- エラーケースの検証（連続ドット、不正なドメインなど）

## 7. RFC 5321とRFC 5322の比較

実装した2つの正規表現の主な違いをまとめます：

| 項目 | RFC 5321 | RFC 5322 |
|------|----------|----------|
| **用途** | SMTPでの転送 | メールヘッダーのフォーマット |
| **local-partの形式** | `dot-atom` + `quoted-string` | `dot-atom` + `quoted-string` + 混在形式 |
| **domainの制約** | DNS準拠（英数字とハイフンのみ） | 構文上は柔軟（実際にはDNS制約推奨） |
| **コメント** | 許可しない | `@` の前後、ドットの前後に配置可能 |
| **最大長** | 256文字 | 998文字(推奨) |
| **主な使用場面** | 実際にメールを送信する場合 | メールアドレスの構文解析 |

## 8. まとめ

本記事では、RFC 5321とRFC 5322に準拠したメールアドレスの正規表現を段階的に構築しました。
繰り返しになりますが、実際のアプリケーションでメールアドレスのバリデーションを行う場合は、記事の冒頭で紹介したHTML仕様の正規表現の使用をお勧めします。

```regex
/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

本記事で紹介したRFC準拠の正規表現は、あくまでRFC仕様の理解と学習を目的としています。実際のプロダクション環境では、用途に応じて適切なバリデーション方法を選択することが重要です。

## 参考資料

- [RFC 5321 - Simple Mail Transfer Protocol](https://www.rfc-editor.org/rfc/rfc5321)
- [RFC 5322 - Internet Message Format](https://www.rfc-editor.org/rfc/rfc5322)
- [HTML Standard - 4.10.5.1.5 Email state](https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email))
- [RFC 1035 - Domain Names - Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
