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

## 改进方案（allSettled）
由于 Promise.all 只要一个触发失败，那么整个结果返回失败，后面的请求可能未执行。后来添加了 Promise.allSettled Api。会将整个参数实例执行完再返回结果。

下来描述 allSettled 一些特性。
- 接收一组 Promise 实例作为参数，返回一个新的 Promise 实例。
- 只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected ，包装实例才会结束。
- 返回的新 Promise 实例，一旦结束，状态总是 fulfilled，不会变成 rejected。
- 新的 Promise 实例监听函数传递一个数组 results。该数组的每个成员都是一个对象，对应传入 Promise.allSettled 的 Promise
实例，每个对象都有 status 属性，对应着 fulfilled 和 rejected。fulfilled 时，对象有 value 属性，rejected 时有 reason
属性，对应两种状态的返回值。
- 有时候我们并不关心异步操作的结果，只关心这些操作有没有结束时，这个方法会比较有用。

```js
const formatSettledResult = (success,value) => (
  success ? {status: "fulfilled",value}
          : {status: "rejected", reason: value}
);

Promise.all_Settled = function(iterators) {
  const promises = Array.from(iterators);
  const num = promise.length;
  const resultList = new Array(num);
  let resultNum = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise,index) => {
      Promise.resolve(promise).then(value => {
        resultList[index] = formatSettledResult(true,value);
        if(++ resultNum === num){
          resolve(resultList);
        }
      }).catch(error => {
        resultList[index] = formatSettledResult(false,error);
        if(++ resultNum === num){
          resolve(resultList);
        }
      })
    })
  })
}
```

