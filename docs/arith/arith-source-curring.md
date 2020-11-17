# 柯里化和反柯里化
## 柯里化（curring）
函数柯里化，是固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数，目的是为了缩小适用范围，创建一个针对性更强的函数。

函数柯⾥化的主要作⽤和特点就是参数复⽤、提前返回和延迟执⾏。
```javascript
function curring(fn,args){
  let length = fn.length;
  args = args || [];
  return function (){
    let newArgs = args.concat(Array.prototype.slice.call(arguments));
    if(newArgs.length < length){
      return curring.call(this,fn,newArgs);
    } else {
      return fn.apply(this,newArgs);
    }
  }
}

function multiFn(a, b, c) {
  console.log(a * b * c);
  return a * b * c;
}

var multi = curring(multiFn);

multi(2)(3)(4);
multi(2, 3, 4);
multi(2)(3, 4);
multi(2, 3)(4);
```
ES6版本的
```javascript
const currying = (fn,arr = []) => (...args) => (
  arg => (arg.length === fn.length ? fn(...args) : curry(fn,arg))
)([...arr,...args]);

let curryTest = currying((a, b, c, d) => a + b + c + d);
curryTest(1, 2, 3)(4); //返回10
curryTest(1, 2)(4)(3); //返回10
curryTest(1, 2)(3, 4); //返回10
```

## 反柯里化（unCurring）
那么反柯里化函数，从字面讲，意义和用法跟函数柯里化相比正好相反，扩大适用范围，创建一个应用范围更广的函数。使本来只有特定对象才适用的方法，扩展到更多的对象。
```javascript
Function.prototype.uncurrying = function() {
  var that = this;
  return function() {
    return Function.prototype.call.apply(that, arguments);
  };
};
```

