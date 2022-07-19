---
title: "キメラプログラムどれが一番速いのか選手権"
emoji: "😎"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["cpp", "rust", "go","python","cython","zig"]
published: true
---

## はじめに

修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。

使用したコードは下記レポジトリに保存されています。

https://github.com/riya-amemiya/chimera-program-laboratory

### 追記

10万じゃ少ないなと思ってループを100万に増やしました。

## 環境

```bath
python --version
Python 3.7.0

cargo --version
cargo 1.64.0-nightly (8827baaa7 2022-07-14)

zig version
0.10.0-dev.2977+7d2e14267

g++ --version
Apple clang version 13.1.6 (clang-1316.0.21.2.5)
Target: x86_64-apple-darwin21.5.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/
XcodeDefault.xctoolchain/usr/bin

go version
go1.18.4 darwin/amd64

sw_vers
ProductName:    macOS
ProductVersion: 12.4
BuildVersion:   21F79
```

## 本題

C++,Rust,Go,Zigのキメラプログラムと個別の呼び出しを比較してどれが一番速いのかを検証します。
FFIによるリンク方法は書くと長くなるので省きます。
(別記事でいつか書きます)
全言語で下記のような階乗を求めるコードで、10までの階乗を100万回計算するコードを書いて、それを10回実行し、その平均で順位を決めます。
なおキメラプログラムは全てCythonから呼び出すものとします。

```go
func factorial(n int) int {
    if n == 0 {
        return 1
    }
    return n * factorial(n-1)
}
```

速かった順で紹介します。

## キメラプログラムの測定結果

### Cython > Rust

```bath
Average time: 0.9254405736923218s
Total time: 9.254405736923218s
```

### Cython > C++ > Rust

```bath
Average time: 0.9255857944488526s
Total time: 9.255857944488525s
```

### Cython > C++

```bath
Average time: 0.9369760990142822s
Total time: 9.369760990142822s
```

### Cython > Rust > Zig

```bath
Average time: 0.946899127960205s
Total time: 9.46899127960205s
```

### Cython > C++ > Rust > Zig

```bath
Average time: 0.9499162435531616s
Total time: 9.499162435531616s
```

### Cython > C++ > Rust > Go

```bath
Average time: 6.586188650131225s
Total time: 65.86188650131226s
```

### Cypython > Go

```bath
Average time: 6.606438231468201s
Total time: 66.064382314682s
```

Goが何故か遅かったです
何がボトルネックになったのかは不明です。
新人のZigはかなり速いですね。
RustやC++と肩並べてます。

## 単体の結果

検証方法は同じです。

### Rust

```bath
Average time: 1.361726450920105s
Total time: 13.61726450920105s
```

### Cython

```bath
Average time: 1.4226868629455567s
Total time: 14.226868629455566s
```

### Go

```bath
Average time: 1.8822954177856446s
Total time: 18.822954177856445s
```

### C++

```bath
Average time: 1.96580650806427s
Total time: 19.6580650806427s
```

### Zig

```bath
Average time: 2.5173786163330076s
Total time: 25.173786163330078s
```

### Python

```bath
Average time: 2.647188401222229s
Total time: 26.47188401222229s
```

驚きなのはPythonが他のコンパイラ言語に劣らずかなり速いですね。
どんな条件下でも速度がほぼ変わらないRustは流石といったところです。
なんでこんなに単体とFFIで結果が違うのか知ってる有識者の方いましたらコメントお願いいたします。
最適化も同じにしたつもりなのですが...

## エキシビジョンマッチ

エキシビジョンマッチとしてJavaScriptとRubyにも参加してもらいます。
インタプリタ言語最速は誰なのか!?

### バージョン

JavaScript:Nodev16.16.0,QuickJS
Ruby:v3.0.1

### JavaScript(QuickJS)

```bath
Average time: 1.2300517082214355s
Total time: 12.300517082214355s
```

### Ruby

```bath
Average time: 1.5127671480178833s
Total time: 15.127671480178833s
```

### JavaScript(Node.js)

```bath
Average time: 4.409640073776245s
Total time: 44.09640073776245s
```

Rubyが爆速すぎて驚きです。
インタプリタ言語の内部処理はあまり詳しくないのですが、単純なループ処理は得意なのかもしれません。

## まとめ

👹<お前もキメラプログラマー🧑‍💻にならないか?

## 注意

これはあくまでも検証であり、実際のプログラムを書くときには違いがあります。
今回は単純なループでしたが複雑な計算になると順位が変動するかもしれません。
複雑な計算は気が向いたら書きます。

## 宣伝

ブログやってます。

https://amemiya-riya-blog.oshaburikitchin.com/
