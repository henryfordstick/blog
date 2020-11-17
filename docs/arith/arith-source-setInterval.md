# 实现setInterval函数
使用 setTimeout 模拟 setInterval 函数，可避免setInterval因执行时间导致的间隔执行时间不一致。

```javascript
const mySetInterval = (fn,time) => {
  setTimeout(function() {
    fn();
    setTimeout(arguments.callee,time);
  },time);
};
```
