# 算法问题
### 1、两个栈实现一个队列
```js
class Queue{
  constructor() {
    this.Stack1 = [];
    this.Stack2 = [];
  }

  push(val){
    this.Stack1.push(val);
  }

  pop(){
    if(!this.Stack2.length){
      while (this.Stack1.length){
        this.Stack2.push(this.Stack1.pop());
      }
    }
    return this.Stack2.length ? this.Stack2.pop() : -1;
  }
}
```
### 2、说说常见的排序算法
[排序算法](/arith/arith-sorting.html)
### 3、实现一个  calc  方法，可以将输入的数拆解为尽可能多的乘数，所有数相乘等于输入数。
```js
/**

 * @param {number} n 乘积

 * @return {Array} 拆解后的乘数

 */
function calc(n) {
  // TODO
  // 1、n >> 1
  // 2、遍历 ++  判断 除得结果 是整数，添加到数组， // res 承接
  if(n == 2) return [2];
  let res = [],fls = n,i = 2;
  let mid = n >> 1;
  while(i <= mid){
    if(fls % i === 0){
      fls = fls / i;
      res.push(i);
    } else {
      i ++;
    }
  }
  return res;
}

// console.log(calc(2));
// [2]

console.log(calc(8));
// [2, 2, 2]

// console.log(calc(24));

// [2, 2, 2, 3]

// console.log(calc(30));
// [2, 3, 5]
```
### 4、输出数组（json）中某些元素相加以后的和等于目标值（num）的所有组合

### 5、反转链表： 1 -> 2 -> 3 -> 4 -> 5 -> null    2 -> 1 -> 4 -> 3 -> 5 -> null
### 6、给一个小数，怎么四舍五入保留其中一位小数呢？
### 7、算法
```js
var tmpl = `
  name is {obj.a}
  age is {obj.b.c}
  address is {obj.c.d}
  phone is {obj2.a}
`;

var data = {
	obj: {
	  a: 1,
	  b: {c:  {d:2}},
	  c: false
	}
}

//根据上面给出的数据写出一个函数 render 返回的结果为：
//"
//  name is 1              // 基本类型返回，，没有找到就返回字符串
//	age is {"d":2}         // 对象类型直接JSON.stringify处理
//	address is obj.c.d     // 没有找到就直接拼接字符串
//	phone is obj2.a
//"

function render(tmpl,data){
	// TODO...
}
```

### 8、假如有10筐苹果，9筐10斤，1筐9斤，一个可以秤无限重量的秤，在没有明显特征下怎么快速找到 9斤的那一筐，如果只允许秤一次呢？
### 9、斐波那契数列
```js
function fib(n){
  if(n < 2) return n;
  let arr = [0,1];
  for(let i = 2; i <= n; i ++){
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr[n];
}
```
### 10、手写快排，利用 非递归 的方式
```js
// 递归
function quickSort(arr){
  if(!arr.length) return arr;
  let big = []; let small = [];
  let refer = arr[0];
  for(let i = 0; i < arr.length; i ++){
    if(arr[i] < refer){
      small.push(arr[i]);
    } else {
      big.push(arr[i]);
    }
  }
  return quickSort(small).concat(refer,quickSort(big));
}
```
### 11、算法中稳定排序和 不稳定排序
[排序算法](/arith/arith-sorting.html)
### 12、abacba 转成 aaa,bb,c

### 13、输入 1234，反转
### 14、一个有序数组，怎么去除偶数
### 15、写出求二叉树的深度
### 16、实现 allKeys
```js
const obj = {
  a: '12',
  b: '23',
  first:{
  	c: '34',
    d: '45,
    second: {e: '56',f:'57',three: {g: '78',h:'89',i:'90'}}
  }
}
console.log(obj.allKeys())
// => [a,b,c,d,e,f,g,h,i]
```

### 17、算法： 实现一个函数，获取页面的元素个数，返回前三多的元素标签名称：如 ['div','span','li']
- ① 前三多改成前n多呢
- ② 如果元素个数重复呢 ['div','span','li','a']  div 和 span 的数量一样，那么前三多就要输出四个。
### 18、手写给个xiaotuofeng-mingming-shezhi改成驼峰式xiaotuofengMingmingShezhi
### 19、手写大数相乘
```js
function mulBigNumber(a,b){
  if(!isNaN(a) || !isNaN(b)) return "";
  a = String(a); b = String(b);
  let maxLen = a.length + b.length;
  let arr = new Array(maxLen);
  for(let i = a.length - 1; i >= 0; i --){
    for(let j = b.length - 1; j >= 0; j --){
      let mul = a[i] * b[i] + arr[i + j + 1];
      arr[i + j] += Math.floor(mul / 10);
      arr[i + j + 1] += mul % 10;
    }
  }
  return arr.join("").replace(/^0+/,"");
}
```
### 20、手写大数相加
### 21、爬楼梯
### 22、手写 ： 批量请求函数，最大并发数maxNum，multiRequest(promises,maxNum)，所有请求完成后，结果按照urls里面的顺序依次打出
### 23、手写一个截取url参数然后生成map关系映射的函数
### 24、手写: 模拟红绿灯：红灯3s，绿灯2s，黄灯1s，如此循环 (async await)
### 25、二分查找
```js
function binarySearch(arr,target) {
  if(!Array.isArray(arr) || !arr.length) return arr;
  let start = 0,end = arr.length - 1;
  while (start <= end){
    let mid = (start + end) >> 1;
    if(arr[mid] < target){
      end = mid - 1;
    } else if(arr[mid] > target){
      start = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}
```
### 26、合并区间
### 27、aaabbaa -> 3a2b2a
### 28、反转二叉树
