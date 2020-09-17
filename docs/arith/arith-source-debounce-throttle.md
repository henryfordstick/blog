# 防抖（debounce)和节流（throttle）
### 1、防抖
在触发事件后n秒才会执行，如果n秒内事件又被触发，则重新计时

##### 案例

- 搜索联想词功能（连续输入，只请求最后一次的结果）。

- resize、scroll、mousemove 等等，但有些时候我们并不希望在事件持续触发的过程中那么频繁地去执行函数。

##### 非立即执行版
非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
```typescript
const debounce = (
  fn:(unknown) => unknown,
  delay: number = 1000
) => {
  let timer = null;
  return (...args:[]):void => {
    if(timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this,args);
    },delay);
  }
}
```

##### 立即执行版
立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
```typescript
const debounce = (
  fn: (unknown) => unknown,
  delay: number = 1000
) => {
  let timer = null;
  
  return (...args:[]):void => {
    if(timer) clearTimeout(timer);
    let callNow:boolean = !timer;

    timer = setTimeout(() => {
      timer = null;
    },delay);
    if(callNow) fn.apply(this,args);
  }
}
```
##### 结合两种写法
```typescript
const debounce = (
  fn:(unknown) => unknown,
  delay: number = 1000,
  immediate?: boolean 
) => {
  let timer = null;
  
  return (...args):void => {
    if(timer) clearTimeout(timer);
    
    if(immediate){
      let callNow:boolean = !timer;
      
      timer = setTimeout(() => {
        timer = null;
      },delay);
      if(callNow) fn.apply(this,args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this,args);
      },delay);
    }
  }
}
```
### 2、节流
所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。
##### 案例
- 鼠标不断点击触发，mousedown(单位时间内只触发一次)

- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
##### 时间戳
```typescript
const throttle = (
  fn:(unknown) => unknown,
  wait: number = 1000
) => {
  let prev = Date.now();
  return (...args:[]):void => {
    let now = Date.now();
    if(now - prev >= wait){
      fn.apply(this,args);
      prev = Date.now();
    }
  }
}
```
##### 定时器
```typescript
const throttle = (
  fn:(unknown) => unknown,
  wait: number = 1000
) => {
  let timer = null;
  return (...args:[]) => {
    if(!timer){
      timer = setTimeout(() => {
        fn.apply(this,args);
        timer = null;
      },wait);
    }
  }
}
```
##### 结合两种写法
```typescript
const throttle = (
  fn: (unknown) => unknown,
  wait: number = 1000,
  type?: boolean
) => {
  let timer,prev;
  if(type){
    timer = null;
  } else {
    prev = Date.now();
  }
  
  return (...args) => {
    if(type){
      timer = setTimeout(() => {
        fn.apply(this,args);
        timer = null
      },wait);
    } else {
      let now = Date.now();
      if(now - prev >= wait){
        fn.apply(this,args);
        prev = Date.now();
      }
    }
  }
}
```




