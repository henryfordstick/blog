# 第七章 正则表达式编程
前面学习了正则表达式，那么怎么去实践呢？
- 一、正则表达式的四种操作
- 二、相关 API 注意要点
- 三、真实案例

## 一、正则表达式的四种操作
正则表达式是匹配模式，在匹配的基础上才有 验证， 切分， 提取， 替换。

#### 1、验证
验证是正则最直接的应用，比如表单验证。<br/>
**所谓的匹配，就是看目标字符串里是否有满足匹配的子串。 而验证就是看有没有匹配上，结果只有两种答案。**<br/>
```js
// 比如判断一个字符串中是否有数字
var regex = /\d/;
var string = 'abc123';

// search
console.log(!!~string.search(regex)); // true

// test
console.log(regex.test(string)); // true

// match
console.log(!!string.match(regex)); // true

// exec
console.log(!!regex.exec(string)); // true
```

#### 2、切分
匹配上了，就可以进行一些操作，如切分。

**切分就是把目标字符串切成一段一段的。** 在 js 中用的是 split。
```js
var regex = /,/;
var string = 'html,css,javascript';

// split
console.log(string.split(regex))
```

#### 4、提取
匹配上了，那么怎么提取部分匹配到的数据呢，正则中通常要使用分组引用（分组捕获）。
```js
// 提取出年月日
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";

// match
console.log(string.match(regex));
// ["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]

// exec
console.log(regex.exec(string));
// ["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]

// test
regex.test(string);
console.log(RegExp.$1, RegExp.$2, RegExp.$3);
// "2017" "06" "26"

// search
string.search(regex);
console.log(RegExp.$1, RegExp.$2, RegExp.$3);
// "2017" "06" "26"

// replace
var date = [];
string.replace(regex, function (match, year, month, day) {
  date.push(year,month, day);
})
console.log(date);
// ["2017", "06", "26"]
```
提取最常用的是 `match`

#### 4、替换
有时候最终的目的不是找到，而且要替换。
```js
// 把日期格式，从 yyyy-mm-dd 替换成 yyyy/mm/dd
var string = '2017-06-26';
var today = new Date(string.replace(/-/g, '/'));
console.log(today);
//  Mon Jun 26 2017 00:00:00 GMT+0800 (中国标准时间)
```

## 二、相关 API 注意要点
由上面得出，正则操作方法有 6 个，字符串实例 4 个， 正则实例 2 个。
```js
String#search
String#split
String#match
String#replace
RegExp#test
RegExp#exec
```

#### 1、search 和 match 的参数问题
字符串实例四个方法的参数都支持 正则 和 字符串。**但是 search 和 match 会把字符串转换成正则**
```js
var string = '2017.06.27';

// search
string.search('.'); // 0
// 只需要修改成一下形式之一
string.search('\\.'); // 4
string.search(/\./);  // 4

// match
string.match('.'); // ["2", index: 0, input: "2017.06.27"]
// 需要修改成下列形式之一
string.match('\\.'); //  [".", index: 4, input: "2017.06.27"]
string.match(/\./); //  [".", index: 4, input: "2017.06.27"]


// split 和 replace
string.split("."); // ["2017", "06", "27"]
string.replace('.', '/'); // "2017/06.27"
```
#### 2、match 返回结果的格式问题
match 返回结果，与正则对象是否有修饰符 g 有关。
```js
var string = '2017.06.27';
var regex1 = /\b(\d+)\b/;
var regex2 = /\b(\d+)\b/g;
string.match(regex1); //  ["2017", "2017", index: 0, input: "2017.06.27"]
string.match(regex2); //  ["2017", "06", "27"]
```
总结如下：
1. 没有 `g`，返回的是标准匹配格式，即（p1 整体匹配的内容  p2 分组捕获的内容  p3 整体匹配的第一个下标  p4 输入的目标字符串）
2. 有 `g`，返回的是所有匹配的内容
3. 当没有匹配时，不管有没有 `g`，都返回 `null`。

#### 3、exec 比 match 更强大
正则没有 g 时，match 返回的信息较多，但是当有 g 后，就没有关键信息 index 了。<br/>
exec 方法就能接着上一次匹配后继续匹配。
```js
var string = '2017.06.27';
var regex2 = /\b(\d+)\b/g;
regex2.exec(string); //  ["2017", "2017", index: 0, input: "2017.06.27"]
console.log(regex2.lastIndex); // 4
regex2.exec(string); //  ["06", "06", index: 5, input: "2017.06.27"]
console.log(regex2.lastIndex); // 7
regex2.exec(string); // ["27", "27", index: 8, input: "2017.06.27"]
console.log(regex2.lastIndex); // 10
regex2.exec(string); // null
console.log(regex2.lastIndex); // 0
```
由上代码看出，使用 exec 时，经常需要配合使用 while 循环。

#### 4、修饰符 g，对 exec 和 test 的影响
字符串的 4 个方法，lastIndex 属性始终不变。<br/>
但是当 exec,test 当正则全局匹配（g），每次匹配完，都会修改 lastIndex.
```js
var regex = /a/g;
console.log(regex.test('a'), regex.lastIndex); // true 1
console.log(regex.test('aba'), regex.lastIndex); // true 3
console.log(regex.test('ababc'), regex.lastIndex); // false 0

// 如果没有 g
var regex = /a/;
console.log( regex.test("a"), regex.lastIndex ); // true 0
console.log( regex.test("aba"), regex.lastIndex ); // true 0
console.log( regex.test("ababc"), regex.lastIndex ); // true 0
```
#### 5、test 整体匹配要使用 ^ 和 $
test 是看目标字符串中是否有子串，即部分匹配成功即可，但是整体匹配就要加 开头和 结尾

#### 6、split 相关注意事项
1. 它的第二个参数，表示数组的最大长度
2. 正则使用分组是，结果数组中是包含分隔符的


#### 7、replace 是特别强大的
replace 有两种使用形式，是因为它的第二个参数可以是字符串，也可以是函数。

当第二个参数为字符串时，如下的特殊字符有特殊含义：
| 属性 | 描述 |
| --- | --- |
| `$1`,`$2`,...`$99` | 匹配第 1-99 个分组里捕获的文本 |
| `$&` | 匹配到的子串文本 |
| $` | 匹配到的子串的左边文本 |fas
| `$'` | 匹配到子串右边文本 |
| `$$` | 美元符号 |
```js
// ************ 当第二个参数为字符串 *************
var string = '2,3,5';

// 把 string 的内容变成 5=2+3
string.replace(/(\d+),(\d+),(\d+)/, '$3=$1+$2');

// 把 string 变成 222,333,555
string.replace(/(\d+)/g, '$&$&$&');

// 把 2+3=5 变成 2+3=2+3=5=5
'2+3=5'.replace(/=/,"$&$`$&$'$&");
// $& 匹的是 = ，$` 匹的是 2+3， $' 匹的是 5

// ************ 当第二个参数为函数 *************
"1234 2345 3456".replace(/(\d)\d{2}(\d)/g, function (match, $1, $2, index, input) {
  console.log([match, $1, $2, index, input]);
});
// ['1234', '1', '4', 0, '1234 2345 3456']
// ['2345', '2', '5', 5, '1234 2345 3456']
// ['3456', '3', '6', 10, '1234 2345 3456']
// 此时拿到的信息，并不比 exec 少
```

#### 8、使用构造函数需要注意的问题
一般不推荐使用 构造函数（RegExp） 生成正则，应该优先使用字面量，因为构造函数会写很多 \。
```js
var string = '2017-06-27 2017.06.27 2017/06/27';
var regex = /\d{4}(-|\.|\/)\d{2}\1\d{2}/g;
string.match(regex); // ["2017-06-27", "2017.06.27", "2017/06/27"]

regex = new RegExp("\\d{4}(-|\\.|\\/)\\d{2}\\1\\d{2}", "g");
string.match(regex); // ["2017-06-27", "2017.06.27", "2017/06/27"]
```

#### 9、修饰符
ES5 中修饰符就 3 个。
|修饰符|描述|
|---|---|
|`g`|全局匹配，即找到所有的匹配的， 单词是 global |
|`i`|忽略字母大小写，单词是 ingoreCase|
|`m`|多行匹配，只影响`^`和`$`，二者变成行的概念，即行开头和行结尾，单词是 multiline|
```js
// 正则对象也有只读属性
var regex = /\w/img;
regex.global; // true
regex.ignoreCase // true
regex.multiline  // true
```

#### 10、source 属性
正则实例属性有：`global`，`ignoreCase`， `multiline`，`lastIndex`，`source`。那么 source 是干什么用的。
```js
var className = "high";
var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
console.log( regex.source )
//  (^|\s)high(\s|$)  即字符串   "(^|\\s)high(\\s|$)"
```

#### 11、构造函数属性
构造函数的静态属性基于所执行的最近一次正则操作而变化。除了是 $1,…,$9 之外，还有几个不太常用的
属性（有兼容性问题）：
|静态属性|描述|简写形式|
|---|---|---|
|`RegExp.input`|最近一次目标字符串|RegExp["$_"]|
|`RegExp.lastMatch`| 最近一次匹配的文本 RegExp["$&"]|
|`RegExp.lastParen`| 最近一次捕获的文本 RegExp["$+"]|
|`RegExp.leftContext`| 目标字符串中lastMatch之前的文本 RegExp["$`"]|
|`RegExp.rightContext`| 目标字符串中lastMatch之后的文本 RegExp["$'"]|