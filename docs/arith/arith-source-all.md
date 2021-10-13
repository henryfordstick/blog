# 前端常用的 JS 方法封装
#### 1、输入一个值，返回数据类型
```js
function type(para){
  return Object.prototype.toString.call(para);
}
```

#### 2、数组去重
```js
// 方法一
function unique1(arr){
  return [...new Set(arr)]; // return Array.from(new Set(arr));
  // 对象去不了
}

function unique2 (arr) {
  let obj = {};
  return arr.filter(el => { // 针对于对象很难区分，所以添加了 JSON.stringify
    let key = typeof el + JSON.stringify(el); // 数据类型 + 转换后的字符串
    return obj.hasOwnProperty(key) ? false : (obj[key] = true)
  })
}

function unique3 (arr) {
  return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}

function unique4 (arr) {
  let res = [];
  
  for(let i = 0; i < arr.length; i ++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }

  return res;
}
```

#### 3、字符串去重
```js
String.prototype.unique = function () {
  let obj = {};
  let str = '';
  let len = this.length;

  for(let i = 0; i < len; i ++) {
    if (!obj[this[i]]) {
      obj[i] = true;
      str += this[i];
    }
  }
  return str;
}

// 利用正则
function unique (str) {
  return str.replace(/(\w)\1+/g, '$1');
}
```

#### 4、深拷贝，浅拷贝
```js
let obj = {a: 1,b: {c: 1}};
// ********* 浅拷贝 ********* 
// 1、使用扩展运算符
let copyObj = {...obj};
// 2、使用 Object.assign
let copyObj = Object.assign({}, obj);

// 3、手写实现浅拷贝
const isObject = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
function shallowCopy (obj) {
  if (!isObject(obj)) return obj;
  let res = Array.isArray(obj) ? [] : {};
  for(let key in obj) {
    if (Object.prototype.hasOwnProperty(obj, key)) {
      res[key] = obj[key]
    }
  }
  return res;
 }

// ********* 深拷贝 ********* 
// 1、JSON.stringify   JSON.parse
let copyObj = JSON.parse(JSON.stringify(obj));
// 2、手写实现深拷贝
function deepCopy (obj) {
  if (!isObject(obj)) return obj;
  let res = Array.isArray(obj) ? [] : {};
  for(let key in obj) {
    if (typeof obj === 'object') {
      res[key] = deepCopy(obj[key]);
    } else {
      res[key] = obj[key];
    }
  }
  return res;
}
```

#### 5、reverse 的原理
```js
Array.prototype.myReverse = function () {
  let len = this.length;
  for(let i = 0; i < len; i ++) {
    let temp = this[i];
    this[i] = this[len - i - 1];
    this[len - i - 1] = temp;
  }
  return this;
}
```

#### 6、forEach 的原理
```js
Array.prototype.myForEach = function (func) {
  let len = this.length;
  let _self = arguments[1] || window;
  for(let i = 0; i < len; i ++) {
    func.call(_self, this[i], i, this);
  }
}
```

#### 7、map 的原理
```js
Array.prototype.myMap = function (func) {
  let arr = [];
  let len = this.length;
  let _self = arguments[i] || window;
  for(let i = 0; i < len; i ++) {
    arr.push(func.call(_self, this[i], i, this));
  }
  return arr;
}
```

#### 8、filter 的原理
```js
Array.prototype.myFilter = function (func) {
  let arr = [];
  let len = this.length;
  let _self = arguments[i] || window;
  for(let i = 0; i < len; i ++) {
    func.call(_self, this[i], i, this) && arr.push(this[i]);
  }
  return arr;
}
```

#### 9、reduce 的原理
```js
Array.prototype.myReduce = function (func, initValue) {
  if (!this.length && initValue) return initValue;
  let i = initValue ? 0 : 1; // 如果有初始值，则从第 0 位开始
  let nextValue = initValue || this[0];
  for(; i < this.length; i ++) {
    nextValue = func(nextValue, this[i], i, this);
  }
  return nextValue;
}
```

#### 10、every 和 some 的原理
```js
Array.prototype.myEvery = function (func) {
  let flag = true;
  let len = this.length;
  let _self = arguments[i] || window;

  for(let i = 0; i < len; i ++) {
    if (!func.call(_self, this[i], i, this)) {
      flag = false;
      break;
    }
  }
  return flag;
}

Array.prototype.mySome = function (func) {
  let flag = false;
  let len = this.length;
  let _self = arguments[i] || window;

  for(let i = 0; i < len; i ++) {
    if (func.call(_self, this[i], i, this)) {
      flag = true;
      break;
    }
  }
  return flag;
}
```

#### 11、实现 call、apply、bind 方法
```js
Function.prototype.myCall = function(context) {
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}

Function.prototype.myApply = function (context) {
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;
  let result;
  if (arguments[1]) {
    result = context.fn(...arguments);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}

Function.prototype.myBind = function (context) {
  const fn = this;
  const args = [...arguments].slice(1);
  return function () {
    return fn.apply(context, args.concat(arguments));
  }
}
```

#### 12、原生 JS 封装 ajax
```js
function ajax (method, url, callback, data, flag) {
  var xhr;
  
}
```