# 第一章 正则表达式字符匹配攻略
本书作者老姚，是一部免费的，并且能助大家快速入门的一部正则书籍，能拜读到他的这部书，也是我猿生的荣幸！

正则表达式匹配模式，**要么匹配字符，要么匹配位置**。而正则本身的**元字符**太多，不是特别好记。

- 一、两种模糊匹配
- 二、字符组
- 三、量词
- 四、分支结构
- 五、案例分析
  
## 一、两种模糊匹配
```js
var regex = /hello/;
console.log( regex.test("hello") );
// => true
```
模糊匹配分为两个方向：横向模糊和纵向模糊

**横向**指一个正则可匹配的字符串长度不是固定的，可以是多种情况。解决方法是用 **量词** 如：`{m,n}` 最少 m 次， 最多 n 次。<br/>
如：`/ab{2,5}c/g` 第一个字符是 a， 接下来 2-5 个 b， 最后一个 c。
> g 是**修饰符**，表全局匹配，是 `global`首字母。

**纵向**指一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种可能。如： `/a[123]/b` 匹的结果是 `a1b`、 `a2b`、 `a3b`。

## 二、字符组
虽叫字符组，但只是其中的一个字符。`[abc]`表 a、b、 c 其中之一。

- **范围表示法**：`[1234567abcdefGHIJK]` 可以写成`[1-6a-fG-K]`。那么需要匹 `a` `-` `f` 这三者中任意一个字符，则需要写成 `[-az]` 或 `[az-]` 或 `[a\-z]`。

- **排除字符组**：纵向匹配，某位字符可以是任何东西，就不能是 a、b、 c 其中之一，则可以写为`[^abc]`（反义字符组）。`^`表**脱字符**。

- **简写形式**
  
| 字符组 | 具体含义 |
| --- | --- |
| `\d` | 表`[0-9]`，即是一位数字。<br> 记忆方式：**英文是 digit (数字)** |
| `\D` | 表`[^0-9]`，即除数字外的任意字符 |
| `\w` | 表`[0-9a-zA-Z]`，即数字，大小写字母和下划线。<br> 记忆方式：**w 是 word 的简写**，也称单词字符 |
| `\W` | 表`[^0-9a-zA-Z]`，非单词字符 |
| `\s` | 表`[ \t\v\n\r\f]`，表示空白符。包括空格，水平制表符，垂直制表符，换行符，回车符，换页符。<br> 记忆方式： **s 是 space 的首字母， 空白符的单词是 white space** |
| `\S` | 表`[^ \t\v\n\r\f]`，非空白符 |
| `.` | 表`[^\n\r\u2028\u2029]`，表通配符， 即任何字符。换行符，回车符，行分隔符和段分隔符除外。<br> 记忆方式：**想想省略号 ... 中的每个店，都可以理解成占位符，表示任何类似的东西** |
:::tip 任意字符
如果要匹配任意字符，可以使用 `[\d\D]` `[\w\W]` `[\s\S]` 和 `[^]`中的任何一个。
:::

## 三、量词
就是横向重复，即 `{m,n}`

- **简写形式**

| 量词 | 具体含义 |
| --- | --- |
| `{m,}` | 表至少出现 m 次 |
| `{m}` | 等价 `{m,m}`，表出现 m 次 |
| `?` | 等价 `{0,1}`，表出现或不出现。<br>记忆方式：**问号的意思表示，有吗？** |
| `+` | 等价 `{1,}`，表出现至少一次。<br>记忆方式：**加号是追加的意思，得现有一个，然后才考虑追加** |
| `*` | 等价 `{0,}`，表出现任意次，有可能不出现。<br>记忆方式：**看天上的星星，可能一颗没有，可能零散有几颗，可能数也数不过来** |

- **贪婪与惰性匹配**<br>
下面看两个列子的区别。
```js 
var string = "123 1234 12345 123456";

// 案列一 (贪婪：尽可能多的匹配) 贪婪不是一件好事
var regex = /\d{2,5}/g;
console.log(string.match(regex));
// ['123','1234','12345','12345']

// 案列二 (惰性：尽可能少的匹配)
var regex = /\d{2,5}?/g;
console.log(string.match(regex));
// ['12','12','34','12','34','12','34','56']
```
:::tip
对惰性匹配的记忆方式：量词后面加个问号，问问你直租了吗，你很贪婪吗？
:::

## 四、多选分支
一个模式可以实现横向和纵向匹配，多选分支可以支持多个子模式任选其一，用 `|`（管道符）分隔，表其中任何之一。
```js
var regex = /good|nice/g;
var string = "good idea, nice try.";
console.log(string.match(regex));
// ['good', 'nice']

// 但是/good|goodbye/ 匹配时，结果只有一个
var regex = /good|nice/g;
var string = "goodbye.";
console.log(string.match(regex));
// ['good']
// 也就是说分支结果也是惰性的，即前面的匹配上了，后面就不再尝试了
```

## 五、案例
#### 1、匹配 16 进制颜色
```js
// 要求匹配
// #ffbbad #Fco1DF #FFF #ffE

// 分析
// 需要用量词和分支结构，其中字母范围是 a-f

/#([0-9a-fA-F]{6}|([0-9a-fA-F]{3})/g
```

#### 2、匹配时间
```js
// 要求匹配
// 23:59  02:07

// 分析
// 一共四位数字，第一位范围是 [0-2]
// 第二位根据第一位为[01]时，则为[0-9]。 第一位为[2]时，则为[0-3]
// 第三位是[0-5], 第四位是 [0-9]

/^([01][0-9]|2[0-3]):([0-5][0-9])$/

// 要求匹配
// 在前面的基础上匹配 7:9 呢？

// 分析
// 前面的0可以省略掉，则可以用到量词简写 ?

/^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/
```
:::tip `^` 和 `$`
`^` 和 `$` 表示字符串的开头和结尾
:::

#### 3、匹配日期
```js
// 要求匹配
// 2017-06-10

// 分析
// 年：四位数字,[0-9]{4}
// 月：共12个月,(0[1-9]|1[0-2])
// 日：最大31天,(0[1-9]|[12][0-9]|3[01])

/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
```

#### 4、window 操作系统文件路径
```js
// 要求匹配
// F:\study\javascript\regex\regular expression.pdf
// F:\study\javascript\regex\
// F:\study\javascript
// F:\

// 分析
// 总体格式为 ”盘符:\文件夹\文件夹\文件夹\“
// 盘符: [c-zC-Z]:\\ （\需要转义，所以变成 \\)
// 文件夹: 不能包含一些特殊的字符 [^\\:*<>|"?\r\n/]
// 另外名字不能为空 [^\\:*<>|"?\r\n/]+\\
// 文件夹可以出现任意次 ([^\\:*<>|"?\r\n/]+\\)*
// 最后一个文件夹没有 \, 即([^\\:*<>|"?\r\n/]+)?

/^[c-zC-Z]:\\([^\\:*<>|"?\r\n/]+\\)*|([^\\:*<>|"?\r\n/]+)?$/
```

#### 5、匹配 id
```js
// 要求匹配
// <div id="container" class="main"></div>

// 分析
// 可以用 /id=".*"/g ，但是*是贪婪的，匹配结果为 id="container" class="main"
// 可以改成惰性匹配 /id=".*?"/g

/id=".*?"/
// 这样效率低，涉及到回溯，优化成
/id="[^"]*"/
```

## 六、正则工具
- [正则练习平台](https://regexone.com/) 可以利用这个工具练习正则，提高水平
- [正则视图生成器1](https://regex101.com/) 一个可以快速直观看到匹配的结果的在线工具
- [正则视图生成器2](https://regexr.com/) 另外一个可以快速直观看到匹配的结果的在线工具