# 每日一题

#### 1、多叉树广度优先遍历，实现输入一个 node，查找 node.phone === 'phone'。找到了返回 node，反之返回false。
```typescript

```
#### 2、将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
```typescript
class TreeNode {
  private val: number;
  private left: TreeNode | null;
  private right: TreeNode | null;
  constructor(
    val?:number,
    left?:TreeNode | null,
    right?:TreeNode | null
  ) {
    this.val = (val ? 0 : val);
    this.left = (left ? null : left);
    this.right = (right ? null : right);
  }
}

// 主体函数
function sortedArrayToBST(
  nums: Array<number>,
  start: number = 0,
  end: number = nums.length - 1
) {
  if(!nums.length || start > end) return null;

  const mid: number = Math.floor((start + end) / 2);

  return new TreeNode(
    nums[mid],
    sortedArrayToBST(nums,start,mid - 1),
    sortedArrayToBST(nums,mid + 1, end)
  )
}
```
#### 3、给定一个数组，最终返回一个二维数组，每个小数组由3个和为 0 的元素组成。全罗列。
> 如 [1, 0, -1, 1, 2, -1, -4]
>
> 返回 [[-1,0,1], [-1, -1, 2]]
```typescript

```

#### 4、生成一个链表，保存100个随机生成的整数，整数不分正负。

#### 5、请实现一个cacheRequest方法，保证发出多次同一个ajax请求时都能拿到数据，而实际上只发出一次请求。
```javascript
const request = (url,option) => new Promise(res => {
  setTimeout(() => { // 用来代替请求的
    res({data:option})
  })
});

const cache = new Map(); // 用来判断是否同一个请求
const cacheRequest = (url,option) => { // 请求的更多参数可用option传入，如method,
  let key = `${url}:${option.method}`;
  if(cache.get(key)){
    if(cache.get(key).status === "pending"){
      return cache.get(key).myWait;
    }
    return Promise.resolve(cache.get(key).data); // 有则返回请求数据，无则发起请求
  } else {
    let requestApi = request(url,option);
    cache.set(key,{status: "pending",myWait: requestApi});
    return requestApi.then(res => {
      cache.set(key,{status: "success",data: res});
      return Promise.resolve(res);
    }).catch(err => {
      cache.set(key,{status: "fail", data: err});
      Promise.reject(err);
    })
  }
};

cacheRequest('ur1').then(res => console.log(res));
cacheRequest('ur1').then(res => console.log(res));

setTimeout(() => {
  cacheRequest('ur1').then(res => console.log(res));
},2000)
```
#### 6、给定二叉搜索树（BST）的根节点和要插入树中的值，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据保证，新值和原始二叉搜索树中的任意节点值都不同。
注意，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回任意有效的结果。
例如
给定二叉搜索树:
```
     4
    / \
   2   7
  / \
 1   3
```

 和 插入的值: 5
 你可以返回这个二叉搜索树:
 ```
      4
    /   \
   2     7
  / \   /
 1   3 5
或者
      5
    /   \
   2     7
  / \
 1   3
      \
       4
```
```js
// 创建二叉树
function TreeNode(val){
  this.val = val;
  this.left = null;
  this.right = null;
}

function insertTreeNode(root,target) {
  if(!root){
    return new TreeNode(target);
  }
  if(target < root.val && !root.left){
    root.left = new TreeNode(target);
  } else if(target > root.val && !root.right){
    root.right = new TreeNode(target);
  } else if(target < root.val){
    root.left = insertTreeNode(root.left);
  } else {
    root.right = insertTreeNode(root.right)
  }
  return root;
}
```
#### 7、Semantic Versioning 是一个前端通用的版本规范。格式为“{MAJOR}.{MINOR}.{PATCH}-{alpha|beta|rc}.{number}”，要求实现 compare(a, b) 方法，比较 a, b 两个版本大小。
```js
function compare(a,b){
  // 0 表示 等于， 1 表示大于， -1 表示小于
  let res = 0;
  let obj = {
    alpha: 1,
    beta: 2,
    rc: 3
  };
  const transfromToArray = (str) => {
    return str.split('.').map(item => {
      return obj[item] ? obj[item] : Number(item);
    })
  };

  const aToArray = transfromToArray(a);
  const bToArray = transfromToArray(b);
  while (aToArray.length){
    let aNum = aToArray.shift();
    let bNum = bToArray.shift();
    if(aNum !== bNum){
      res = aNum > bNum ? 1 : -1;
      break;
    }
  }
  return res;
}
console.log(compare('1.0.0.alpha.1','1.0.0.alpha.1')); // 0
console.log(compare('2.0.0.alpha.1','1.0.0.alpha.1')); // 1
console.log(compare('1.0.0.alpha.1','1.0.0.beta.2'));  // -1
```
#### 8、实现一个请求函数 function ajax (url, wait, count)，在 wait 时间内无结果则进行重试，最多重试 count 次。要求不可使用 xhr 的 timeout 属性。如果 wait 的时间要尽可能排除掉 xhr pending 的时间可以怎么做？
#### 9、实现一个 LRUCache 的类。
#### 10、基于promise实现高级API的polyfill
#### 11、六种常见设计模式，手写简单demo
#### 12、用Object实现一个迭代器
```js
function createIterator(obj){
  let i = 0;
  let keys = Object.keys(obj);
  let len = keys.length;
  return {
    next(){
      return {
        done: i >= len,
        value: obj[keys[i ++]]
      }
    }
  }
}
```
