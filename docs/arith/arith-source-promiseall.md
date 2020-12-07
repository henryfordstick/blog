# 实现 Promise.all方法
一般来说，Promise.all 用来处理多个并发请求，也是为了页面数据构造的方便，将一个页面
所用到的在不同接口的数据一起请求过来，不过，如果其中一个接口失败了，多个请求也就失败了，
页面可能啥也出不来，这就看当前页面的耦合程度了。

## 核心思想
1. 接收一个 Promise 实例的数组或 具有 Iterator 接口的对象作为参数。
2. 这个方法返回一个新的 Promise 对象
3. 遍历传入的参数，用 Promise.resolve() 将参数"包一层"，使其变成一个 Promise 对象。
4. 参数所有回调成功才是成功，返回数组与参数顺序一致
5. 参数数组其中一个失败，则触发失败状态，第一个触发失败的 Promise 错误信息作为 Promise.all 的错误信息。

## 实现代码
```js
function promiseAll(promises) {
  return new Promise(function(resolve, reject){
    if(!Array.isArray(promises)){
      throw new TypeError(`argument must be a array`);
    }
    var resolvedCounter = 0;
    var promiseNum = promises.length;
    var resolveResult = [];
    for(let i = 0; i < promiseNum; i++){
      Promise.resolve(promises[i]).then(value => {
        resolvedCounter ++;
        resolveResult[i] = value;
        if(resolvedCounter === promiseNum){
          return resolve(resolveResult);
        }
      },error => {
        return reject(error);
      })
    }
  })
}

// 测试
let p1 = new Promise(function(resolve, reject){
  setTimeout(function() {
    resolve(1);
  },1000)
});

let p2 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve(2)
  },2000)
});

let p3 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve(3)
  },3000)
});

promiseAll([p3,p1,p2]).then(res => {
  console.log(res); // [3, 1, 2]
})
```
