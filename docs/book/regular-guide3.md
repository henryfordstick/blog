# 第三章 正则表达式括号的作用
括号提供了分组，便于我们引用它。引用某个分组，有两种情形： 在 JavaScript 里引用它，在正则表达式里引用它。
- 分组和分支结构
- 分组引用
- 反向引用
- 非捕获括号
- 相关案例

## 一、分组和分支结构
#### 1、分组
`/a+/`匹配连续出现的 a， 那么要匹配连续出现的 ab 时，需要使用 `/(ab)+/`。
```js
var regex = /(ab)+/g;
var string = "ababa abbb ababab";
console.log(string.match(regex));
// ["abab", "ab", "ababab"]
```
#### 2、分支结构
多选分支结构 `(p1|p2)`，这里的括号提供了分支表达式的所有可能。

## 二、分组引用
括号有一个重要的作用，就是数据提取，以及更强大的替换操作。
```js
var regex = /\d{4}-\d{2}-\d{2}/;
// 改成括号版的：
var regex = /(\d{4})-(\d{2})-(\d{2})/
```
:::tip
正则引擎在匹配的过程中，给每一个分组都开辟一个空间，用来存储每一个分组匹配到的数据。
:::

#### 1、提取数据
```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log(string.match(regex));
//  ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]
```
:::tip
`match` 返回的一个数组，第一个元素是整体匹配结果，然后是各个分组匹配的内容，然后是匹配的下表，最后是输入的文本。另外，正则表达式是否有修饰符 g， match 返回的数组格式是不一样的。
:::
```js
// 可以使用构造函数的全局属性 $1 ~ $9 来获取。
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";

regex.test(string); // 正则操作即可，例如
// regex.exec(string)
// string.match(regex)

console.log(RegExp.$1); // 2017
console.log(RegExp.$2); // 06
console.log(RegExp.$3); // 12
```
#### 2、替换
```js
// 将 yyyy-mm-dd 格式替换成 mm/dd/yyyy 怎么做
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, '$2/$3/$1')
// 06/12/2017

// 等价于
var result = string.replace(regex, function () {
  return RegExp.$2 + '/' + RegExp.$3 + '/' + RegExp.$1;
})

// 也等价于
var result = string.replace(regex, function(match, year, month, day) {
  return month + '/' + day + '/' + year;
})
```
## 三、反向引用
除了使用 API 来引用分组，正则本身也可以引用分组，但只能引用之前出现的分组，即**反向引用**。
```js
// 要求
// 实现一个正则，同时支持匹配如下三种格式
// 2016-06-12   2016/06/12     2016.06.12

// 1、那么最容易想到的正则是
/\d{4}(-|\/|\.)\d{2}(-|\/|\.)\d{2}/

// 2、上面正则 2016-06/12 也可以匹成功，那么就需要反向引用了
/\d{4}(-|\/|\.)\d{2}\1\d{2}/
// 上面 \1 就是引用前面的 (-|\/|\.)， 如果前面匹到 - ，那么反向引用 \1 也会匹 -。
// 同时 \2 \3 等等也就好理解了
```
#### 1、括号嵌套怎么办？
```js
var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = '1231231233';
regex.test(string) // true
RegExp.$1; // 123
RegExp.$2; // 1
RegExp.$3; // 23
RegExp.$4; // 3
```
#### 2、\10 表示什么
\10 表示第10个分组，那么真要匹配 \1 和 0，就要用`(?:\1)0`或者`\1(?:0)`。
#### 3、引用不存在的分组
如果引用不存在的分组，如 \2 不存在，那么就会匹配'\2'，注意'\2' 是对 2 进行了转义。
#### 4、分组后面有量词
```js
var regex = /(\d)+/;
var string = "12345";
string.match(regex);
// ["12345", "5", index: 0, input: "12345"]

// 更直观一点
var regex = /(\d)+ \1/;
regex.test('12345 1'); // false
regex.test('12345 5'); // true
```

## 四、非捕获括号
前面出现的括号，都会捕获他们匹配到的数据，以便后续引用，因此他们是**捕获型分组**和**捕获型分支**。<br/>
那么即不在 API 中引用，也不在正则中反向引用，则可以使用非捕获括号`(?:p)`和`(?:p1|p2|p3)`。
```js
var regex = /(?:ab)+/g
var string = 'ababa abbb ababab';
string.match(regex);
// ['abab', 'ab', 'ababab']
```

## 五、相关案例
#### 1、字符串 `trim` 方法模拟
```js
// 要求
// trim 方法就是去掉字符串的开头和结尾的空白符。

// 分析
// 第一种：匹开头和结尾的空白符，然后替换成空字符
// 第二种：匹配整个字符串，然后用引用来提取出相应的数据

// 方法一：（效率高）
function trim (str) {
  return str.replace(/^\s+|\s+$/g, '');
}
console.log(trim(' foobar '));
// foobar

// 方法二：
function trim (str) {
  return str.replace(/^\s*(.*?)\s*/g, '$1');
}
console.log(trim(' foobar '));
// foobar
```
#### 2、将每个单词的首字母转换成大写
```js
// 分析
// 1、将所有的字母转成小写
// 2、找到首字母，开头可能存在空格
// 3、将首字母转成大写

function titleize (str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (c) {
    return c.toUpperCase();
  })
}
console.log(titleize('my name is henry'));
// My name is henry
```

#### 3、驼峰化
```js
// 分析
// 单词的可能有多个连字符，下划线，空白符等

function cameLine (str) {
  return str.replace(/[-_\s]+(.)?/, function (match, c) {
    return c ? c.toUpperCase() : '';
  })
}
console.log(cameLine('-moz-transform'));
// MozTransform
```

#### 4、中划线化
```js
function dasherize (str) {
  return str.replace(/[A-Z]/g, '-$1').replace(/[-_\s]+(.)?/, '-').toLowerCase();
}
console.log(dasherize('MozTransform'));
// -moz-transform
```
#### 5、HTML 转义和反转义
```js
// 将 HTML 特殊字符穿换成等值的实体
function escapeHTML (str) {
  var escapeChars = {
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    '&': 'amp',
    '\'': '#39'
  };
  return str.replace(new RegExp('[' + Object.keys(escapeChars).join('')+']','g'),function (match) {
    return '&' + escapeChars[match] + ';';
  })
}
console.log( escapeHTML('<div>Blah blah blah</div>') );
// "&lt;div&gt;Blah blah blah&lt;/div&gt";

// 反转义
function unescapeHTML (str) {
  var escapeChars = {
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'amp': '&',
    '#39': '\''
  };
  return str.replace(/\&([^;]+);/g, function (match, key) {
    if (key in htmlEntities) {
      return htmlEntities[key];
    }
    return match;
  })
}
console.log( unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;') );
// "<div>Blah blah blah</div>"
```
#### 6、匹配成对标签
```js
// 要求
// 匹配 <title>regular expression</title><p>henry bye bye</p>
// 不匹配 <title>wrong!</p>

// 分析
// 匹配一个开标签<[^>]+>
// 匹配一个闭标签<\/[^>]+>

var regex = /<([^>]+)>[\d\D]*<\/\1>/
var string1 = "<title>regular expression</title>";
var string2 = "<p>henry bye bye</p>";
var string3 = "<title>wrong!</p>";
console.log( regex.test(string1) ); // true
console.log( regex.test(string2) ); // true
console.log( regex.test(string3) ); // false
```
:::tips
题 6 的开标签 `<[^>]+>` 改成 `<([^>]+)>`，使用括号的目的是为了后面使用反向引用<br/>
闭标签使用了**反向引用** `<\/\1>`。
:::
