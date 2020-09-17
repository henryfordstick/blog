# call,apply和bind的原理
首先他们的作用是为了改变**函数运行时this的指向**，只是用法有所区别。

#### 用法
- `func.call(thisArg, arg1, arg2, ...)` ，调⽤⼀个函数, 其具有⼀个指定的this值和分别提供的参数(参数的列表)。
  
- `func.apply(thisArg, [argsArray])` ，调⽤⼀个函数，以及作为⼀个数组（或类数组对象）提供的参数。
  
- `bind` 会创建⼀个新函数。当这个新函数被调⽤时，bind() 的第⼀个参数将作为它运⾏时的 this，之 后的⼀序列参数将会在传递的实参前传⼊作为它的参数。

#### 核心思想
- 如果不传入参数，默认指向window
- 将函数设为对象的属性
- 执行和删除这个函数
- 指定this到函数并传入给定参数执行函数

#### call
```typescript
/**
 * 1、首先context为可选参数，如果不传默认上下文为window
 * 2、接下来给context创建一个fn属性，并将值设为需要调用的函数
 * 3、因为call需要传入多个参数作为调用函数的参数，所以需要将参数剥离出来
 * 4、然后调用函数并将对象上的函数删除
 */

Function.prototype['mycall'] = function(context){
  if (typeof this != "function") {
    throw Error("not a function")
  }

  context = context || window;
  let args:Array<unknown> = [...arguments].slice(1);
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}
```
#### apply
```typescript
Function.prototype['myapply'] = function(context) {
  if (typeof this != "function") {
    throw Error("not a function")
  }

  context = context || window;
  context.fn  = this;
  let result;
  if(arguments[1]){
    result = context.fn(arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
```

#### bind
```typescript
Function.prototype['mybind'] = function (context) {
  if (typeof this != "function") {
    throw Error("not a function")
  }

  const fn = this;
  const args = [...arguments].slice(1);
  return function F() {
    // 因为返回了一个函数F，这个函数可以用 new F() 的方式调用，所以需要判断
    if(this instanceof F){
      return new fn(...args,...args);
    }
    return fn.apply(context,args.concat(...arguments));
  }
};
```
