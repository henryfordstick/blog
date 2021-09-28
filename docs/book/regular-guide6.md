# 第六章 正则表达式的构建
对应正则的运用，首重就是：如何针对问题，构建一个合适的正则表达式？
- 一、平衡法则
- 二、构建正则的前提
- 三、准确性
- 四、效率

## 一、平衡法则
构建正则有一点非常重要，需要做到下面几点的平衡：
1. 匹配预期的字符串
2. 不匹配非预期的字符串
3. 可读性和可维护型
4. 效率

## 二、构建正则的前提
#### 1、是否能使用正则
正则太强大了，以至于我们随便遇到一个字符串，就想用正则怎么做。 但是实际上也有正则做不到的， 比如匹配 `1010010001...`, 虽然有规律，但是靠正则无能为力。

#### 2、是否有必要使用正则
不能无所不用正则， 能用字符串 API 解决的问题，就不该使用正则。如：
```js
// *************** 案例一 ****************
// 提取年月日
var string = '2021-07-01';
var regex = /^(\d{4})-(\d{2})-(\d{2})$/;
string.match(regex);

// 上面也可以使用 split API

var result = string.split('-');

// *************** 案例二 ****************
// 判断是否有问号
var string = '?id=XX&act=search';
string.search(/\?/); // 0

// 上面也可以使用 indexOf 方法
string.indexOf('?'); // 0
```

#### 3、是否有必要否建一个复杂的正则
```js
// 前面章节中，要求密码长度 6-12 位，由数字，小写字母和大写字母 组成，必须包括 2 种字符。
/(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/

// 但实际上可以用多个小正则
var regex1 = /^[0-9A-Za-z]{6,12}$/;
var regex2 = /^[0-9]{6,12}$/;
var regex3 = /^[A-Z]{6,12}$/;
var regex4 = /^[a-z]{6,12}$/;

function checkPassword (string) {
  if (!regex1.test(string)) return false;
  if (regex2.test(string)) return false;
  if (regex3.test(string)) return false;
  if (regex4.test(string)) return false;
  return true;
}
```

## 三、准确性
准确性就是匹配预期的目标，也就是寻找目标字符串的规则。那么字符串构成结构比较复杂是，应该怎样去构建？
```js
// 目标字符串
// 055188888888
// 0551-88888888
// (0551)88888888

// 分析
// 区号是 0 开头的 3 到 4 位数字， 号码是非 0 开头的 7 到 8 位数字。
// 1、匹配第一个字符串，很容易构建出的正则为
/^0\d{2,3}[1-9]\d{6,7}$/
// 2、匹配第二个字符串
/^0\d{2,3}-[1-9]\d{6,7}$/
// 3、匹配第三个字符串
/^\(0\d{2,3})[1-9]\d{6,7}/

// 合并 | 
/^0\d{2,3}[1-9]\d{6,7}$|^0\d{2,3}-[1-9]\d{6,7}$|^\(0\d{2,3}\)[1-9]\d{6,7}$/
// 提取公共部分
/^(0\d{2,3}|0\d{2,3}-|\(0\d{2,3}\))[1-9]\d{6,7}$/
// 进一步简写
/^(0\d{2,3}-?|\(0\d{2,3}\))[1-9]\d{6,7}$/
```
上面这个过程就是保证了准确性，当然规则只限当前的字符串，还有其他的可能性，这里用不到，就没有考虑，所以有个**平衡取舍问题**

```js
// 目标字符串
// 1.23  +1.23  -1.23
// 10  +10  -10
// .2  +.2  -.2

// 分析
// 上面正则很容易得出
/^[+-]?(\d+)?(\.\d+)?1$/    // 但是这个会匹配到 空字符 ""

// 分步骤写
// 1、匹配 1.23  +1.23  -1.23
/^[+-]?\d+\.\d+$/
// 2、匹配 10  +10  -10
/^[+-]?\d+$/
// 3、匹配 .2  +.2  -.2
/^[+-]?\.\d+$/
// 4、合并简化以后
/^[+-]?(\d+\.\d+|\d+|\.\d+)$/
```
## 四、效率
保证了准确性，接下来就要考虑优化了（当然大部分情况不需要优化），就需要知道正则的运行原理。

正则表达式的运行分为如下的阶段：
1. 编译
2. 设定起始位置
3. 尝试匹配
4. 匹配失败，从下一位开始继续第 3 步
5. 最终结果，匹配成功或者失败

```js
var regex = /\d+/g;
console.log( regex.lastIndex, regex.exec("123abc34def") );
console.log( regex.lastIndex, regex.exec("123abc34def") );
console.log( regex.lastIndex, regex.exec("123abc34def") );
console.log( regex.lastIndex, regex.exec("123abc34def") );
// => 0 ["123", index: 0, input: "123abc34def"]
// => 3 ["34", index: 6, input: "123abc34def"]
// => 8 null
// => 0 ["123", index: 0, input: "123abc34def"]
```
- 当生成一个正则时，引擎会对其进行编译，是否报错就在这个阶段
- 确定起始位置，一般都是字符串开头。 但当使用 test 和 exec 时，且正则有 g 时，起始位置就是正则的 `lastIndex` 属性开始。
- 尝试匹配
  - 第一次 exec 从 0 位开始， 结果是 123
  - 第二次 exec 从 3 位开始，结果是 34
  - 第三次 exec 从 8 开始，直到最后一位，没有发现匹配，返回 null，同时设置 `lastIndex` 为 0

由上面可以看出，效率会出现问题的，就在第 3、4 阶段，因此主要优化手段也是在这两个阶段。

#### 1、使用具体型字符组来代替通配符，消除回溯
例如匹配字符串 `123"abc"456` 中的 `"abc"`，如果正则使用 `/".*"/`，因为 `*`是贪婪量词，就会产生好多回溯：
![贪婪量词导致的回溯](/images/regex-构建.png)

如果改成惰性的呢，`/".*?"/`
![惰性量词导致的回溯](/images/regex-构建1.png)

因为回溯存在，引擎保存多种可能中未尝试过的状态，以便后续回溯使用，就一定占用一定的内存，此时使用具体化的字符组来代替通配符，此时使用正则 `/"[^"]*"/`

#### 2、使用非捕获型分组
因为括号的作用之一，可以捕获分组和分支里的数据，那么就需要内存来保存。<br/>
那么当不需要使用分组和反向引用时，此时可以使用非捕获分组。如<br/>
`/^[-]?(\d\.\d+|\d+|\.\d+)$/` 可以修改成 `/^[-]?(?:\d\.\d+|\d+|\.\d+)$/`

#### 3、独立出确定字符
如 `/a+/` 可以修改成 `/aa*/`<br/>
因为后者能比前者多确定了字符 'a'，这样在第四步中，加快判断是否匹配失败，进而加快移位的速度。

#### 4、提取分支公共部分
如 `/this|that/` 修改成 `/th(?:is|at)/`
这样做，可以减少匹配过程中可消除的重复。

#### 5、减少分支的数量，缩小它们的范围
`/red|read/` 可以修改成 `/rea?d/`<br/>
此时分支和量词产生的回溯的成本是不一样的，但是这样优化会降低可读性。
