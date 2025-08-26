---
title: 1-3、TypeScriptのよくある種類
toc: true
categories:
  - 日本語
  - TypeScript
tags:
  - フロントエンド
  - TypeScript
abbrlink: 17422
date: 2024-02-14 22:05:56
author:
img:
coverImg:
top:
cover:
mathjax:
password:
summary:
---

# 三、よく使われるタイプ

この章では、JavaScriptコードで最も一般的な値の型をいくつか紹介し、これらの型をTypeScriptで説明するための適切な方法について説明します。これは詳細なリストではありませんが、今後の章では、他の種類の名前を付けて使用するためのより多くの方法について説明します。

タイプは、タイプコメントだけでなく、他の*地方、*にも表示されます。型自体を理解すると、新しい構造を形成するためにそれらの型を参照できる場所についても理解していきます。

最初に、JavaScriptまたはTypeScriptコードを書くときに遭遇するであろう最も基本的で一般的な型を見てみましょう。これは、より複雑な型を形成するコア構成要素です。

## 3.0 TypeScript設定ファイル

学習を容易にするために、コマンドラインの引数を別の構成ファイルに保存し、 `tsc` を適用して構成ファイルを生成します：

<img src="https://s2.loli.net/2022/02/22/1dAfz2imrs3CMbL.png" alt="image-20211113170722654" style="zoom: 50%;"/>

構成ファイル `tsconfig.json` がプロジェクトのルートディレクトリに構築されました。ここでは、独自の構成について説明します：

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "es6",
    /* Modules */
    "rootDir": "./src",
    /* Emit */
    "outDir": "./dist",
    /* Type Checking */
    "strict": true
  }
}
```

## 3.1プリミティブ型 `string`, `number`,および `boolean`

JavaScriptには3つの非常に一般的な[原语](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)があります。 `string`、 `number`、および `boolean` です。TypeScriptには、それぞれに対応するタイプがあります。これらの名前は、JavaScriptアプリケーション `typeof` で返された型の名前と同じであることがわかりました：

- `string` は、 `"Hello, world"` のような文字列値を表します。
- `number` は、 `42` などの数値を表します。JavaScriptには特別な整数ランタイム値がないので、 `int` または `float` 型と等価ではありません。すべては `number` のみです。
- `boolean` 2つの値のみ `true` と `false`

> 型名 `String`, `Number`,および `Boolean` (大文字で始まる)は合法ですが、コードにはあまり表示されない特殊な組み込み型を指します。タイプの場合、*始終*は `string`, `number`,または `boolean` を使用します。

```js
let str: string = 'hello typescript'
let num: number = 100
let bool: boolean = true
```

## 3.2配列

配列は、 `[1, 2, 3]` データのように指定された形であり、構文 `number[]` を使用して定義できます;この構文は、任意の型(たとえば、 `string[]`、文字列配列など)に適用されます。

`Array<number>` と書くこともできます。 `T<U>` この構文については、*はんぷくがた*を参照してください。

**02-everyday-types/src/02-array.ts**

```ts
let arr: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];
```

## 3.3 any

TypeScriptには特殊な型 `any` もあり、特定の値で型チェックエラーが発生したくない場合に使用できます。

値の型が `any` の場合は、その属性にアクセスし、どの型の値にもそれを割り当てることができます。その他のほとんどの構文的なものは、正当なものとなります：

```tsx
let obj: any = { x: 0 };
// 次のコード行はいずれもコンパイラ エラーをスローしません。
// 「any」を使用すると、それ以降の型チェックがすべて無効になります
obj.foo();
obj();
obj.bar = 100;
obj = 'hello';
const n: number = obj;
```

ただし、実行環境でコードを実行すると、エラーになることがあります：

<img src="/img/TypeScript/03-02.png" alt="image-20211113182543401" style="zoom:50%;" />

`dist` ディレクトリに移動し、node環境でコードを実行しましたが、やはりエラーが発生しました。

`any` 型は、TypeScriptが特定のコード行が大丈夫であることを確信するためだけに、長い型を書きたくない場合に便利です。

- **noImplicitAny**

型が指定されておらず、TypeScriptがコンテキストから推測できない場合、コンパイラは通常、デフォルトで `any` に設定されます。

ただし、 `any` は型チェックを行わないので、このような状況は避けたいのが一般的です。コンパイラフラグ[ `noImplicitAny`]（https://www.typescriptlang.org/tsconfig#noImplicitAny）を使用して、暗黙的なフラグ `any` をエラーにします。この構成は前にも述べました。

## 3.4変数の型コメント

`const`, `var`,または `let` を使用して変数を宣言する場合は、型コメントを追加して変数の型を明示的に指定できます：

```ts
let myName: string = 'Felixlu';
```

> TypeScriptは「左の型」スタイルの宣言を使用しません。たとえば、 `int x = 0;` 型注釈は常に*在る*入力されたもの*後*です。

しかし、ほとんどの場合、これは必須ではありません。可能な限り、TypeScriptは自動*推論*コード内の型を試します。たとえば、変数の型は、その初期化子の型から推測されます：

```tsx
// 型定義は必要ありません -- 「myName」は「string」型であると推論されます
let myName = 'Felixlu';
```

多くの場合、推論規則を明示的に学習する必要はない。始めたばかりの方は、思ったよりも少ないタイプの注釈を使ってみてください。驚くかもしれませんが、TypeScriptは何が起こっているかを完全に理解しています。

## 3.5関数

関数は、JavaScriptでデータを渡す主要な方法です。TypeScriptを使用すると、関数の入力値と出力値のタイプを指定できます。

- パラメータタイプの注記

関数を宣言するときは、各引数の後に型注記を追加して、関数が受け入れる引数の型を宣言できます。パラメータタイプの注記は、パラメータ名の後に表示されます：

```tsx
// パラメータの型の定義
function greet(name: string) {
  console.log('Hello, ' + name.toUpperCase() + '!!');
}
```

パラメータに型コメントがある場合、関数のパラメータがチェックされます：

```tsx
// 実行すると実行時エラーになります。
greet(42);
```

<img src="https://s2.loli.net/2022/02/22/SR9okXs1ez7ThC6.png" alt="image-20211114072314780" style="zoom: 50%;" />

> パラメータに型コメントがない場合でも、正しい数のパラメータが渡されているかどうかがチェックされます。

- 戻り値型コメント

返り型コメントを追加することもできます。戻り値の型に関するコメントは、引数リストの後に表示されます：

```tsx
function getFavoriteNumber(): number {
  return 26;
}
```

TypeScriptは関数の戻り値の型を `return` ステートメントに基づいて推定するので、変数型コメントと同様に、戻り値型コメントは通常必要ありません。上記の例のタイプ注釈は何も変わりません。一部のコードベースでは、意図しない変更や個人的な好みを防ぐために、マニュアル用に戻り値の型を明示的に指定しています。

- 匿名関数

匿名関数は関数宣言とは少し異なります。TypeScriptがどのように呼び出されるかを判断できる場所に関数が現れると、その関数の引数によって自動的に型が指定されます。

次に例を示します：

```tsx
// ここには型の注釈はありませんが、TypeScript はエラーをキャッチできます。
const names = ['Alice', 'Bob', 'Eve'];

// 関数コンテキスト型
names.forEach(function (s) {
  console.log(s.toUppercase());
});

// コンテキストタイプはアロー関数でも機能します
names.forEach((s) => {
  console.log(s.toUppercase());
});
```

<img src="https://s2.loli.net/2022/02/22/qMkb8YQzxUw2Xnc.png" alt="image-20211114073444596" style="zoom:50%;" />

パラメータ `s` に型コメントがない場合でも、TypeScriptは `forEach` 関数の型と配列の推定型を使用して `s` の型を決定します。

このプロセスは*を選択して、*と呼ばれ、関数が発生する*コンテキスト*は、その関数がどのような型を持つべきかを通知するためです。

推論規則と同様に、これがどのように起こるのかを明確に理解する必要はありませんが、そのメカニズム*確かに*を理解することで、型注釈が必要ないときに注意を払うことができます。あとで、*値が表示されるコンテキスト*がその型にどのように影響するかについて、さらに例を示します。

## 3.6オブジェクトタイプ

`string`, `number`, `boolean` 型(プリミティブ型とも呼ばれる)のほかに、最も一般的な型は*オブジェクトタイプ*です。これは、ほとんどすべてのプロパティを持つJavaScript値を指します！オブジェクトタイプを定義するには、その属性とそのタイプをリストします。

たとえば、点状のオブジェクトを受け取る関数です：

```tsx
// パラメータの型アノテーションがオブジェクト型である
function printCoord(pt: { x: number; y: number }) {
  console.log('座標のx値： ' + pt.x);
  console.log('座標のy値： ' + pt.y);
}
printCoord({ x: 3, y: 7 });
```

ここでは、2つの属性( `x` および `y`)を持つタイプ注釈パラメータを使用します。どちらも `number` タイプです。属性は、 `,` または `;` を使用して区切ることができます。最後の区切り文字はオプションです。

各プロパティのタイプ部分もオプションです。型を指定しない場合は、 `any` とみなされます。

- オプション属性

オブジェクトタイプでは、プロパティの一部またはすべてが*オプション*であることも指定できます。これを行うには、属性名の後に `?` を追加します。

**02-everyday-types/src/05-object.ts**

```tsx
function printName(obj: { first: string; last?: string }) {
  // ...
}
// どちらの方法でパラメータを渡しても問題ありません
printName({ first: 'Felix' });
printName({ first: 'Felix', last: 'Lu' });
```

JavaScriptでは、存在しないプロパティーにアクセスすると、実行時エラーではなく `undefined` の値が取得されます。したがって、オプション属性*読み取り*を使用する場合は、その属性を使用する前に `undefined` でチェックする必要があります。

```tsx
function printName(obj: { first: string; last?: string }) {
  // × -「obj.last」が存在しない可能性があります。
  console.log(obj.last.toUpperCase());

  if (obj.last !== undefined) {
    // √
    console.log(obj.last.toUpperCase());
  }

  // 最新の JavaScript 構文を使用した安全な代替手段:
  console.log(obj.last?.toUpperCase());
}
```

## 3.7統合タイプ

TypeScriptの型システムでは、複数の演算子を使用して既存の型から新しい型を構築できます。いくつかのタイプを書く方法がわかったので、それを面白おかしく*くみあわせ*始める時が来ました。

- 連合タイプの定義

型を結合する最初の方法は、*連合*型です。結合型は、2つ以上の他の型からなる型であり、これらの型の*いずれか*の値である可能性があることを示します。これらの各タイプを*結合タイプのメンバー*と呼びます。

文字列または数値を操作する関数を作成します：

```tsx
function printId(id: number | string) {
  console.log('Your ID is: ' + id);
}
// √
printId(101);
// √
printId('202');
// ×
printId({ myID: 22342 });
```

<img src="https://s2.loli.net/2022/02/22/qkOvn9DrVdCRSBc.png" alt="image-20211114081646215" style="zoom:50%;" />

- 結合タイプの使用

*提供*結合タイプの値を一致させるのは簡単です。結合メンバーのタイプを指定するだけで済みます。もしあなたが*ある*結合型の値を持っていたら、どのようにそれを使いますか？

連合の*それぞれ*メンバーがすべて有効であれば、TypeScriptは連合を使って何かをすることだけを許可します。たとえば、結合型 `string | number` がある場合、 `string` のように1つの型の操作のみを使用することはできません。

```tsx
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

<img src="https://s2.loli.net/2022/02/22/TnuapbGVlOE2BYw.png" alt="image-20211114085508715" style="zoom:50%;" />

解決策は、型注釈のないJavaScriptと同様に、コード*縮小*を使用して結合することです。*縮小*は、TypeScriptがコード構造に基づいて値のより具体的な型を推定できる場合に発生します。

たとえば、TypeScriptは、1つの `string` の値だけが `typeof` の値 `"string"` を持つことを知っています：

```tsx
function printId(id: number | string) {
  if (typeof id === 'string') {
    // このブランチでは、ID のタイプ “string”
    console.log(id.toUpperCase());
  } else {
    // ここでのIDの種類 “number”
    console.log(id);
  }
}
```

別の例として、次の関数 `Array.isArray` を使用します。

```tsx
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // ここ:「x」のタイプ 'string[]'
    console.log('Hello, ' + x.join(' and '));
  } else {
    // ここ:「x」のタイプ 'string'
    console.log('Welcome lone traveler ' + x);
  }
}
```

`else` ブランチでは特別なことをする必要はありません。 `x` が `string[]` でなければ、 `string` になります。

時には `union` を持ち、メンバー全員に共通点があることもあります。たとえば、配列と文字列の両方に `slice` メソッドがあります。連合内の各メンバーに共通のプロパティがある場合は、そのプロパティを絞り込むことなく使用できます：

```tsx
// 戻り値の型は、number[] | string として推論されます。
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

## 3.8型エイリアス

オブジェクト型と結合型は、型注釈に直接記述することで使用してきました。これは便利ですが、同じ型を何度も使い、名前を付けて参照したいというのはよくあります。

*型エイリアス*は、任意の*タイプ*に対する*名前*の定義です。型エイリアスの構文は次のとおりです：

```tsx
type Point = {
  x: number;
  y: number;
};

// 前の例とまったく同じ
function printCoord(pt: Point) {
  console.log('座標 x の値： ' + pt.x);
  console.log('座標 y の値： ' + pt.y);
}

printCoord({ x: 100, y: 100 });
```

実際には、オブジェクトタイプだけでなく、タイプエイリアスを使用して任意のタイプに名前を付けることができます。たとえば、型エイリアスは連合型に名前を付けることができます：

```tsx
type ID = number | string;
```

エイリアス*ただ*エイリアス-タイプエイリアスを使用して、同じタイプの異なる「バージョン」を作成することはできません。エイリアスを使うときは、エイリアスの型を書いたのと同じです。言い換えれば、このコード*そうは見えない*は有効かもしれませんが、TypeScriptに基づいて可能です。どちらのタイプも同じエイリアスなので、次のようになります：

```tsx
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return str.slice(0, 2);
}

// サニタイズされた入力を作成する
let userInput = sanitizeInput('hello');

// ただし、文字列を使用して値を再割り当てすることは可能です
userInput = 'new input';
```

## 3.9コネクタ

*インタフェース宣言*は、オブジェクトタイプに名前を付ける別の方法です：

```tsx
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log('座標 x の値： ' + pt.x);
  console.log('座標 y の値： ' + pt.y);
}

printCoord({ x: 100, y: 100 });
```

上記でタイプエイリアスを使用した場合と同様に、この例は匿名オブジェクトタイプを使用した場合と同様に動作します。TypeScriptは、渡された値の*構造* `printCoord` だけを対象とします。これは、期待されるプロパティがあるかどうかだけを対象とします。型の構造と機能のみに注目することが、TypeScriptを*構造型*型システムと呼ぶ理由である。

- 型エイリアスとインタフェースの違い

型エイリアスとインタフェースは非常によく似ており、多くの場合、自由に選択することができます。ほとんどすべての機能が `interface` `type` で使用できます。主な違いは、新しいタイプの拡張方法です：

```tsx
// 拡張ポート
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear: Bear = {
  name: 'winnie',
  honey: true,
};
bear.name;
bear.honey;
// 交差点ごとにタイプを展開
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear: Bear = {
  name: 'winnie',
  honey: true,
};
bear.name;
bear.honey;
// 既存のインターフェースに新しいフィールドを追加する
interface MyWindow {
  title: string;
}

interface MyWindow {
  count: number;
}

const w: MyWindow = {
  title: 'hello ts',
  count: 100,
};
// 作成後にタイプを変更することはできません。
type MyWindow = {
  title: string;
};

type MyWindow = {
  count: number;
};
```

<img src="/img/TypeScript/03-07.png" alt="image-20211114094240585" style="zoom:50%;" />

> - TypeScriptバージョン4.2より前のバージョンでは、型エイリアス[*エラー・メッセージに*が表示される可能性があります](https://www.typescriptlang.org/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA)は、同等の匿名型の代わりに使用されることがありました(これは望ましい場合と望ましくない場合があります)。インタフェースには常にエラーメッセージ内の名前が付けられます。
> - 型エイリアスは[声明合并，但接口可以](https://www.typescriptlang.org/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA)に関係しない可能性があります。
> - インタフェースは[オブジェクトの形状を宣言します。プリミティブの名前は変更できません](https://www.typescriptlang.org/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA)でのみ使用できます。
> - インタフェース名は[*常に*元の形式で](https://www.typescriptlang.org/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA)エラーメッセージに表示されますが、名前で使用されている場合は*のみ*。
>
> ほとんどの場合、好みに合わせて選ぶことができますが、TypeScriptは別の種類の宣言が必要かどうかを教えてくれます。ヒューリスティックを使用する場合は、 `interface` を使用し、必要に応じて `type` を使用します。

## 3.10型アサーション

TypeScriptが知らない値の種類に関する情報が得られることがあります。

たとえば、 `document.getElementById` を使用している場合、TypeScriptはこれが*ある種*型の `HTMLElement` を返すことだけを知っていますが、ページが常に `HTMLCanvasElement` 指定されたIDの値を持つことを知っているかもしれません。

この場合、*タイプアサーション*を使用して、より具体的な型を指定できます：

```tsx
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;
```

型コメントと同様に、型アサーションはコンパイラによって削除され、コードの実行時動作には影響しません。

山括弧構文も使用できます( `.tsx` ファイルにコードが含まれていない場合)。これは同等です：

```tsx
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> 注意：型アサーションはコンパイル時に削除されるため、型アサーションに関連付けられた実行時チェックはありません。 `null` 型アサーションが間違っている場合、例外は発生しません。

TypeScriptでは、型アサーションは*より具体的な*または*あまり具体的ではない*の型バージョンにのみ変換できます。このルールは、次のような「不可能」の強制を防止します：

```tsx
const x = 'hello' as number;
```

<img src="https://s2.loli.net/2022/02/22/qNWktG6hBmzVZaC.png" alt="image-20211114095324614" style="zoom:50%;" />

型 `string` を型 `number` に変換すると、両方の型が十分に重複していないため、正しく変換されない可能性があります。意図的な場合は、式を `any` または `unknown` ( `unknown` (後述)に変換してから、必要な型を指定します：

```tsx
const x = 'hello' as unknown as number;
```

## 3.11文字タイプ

一般的な型 `string` および `number` に加えて、型の位置で*特定の*文字列および数値を参照できます。

1つの方法は、JavaScriptがどのようにさまざまな方法で変数を宣言するかを検討することです。 `var` と `let` のどちらも、変数に保存されているコンテンツの変更を許可します。 `const` は許可しません。これは、TypeScriptがテキストの型を作成する方法に反映されています。

```tsx
let testString = 'Hello World';
testString = 'Olá Mundo';

//'testString'あらゆる文字列を表すことができますが、TypeScript ではそれを型システムでどのように記述するのでしょうか?
testString;

const constantString = 'Hello World';
//「constantString」は 1 つの可能な文字列のみを表すことができるため、
//テキスト型表現がある
constantString;
```

リテラルタイプは、それ自体にはあまり価値がありません：

```tsx
let x: 'hello' = 'hello';
// √
x = 'hello';
// ×
x = 'howdy';
```

<img src="https://s2.loli.net/2022/02/22/kcOHJ74TKSvuq1h.png" alt="image-20211114102648519" style="zoom:50%;" />

1つの値しか持たない変数を持っていても、あまり役に立ちません！

しかし、*将*リテラル*くみあわせ*を結合することで、より有用な概念を表すことができます。たとえば、特定の既知の値のセットだけを受け入れる関数などです：

```tsx
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left');
printText("G'day, mate", 'centre');
```

<img src="https://s2.loli.net/2022/02/22/SrcPeBsQvOUkDfw.png" alt="image-20211114103049870" style="zoom:50%;" />

数値リテラル型も同様に機能します：

```tsx
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

もちろん、これらをリテラル以外のタイプと組み合わせて使用することもできます：

```tsx
interface Options {
  width: number;
}
function configure(x: Options | 'auto') {
  // ...
}
configure({ width: 100 });
configure('auto');
configure('automatic');
```

<img src="https://s2.loli.net/2022/02/22/YZQwUvRlCtkzcTL.png" alt="image-20211114103530209" style="zoom:50%;" />

Boolean型の文字もあります。booleanリテラルには、型 `true` と `false` の2種類しかありません。型 `boolean` 自体は、実際には結合型 `union` のエイリアス `true | false` にすぎません。

- 文字推論

オブジェクトを使用して変数を初期化する場合、TypeScriptはそのオブジェクトのプロパティの値が後で変更される可能性があると仮定します。例えば、次のようなコードを書いたとします：

```tsx
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScriptでは、以前に `0` というフィールド値があり、その後に `1` を割り当てることが間違っているとは想定されません。別の説として、 `obj.counter` は `0` ではなく `number` 属性を持つ必要があります。これは、タイプが*読み取り*および*書き込み*動作を決定するためです。

これは、文字列にも当てはまります：

```tsx
function handleRequest(url: string, method: 'GET' | 'POST' | 'GUESS') {
  // ...
}

const req = { url: 'https://example.com', method: 'GET' };
handleRequest(req.url, req.method);
```

<img src="https://s2.loli.net/2022/02/22/hmLQKWoi4kVtBFD.png" alt="image-20211114105814002" style="zoom:50%;" />

上の例 `req.method` では `string` と推定され、 `"GET"` ではない。コードは `req` の作成と呼び出しの間で評価されるため、TypeScriptではこのコードにエラーがあると考えられます。

この問題を解決するには2つの方法があります。

**1. 任意の場所に型アサーションを追加することで、投機を変更できます：**

```tsx
// 方案 1:
const req = { url: 'https://example.com', method: 'GET' as 'GET' };
// 方案 2
handleRequest(req.url, req.method as 'GET');
```

シナリオ1では、「 `req.method` は常に*テキストの種類* `"GET"` を所有するようにします。これにより、後でこのフィールドに `"GUESS"` が割り当てられないようにします。

案2は、「他の原因 `req.method` が `"GET"` の値を持つことを知っている」という意味である。

**2. `as const` を使用して、オブジェクト全体を型リテラルに変換できます。**

```tsx
const req = { url: 'https://example.com', method: 'GET' } as const;
handleRequest(req.url, req.method);
```

この接尾辞 `as const` は、 `const` のように定義され、より一般的な `string` や `number` ではなく、すべての属性にテキスト型が割り当てられることを保証します。

## 3.12 `null` および `undefined`

JavaScriptには、存在しないか初期化されていない値を表す2つの元の値があります。 `null` と `undefined` です。

TypeScriptには、2つの同じ名前があります*タイプ*。これらのタイプの動作は、[ `strictNullChecks`]（https://www.typescriptlang.org/tsconfig#strictNullChecks）オプションを設定しているかどうかによって異なります。

- `strictNullChecks` オフ

*false*を使用すると、の値は通常どおりにアクセスでき、どのタイプの属性にも値を割り当てることができます。これは、空のチェックがない言語(C#、Javaなど)の動作に似ています。これらの値のチェックが不足していることが、多くの場合、誤りの主要な原因である。もし彼らのコードベースでそれが可能であれば、私たちはいつもそれを開くことをお勧めします。

- `strictNullChecks` オープン

*true*では、メソッドまたはプロパティを使用する前に値をテストする必要があります。オプション属性を使用する前と同様に、*縮小*を使用して、可能な値を確認できます：

```tsx
function doSomething(x: string | null) {
  if (x === null) {
    //何かをする
  } else {
    console.log('Hello, ' + x.toUpperCase());
  }
}
```

- 空でないアサーション演算子( `!` 接尾辞)

TypeScriptには特殊な構文 `null`、 `undefined` もあり、明示的なチェックを行わずにタイプを削除したり、タイプから削除したりすることができます。 `!` 式の後に書き込むことは、実際には型のアサーションです。つまり、値は `null` or `undefined` ではありません：

```tsx
function liveDangerously(x?: number | null) {
  // 正解
  console.log(x!.toFixed());
}
```

他の型のアサーションと同様に、これはコードの実行時動作を変更しません。したがって、 `!` は、*できない*が `null` または `undefined` であることがわかっている場合にのみ使用することが重要です。

## 3.13列挙

列挙は、TypeScriptがJavaScriptに追加する機能で、名前付き定数の可能なセットの1つである可能性のある値を記述できます。ほとんどのTypeScript機能とは異なり、この*いいえ*JavaScriptの型レベルの追加は、言語とランタイムのコンテンツに追加されます。したがって、列挙が何かをしている必要があることを確認してください。そうでない場合は使用しないでください。列挙の詳細については、[Enum 参考页 中](https://www.typescriptlang.org/docs/handbook/enums.html)を参照してください。

```tsx
// ts ソースコード
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
console.log(Direction.Up); // 1
// コンパイルされたjsコード
('use strict');
var Direction;
(function (Direction) {
  Direction[(Direction['Up'] = 1)] = 'Up';
  Direction[(Direction['Down'] = 2)] = 'Down';
  Direction[(Direction['Left'] = 3)] = 'Left';
  Direction[(Direction['Right'] = 4)] = 'Right';
})(Direction || (Direction = {}));
console.log(Direction.Up);
```

<img src="https://s2.loli.net/2022/02/22/dvthyFIPKAuBR1s.png" alt="image-20211114112554381" style="zoom:33%;" />

## 3.14あまり一般的ではない原語

特に、JavaScriptの新しいプリミティブのいくつかは、TypeScriptタイプのシステムでも実装されています。まず簡単に2つの例を見てみましょう：

- #### `bigint`

ES2020以降、JavaScriptには、非常に大きな整数のプリミティブ `BigInt` があります。

```tsx
// bigint 関数を使用して bigint を作成する
const oneHundred: bigint = BigInt(100);

// テキスト構文を使用して BigInt を作成する
const anotherHundred: bigint = 100n;
```

BigIntの詳細については[TypeScript 3.2リリースノート](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html#bigint)を参照してください。

- #### `symbol`

JavaScriptには、関数からグローバル一意参照を作成するためのプリミティブ `Symbol()` があります：

```tsx
const firstName = Symbol('name');
const secondName = Symbol('name');

if (firstName === secondName) {
  // ここのコードは実行できません
}
```

<img src="https://s2.loli.net/2022/02/22/ORATaxUgEjrPL9V.png" alt="image-20211114113536948" style="zoom:40%;" />

タイプ `typeof firstName` と `typeof secondName` は重複していないので、この条件は常に `false` を返します。

### 特別声明：この記事は<a href="https://github.com/lurongtao/TypeScript">古艺散人先生</a>から転自し、必要があれば原文のプレビューで閲覧することができます。
