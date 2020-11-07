# null 和 undefined 区别
null 和 undefined 基本是同义的，只有一些细微的差别
```javascript
console.log(Number(null));  // 0
console.log(Number(undefined)); // NaN

console.log(3 + null); // 3
console.log(4 + undefined); // NaN

console.log(null == undefined); // true
console.log(null === undefined); // false
```
## null
**null 是一个表示"无"的对象，此处不该有值，转为数值时为 0。**

- 作为函数的参数，表示该函数的参数不是对象。

- 作为对象原型链的终点`Object.getPrototypeOf(Object.prototype)`
## undefined
**undefined 是一个表示"无"的原始值，转为数值时为 NaN**

- 变量被声明了，但没有赋值时，就等于 undefined。

- 调用函数时，应该提供的参数没有提供，该参数等于 undefined。

- 对象没有赋值的属性，该属性的值为 undefined。

- 函数没有返回值时，默认返回 undefined。
```javascript
var i;
i // undefined

function f(x){console.log(x)}
f() // undefined

var  o = new Object();
o.p // undefined

var x = f();
x // undefined
```
## 相关链接
[本文出自阮一峰的 null 和 undefined 区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
