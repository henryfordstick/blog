# 07 | 类型转换
有一个问题，在 JS 中，执行 1 + '2' 的结果是啥呢？
```js
let res = 1 + "2";
console.log(res);
// "12"
```
为什么结果是 12 呢，下面详细的分析！
## 一、什么是类型系统
在上面的表达式中，涉及两种不同类型数据的相加。因此我们需要知道类型的概念，以及 JavaScript 操作类型的策略。

对于机器语言，所有的数据都是二进制，CPU 处理数据的时候并没有类型的概念。CPU 所做的仅仅是移动数据，比如对其进行移位，相加或相乘。

在高级语言中，对操作的数据都要指定类型，类型可以确认一个值或者一组值具有特定的意义和目的。
![类型的目的](/images/e0dfa246212ec1070ac8aac6bc0f1a3f.jpg)


而更高级的语言如 JavaScript 可以根据数据自动推断类型，有了这些类型之后，编译器和解释器就可以限制一些错误或者没有意义的操作了。

每种语言都定义了自己的类型，还定义了如何操作这些类型，另外还定义了这些类型应该如何相互作用，我们就把这称为**类型系统**。
> 在计算机科学中，类型系统（type system）用于定义如何将编程语言中的数
>
> 值和表达式归类为许多不同的类型，如何操作这些类型，这些类型如何互相作用。

总结来说：**类型系统定义了各个类型之间应该如何相互操作，相互转换等**。

## 二、V8 怎么执行加法操作的
1. 把第一个表达式 (AdditiveExpression) 的值赋值给左引用 (lref)。
2. 使用 GetValue(lref) 获取左引用 (lref) 的计算结果，并赋值给左值。
3. 使用 ReturnIfAbrupt(lval) 如果报错就返回错误
4. 把第二个表达式 (MultiplicativeExpression) 的值赋值给右引用 (rref)
5. 使用 GetValue(rref) 获取右引用 (rref) 的计算结果，并赋值给 rval
6. 使用ReturnIfAbrupt(rval) 如果报错就返回错误。
7. 使用 ToPrimitive(lval) 获取左值 (lval) 的计算结果，并将其赋值给左原生值 (lprim)
8. 使用 ToPrimitive(rval) 获取右值 (rval) 的计算结果，并将其赋值给右原生值 (rprim)
9. 如果 Type(lprim) 和 Type(rprim) 中有一个是 String，则：
    - 把 ToString(lprim) 的结果赋给左字符串 (lstr)；
    - 把 ToString(rprim) 的结果赋给右字符串 (rstr)；
    - 返回左字符串 (lstr) 和右字符串 (rstr) 拼接的字符串。
10. 把 ToNumber(lprim) 的结果赋给左数字 (lnum)。
11. 把 ToNumber(rprim) 的结果赋给右数字 (rnum)。
12. 返回左数字 (lnum) 和右数字 (rnum) 相加的数值。

下面用人话来说明整个过程：

V8 会提供一个 ToPrimitive 方法，其作用是将 a 和 b 转换为原生数据类型，其转换流程如下：
    - 先检测该对象中是否存在 valueOf 方法，如果有并返回了原始类型，那么就使用该值进行强制类型转换
    - 如果 valueOf 没有返回原始类型，那么就使用 toString 方法的返回值
    - 如果 vauleOf 和 toString 两个方法都不返回基本类型值，便会触发一个 TypeError 的错误。
![类型转换流程图](/images/d150309b74f2c06e66011cf3e177dbaa.jpg)
下面用代码验证一下上面的流程：
```js
var obj = {
  toString(){
    return '200';
  },
  valueOf(){
    return 100;
  }
};

var res = obj + 3; // 103
// 这个是 ToPrimitive 会优先调用 valueOf 方法，没有 valueOf 方法才调用 toString 方法的。
```
那么将上面代码改造一下
```js
var obj = {
  toString(){
    return new Object();
  },
  valueOf(){
    return new Object();
  }
};

var res = obj + 3; // Cannot convert object to primitive value
// 发现 valueOf 和 toString 都不是原生类型，所以就会报错异常
```

## 三、思考题
```js

var Obj = {
    toString() {
      return "200"
    },
    valueOf() {
      return 100
    }
  };
let a = Obj+"3" // 1003
// 如果其中一个是字符串，V8 默认也会把另外一个变成字符串
```
