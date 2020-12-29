# LRU 缓存算法
LRU 是常见的页面置换算法，在计算中，所有的文件操作都要放到内存里面，然而计算机内存大小是固定的，所以我们不能把所有的文件都加载到内存。
因此我们需要制定一种策略对加入到内存中的文件进项选择。

## LRU 原理
当数据在最近一段时间经常被访问，那么它在以后也会经常被访问。所以经常访问的数据需要快速命中，而不常访问的数据在容量超出的限制内，将其淘汰。
- 每次访问的数据都会放在栈顶
- 当访问的数据不在内存中，且栈内数据存储满了
- 我们就要移除栈底的元素
- 因为栈底部的数据访问频率是比较低的，所以要将其淘汰

## LRU 实现
```js
class LRUCache {
  constructor(capacity) {
    this.max = capacity;
    this.cache = new Map();
  }

  get(key){
    let flag = this.cache.has(key);
    if(flag){
      let value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key,value);
    }
    return flag ? this.cache.get(key) : -1;
  }

  put(key,value){
    let size = this.cache.size;
    let max = this.max;
    if(this.cache.has(key)){
      this.cache.delete(key);
    }
    this.cache.set(key,value);
    while(size > max){
      this.cache.delete(this.cache.keys().next().value);
    }
  }

}
```
