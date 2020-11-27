# 手写 Promise
`Promise` 是异步编程的解决方案，主要解决各种回调函数和回调事件。

所谓的 `Promise` 就是一个**容器**，里面保存着某个未来才会结束的事件，通常是一个异步操作的结果。

## 一、Promise 的特点
### 特性
1. `Promise` 有三种状态：`pending`（进行中）`fulfilled`（已成功）`rejected`(已失败)
2. `Promise` 对象接受一个回调函数作为参数, 该回调函数接受两个参数.
3. `then` 方法返回一个新的 `Promise` 实例，并接收两个参数 `onResolved` (`fulfilled`状态的回调)；`onRejected`(`rejected`状态的回调，该参数可选)
4. `catch`方法返回一个新的`Promise`实例
5. `finally`方法不管`Promise`状态如何都会执行，该方法的回调函数不接受任何参数
6. `Promise.all()`方法将多个`Promise`实例，包装成一个新的`Promise`实例，该方法接受一个由`Promise`对象组成的数组作为参数(`Promise.all()`方法的参数可以不是数组，但必须具有`Iterator`接口，且返回的每个成员都是`Promise`实例)，注意参数中只要有一个实例触发`catch`方法，都会触发`Promise.all()`方法返回的新的实例的`catch`方法，如果参数中的某个实例本身调用了`catch`方法，将不会触发`Promise.all()`方法返回的新实例的`catch`方法。
7. `Promise.race()`方法的参数与`Promise.all`方法一样，参数中的实例只要有一个率先改变状态就会将该实例的状态传给`Promise.race()`方法，并将返回值作为`Promise.race()`方法产生的`Promise`实例的返回值
8. `Promise.resolve()`将现有对象转为`Promise`对象，如果该方法的参数为一个`Promise`对象，`Promise.resolve()`将不做任何处理；如果参数`thenable`对象(即具有`then`方法)，`Promise.resolve()`将该对象转为`Promise`对象并立即执行`then`方法；如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的`Promise`对象，状态为`fulfilled`，其参数将会作为`then`方法中`onResolved`回调函数的参数，如果`Promise.resolve`方法不带参数，会直接返回一个`fulfilled`状态的 `Promise` 对象。需要注意的是，立即`resolve()`的
`Promise` 对象，是在本轮“事件循环”（`event loop`）的结束时执行，而不是在下一轮“事件循环”的开始时。
9. `Promise.reject()`同样返回一个新的`Promise`对象，状态为`rejected`，无论传入任何参数都将作为`reject()`的参数。
### 优点
1. 解决了回调地狱的问题,将异步操作以同步操作的流程表达出来。
2. 统一异步的API，它将逐渐被用作浏览器的异步 API ，统一现在各种各样的 API ，以及不兼容的模式和手法。
3. `Promise` 与事件对比。和事件相比较， `Promise` 更适合处理一次性的结果。
4. `Promise` 带来的额外好处是包含了更好的错误处理方式，并且写起来很轻松。

### 缺点
1. 无法取消 `Promise`，一旦新建它就会立即执行，无法中途取消。
2. 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。
3. 当处于`Pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
4. `Promise` 真正执行回调的时候，定义 `Promise` 那部分实际上已经走完了，所以 `Promise` 的报错堆栈上下文不太友好。

接下来由一个一个特点来写 `Promise`。

## 二、可以在 setTimeout 中去 resolve
这里想要得到的功能是想要在 耗时任务处理成功以后使用 `resolve`。
```js
new MyPromise((resolve,reject) => {
    setTimeout(() => {
        resolve('step1');
    },1000)
}).then(console.log);

// step1
```
接下来实现 MyPromise 构造函数
```js
class MyPromise {
  constructor(executor) {
    this.resolveCallbacks = [];
    const resolve = val => {
      this.resolveCallbacks.map(fn => fn(val));
    };
    // reject 先暂时不用管
    const reject = val => {};

    executor(resolve,reject)
  }
  then(onFulfilled){
    this.resolveCallbacks.push(onFulfilled);
  }
}
```

## 三、同步的 resolve
如果我直接在 then 方法中调用 调用执行成功的结果，怎么样才能让 then方法的回调执行呢？
```js
new MyPromise((resolve,reject) => {
    resolve('step2');
}).then(console.log);
// step2
```
这是 Promise 最常规的一种使用方法，那么怎么去实现这个功能呢？
```js
class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    const resolve = val => {
      // 利用宏任务的特性
      setTimeout(() => {
        this.resolveCallbacks.map(fn => fn(val));
      })
    };
    // reject 先暂时不用管
    const reject = () => {};
    executor(resolve,reject);
  }
  then(onFulfilled){
    this.resolveCallbacks.push(onFulfilled);
  }
}
```

## 四、防止 resolve 多次
上面的功能圆满完成了，那么新的问题来了，我在 Promise 里面 resolve 多次怎么办，怎么样防止重复的去执行
```js
new MyPromise((resolve,reject) => {
    resolve('step3');
    resolve('step3.1');
}).then(console.log);
// step3
```
要实现这个特性，就要引入 Promise 的三种状态了。
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
    constructor(executor){
        this.resolveCallbacks = [];
        this.state = PENDING;
        this.value = undefined; // 存储输入的结果

        const resolve = val => {
            setTimeout(() => {
                if(this.state === PENDING){
                    this.state = FULFILLED;
                    this.value = val;
                    this.resolveCallbacks.map(fn => fn(val));
                }
            })
        };
        // reject 先暂时不用管
        const reject = val => {
          this.value = val;
          this.state = REJECTED;
        };

        executor(resolve,reject)
    }

    then(onFulfilled){
        if(this.state === PENDING){
            this.resolveCallbacks.push(onFulfilled);
        }
    }
}
```

## 五、then 方法的链式调用
如果要实现then方法的链式调用，应该怎么处理？
```js
new MyPromise((resolve,reject) => {
    resolve('step4');
    resolve('step4.1');
}).then(res => {
    console.log(res);
    return "step4.2"
}).then(console.log);
// step4
// step4.2
```
因为 then 返回的是一个 Promise， 接下来实现方法：
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  then(onFulfilled){
    if(this.state === PENDING){
      return new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          resolve(x);
        });
      })
    }
  }
}
```

## 六、支持空 then 函数
如果我链式调用的时候，传入空的then，那么后面的then怎么获取前面then返回的内容呢？
```js
new MyPromise((resolve,reject) => {
    resolve('step5');
    resolve('step5.1');
}).then(res => {
    console.log(res);
    return "step5.2"
}).then()  // 空then
  .then(console.log); // 这里要打印 step5.2 出来
// step5
// step5.2
```
接下来看一下具体的函数实现
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      return new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          resolve(x);
        });
      })
    }
  }
}
```

## 七、支持 then 传递 thenable 对象
先说一下，thenable 对象就是对象里面包含 then 方法，Promise解析的时候当做一个promise去解析了。
```js
new MyPromise((resolve,reject) => {
    resolve('step6');
    resolve('step6.1');
}).then(res => {
    console.log(res);
    return {
        then(r){
            r('step6.2')
        }
    }
}).then()  // 空then
  .then(console.log);
// step6
// step6.2
```
下面实现支持的方法:
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      return new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          this.#promiseResolutionProcedure(x,resolve,reject);
        });
      })
    }
  }
  // 私有方法
  #promiseResolutionProcedure(x,resolve,reject){

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => this.#promiseResolutionProcedure(y,resolve,reject),reject)
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }
}
```

## 八、支持 then 传递 promise 对象
在 then 中如果传递了 Promise 怎么办？
```js
new MyPromise((resolve,reject) => {
    resolve('step7');
    resolve('step7.1');
}).then(res => {
    console.log(res);
    return new MyPromise((resolve,reject) => {
        resolve('step7.2');
    })
}).then()  // 空then
  .then(console.log);
// step7
// step7.2
```
接下来实现类。
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      return new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          this.#promiseResolutionProcedure(x,resolve,reject);
        });
      })
    }
  }
  // 私有方法
  #promiseResolutionProcedure(x,resolve,reject){
    // 处理promise对象
    if(x instanceof MyPromise){
      if(x.state === PENDING){
        x.then(y => this.#promiseResolutionProcedure(y,resolve,reject),reject)
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => this.#promiseResolutionProcedure(y,resolve,reject),reject)
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }
}
```
## 九、支持 resolve 传递 promise 对象
```js
new MyPromise((resolve,reject) => {
    resolve(new MyPromise((resolve,reject) => {
        resolve('step8');
    }))

}).then(res => {
    console.log(res);
    return new MyPromise((resolve,reject) => {
        resolve('step8.2');
    })
}).then()  // 空then
.then(res => {
    console.log(res);
});
// step8
// step8.2
```
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      if((typeof val === "object" || typeof val === "function") && val.then){
          this.#promiseResolutionProcedure(val,resolve,reject);
          return;
      }
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      return new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          this.#promiseResolutionProcedure(x,resolve,reject);
        });
      })
    }
  }
  // 私有方法
  #promiseResolutionProcedure(x,resolve,reject){
    // 处理promise对象
    if(x instanceof MyPromise){
      if(x.state === PENDING){
        x.then(y => this.#promiseResolutionProcedure(y,resolve,reject),reject)
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => this.#promiseResolutionProcedure(y,resolve,reject),reject)
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }
}
```
## 十、处理 then 中的循环 promise
如果在 then 循环引用 promise 就报错。
```js
const promise1 = new MyPromise((resolve,reject) => {
    resolve('step9');

});

const promise2 = promise1.then(res => {
    return promise2;
})

// 报错 Uncaught Error: 循环引用promise
```
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      if((typeof val === "object" || typeof val === "function") && val.then){
          this.#promiseResolutionProcedure(this,val,resolve,reject);
          return;
      }
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      const promise2 = new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
            const x = onFulfilled(this.value);
            this.#promiseResolutionProcedure(promise2,x,resolve,reject)
        })
      });

      return promise2;
    }
  }
  // 私有方法
  #promiseResolutionProcedure(promise2,x,resolve,reject){
    if(promise2 === x){
        throw new Error('循环引用promise');
    }
    // 处理promise对象
    if(x instanceof MyPromise){
      if(x.state === PENDING){
        x.then(y => this.#promiseResolutionProcedure(promise2,y,resolve,reject),reject)
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => this.#promiseResolutionProcedure(promise2,y,resolve,reject),reject)
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }
}
```
## 十一、支持静态方法 Promise.all
```js
MyPromise.all([
    new MyPromise(resolve => {
        resolve(1);
    }),
    new MyPromise(resolve => {
        resolve(2);
    })
]).then(res => {
    console.log(res);
})
// [1,2]
```
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise{
  constructor(executor) {
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      if((typeof val === "object" || typeof val === "function") && val.then){
          this.#promiseResolutionProcedure(this,val,resolve,reject);
          return;
      }
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };
    // reject 先暂时不用管
    const reject = val => {
      this.state = REJECTED;
      this.value = val;
    };
    executor(resolve,reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(onFulfilled = val => val){
    if(this.state === PENDING){
      const promise2 = new MyPromise((resolve,reject) => {
        // 这里 因为 下一个then调用的结果是return出来的
        // 所以需要将 onFulfilled 执行之后的结果获取到，然后用 resolve 反出来，这样下一个then才能接收到
        this.resolveCallbacks.push(() => {
            const x = onFulfilled(this.value);
            this.#promiseResolutionProcedure(promise2,x,resolve,reject)
        })
      });

      return promise2;
    }
  }
  // 私有方法
  #promiseResolutionProcedure(promise2,x,resolve,reject){
    if(promise2 === x){
        throw new Error('循环引用promise');
    }
    // 处理promise对象
    if(x instanceof MyPromise){
      if(x.state === PENDING){
        x.then(y => this.#promiseResolutionProcedure(promise2,y,resolve,reject),reject)
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => this.#promiseResolutionProcedure(promise2,y,resolve,reject),reject)
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  static all(promiseArray){
    if(!Array.isArray(promiseArray)) throw new Error('输入参数必须是数组');

    return new MyPromise((resolve,reject) => {
      const resultArray = [];
      let successTimes = 0;

      function processResult(index,data) {
        resultArray[index] = data;
        successTimes ++;
        if(successTimes === promiseArray.length){
          // 处理成功
          resolve(resultArray);
        }
      }

      for (let i = 0; i < promiseArray.length; i++){
        promiseArray[i].then(res => {
          processResult(i,res);
        },err => {
             // 处理失败
             reject(err)
        })
      }
    })
  }
}
```
## 十二、支持 reject 和 catch
```js
new MyPromise((resolve,reject) => {
    reject(11)
}).then(res => {
    console.log('resolve',res);
},err => {
    console.log('reject',err);
})
// reject 11
```

```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise {
  constructor(executor) {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    this.state = PENDING;
    this.value = undefined;

    const resolve = val => {
      if((typeof val === "object" || typeof val === "function") && val.then){
        this.#promiseResolutionProcedure(this,val,resolve,reject);
        return;
      }
      setTimeout(() => {
        if(this.state === PENDING){
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map(fn => fn(val));
        }
      })
    };

    const reject = val => {
      if((typeof val === "object" || typeof val === "function") && val.then){
        this.#promiseResolutionProcedure(this,val,resolve,reject);
        return;
      }
        setTimeout(() => {
          if(this.state === PENDING){
            this.state = REJECTED;
            this.value = val;
            this.rejectCallbacks.map(fn => fn(val));
          }
        })
    };
    executor(resolve,reject);
  }

  then(
    onFulfilled = val => val,
    onRejected = err => throw new Error(err)
  ){
    if(this.state === PENDING){
      const promise2 = new MyPromise((resolve,reject) => {
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          this.#promiseResolutionProcedure(promise2,x,resolve,reject);
        });
        this.rejectCallbacks.push(() => {
          const x = onRejected(this.value);
          this.#promiseResolutionProcedure(promise2,x,resolve,reject);
        })
      });

      return promise2;
    }
  }

  #promiseResolutionProcedure(promise2,x,resolve,reject){
    if(promise2 === x){
      throw new Error('循环引用promise');
    }
    if(x instanceof MyPromise){
      if(x.state === PENDING){
        x.then(y => this.#promiseResolutionProcedure(promise2,y,resolve,reject),reject)
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if((type === "object" || type === "function") && x !== null){
      if(typeof x.then === "function"){
        x.then(y => {
          this.#promiseResolutionProcedure(promise2,y,resolve,reject);
        },reject);
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  static all(promiseArray){
    if(!Array.isArray(promiseArray)) throw new Error('输入参数必须是数组');
    return new MyPromise((resolve,reject) => {
      const resultArray = [];
      let successTimes = 0;
      function processResult(index,data) {
          resultArray[index] = data;
          successTimes ++;
          if(successTimes === promiseArray.length){
              // 处理成功
              resolve(resultArray);
          }
      }
      for (let i = 0; i < promiseArray.length; i++){
          promiseArray[i].then(res => {
              processResult(i,res);
          },err => {
              // 处理失败
              reject(err)
          })
      }
    })
  }

}
```

## 十三、支持处理完成态或失败态的then
:::tip 终极方案
这里是整个 Promise 的终极方案，面试中征服面试官的利器
:::
```js
const promise = new MyPromise(res => {
    res('step12');
});

promise.then(res => {
    console.log(res);
});

promise.then(res => {
    console.log(res);
});
// step12
// step12
```
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];

    const resolve = (val) => {
      if ((typeof val === "object" || typeof val === "function") && val.then) {
        this.#promiseResolutionProcedure(this, val, resolve, reject);
        return;
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = val;
          this.resolveCallbacks.map((fn) => fn(val));
        }
      });
    };

    const reject = (val) => {
      if ((typeof val === "object" || typeof val === "function") && val.then) {
        this.#promiseResolutionProcedure(this, val, resolve, reject);
        return;
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.value = val;
          this.rejectCallbacks.map((fn) => fn(val));
        }
      });
    };
    executor(resolve, reject);
  }
  // 这里如果then为空，则传什么原封不动的返回给下一个then
  then(
    onFulfilled = (val) => val,
    onRejected = (err) => {
      throw new Error(err);
    }
  ) {
    let promise2 = null;
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onFulfilled(this.value);
        this.#promiseResolutionProcedure(promise2, x, resolve, reject);
      });

      return promise2;
    }

    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onRejected(this.value);
        this.#promiseResolutionProcedure(promise2, x, resolve, reject);
      });

      return promise2;
    }
    if (this.state === PENDING) {
      promise2 = new MyPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value);
          this.#promiseResolutionProcedure(promise2, x, resolve, reject);
        });
        this.rejectCallbacks.push(() => {
          const x = onRejected(this.value);
          this.#promiseResolutionProcedure(promise2, x, resolve, reject);
        });
      });

      return promise2;
    }
  }
  // 私有方法
  #promiseResolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
      throw new Error("循环引用promise");
    }

    // 处理promise对象
    if (x instanceof MyPromise) {
      if (x.state === PENDING) {
        x.then(
          (y) => this.#promiseResolutionProcedure(promise2, y, resolve, reject),
          reject
        );
      } else {
        x.state === FULFILLED && resolve(x.value);
        x.state === REJECTED && reject(x.value);
      }
    }

    let type = typeof x;
    if ((type === "object" || type === "function") && x !== null) {
      if (typeof x.then === "function") {
        x.then(
          (y) => this.#promiseResolutionProcedure(y, resolve, reject),
          reject
        );
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  static all(promiseArray) {
    if (!Array.isArray(promiseArray)) throw new Error("输入参数必须是数组");

    return new MyPromise((resolve, reject) => {
      const resultArray = [];
      let successTimes = 0;

      function processResult(index, data) {
        resultArray[index] = data;
        successTimes++;
        if (successTimes === promiseArray.length) {
          // 处理成功
          resolve(resultArray);
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(
          (res) => {
            processResult(i, res);
          },
          (err) => {
            // 处理失败
            reject(err);
          }
        );
      }
    });
  }
}
```





