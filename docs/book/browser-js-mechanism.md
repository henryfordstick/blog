# 第三章 浏览器中 JS 执行机制
前面对浏览器宏观原理做了一个深度介绍，接下来我们深入一下 JS 的执行原理。

## 一、变量提升
```js
showName()
console.log(myname);
var myname = '极客时间'
function showName () {
  console.log('函数 showName 被执行');
}

// 函数 showName 被执行
// undefined

// 当去掉 “var myname = '极客时间'” 这段代码时，js 引擎就会报错
// myname is not defined
```
