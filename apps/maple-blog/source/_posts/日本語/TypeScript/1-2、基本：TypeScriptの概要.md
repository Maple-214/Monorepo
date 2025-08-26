---
title: 1-2、基本：TypeScriptの概要(2)
toc: true
categories:
  - 日本語
  - TypeScript
tags:
  - フロントエンド
  - TypeScript
abbrlink: 52879
date: 2024-01-28 21:16:17
author:
img:
coverImg:
top:
cover:
mathjax:
password:
summary:
---

# 二、TypeScriptについて

## 2.1問題の発見

JavaScriptの各値には動作のセットがあり、さまざまなアクションを実行することで確認できます。これは抽象的に聞こえるので、簡単な例として、 `message` という変数に対して実行する可能性のあるアクションを考えてみましょう：

```js
// 在 'message' 上访问属性 'toLowerCase'，并调用它
message.toLowerCase();
// 调用 'message'
message();
```

これを分解すると、実行可能なコードの最初の行は属性 `toLowerCase` にアクセスし、それを呼び出します。2番目の試みは、 `message` を直接呼び出すことです。

しかし、 `message` が分からないとします。これはよくあることですが、これらのコードを実行しようとすると、どのような結果が得られるのかを確実に説明することはできません。各操作の動作は、最初に与えた `message` に依存します。

- `message` を呼び出すことはできますか？
- `toLowerCase` という属性を持っていますか？
- できる場合、 `toLowerCase` を呼び出すことができますか？
- 両方の値が呼び出し可能な場合、何を返しますか。

これらの質問に対する答えは、通常、JavaScriptを書くときに心に留めていることであり、すべての詳細が正確であることを期待しなければなりません。

`message` が次のように定義されているとします：

```js
const message = 'Hello World!';
```

予想されるように、 `message.toLowerCase()` を実行しようとすると、同じ小文字の文字列しか得られません。

2行目のコードは？JavaScriptに精通していれば、これが失敗して例外が発生することがわかります：

```shell
TypeError: message is not a function
```

私たちがそのような間違いを避けられれば幸いです。

コードを実行するとき、JavaScriptの実行時に何をするかを選択する方法は、値の*タイプ*を決定することです。それがどのような動作と機能を持つかを決定します。この `TypeError` は暗示の一部です。文字列 `"Hello World!"` は関数として呼び出すことはできません。

基本型 `string` や `number` などの一部の値については、 `typeof` 演算子を使用して実行時にその型を識別できます。しかし、関数のような他のものについては、それらの型を識別するための適切な実行時機構がありません。たとえば、次の関数を考えてみます：

```js
function fn(x) {
  return x.flip();
}
```

コード*観察*を読むことで、この関数は `flip` を呼び出せるプロパティを持つオブジェクトが与えられている場合にのみ機能しますが、JavaScriptはコードの実行時に確認できるような方法でこれらの情報を表示しません。純粋なJavaScriptでは、 `fn` に特定の値が何をするかを指定する**唯一の方法**は、その値を呼び出して何が起こるかを確認します。この動作は、実行前にコードが何をするかを予測することを困難にします。つまり、コードを書くときにコードが何をするかを知ることがより困難になることを意味します。

このように、*タイプ*は、 `fn` に渡すことができる値がクラッシュすることを示す概念である。JavaScriptが実際に提供するのは*動態*型だけです。コードを実行して、何が起こるかを確認してください。

もう1つの方法は、*せいてき*タイプのシステム*在る*を使用して、*前*予測コードを実行することです。

## 2.2**せいてきtypeけんさ**

`TypeError` 以前に `string` を関数として呼び出してみたことを思い出してください。*大多数の人*コードを実行するときに発生するあらゆる種類のエラーは好ましくありません。これらはエラーとみなされます！私たちは新しいコードを書くときに、新しいエラーを導入しないようにしています。

理想的には、*在る*コード実行*前*がこれらのエラーを発見するのに役立つツールがあります。これは、TypeScriptのような静的タイプインスペクタによって行われます。*せいてきがたシステム*は、プログラムを実行したときの値の形状と動作を記述しています。TypeScriptのようなタイプチェッカーは、どんなときに物事が浮気する可能性があるかを教えてくれます。

<img src="https://s2.loli.net/2022/02/22/5yhsbTCF7cqVGNQ.png" alt="image-20211109134610557" style="zoom:50%;" align="left" />

コードを実行する前にTypeScriptを使用して最後のサンプルを実行すると、エラーメッセージが表示されます。

## 2.3**異常なし故障**

ここまでランタイムエラーについてお話ししてきました--JavaScriptの実行時に、何かが無意味だと思っていることを教えてくれる場合です。このような状況が発生するのは、[ECMAScript仕様](https://tc39.github.io/ecma262/)が予期しない状況が発生した場合に言語がどのように動作するかを明示的に示しているからです。

たとえば、呼び出せないものを呼び出そうとすると、エラーがスローされると仕様書は言う。これは「明らかな行為」のように聞こえるかもしれませんが、オブジェクトに存在しない属性にアクセスしてもエラーがスローされるべきであることは想像できます。逆に、JavaScriptは別の動作を行い、値 `undefined` を返します：

```js
const user = {
  name: '小千',
  age: 26,
};
user.location; // 返回 undefined
```

最終的に、静的タイプのシステムでは、呼び出しが必要なコードがシステム内でマークされる必要があります。たとえ、それがすぐにエラーがスローされない「有効な」JavaScriptであっても、そのコードはそのシステム内でマークされる必要があります。たとえば、TypeScriptでは、次のコードが未定義の `location` に関するエラーを生成します：

<img src="https://s2.loli.net/2022/02/22/Qqo8BZmtJnGC1D4.png" alt="image-20211109141050215" style="zoom:50%;" />

TypeScriptは、私たちのプログラム内の*おびただしい*正当なエラーをキャプチャすることができます。例：

- 誤字![](/img/TypeScript/01-04.png)
- 呼び出されていない関数

<img src="https://s2.loli.net/2022/02/22/U1MmrPyjdbkueRC.png" alt="image-20211109142053954" style="zoom:50%;" align="left" />

- または基本的な論理エラー

![](/img/TypeScript/01-06.png)

## 2.4**ツールの使用**

コード内でエラーが発生した場合、TypeScriptはエラーをキャッチします。これは素晴らしいことですが、TypeScriptも*まずは*私たちがこれらのミスを犯すのを防いでくれます。

タイプインスペクタは、変数やその他のプロパティの正しいプロパティにアクセスしているかどうかなどを確認するのに役立ちます。これらの情報を取得すると、使用したい属性を開始することもできます*提案*。

これは、ツールを使用してTypeScriptコードを編集するときにエラーメッセージとコード補完が表示され、コアタイプインスペクタがエディタにコードを入力できることを意味します。これは、TypeScriptのツールについて話す際によく言及する部分です。

<img src="https://s2.loli.net/2022/02/22/qolAfbMnVIcXvys.png" alt="image-20211113085757666" style="zoom: 25%;" align="left" />

TypeScriptはツールを非常に重視しています。TypeScriptをサポートするエディタには、エラーを自動的に修正する「簡易修正」機能、コードを簡単に再編成するためのリファクタリング機能、変数定義にジャンプしたり、特定の変数へのすべての参照を検索するための便利なナビゲーション機能が用意されています。これらはすべてタイプチェッカーに基づいており、完全にクロスプラットフォームであるため、[您最喜欢的编辑器](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)は[TypeScriptのサポートが利用可能](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)の可能性があります。

## 2.5 `tsc` コンパイラ

タイプチェックについて話してきましたが、私たちのタイプ*チェッカー*はまだ使用されていません。新しい友人 `tsc` TypeScriptコンパイラを紹介しましょう。まずnpmで入手する必要があります。

```she
npm install -g typescript
```

これにより、TypeScriptコンパイラがグローバルにインストールされます。

では、空のフォルダに移動して、最初のTypeScriptプログラム `hello.ts` を作成してみましょう。

**01-ts-basics/hello.ts**

```ts
// 你好，世界
console.log('Hello World');
```

ここには余分な装飾がないことに注意してください。この「ハローワールド」プログラムは、JavaScriptで「ハローワールド」プログラム用に書いたプログラムと同じように見えます。次に、 `tsc` パッケージを実行して、 `typescript` パッケージをコンパイルします：

```shell
[felix] 01-ts-basics $ tsc hello.ts
```

私たちは `tsc` を走りましたが、何も起きませんでした！はい、タイプエラーはありませんので、何も報告されていないので、コンソールには何も出力されていません。

<img src="https://s2.loli.net/2022/02/22/APiNb5FzvuwGlZk.png" alt="image-20211113093244339" style="zoom: 50%;" align="left"/>

しかし、もう一度調べてみると、*ファイル*という出力がいくつか出てきます。現在のディレクトリを見ると、2つのファイル `hello.js` が `hello.ts` にあります。これは、 `hello.ts` ファイルが `tsc` *コンパイル*または*変換*に純粋なJavaScriptファイルである場合の出力です。

<img src="https://s2.loli.net/2022/02/22/ctI9MPpSY1y8uLr.png" alt="image-20211113093559374" style="zoom: 50%;" align="left" />

`hello.js` を確認すると、 `.ts` ファイルを処理した後にTypeScriptが吐き出す内容が表示されます：

```js
// 你好，世界
console.log('Hello World');
```

この場合、TypeScriptは変換するものがほとんどないので、私たちが書いたものと同じように見えます。コンパイラは、人間が書いたもののように見える、明瞭に読めるコードをコンパイルしようとします。注釈も残しておいてください。

タイプチェックエラーを導入した場合*確かに*はどうでしょうか。 `hello.ts` を上書きしてみましょう。

```ts
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet('小千');
```

もう一度実行すると、コマンドラインにエラーが表示されます！

<img src="https://s2.loli.net/2022/02/22/QNL3DlBHYUbxu9Z.png" alt="image-20211113095515775" style="zoom:50%;" align="left"/>

TypeScriptは、 `greet` 関数に引数を渡すことを忘れていることを示していますが、これは当然のことです。これまでは標準的なJavaScriptしか書いていませんでしたが、タイプチェックではコードの他の問題を見つけることができます。TypeScriptに感謝！

## 2.6エラーが発生しました

前の例では、私たちの `hello.js` ファイルが再び変更されたことに気がつかないかもしれません。このファイルを開くと、内容が入力ファイルとほぼ同じであることがわかります。

```js
// 你好，世界
console.log('Hello World');
function greet(person, date) {
  console.log('Hello ' + person + ', today is ' + date + '!');
}
greet('小千');
```

`tsc` が私たちのコードに関するエラーを報告しているという事実を考えると、これは少し驚くべきことかもしれませんが、これはTypeScriptの重要な価値観の1つに基づいています。ほとんどの場合、*君*はTypeScriptよりも何が起きているかを理解しています。

これまでにも触れておくと、タイプチェックコードによって実行できるプログラムの種類が制限されているため、タイプチェッカーが許容できると判断したタイプを比較検討する必要があります。ほとんどの場合、これは問題ありませんが、場合によっては、これらのチェックが邪魔になることがあります。たとえば、JavaScriptコードをTypeScriptに移行し、タイプチェックエラーを導入したとします。最終的には、タイプチェッカーのコードクリーンアップを開始しますが、元のJavaScriptコードを実行できるようになりました！なぜ、JSコードをTypeScriptコードに変換して実行しないようにしなければならないのでしょうか。

したがって、デフォルトではTypeScriptは我々のコードの実行を妨げることはありません。これらのJSはホスト環境で実行されても問題ありません。もちろん、時間の経過とともに、エラーに対してより防御し、TypeScriptの挙動をより厳しくしたいと思うかもしれません。この場合は、[ `noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError)コンパイラオプションを使用します。このオプションを使用して、 `hello.ts` ファイルを変更し、 `tsc` を再コンパイルしてみます：

```
tsc --noEmitOnError hello.ts
```

![](/img/TypeScript/02-04.png)

`hello.js` は決して更新されないことに気づくでしょう。

## 2.7明示型

これまでのところ、typescript `person` や `date` がどのような型であるかは教えていません。コードを編集するときに、 `person` は `string` であり、 `date` は `Date` オブジェクトであるべきであることをTypeScriptに伝えます。

これにより、TypeScriptは他の `greet` が誤って呼び出された可能性があることを知らせることができます。たとえば、 `hello.ts` コードを変更します：

```js
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

![](/img/TypeScript/02-05.png)

ん？TypeScriptは2番目のパラメータでエラーを報告していますが、これはなぜでしょうか。

驚くべきことに、 `Date()` をJavaScriptで呼び出すと、 `string` が返されます。 `new Date()` を使用すると、期待どおりに簡単にエラーを修正できます：

```js
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("小锋", new Date());
```

![](/img/TypeScript/02-06.png)

コンパイルに成功した結果、 `hello.js` が出力されました。

変数に明示的な型コメントを書く必要があるわけではないことを覚えておいてください。多くの場合、タイプの定義を無視しても、TypeScriptはタイプを自動的に*推論*(または「見つける」)ことができます。例えば：

<img src="https://s2.loli.net/2022/02/22/N2pXBbY6LRwoaC1.png" alt="image-20211113111924590" style="zoom:50%;" align="left" />

ここではmsgに具体的な型を指定しておらず、typescriptは関数の実数から型を自動的に推定する。これは、タイプシステムが最終的に同じタイプを推定する場合には、タイプコメントを追加しない方がよい特性です。

## 2.8消去タイプ

上のコードを `tsc` でコンパイルしたときにどのようなJavaScriptが出力されるかを詳しく見てみましょう。 `hello.js`

![](/img/TypeScript/02-08.png)

ここでは、2つの点に注意してください：

1. 引数 `person` および `date` には型に関するコメントがありません。
2. 「テンプレート文字列」--逆引用符(`文字)を使用した文字列は、連結(+)を持つ純粋な文字列に変換されます。

2点目については後ほど詳しく紹介しますが、ここでは1点目に焦点を当ててみましょう。型注釈はJavaScriptの一部ではありません(つまり、ECMAScriptは遅れています)。そのため、実際にはブラウザが存在しないか、他のランタイムが変更なしでTypeScriptを実行することができます。これは、TypeScriptが最初にコンパイラを必要とする理由です。TypeScript固有のコードを切り離したり変換したりして、実行できるようにする方法が必要です。TypeScript固有のコードのほとんどが削除されました。

> **覚えておいてください**：型コメントは、プログラムの実行時の動作を変更しません。

## 2.9ダウングレードコンパイル

上記とのもう1つの違いは、テンプレート文字列が次のものから構成されていることです：

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

対象：

```js
'Hello ' + person + ', today is ' + date.toDateString() + '!';
```

なぜそうなったのか。

テンプレート文字列は、ECMAScriptバージョンの機能であり、ECMAScript 2015（別名ECMAScript 6、ES2015、ES6など）と呼ばれます。TypeScriptは、新しいバージョンのECMAScriptから古いバージョン(ECMAScript 3やECMAScript 5(別名ES3とES5)など)にコードを書き換えることができます。ECMAScriptの最新バージョンまたはそれ以降のバージョンから、古いバージョンまたはそれ以前のバージョンへの移行プロセスは、*降格*と呼ばれることがあります。

デフォルトでは、TypeScriptはECMAScriptの非常に古いバージョンであるES3をターゲットにしています。[ `target`](https://www.typescriptlang.org/tsconfig#target)オプションを使用すると、のコンテンツを更新することができます。 `--target es2015` TypeScriptを実行してECMAScript 2015に変更を加えます。つまり、コードはECMAScript 2015をサポートするどこでも実行できるはずです。したがって、 `tsc --target es2015 hello.ts` を実行すると、次のような出力が得られます：

<img src="https://s2.loli.net/2022/02/22/3BbKfisq9htp4nr.png" alt="image-20211113113644658" style="zoom:33%;" />

> デフォルトのターゲットはES3ですが、現在はほとんどのブラウザがES2015をサポートしています。そのため、一部の古いブラウザとの互換性を考慮しない限り、ほとんどの開発者はES2015以降をターゲットとして安全に指定することができます。

## 2.10厳格モード

タイプインスペクタでTypeScriptを使用するユーザーによって、どの程度厳密にチェックしたいかが異なります。一部の人は、プログラムの一部のみを検証するのに役立つ、より緩やかな検証体験を探していますが、それでもよいツールを持っています。これはTypeScriptのデフォルトの操作です。タイプはオプションで、推論は最も緩いタイプを使用します。 `null`/ `undefined` は、 `tsc` がエラーに直面したときにJSファイルをコンパイルして生成する方法と同様に、潜在的な `null`/ `undefined` の値をチェックしません。既存のJavaScriptを移行するのであれば、これは理想的な第一歩かもしれません。

それよりも、多くのユーザーがTypeScriptをできるだけすぐに検証できるようにすることを好むのは、この言語が厳格な設定を提供する理由です。これらの厳密な設定は、(コードがチェックされているかどうかにかかわらず)スイッチから、よりダイヤルアップに近いものへと静的なタイプチェックを変えます。このダイアルを遠くに合わせるほど、TypeScriptがチェックしてくれます。これには多少の追加作業が必要になるかもしれないが、概して長期的に見れば価値があり、より徹底した検査とより正確なツールを実現することができる。可能であれば、新しいコードベースではこれらの厳密性チェックを常にオンにしておくべきである。

TypeScriptにはいくつかのタイプチェック厳密フラグがありますが、特に明記されていない限り、これらのフラグをすべて有効にして記述します。コマンドラインで[ `strict`](https://www.typescriptlang.org/tsconfig#strict)を設定するか、[ `tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)で `"strict": true` を設定して開きます。

![](/img/TypeScript/02-10.png)

![](/img/TypeScript/02-11.png)

上の2つのケースは、 `--strict true` を構成したためにエラーが発生しました。

また、個別に構成を選択することもできます。知っておくべき最も典型的な2つは、[ `noImplicitAny`]（https://www.typescriptlang.org/tsconfig#noImplicitAny）と[ `strictNullChecks`]（https://www.typescriptlang.org/tsconfig#strictNullChecks）です。

- ** `noImplicitAny` **

いくつかの場所では、TypeScriptはタイプを推定しようとせず、最も緩いタイプに戻ります。 `any`。これは起こりうる最悪の事態ではありません--結局のところ、 `any` はいずれにしても、通常のJavaScript体験に戻ることができます。

ただし、通常、 `any` を使用すると、最初にTypeScriptを使用する目的が損なわれます。プログラムの種類が多ければ多いほど、より多くの検証やツールを手に入れることができます。つまり、コードを書くときのエラーが少なくなります。この[ `noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny)フラグをオンにすると、タイプが暗黙的に推定され、変数がエラーを起こしたときに `any` が適用されます。

<img src="https://s2.loli.net/2022/02/22/Ir7T4vckJMsSnuK.png" alt="image-20211113122642576" style="zoom:40%;" />

- ** `strictNullChecks` **

デフォルトでは、 `null` および `undefined` の値は、他の任意の型に割り当てることができます。これはいくつかのコードを書くのを簡単にすることができますが、 `null` の処理を忘れて、 `undefined` があなたのコードの無数の誤りの原因です-一部の人はこれを[十亿美元的错误](https://www.youtube.com/watch?v=ybrQvs4x0Ps)と考えています！この[ `strictNullChecks`]（https://www.typescriptlang.org/tsconfig#strictNullChecks）フラグにより、オペレーション `null` および `undefined` がより明確になり、*忘れる*が `null` および `undefined` を処理するかどうかを心配する必要がなくなります。

<img src="https://s2.loli.net/2022/02/22/wRlPY8gO9v1zkZa.png" alt="image-20211113122914750" style="zoom:50%;" />

### 特別声明：この記事は<a href="https://github.com/lurongtao/TypeScript">古艺散人先生</a>から転自し、必要があれば原文のプレビューで閲覧することができます。
