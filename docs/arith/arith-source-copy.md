# 浅拷贝，深拷贝和赋值
首先强调一点的是浅拷贝，深拷贝，赋值的区别在引用类型上，基本类型中都会在栈中创建一个新的变量，并赋值过来。
对于引用类型，共同的特点是都会在栈中创建一个变量，然后将堆中对象的地址存在栈中的变量中，区别就是引用的是不是同一个地址。

浅拷贝对于单层列表来说，没有区别，但是对于多层列表来说：


## 浅拷贝
### 1、Object.assign
ES6 中拷贝对象的方法，接收的第一个参数是拷贝的目标 target，剩下的参数是拷贝的原对象 sources （可以是多个）
```js
let target = {};
let source = {a: "123",b:{name: 'abc'}};
Object.assign(target,source);
console.log(target);
// {a: "123",b:{name: 'abc'}}
```
Object.assign 注意事项
- 只拷贝源对象的自身属性（不拷贝继承属性）
- 不会拷贝对象不可枚举的属性
- undefined 和 null 无法转成对象，他们不能作为 Object.assign 参数，但是可以作为源对象
- 属性名 Symbol 值的属性，可以被 Object.assign 拷贝

### 2、Array.prototype.slice
```js
let array = [{a: 1},{b: 2}];
let array1 = array.slice(0);
console.log(array1);
```
- slice 从已有的数组中返回选定的元素

### 3、Array.prototype.concat
```js
let array = [{a: 1},{b: 2}];
let array1 = [].concat(array);
console.log(array1);
```

### 4、扩展运算符
```js
let obj = {a: 1,b: {c: 1}};
let obj2 = {...obj};
console.log(obj2);
```

### 5、自己实现一个
#### 原理
新的对象复制已有对象中非对象属性的值和对象属性的引用，也就是说对象属性并不复制到内存。
```js
function cloneShallow(source){
  var target = {};
  for(var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      target[key] = source[key];
    }
    return target;
  }
}
```
#### for in
for...in 语句以任意顺序遍历一个对象自有的，继承的，可以枚举的，非 Symbol 的属性。对于每个不同的属性，语句都会被执行。
#### hasOwnProperty
改函数返回值为布尔值，所有继承了 Object 的对象都会集成到 hasOwnProperty 方法，和 in 运算符不同，改函数会忽略掉那些从原型链上
继承到的属性和自身属性。

## 深拷贝
深拷贝开辟一个新的栈，两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性
### 1、JSON.parse(JSON.stringify(source))
利用现代浏览器支持的 JSON 对象做一次中转，实现深度克隆
#### 优点
简单快捷
#### 缺点
- undefined,函数，Symbol值，在序列化过程中会被忽略。
- 不能处理 BigInt 类型的数据和循环引用，会报错
- Map,Set,RegExp 类型的数据，会引用丢失，变成空值。
- Date 类型的数据会被当做字符串处理
- NaN 和 Infinity 格式的数值及 null 都会被当做 null
- 其他类型的对象，包括 Map/Set/WeakMap/WeakSet,仅会序列化可枚举的属性。
```js
function deepClone(obj){
  var _tmp,result;
  _tmp = JSON.stringify(obj);
  result = JSON.parse(_tmp);
  return result;
}
```

### 2、确定参数类型为 object
确定参数类型为 object（这里仅指 object literal,Array literal）后，复制源对象的键/值到目标对象，否则直接返回源对象
```js
function deepClone(obj){
  var result = typeof obj.splice === 'function' ? []: {},
  key;
  if(obj && typeof obj === 'object'){
    for(key in obj){
      if(obj[key] && typeof obj[key] === 'object'){
        result[key] = deepClone(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  return obj;
}
```
### 3、终极版
```js
function isObject(obj){
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

function isFunc(obj){
  return typeof obj === 'function';
}

function isArray(obj){
  return Array.isArray(obj);
}

function isDate(obj){
  return Object.prototype.toString.call(obj) === '[object Date]'
}
function isMap(obj){
  return Object.prototype.toString.call(obj) === '[object Map]'
}
function isSet(obj){
  return Object.prototype.toString.call(obj) === '[object Set]'
}

function isRegExp(obj){
  return Object.prototype.toString.call(obj) === '[object Set]'
}

function deepCopy(obj,weakMap = new WeakMap()){
  if(!isObject(obj)) return obj;
  if(weakMap.get(obj)) return weakMap.get(obj);
  // 如果是函数
  if(isFunc(obj)){
    let result = null;
    // 获取函数的主体
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    // 获得参数
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = obj.toString();
    // 判断是否是箭头函数
    if(obj,prototype){
      const param = paramReg.exec(funcString);
      const body = bodyReg.exec(funcString);
      if(body){
        if(param){
          const paramArr = param[0].split(',');
          result = new Function(...paramArr,body[0]);
        } else {
          result = new Function(body[0]);
        }
      } else {
        result = eval(funcString);
      }
    }
    weakMap.set(obj,result);
    return result;
  }
  // 如果是数组
  if(isArray(obj)){
    let result = [];
    for(let val of obj){
      result.push(deepCopy(val,weakMap));
    }
    weakMap.set(obj,result);
    return result;
  }
  if(isDate(obj)){
    let result = new obj.constructor(obj);
    weakMap.set(obj,result);
    return result;
  }
  if(isSet(obj)){
    let result = new Set();
    obj.forEach(val => {
      result.add(deepCopy(val,weakMap));
      weakMap.set(obj,result);
      return result;
    })
  }
  if(isMap(obj)){
    let result = new Map();
    obj.forEach((val,key) => {
      result.set(key,deepCopy(key,weakMap))
    });
    weakMap.set(obj,result);
    return result;
  }
  // 如果是正则
  if(isRegExp(obj)){
    const reFlags = /\w*$/;
    const result = new obj.constructor(obj.source,reFlags.exec(obj));
    result.lastIndex = obj.lastIndex;
    weakMap.set(obj,result);
    return result;
  }
  let result = {};
  weakMap.set(obj,result);
  // 考虑 symbol 类型的属性名
  let symbols = Object.getOwnPropertyDescriptor(obj);
  if(symbols.length > 0){
    for(let key of symbols){
      let val = obj[key];
      result[key] = isObject(val);
    }
  }
  // 非symbol 类型属性名
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      let val = obj[key];
      result[key] = isObject(val) ? deepCopy(val,weakMap) : val;
    }
  }

  return result;
}
```

