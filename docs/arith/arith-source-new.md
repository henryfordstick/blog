# new操作符的原理

首先研究一下，new操作符具体干了那些事情！
- 创建一个全新的对象。
- 将对象的原型链`__proto__`指向构造函数的原型`prototype`。
- 将构造函数的this指向新创建的对象。
- 如果对象没有返回对象类型Object（包含Function，Array，Date，RegExp，Error），那么new 表达式的函数将返回该对象引用。

```typescript
function MyNew(fn:(unknown) => unknown, ...args:[]){
  let obj:object = {};

  obj.__proto__ = fn.prototype;

  let ret:unknown = fn.apply(obj,args);

  if((typeof ret === "function" || typeof ret === "object") && ret !== null){
    return ret;
  }
  return obj;
}
```