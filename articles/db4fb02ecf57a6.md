---
title: "AI Programmerで遊んでみた"
emoji: "🔖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["AI","プログラミング"]
published: true
---

## はじめに

:::message
修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。
:::

コード内のコメントはAIが書いたものではなく、私が入力したものです。
コードはAIが書いたものをそのまま貼り付けています。

## 本題

面白そうなサービスをTwitterで見つけたのでレポートします。
「また海外ですか、私英語できません。」って方、安心してください！
日本製です！
日本語でOKです！

https://aiprogrammer.hashlab.jp/

## 早速書かせてみる

### JavaScript

```js
//配列の平均値を求める関数

function average(arr) {
  var sum = 0;

  for(var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum / arr.length;
}
```

うーんvarになってしまいました。
varはゴミゴミのゴミなのでES6と付け加えてみます。

```js
//ES6以上で配列の平均値を求める関数

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
```

いい感じに出力できました。
JavaScriptを指定した際はES6以上などの文言を入れた方がいいかもしれません。

### Python

```py
# 配列の平均値を求める関数

def average(arr):
sum = 0
for i in range(0, len(arr)):
sum += arr[i]
return sum / len(arr)
```

長いし、インデントがずれてます。

### Ruby

```rb
# 配列の平均値を求める関数

def average(array)
sum = 0
array.each do |element|
sum += element
end
sum / array.length
end
```

長い!

### Go

```go
//配列の平均値を求める関数

func average(arr []int) int {
sum := 0
for _, v := range arr {
sum += v
}
return sum / len(arr)
}
```

Python,Ruby,Goのコードは同じですね。
どの言語も2~3行で書けるのに、冗長的なコードになってしまっています。

### PHP

```php
//配列の平均値を求める関数

<?php

function get_average($arr) {
return array_sum($arr) / count($arr);
}

?>
```

PHPは短くなりましたね。

### 複雑な指示出してみた

#### 自然数判定

```js:JavaScript
//自然数かどうか判定する関数

function isNatural(num) {
return num >= 0;
}
```

小数点もOKになってしまいました。

#### 偏差値

```js:JavaScript
//偏差値を求める関数

function getDeviation(arr) {
var mean = getMean(arr);
var deviations = arr.map(function(num) {
return num - mean;
});
return getMean(deviations);
}
```

謎の `getMean` が出てきました。

#### 電卓

```js:JavaScript
//文字列を解析して足し算、引き算、掛け算、割り算ができる電卓を作って

var calculator = {
add: function(x, y) {
return x + y;
},
subtract: function(x, y) {
return x - y;
},
multiply: function(x, y) {
return x * y;
},
divide: function(x, y) {
return x / y;
}
};
```

使い物になりません。

## まとめ

AI Programmerは非常に面白いサービスです。
日本語に対応しているのが一番の魅力ですね。
今後のアップデートに期待です。

## おまけ

GitHub Copilotにも書いてもらいました。

```js:JavaScript
//配列の平均値を求める関数

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
```

```py:Python
# 配列の平均値を求める関数

def average(arr):
    return sum(arr) / len(arr)
```

```rb:Ruby
# 配列の平均値を求める関数

def average(array)
    array.sum / array.length
end
```

```go:Go
// 配列の平均値を求める関数

func average(arr []int) int {
    return sum(arr) / len(arr)
}
```

```php:PHP
// 配列の平均値を求める関数

<?php
function average($arr) {
    return array_sum($arr) / count($arr);
}
?>
```

```js:JavaScript
//偏差値を求める関数

const calc = (score) => {
    return (score - 50) / 10;
}
```

```js:JavaScript
//自然数かどうか判定する関数
const isNaturalNumber = (num) => {
    return Number.isInteger(num) && num > 0;
}
```

```js:JavaScript
//文字列を解析して足し算、引き算、掛け算、割り算ができる電卓を作って

function calculator(str) {
    let result = 0;
    let operator = '+';
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '+' || str[i] === '-' || str[i] === '*' || str[i] === '/') {
            if (operator === '+') {
                result += num;
            } else if (operator === '-') {
                result -= num;
            } else if (operator === '*') {
                result *= num;
            } else if (operator === '/') {
                result /= num;
            }
            operator = str[i];
            num = 0;
        } else {
            num = num * 10 + parseInt(str[i]);
        }
    }
    if (operator === '+') {
        result += num;
    } else if (operator === '-') {
        result -= num;
    } else if (operator === '*') {
        result *= num;
    } else if (operator === '/') {
        result /= num;
    }
    return result;
}
```

Copilotの方は掛け算と割り算ができないですね。惜しいです。

## おまけ2

ではなく構文を使うと別言語で書けるらしいです。

```java:Java
// C++ではなくJavaで配列の平均値を求める関数を作って

public class Main {
public static void main(String[] args) {
int[] array = {1, 2, 3, 4, 5};
int sum = 0;
for (int i = 0; i < array.length; i++) {
sum += array[i];
}
int average = sum / array.length;
System.out.println(average);
}
}
```

執筆時点ではまだJavaは対応してないのにかけてしまいました。
(`public class Main` までは私が書いてます)
シンプルに驚きました。

## おまけ3

コードを日本語で説明してくれるらしいので、試してみます。
スタイリングの関係でコメントアウトしています。

```ts:TypeScript
const getDecimalLength = (value: number) => {
let x = (value + '').split('.')[1];
if (typeof x !== 'undefined' && x.length > 0) {
return x.length;
}
return 0;
};

//数値から小数点以下の桁数を取得する関数です。
```

```asm:Assembly
.section __TEXT,__text,regular,pure_instructions
.build_version macos, 12, 0 sdk_version 12, 3
.globl __Z3addii ## -- Begin function _Z3addii
.p2align 4, 0x90
__Z3addii: ## @_Z3addii
.cfi_startproc
## %bb.0:
pushq %rbp
.cfi_def_cfa_offset 16
.cfi_offset %rbp, -16
movq %rsp, %rbp
.cfi_def_cfa_register %rbp
movl %edi, -4(%rbp)
movl %esi, -8(%rbp)
movl -4(%rbp), %eax
addl -8(%rbp), %eax
popq %rbp
retq
.cfi_endproc
## -- End function
.subsections_via_symbols

# このコードは、2つの整数を加算する関数を定義しています。
```

gccで作成したアセンブリですがしっかりと説明してくれています。
