# 03 | 快属性和慢属性
V8 是怎样提升对象访问速度的？

JS 语言的角度开看，JS像一个字典，字符串作为键名，任意对象可作为键值，通过读写键值来获取键名。

所以最简单的方式是使用字典来保存属性和值，但是字典是非线程结构，所以如果使用字典，读取效率会大大降低。
![线性结构和非线性结构](/images/c970cdc7b89bfe0a12e560fe94fcdfef.jpg)

V8 为了提升存储和查找效率，在对象中添加了两个隐藏属性，排序属性和常规属性。

下面就详细看看这两个属性的具体内容。

## 一、排序属性和常规属性
先看一段代码：
```js
/**
 * 1.字属性被最先打印出来了，并且是按照数字⼤⼩的顺序打印的
 * 2.设置的字符串属性依然是按照之前的设置顺序打印的
 * 原因：ECMAScript 规范中定义了数字属性应该按照索引值⼤⼩升序排列，字符串属性根据创建时的顺序升序排列
 */
function Foo() {
    this[100] = 'test-100'
    this[1] = 'test-1'
    this["B"] = 'bar-B'
    this[50] = 'test-50'
    this[9] = 'test-9'
    this[8] = 'test-8'
    this[3] = 'test-3'
    this[5] = 'test-5'
    this["A"] = 'bar-A'
    this["C"] = 'bar-C'
}
var bar = new Foo();
for(key in bar){
  console.log(`index:${key} value:${bar[key]}`)
}
/*
  index:1 value:test-1
  index:3 value:test-3
  index:5 value:test-5
  index:8 value:test-8
  index:9 value:test-9
  index:50 value:test-50
  index:100 value:test-100
  index:B value:bar-B
  index:A value:bar-A
  index:C value:bar-C
 */
```
**排序属性**（element）：把对象中的数字属性称为排序属性。element 属性指向了 elements 对象，在 elements 对象中，会按照顺序存放排序属性。

**常规属性**（properties）：字符串属性就被称为常规属性。properties 属性则指向了 properties 对象，在 properties 对象中，会按照创建时的顺序保存了常规属性。

**数字属性应该按照索引值大小升序排列，字符串属性根据创建时的顺序升序排列**。

![V8内部的对象构造](/images/af2654db3d3a2e0b9a9eaa25e862cc75.jpg)
分解成两种数据结构之后，如果执行索引操作，V8 会先从 elements 属性中按照顺序读取所有的元素，然后再在 properties 属性中读取所有的元素，这样就完成一次索引操作。

## 二、快属性和慢属性
将不同的属性分别保存到 elements 属性和 properties 属性中，无疑简化了程序的复杂度。但是在查找元素时，却多了一步操作。
如：
- 执行 bar.B 这个语句来查找 B 的属性值，V8 会先查找出 properties 属性所指向的对象 properties。
- 然后再在 properties 对象中查找 B 属性。

这样影响元素的查找效率。

因此，V8 采用了一个权衡的策略以加快查找属性的效率，就是将**部分常规属性存储到对象本身**，我们称为**对象内属性**(in-object properties)。
![对象内属性](/images/f12b4c6f6e631ce51d5b4f288dbfb13e.jpg)
不过对象内属性的数量是固定的，默认是 10 个，如果添加的属性超出了对象分配的空间,则它们将被
保存在常规属性存储中,虽然属性存储多了⼀层间接层，但可以⾃由地扩容。

我们将保存在线性结构中的属性称为**快属性**。但是线程结构却因为查找快，删除慢。因此一个对象的属性过得时，
V8 就是将超出的数据保存在字典中，这些属性称为**慢属性**。
![慢属性是如何存储的](/images/e8ce990dce53295a414ce79e38149917.jpg)


## 三、实践查看
```js

function Foo(property_num,element_num) {
    //添加可索引属性
    for (let i = 0; i < element_num; i++) {
        this[i] = `element${i}`
    }
    //添加常规属性
    for (let i = 0; i < property_num; i++) {
        let ppt = `property${i}`;
        this[ppt] = ppt
    }
}
var bar = new Foo(10,10)
```
打开 Chrome 开发者工具切换到 Memory 标签。然后点击左侧的小圆圈就可以捕获当前的内存快照。
<img src="/images/d2a123d127a2895d9f0d09be61cc55d3.png" width="45%" style="margin-right:10px">
<img src="/images/2b4ee447d061f72026ca38d6dfc25389.png" width="45%">

这时候内存布局如下：
- 10 属性直接存放在 bar2 的对象内 ;
- 10 个排序属性存放在 elements 中。

在内存快照中没有看到 properties，是因为创建的常规属性太少了。
```js
var bar2 = new Foo(100,10)
```
<img src="/images/dab6d6e2291117781e4294f27113d469.png" width="45%">

此时的内存布局是：
- 10 属性直接存放在 bar2 的对象内 ;
- 90 个常规属性以非线性字典的这种数据结构方式存放在 properties 属性里面 ;
- 10 个数字属性存放在 elements 属性里面。

## 四、其他属性
在内存中还有几个重要的隐藏属性：
- `__proto__`: 属性就是原型，是用来实现 JavaScript 继承的。
- `map`: 是隐藏类。后面详细介绍。《15章》

## 五、Object 和 Map 的区别
||Map|Object|
|:-|:-|:-|
|默认值|默认不包含任何值，只包含显式插⼊的键|有⼀个原型，原型上的键名有可能和⾃⼰对象上设置的键名冲突|
|类型|任意|String 或 Symbol|
|⻓度|键值对个数通过 size 属性获取|键值对个数只能⼿动计算|
|性能|频繁增删键值对的场景下表现更好|频繁添加和删除键值查询变慢|

1.「Object」不同于「Map」，它不仅仅是表⾯所看到的。「Map」只包含你所定义的键值对，但是「Object」对象具有其原型中的⼀些内置属性。

2.「Map」是⼀个纯哈希结构，始终保持对⻓度的跟踪，使其能够在O(1)复杂度中进⾏访问。

⽽另⼀⽅⾯，对于「Object」⽽⾔，想要获得对象的属性⻓度，需要⼿动对其进⾏迭代，使其为O(n)复
杂度，属性⻓度为n 。「Map」始终保持按插⼊顺序返回键名。但「Object」却不是。所以当你需要频
繁操作数据的时候也可以优先考虑 Map
:::tip
不要将「Map」作为普通「Object」的替代品，⽽应该是普通对象的补充
:::

