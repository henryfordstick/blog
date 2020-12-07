# 实现一个 sleep 函数

```js
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function test() {
  console.log('hello');
  await sleep(1000);
  console.log('world');
}
test();
```
