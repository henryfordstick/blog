# js 常见面试题
## 一、js基础问题
### 1、数组的常用API，有哪些方法可以改变数组的内容，forEach 和 map的区别，push 和 concat的区别
### 2、数组去重
### 3、js继承的方式有哪些
### 4、闭包
### 5、toString 和 valueOf 的区别
### 6、Map 和 普通的 object 的区别
### 7、GC 垃圾回收机制
### 8、原型链和作用域链
### 9、基本数据类型，undefined 和 null的区别
### 10、apply,bind,call的区别
### 11、常用数据类型，判断数据类型有哪些方法？
##### ① JavaScript 的 typeof 可能返回哪些基本数据类型？
js判断数据类型有四种方法
- typeof 只能判断基础类型
- instanceof 只能判断引用类型，A是否为B的实例；
- constructor
- Object.prototype.toString.call()  返回一个数组[object Boolean]
```js
// 封装一个准确判断数据类型的函数
function getType(obj){
  let type = typeof obj;
	if(type !== 'object'){
  	return type;
  }

  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/,'$1');
}
```
### 12、instanceof 的作用
### 13、浅拷贝和深拷贝，深拷贝有哪些方法，JSON.stringify(JSON.parse(arr))的弊端
### 14、说一下eventloop 事件循环机制
### 15、说一下__proto__ 和 prototype 的理解,Function 和 Object 的关系
### 16、防抖和节流函数实现，及其应用场景
### 17、requestAnimiationFrame原理
### 18、localStorage,sessionStorage,cookies的区别（本地缓存）
### 19、变量提升，函数提升
### 20、函数传参方式 是按照引用传递的
### 21、JS 中的异步函数有哪些
### 22、Promise vs async await
### 23、CommonJS, AMD, CMD, UMD , ESModule 模块的区别
### 24、for in 和 for of 的区别
### 25、跨域原理，怎么解决 cors 跨域怎么携带 cookies
### 26、箭头函数和普通函数的区别
- 箭头函数是匿名函数，不能作为构造函数，不能使用new。
- 箭头函数不绑定arguments，取而代之用rest参数...解决
- 箭头函数不绑定this，会捕获其所在的上下文的this值，作为自己的this值
- 箭头函数通过 call() 或 apply() 方法调用一个函数时，只传入了一个参数，对 this 并没有影响。
- 箭头函数没有原型属性
- 箭头函数不能当做Generator函数,不能使用yield关键字
### 27、面向对象是什么，用面向对象实现登录
### 28、webView 与原生的通信原理
### 29、v8 引擎解释执行 js 代码的详细流程
### 30、js 内存回收机制，如何避免内存泄漏
### 31、this   指向场景 ，区别
- new
- window
- es6 箭头
- settimeout
### 32、变量VO，AO，VO是在什么阶段被创建的，arguments对象呢
### 33、js常见的错误类型
### 34、iterator属性




## 二、场景题
### 1、js中表达式parseInt("x8x8") + parseFloat("8")的结果是  NaN
### 2、重排和重绘以及解决的方案
### 3、实现函数柯里化，函数传空值的时候调用
### 4、图片上传的方式有几种，说一下流程，怎么在页面中展示
### 5、大文件上传，断点续传的原理
### 6、const a = 0; let b = 1; var c = 2;  放到全局作用域，window能打印出 a b c 吗
### 7、场景： 怎么实现一个页面的高度是宽度的一半
### 8、场景：tabA，和tabB 都要请求接口，怎么确定 数据加载回来是 tabA 的数据，或者 tabB 的数据（返回的数据没有明显的标识）  用闭包实现
### 9、web应用是怎么处理错误上报问题的



## 三、手写题
### 1、函数柯里化
### 2、Object.create原理
### 3、setTimeout 的实现原理
### 4、Promise原理，常用的方法
### 5、手写 Promise.all
### 6、数组 flat
### 7、实现一个Observer类对指定数据进行劫持

## 四、TS 问题
### 1、聊聊常用的ts，相对js有那些语法糖
### 2、介绍 TS 中的泛型
### 3、ts 编辑器是怎么查找类型的
### 4、用 TS 实现 防抖函数，要求处理返回值
### 5、泛型的理解，实现一个场景
### 6、ts type和interface
### 7、ts装饰器



