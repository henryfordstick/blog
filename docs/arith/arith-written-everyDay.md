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
#### 13、手写: 模拟红绿灯：红灯3s，绿灯2s，黄灯1s，如此循环 (async await)
```js
async function trafficLight(){
  let fn = async (color,wait) => {
    await new Promise((resolve, reject) => {
      console.log(new Date(),color,"亮");
      setTimeout(() => {
        console.log(new Date(),color,"灭");
        resolve();
      },wait * 1000);
    })
  }

  while (true){
    await fn("红",3);
    await fn("黄",1);
    await fn("绿",2);
  }
}

trafficLight();
```
#### 14、给你一个按升序排序的整数数组 num（可能包含重复数字），请你将它们分割成一个或多个长度为 3 的子序列，其中每个子序列都由连续整数组成。
```js
// 如果可以完成上述分割，则返回 true ；否则，返回 false 。

// 示例：

// 输入: [1,2,3,3,4,5]
// 输出: True
// 解释:
// 你可以分割出这样两个连续子序列 :
// 1, 2, 3
// 3, 4, 5

function mySplit(num){
  if(!num || !num.length || num % 3 !== 0){
    return false;
  }

  for(let i = 2; i < num.length; i ++){
    if(num[i - 1] - num[i - 2] !== num[i] - num[i - 1]){
      return false;
    }
  }
  return true;
}
```
#### 15、实现两个大数相加
```js
function add(a,b) {
  if(isNaN(a) || isNaN(b)) return "";
  a = String(a); b = String(b);
  let maxLength = Math.max(a.length,b.length);
  a = a.padStart(maxLength,0);
  b = b.padStart(maxLength,0);
  let t = 0;
  let f = 0; // 进位
  let sum = "";
  for(let i = maxLength - 1; i > 0; i --){
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(t / 10);
    sum = t % 10 + sum;
  }
  if(f > 0){
    sum = f + sum;
  }
  return sum;
}

function addBigNum(a,b){
  var res = "",loc = 0;
  a = a.slice();
  b = b.slice();
  while (a.length || b.length || loc){
    //~~把字符串转换为数字，用~~而不用parseInt，是因为~~可以将undefined转换为0，当a或b数组超限，不用再判断undefined
    //注意这里的+=，每次都加了loc本身，loc为true，相当于加1，loc为false，相当于加0
    loc += ~~a.pop() + ~~b.pop();
    //字符串连接，将个位加到res头部
    res = (loc % 10) + res;
    //当个位数和大于9，产生进位，需要往res头部继续加1，此时loc变为true，true + 任何数字，true会被转换为1
    loc = loc > 9;
  }
  return res.replace(/^0+/,'');
}
```
#### 16、实现两个大数相乘
```js
function mulBigNum(a,b){
    if(isNaN(a) || isNaN(b)) return "";
    a = String(a); b = String(b);
    let len = a.length + b.length;
    let arr = new Array(len).fill(0); //为了进行加法运算需要先初始化为0

    for(let i = a.length - 1; i >= 0; i --){
        for(let j = b.length - 1; j >= 0; j --){ //倒序，从个位开始计算
            let mul = a[i] * b[j] + arr[i + j + 1];
            arr[i + j] += Math.floor(mul / 10);
            arr[i + j + 1] = mul % 10;
        }
    }
    return (arr.join("").replace(/^0+/,"")) ; //去掉首位0
}
```
#### 17、算法： 实现一个函数，获取页面的元素个数，返回前三多的元素标签名称：如 ['div','span','li']
-  前三多改成前n多呢
-  如果元素个数重复呢 ['div','span','li','a']  div 和 span 的数量一样，那么前三多就要输出四个。
```js
function findNodeCount(n){
  let allTag = Array.from(document.getElementsByTagName("*"));
  let map = new Map();
  allTag.forEach(node => {
    let count = map.has(node.tagName) ? map.get(node.tagName) + 1 : 1;
    map.set(node.tagName,count);
  });

  let tagArr = [];
  for(let [key,val] of map.entries()){
    tagArr.push({name: key,count: val});
  }

  let sortArr = tagArr.sort((a,b) => b.count - a.count);
  let result = [];
  let num = Infinity;
  let times = 0;
  for(let i = 0; i < sortArr.length; i ++){
    let ele = sortArr[i];
    if(num === ele.count){
      result.push(ele.name);
    } else {
      num = ele.count;
      if(++ times > n){
        break;
      }
      result.push(ele.name);
    }
  }
  return result;
}
findNodeCount(3);
```

#### 18、算法: 实现一个函数 add(1)(2,3)(4).getValue()
```js
function add(){
  let sum = Array.from(arguments).reduce((a,b) => a + b);
  function fn(){
    let result = Array.from(arguments).reduce((a,b) => a + b);
    sum += result;
    return fn;
  }
  fn.getValue = function() {
    return sum;
  }
  return fn;
}
```

#### 19、实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
- 要求最大并发数 maxNum
- 每当有一个请求返回，就留下一个空位，可以增加新的请求
- 所有请求完成后，结果按照 urls 里面的顺序依次打出复制代码
```js
function multiRequest(urls = [], maxNum) {  // 请求总数量
  const len = urls.length;  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);  // 当前完成的数量
  let count = 0;
  return new Promise((resolve, reject) => {// 请求maxNum个
    while (count < maxNum) {
      next();
    }function next() {
      let current = count++;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`,
      new Date().toLocaleString());
      fetch(url)
        .then((res) => {          // 保存请求结果
          result[current] = res;
          console.log(`完成 ${current}`,
          new Date().toLocaleString());
            // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          console.log(`结束 ${current}`,
          new Date().toLocaleString());
          result[current] = err;          // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        });
    }
  });
}


async function fetchAll(urls, max) {
  // 通知结果
  let resolve = null;
  const promise = new Promise((res) => {
    resolve = res;
  });
  // 请求数量
  let count = 0;
  // 最大通道
  max = max || 6;
  // 当前为完成坐标
  let currentIndex = 0;
  // 结果数组
  let resultArr = [];
  // 占用所有的可用请求线路
  for (let i = 0; i < max; i++) {
    request(urls, currentIndex, resultArr);
    count++;
  }
  async function request(urls, index, result) {
    const timeStart = Date.now();
    console.log(`开始 ${index}`);
    currentIndex++;
    try {
      const data = await fetch(urls[index]);
      result[index] = data;
    } catch (error) {
      console.log(`第${index}个请求失败，失败日志：`, error);
      result[index] = null;
    }
    if (currentIndex < urls.length) {
      // 开始下一个
      request(urls, currentIndex, result);
    } else {
      // 最后的请求队列
      count--;
    }
    // 全部完成
    if (count <= 0) {
      resolve(result);
      console.log("全部请求结束", count);
    }
  }
  return await promise;
}
const fetch = (url) =>
  new Promise((res) => {
    setTimeout(() => {
      res({ url });
    }, Math.round(Math.random() * 200 + 500));
  });

async function init() {
  let urls = [];

  for (let i = 0; i < 10; i++) {
    urls.push(i + "-");
  }
  console.log(await fetchAll(urls, 4));
}
init();
// async 果然是一个很伟大语法
```
