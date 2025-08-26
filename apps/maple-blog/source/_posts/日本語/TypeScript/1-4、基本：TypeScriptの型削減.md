---
title: 1-4、基本：TypeScriptの型削減.md
toc: true
categories:
  - 日本語
  - TypeScript
tags:
  - フロントエンド
  - TypeScript
abbrlink: 53859
date: 2024-02-15 15:49:54
author:
img:
coverImg:
top:
cover:
mathjax:
password:
summary:
---

# 四、類型縮小

`padLeft` という関数があるとします：

```tsx
function padLeft(padding: number | string, input: string): string {
  throw new Error('まだ実装されていません！');
}
```

機能を拡張してみましょう。 `padding` が `number` の場合、 `input` に追加するスペースの数として扱われます、 `padding` が `string` であれば、 `input` 上にのみ `padding` を実行する。次のことを実現してみましょう：

```tsx
function padLeft(padding: number | string, input: string) {
  return new Array(padding + 1).join(' ') + input;
}
```

![image-20211114161343249](/img/TypeScript/04-01.png)

ああ、 `padding + 1` でエラーが発生しました。TypeScriptは、演算子 `+` をタイプ `string | number` および `number` に適用できないことを警告していますが、これは正しいです。言い換えれば、 `padding` が `number` であるかどうかを明確にチェックしたり、 `string` である場合に対処したりしていないので、このようにします：

```tsx
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input;
  }
  return padding + input;
}
```

このほとんどが面白くないJavaScriptコードのように見えるなら、これもポイントになるでしょう。設定した注釈を除けば、このTypeScriptコードはJavaScriptのように見えます。私たちの考えでは、TypeScriptの型システムは、型セキュリティを獲得するために身をかがめる必要がなく、典型的なJavaScriptコードをできるだけ簡単に記述できるように設計されています。

あまり多くないように見えますが、実はたくさんのものがここにあります。TypeScriptが静的型を使用して実行時の値を分析するのと同様に、JavaScriptの実行時制御フロー構造に、if/else、条件トリプル、ループ、信頼性チェックなどの型の分析を重ねます。

私たちのifチェックでは、TypeScriptは `typeof padding ==="number"` と認識し、タイプ保護と呼ばれる特殊な形式のコードとして認識します。TypeScriptは、特定の場所にある値の最も具体的な型を分析するために、プログラムが取り得る実行パスに従います。これらの特殊なチェック(型保護と呼ばれる)と代入を見て、宣言された型よりも具体的な型に型を細分化するプロセスを絞り込みと呼びます。多くのエディタでは、これらの種類の変化を見ることができますし、私たちの例でもそうします。

TypeScriptは、いくつかの異なる縮小構造を理解することができます。

## 4.1 `typeof` タイプガード

ここまで見てきたように、JavaScriptは `typeof` 演算子をサポートしています。この演算子は、実行時に所有する値の種類に関する非常に基本的な情報を提供します。TypeScriptは、特定の文字列のセットを返すことを期待します：

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

`padLeft` に見られるように、この演算子は多くのJavaScriptライブラリによく登場します。TypeScriptは、さまざまな分岐にある型を絞り込むものとして理解できます。

TypeScriptでは、 `typeof` の戻り値をチェックすることが保護型です。TypeScriptは、 `typeof` アクションをエンコードして異なる値を返すので、JavaScriptに何が行われたかを知っています。たとえば、上のリストでは、 `typeof` はstring `null` を返さないことに注意してください。次の例を参照してください：

```tsx
function printAll(strs: string | string[] | null) {
  if (typeof strs === 'object') {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  } else {
    // do something
  }
}
```

<img src="https://s2.loli.net/2022/02/22/vqyDfKRPZkdzX7j.png" alt="image-20211114164143361" style="zoom:50%;" />

関数 `printAll` では、配列型であるかどうかを調べる代わりに、 `strs` がオブジェクトであるかどうかを調べてみます(配列がJavaScriptのオブジェクト型であることを強調するのに適したタイミングかもしれません)。しかし、JavaScriptでは、 `typeof null` も実際には `"object"` であることが判明しました。歴史上の不幸な事故の一つだ。

十分な経験を持つユーザーは驚かないかもしれませんが、誰もがJavaScriptでこのような状況に遭遇したことがあるわけではありません。幸いなことに、typescriptは、 `strs` が `string[]` だけではなく、 `string[] | null` に縮小されることを示しています。

これは、いわゆる「真正性」チェックへの良い移行といえるかもしれません。

## 4.2真理値の縮小

真理値チェックはJavaScriptでよくやっていることです。JavaScriptでは、条件、 `&&`、 `||`、 `if` ステートメント、ブール否定( `!`)などの任意の式を使用できます。たとえば、 `if` ステートメントでは、条件が常に `boolean` 型になることは想定していません。

```tsx
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `「合計 ${numUsersOnline} 人が現在オンラインです!」`;
  }
  return '今は誰もオンラインにいません. :(';
}
```

JavaScriptでは、このような `if` 条件ステートメントは、まず条件「強制」を `boolean` に変換して意味を持たせ、その結果が `true` であるか `false` であるかによって分岐を選択します。このような面の値は次のようになります：

- `0`
- `NaN`
- `""` (空の文字列)
- `0n` ( `bigint` ゼロのバージョン)
- `null`
- `undefined`

これらの値は強制的に `false` に変換され、その他の値は強制的に `true` に変換されます。関数 `Boolean` で値を実行して `boolean` を取得するか、短い二重ブール否定を使用して値を強制的に `boolean` に変換することができます。(後者の利点は、TypeScriptが狭いリテラルのboolean型 `true` を推定し、最初の型を `boolean` と推定することです)。

```tsx
// どちらの結果も true を返します
Boolean('hello'); // type: boolean, value: true
!!'world'; // type: true, value: true
```

この動作を利用することは、特に `null` や `undefined` などの値を防ぐ場合には、非常に一般的である。たとえば、この関数を `printAll` 関数で使用してみましょう。

```tsx
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  }
}
```

`strs` が真であるかどうかをチェックすることで、上記のエラーを解消したことにお気づきでしょう。これにより、コードの実行時に次のような恐ろしいエラーが発生するのを防ぐことができます：

```shell
TypeError: null is not iterable
```

ただし、プリミティブの真理値チェックはしばしば誤りやすいことを覚えておいてください。たとえば、 `printAll` を上書きすることを考えてみましょう。

```tsx
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  // そんなことしたらダメ！
  // 理由は以下の通り
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs);
    }
  }
}
```

関数本体全体を実際の検査でラッピングしましたが、空の文字列を正しく処理できなくなるという小さな欠点があります。

TypeScriptはここではまったく間違いを報告しませんが、JavaScriptに詳しくない方は注意すべき行動です。TypeScriptは通常、エラーを早期に発見するのに役立ちますが、ある値を*任意*処理しないように選択した場合には、論理的な問題をあまり考慮することなく、これだけのことができます。必要に応じて、linter(プログラムの正規化)を使用してこのような状況に対処することができます。

真正性による絞り込みの最後の点については、論理を否定枝からブール否定 `!` でフィルタリングすることである。

```tsx
function multiplyAll(values: number[] | undefined, factor: number): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## 4.3等価縮小

typescriptも分岐文を用いて `===`、 `!==`、 `==`、および `!=` などの値検査を行い、型の絞り込みを実現している。例：

```tsx
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // これで、x、y で文字列型のメソッドを呼び出すことができます。
    x.toUpperCase();
    y.toLowerCase();
  } else {
    console.log(x);
    console.log(y);
  }
}
```

上記の例で `x` と `y` が等しいかどうかを調べたとき、TypeScriptはそれらの型も等しくなければならないことを認識しています。 `string` は、 `x` と `y` の両方で使用できる唯一の一般的な型なので、TypeScriptは、 `x` と `y` がいずれも `string` の場合、プログラムは最初の分岐に進みます。

変数ではなく、特定のリテラル値をチェックすることも有効です。真理値の絞り込みについてのセクションでは、空の文字列を正しく処理していないため、エラーが発生しやすい関数 `printAll` を書きました。代わりに、特定のチェックをして `null` をブロックし、TypeScriptが `strs` から `null` を正しく削除したままにすることができます。

```tsx
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs);
    }
  }
}
```

JavaScriptのより緩やかな同等性チェック `==` および `!=` も、適切に縮小されます。変数が `== null` であるかどうかを調べる方法に慣れていない場合は、それが特定の値 `null` であるかどうかだけでなく、 `undefined` であるかもしれないかどうかも調べる必要があるので、どのようにして `== null` であるかどうかを調べる必要があります。これは `== undefined` にも当てはまります。値が `null` または `undefined` であるかどうかがチェックされます。ここでは、この `==` と `!=` だけで済ませることができます。

```tsx
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // 未定義と null を型から除外しました
  if (container.value != null) {
    console.log(container.value);
    // これで、「container.value」を安全に乗算できるようになりました。
    container.value *= factor;
  }
}
```

<img src="https://s2.loli.net/2022/02/22/tkwKocVjWeRn3XN.png" alt="image-20211115154532180" style="zoom:50%;" />

最初の3つの印刷はパスしましたが、4番目に問題がありました。

## 4.4 `in` オペレータ縮小

JavaScriptには、 `in` 演算子を使用して、オブジェクトに属性名があるかどうかを判断する演算子があります。TypeScriptはこの点を考慮して、潜在的なタイプを絞り込んでいます。

たとえば、コード `"value" in x` を使用します。ここで、 `"value"` は文字列リテラルであり、 `x` は結合型である。値が「true」の分岐は縮小されます。 `x` オプションまたは必須属性を持つタイプの値が必要です。値が「false」の分岐は縮小され、オプションまたは欠落した属性を持つタイプの値が必要になります。

```tsx
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

また、オプション属性は縮小の両側にも存在します。たとえば、人間は（適切な装置を使用して）泳いだり飛んだりできるため、 `in` チェックの両側に表示されます：

```tsx
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ('swim' in animal) {
    // animal: Fish | Human
    animal;
  } else {
    // animal: Bird | Human
    animal;
  }
}
```

## 4.5 `instanceof` オペレータ縮小

JavaScriptには、ある値が別の値の「インスタンス」であるかどうかをチェックする演算子 `instanceof` があります。具体的には、JavaScriptの `x instanceof Foo` で、 `x` の*プロトタイプチェーン*に `Foo.prototype` が含まれているかどうかをチェックします。ここでは詳しく説明しませんが、 `类(class)` の学習に入ると、その多くが `new` キーワードを使ってインスタンス化できることがわかります。すでにお気づきのように、 `instanceof` も型保護であり、TypeScriptは `instanceof` で保護されたブランチの縮小を実装します。

```tsx
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}

logValue(new Date()); // Mon, 15 Nov 2021 22:34:37 GMT
logValue('hello ts'); // HELLO TS
```

## 4.6配分の縮小

前述したように、任意の変数に値を割り当てると、TypeScriptは割り当てられた値の右側を確認し、左側を適切に縮小します。

```tsx
// let x: string | number
let x = Math.random() < 0.5 ? 10 : 'hello world!';

x = 1;
// let x: number
console.log(x);

x = 'goodbye!';
// let x: string
console.log(x);
```

これらの割り当てはそれぞれ有効であることに注意してください。最初の代入後に観測されたタイプ `x` が `number` に変更された場合でも、 `string` を `x` に代入することができます。これは、*宣言型*の `x` -このタイプ `x` は `string | number` で始まるためです。

`x` に `boolean` を割り当てると、宣言型の一部ではないため、エラーが表示されます。

```tsx
let x = Math.random() < 0.5 ? 10 : 'hello world!';

// let x: string | number
x = 1;

// let x: number
console.log(x);

// エラー！
x = true;

// let x: string | number
console.log(x);
```

<img src="https://s2.loli.net/2022/02/22/iZFWjN4BkfKbdr2.png" alt="image-20211116065026159" style="zoom: 50%;" />

## 4.7制御フロー解析

ここまで、いくつかの基本的な例を使って、TypeScriptが特定のブランチでどのように絞り込むかを説明してきました。しかし、各変数から出てきて、 `if`、 `while`、条件などで型保護を探す以外にも、やるべきことはたくさんあります。例：

```tsx
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input;
  }
  return padding + input;
}
```

`padLeft` は、その最初の `if` ブロックから返されます。TypeScriptはこのコードを解析し、paddingが数値の場合、ボディの残りの部分( `return padding + input;`)が到達不可能であることを確認します。このため、関数の残りの部分で使用される `padding` 型から数値を削除(文字列数値から文字列に絞り込む)できます。

この到達可能性ベースのコード解析は制御フロー解析と呼ばれ、TypeScriptはタイプガードと代入に遭遇するため、このフロー解析を使用してタイプを絞り込みます。各点で異なる型が観察され得る変数を解析すると、制御フローを何度も分割して再結合することができる。

```tsx
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  // let x: boolean
  console.log(x);

  if (Math.random() < 0.5) {
    x = 'hello';
    // let x: string
    console.log(x);
  } else {
    x = 100;
    // let x: number
    console.log(x);
  }

  // let x: string | number
  return x;
}

let x = example();
x = 'hello';
x = 100;
x = true; // error
```

<img src="https://s2.loli.net/2022/02/22/hA2aRrP93TIBuOG.png" alt="image-20211117203742503" style="zoom:50%;" />

## 4.8型述語の使用

ここまで、我々は既存のJavaScript構造体を用いてナローディングの問題に対処してきましたが、時にはコード全体の型の変化をより直接的に制御したいと思うことがあります。

ユーザ定義型保護を定義するには、戻り型が型述語である関数を定義するだけです。

```tsx
type Fish = {
  name: string;
  swim: () => void;
};

type Bird = {
  name: string;
  fly: () => void;
};

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

この例では、 `pet is Fish` が型述語です。述語の形式は `parameterName is Type` です。 `parameterName` は、現在の関数のシグネチャ内のパラメータ名である必要があります。

`isFish` が呼び出されるたびに、TypeScriptは元の型が互換性を持っている場合、その変数を特定の型に絞り込みます。

```tsx
function getSmallPet(): Fish | Bird {
  let fish: Fish = {
    name: 'gold fish',
    swim: () => {},
  };

  let bird: Bird = {
    name: 'sparrow',
    fly: () => {},
  };

  return true ? bird : fish;
}

// ペットのスイムとフライの両方にアクセスできます。
let pet = getSmallPet();
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

TypeScriptは、 `pet` が `if` 分岐で魚であることを知っているだけではないことに注意してください。また、 `else` 枝に `Fish` がないことも知っているので、 `Bird` があるはずです。

型ガード `isFish` を使用して、 `Fish | Bird` の配列をフィルタリングし、 `Fish` の配列を得ることができます。

```tsx
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// または、以下と同等
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// より複雑な例では、述語を再利用する必要がある場合があります。
const underWatch3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'frog') {
    return false;
  }
  return isFish(pet);
});
```

## 4.9差別された `unions`

これまで見てきた例のほとんどは、単純な型( `string`、 `boolean`、 `number` など)を使って個々の変数を絞り込むことを中心にしています。よくあることですが、JavaScriptでは少し複雑な構造体を扱うことが多いです。

インスピレーションを引き出すために、円形や四角などの形をコード化しようとしていると想像してみましょう。円は半径を表し、四角形は辺の長さを表します。 `kind` というフィールドを使用して、どの形状を扱っているかを示します。ここでは、 `Shape` を定義する最初の試みを行います。

```tsx
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}
```

文字列リテラル型の結合を使用していることに注意してください。 `"circle "` と ` "square "` はそれぞれ、この形状を円形とみなすべきか正方形とみなすべきかを示しています。 `string` ではなく `"circle" | "square "` を使用することで、スペルミスの問題を回避できます。

```tsx
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === 'rect') {
    // ...
  }
}
```

<img src="https://s2.loli.net/2022/02/22/gN6Arztw5S2kFJm.png" alt="image-20211118090404099" style="zoom:50%;" />

関数 `getArea` を書いて、それが円か正方形かに応じて正しい論理を適用することができます。まず円形を試してみましょう。

```tsx
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<img src="https://s2.loli.net/2022/02/22/fNEWpy8i3GdxTLO.png" alt="image-20211118091637002" style="zoom:50%;" />

`strictNullChecks` では、これは私たちに間違いを与えます。 `radius` が定義されていない可能性があるので、これは適切です。しかし、 `kind` 属性を適切にチェックしたらどうでしょうか。

```tsx
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  }
}
```

<img src="https://s2.loli.net/2022/02/22/T76rqcQbF2utN4U.png" alt="image-20211118093134890" style="zoom:50%;" />

まあ、TypeScriptはまだどうすればいいのかわかりません。私たちは、タイプチェッカーが知っている以上に値を知っているという問題に直面しました。空ではないアサーション( `radius` の後にある感嘆符 `!`)を使用して、 `radius` が存在することを示すことができます。

```tsx
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius! ** 2;
  }
}
```

しかしこの感じは理想的ではありません。空ではないアサーションを使用して、型チェッカーに感嘆符( `！`)を宣言し、 `shape.radius` が定義されていることを納得させる必要がありますが、コードを動かし始めると、これらのアサーションは間違いやすいでしょう。また、 `strictNullChecks` 以外では、これらのフィールドに誤ってアクセスすることもできます(これらのフィールドが読み込まれると、オプション属性が常に存在すると見なされるからです)。私たちは絶対にもっとうまくやることができます。

このような `Shape` のエンコーディングの問題は、タイプチェッカーが、クラス属性に基づいて `radius` または `sideLength` の存在を知る方法がないことです。私たちが知っていることをタイプチェッカーに伝える必要があります。そのことを考えて、Shapeをもう一度定義してみましょう。

```tsx
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;
```

ここでは、 `Shape` を2つのタイプに正しく分類し、 `kind` 属性に異なる値を設定していますが、 `radius` と `sideLength` はそれぞれのタイプで必須属性として宣言されています。

半径 `Shape` にアクセスしようとするとどうなるか見てみましょう。

```tsx
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<img src="https://s2.loli.net/2022/02/22/ws1RYKDjvnQNxlC.png" alt="image-20211118180452972" style="zoom:50%;" />

最初に定義した `Shape` と同様に、これはまだ間違いです。半径がオプションの場合、TypeScriptではこのアトリビュートが存在するかどうかを判断できないため、エラーが発生しました( `strictNullChecks` のみ)。これで `Shape` がコンソーシアムになり、TypeScriptは `shape` が `Square` である可能性があることを示していますが、Squareは半径 `radius` を定義していません。どちらの解釈も正しいのですが、 `Shape` の新しいエンコーディングだけが、まだ `strictNullChecks` の外側でエラーが発生しています。

しかし、もう一度kind属性をチェックしてみたらどうでしょうか。

```tsx
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    // shape: Circle
    return Math.PI * shape.radius ** 2;
  }
}
```

これで間違いから脱した！ `union` の各型にリテラル型と同じプロパティが含まれている場合、TypeScriptはそれを `union` と見なし、 `union` のメンバーを絞り込むことができます。

この場合、 `kind` がその共通属性である（これが `Shape` の判別属性である）。 `kind` 属性が `"circle"` であることを確認すると、 `Shape` 内の ` "circle"` 型属性を持たないすべての型を除外できます。これにより、 `Shape` の範囲は `Circle` というタイプに絞られる。

`switch` 文にも同じチェック方法が適用されます。ここでは、 `！` 空でないアサーションという嫌な感嘆符を付けずに、完全な `getArea` を書いてみましょう。

```tsx
function getArea(shape: Shape) {
  switch (shape.kind) {
    // shape: Circle
    case 'circle':
      return Math.PI * shape.radius ** 2;

    // shape: Square
    case 'square':
      return shape.sideLength ** 2;
  }
}
```

ここで最も重要なのは、 `Shape` のエンコーディングである。 `Circle` と `Square` は、実際には特定の種類のフィールドを持つ2つの独立したタイプであるという正しい情報をTypeScriptに伝えることが重要です。このようにすることで、本来書くJavaScriptと変わらないように見えるタイプ安全なTypeScriptコードを書き出すことができます。そこから、型システムは「正しい」ことを行い、私たちの `switch` 文の各分岐内の型を見つけることができます。

> 傍観者として、上記の例をプレイして、リターンキーワードをいくつか外してみてください。型チェックは、switchステートメントの中で誤って別の節に落とし込まれるバグを回避するのに役立ちます。

弁証法的な連合体は、円形と四角の話をするだけではありません。ネットワーク上でメッセージを送信したり( `client/server` トラフィック)、状態管理フレームワークで突然変異をエンコードしたりするなど、JavaScriptであらゆるタイプのメッセージングスキームを表現するのに適しています。

## 4.10 `never` タイプおよび網羅性チェック

絞り込む際には、コンソーシアムの選択肢を、すべての可能性を削除して何も残らない程度に減らすことができます。このような場合、TypeScriptは `never` 型を使用して、存在してはならない状態を表します。

`never` 型は各型に割り当てることができます。ただし、neverに割り当てることができる型はありません(never自体を除く)。つまり、 `switch` 文では、縮小して `never` に依存する出現を使用して詳細なチェックを行うことができます。

たとえば、関数 `getArea` にデフォルト値を追加して、形状を `never` に割り当てようとすると、可能なすべての状況が処理されなかったときに送出されます。

```tsx
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

`Shape` フェデレーションに新しいメンバを追加すると、TypeScriptエラーが発生します。

```tsx
interface Triangle {
  kind: 'triangle';
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

<img src="https://s2.loli.net/2022/02/22/mPEYDNGbXZxzIy9.png" alt="image-20211118183410201" style="zoom:50%;" />

### 特別声明：この記事は<a href="https://github.com/lurongtao/TypeScript">古艺散人先生</a>から転自し、必要があれば原文のプレビューで閲覧することができます。
