# 手写 instanceof 原理
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

```javascript
// instanceof 是关键字
function instanceOf(left,right){
  let proto = left.__proto__;
  let prototype = right.prototype;

  while(true){
    if(proto === null) return false;
    if(proto === prototype) return true;
    proto = proto.__proto__;
  }
}

```

