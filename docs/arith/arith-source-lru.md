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
### 一、哈希版
```js
class LRUCache {
  constructor(capacity) {
    this.max = capacity;
    this.cache = new Map();
  }

  get(key){
    if(!this.cache.has(key)){
      return -1;
    }
    let value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key,value);
    return value;
  }

  put(key,value){
    if(this.cache.has(key)){
      this.cache.delete(key);
    }
    this.cache.set(key,value);
    if(this.cache.size > this.max){
      let keys = this.cache.keys();
      this.cache.delete(keys.next().value);
    }
  }
}
```
### 二、哈希 + 双向链表
```js
// 思路，map加双向链表
class ListNode {
    constructor(key, value) {
        this.key = key; // 用于存放key，以便于后面在cache中删除
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        // 空头节点和空尾节点方便操作
        this.dummyHead = new ListNode(-1, -1);
        this.dummyTail = new ListNode(-1, -1);
        this.dummyHead.next = this.dummyTail;
        this.dummyTail.prev = this.dummyHead;
    }
    get(key) {
        if(!this.cache.has(key)) {
            return -1;
        }
        const node = this.cache.get(key);
        this._move2head(node); // 移到头部
        return node.value;
    }
    put(key, value) {
        if(this.cache.has(key)) { // 存在
            const node = this.cache.get(key);
            node.value = value; // 更新值
            this._move2head(node);
        } else { // 不存在
            if(this.cache.size === this.capacity) { // 满了
                const removedNode = this.dummyTail.prev; // 移除最后一个
                this._removeNode(removedNode);
                this.cache.delete(removedNode.key);
            }
            const newNode = new ListNode(key, value);
            this.cache.set(key, newNode);
            this._addHead(newNode);
        }
    }
    _addHead(node) {
        node.next = this.dummyHead.next;
        this.dummyHead.next.prev = node;
        this.dummyHead.next = node;
        node.prev = this.dummyHead;
    }
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    _move2head(node) {
        this._removeNode(node);
        this._addHead(node);
    }
}
```
