# 排序算法
十大排序算法总结对比：
![十大算法列表图](/images/算法列表.png)
**n**: 数据规模
**k**:“桶”的个数
**In-place**: 占用常数内存，不占用额外内存
**Out-place**: 占用额外内存
**稳定性**：排序后2个相等键值的顺序和排序之前它们的顺序相同

## 一、冒泡排序 (Bubble sort)
冒泡排序(Bubble Sort)是排序算法里面比较简单的排序。它重复地走访要排序的数列，一次比较两个数据元素，如果顺序不对则进行交换，并且一直重复这样的走访操作，直到没有要交换的数据元素为止。
**什么时候最快**
当输入元素为正序的时候。
**什么时候最慢**
当输入的数据是反序的时候。
![冒泡排序图](/images/冒泡排序.gif)
```javascript
/**
 * 冒泡排序
 * @param arr Array 需要排序的数组
 */
function bubbleSort(arr){
  if(!Array.isArray(arr) || arr.length < 1) return arr;

  const len = arr.length;

  for(let i = len - 1; i > 0; i --){
    for(let j = len - 1; j > len - 1 - i; j --){
      if(arr[j] < arr[j - 1]){
        [arr[j - 1],arr[j]] = [arr[j],arr[j - 1]];
      }
    }
  }
  return arr;
}

// TODO 存在尾冒泡和首冒泡，优化程序 可以同时尾冒泡和首冒泡
```
## 二、选择排序
从数组的开头开始，将第一个元素和其他元素比较。最小的元素会被放到数组第一个位置，再从第二个位置继续。
![选择排序图](/images/选择排序.gif)

```javascript
/**
 * 选择排序
 * @param arr Array 需要排序的数组
 */
function selectSort(arr){
  if(!Array.isArray(arr) || arr.length < 1) return arr;

  const len = arr.length;
  for(let i = 0; i < len - 1; i++){
    let min = i;
    for(let j = i + 1; j < len; j ++){
      if(arr[i] > arr [j]){
        min = j;
      }
    }
    if(min !== i){
      [arr[i],arr[min]] = [arr[min],arr[i]];
    }
  }
  return arr;
}
```
## 三、插入排序
插入排序分为两种，一种是直接插入排序，一种是二分法插入排序。这两种排序实际上都是插入排序，唯一的不同就是插入的方式不一样。

插入排序就是往数列里面插入数据元素。一般我们认为插入排序就是往一个已经排好顺序的待排序的数列中插入一个数之后，数列依然有序。

二分插入排序应该也是用来分治法的思想去排序的。实际上二分就是使用二分查找来找到这个插入的位置，剩下的插入的思想其实和直接插入排序一样。

所以完成插入排序，就是需要找到这个待插入元素的位置。

类似于人们按数字或字母顺序对数据进行排序，后面要为前面的腾位置

​![插入排序图](/images/插入排序.gif)
```javascript
/**
 * 插入排序
 * @param arr Array 需要排序的数组
 */
function insertSort(arr){
  if(!Array.isArray(arr) || arr.length < 1) return arr;
  const len = arr.length;

  for(let i = 0; i < len; i++){
    for(let j = i; j > 0 && arr[j] < arr[j - 1]; j --){
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
    }
  }
  return arr;
}
```
插入排序是稳定的排序，处理小规模数据或者基本有序数据时，十分高效。

## 四、希尔排序
它会首先比较较远的元素，而非非0元素。让元素尽快回到正确的位置。通过定义一个间隔序列来表示在排序过程中进行比较的元素间隔，公开的间隔序列是701，301，132，57，23，10，4，1（质数）
​![希尔排序图](/images/希尔排序.gif)
​![希尔排序图](/images/希尔排序过程.png)

```javascript
/**
 * 希尔排序
 * @param arr Array 需要排序的数组
 */
function shellSort(arr){
  if(!Array.isArray(arr) || arr.length < 1) return arr;
  const len = arr.length;
  // 定义间隔序列，这里写死了，可以动态定义
  const gaps = [5, 3, 1];

  for(let index = 0; index < gaps.length; index ++ ){
    const order = gaps[index];
    for(let i = order; i < len; i++){
      // 检查的数字
      let temp = arr[i];
      for(let j = i - order; j >= 0 && arr[j] > temp; j -=gaps){
        [arr[j], arr[j + order]] = [arr[j + order], arr[j]];
      }
    }
    console.log("调换后",arr);
  }

  return arr;
}
```
## 五、归并排序
把一系列排好序的子序列合并成一个大的完整的有序序列
​![归并排序图](/images/归并排序.gif)
```javascript

//归并排序算法
function mergeSort(arr){
  const temp = [...arr];
  splitSort(temp,0,temp.length - 1);
  return temp;
}

// 将大数组拆分成两个小数组
function splitSort(temp,start,end){
  if(start < end){
    let mid = Math.floor((start + end) / 2);
    splitSort(temp,start,mid);
    splitSort(temp,mid + 1,end);
    mergeArray(temp,start,mid,end);
  }
}

// 合并两个排序好的数组
function mergeArray(temp,start,mid,end){
  let i = start; // 起始位置
  let j = mid + 1; // 中间起始位置
  let k = 0; // 输入序号
  let arr = []; // 待输入值的新数组
  while(i <= mid && j <= end){
    if(temp[i] <= temp[j]){
      arr[k] = temp[i];
      i ++;
    } else {
      arr[k] = temp[j];
      j ++;
    }
    k ++;
  }

  while(i <= mid){
    arr[k] = temp[i];
    i ++;
    k ++;
  }

  while(j <= end){
    arr[k] = temp[j];
    j ++;
    k ++;
  }

  for(let index = 0; index < k; index ++){
    temp[index + start] = arr[index];
  }
}
```
## 六、快速排序
在列表中选择一个元素作为基准值，排序围绕这个基准值进行，将列表中小于基准值的放入数组底部，大于的放入数组顶部。
​![快速排序图](/images/快速排序.gif)
```javascript
/**
 * 快速排序
 * @param arr Array 需要排序的数组
 */
function quickSort(arr){
	if(!Array.isArray(arr) || arr.length < 1) return arr;
  const len = arr.length;
  let pivot = arr[0]; // 定义第一个值为基准值
  let small = [];
  let big = [];
  for(let i = 1; i < arr.length; i++){
    if(pivot < arr[i]){
      big.push(arr[i]);
    } else {
      small.push(arr[i]);
    }
  }

  return quickSort(small).concat(pivot,quickSort(big));
}
```

#### 七、堆排序

堆排序是利用**堆**这种数据结构而设计的一种排序算法，堆排序是一种选择排序，它的最坏，最好，平均时间复杂度均为 O(nlogn)，它也是不稳定排序。
​![堆排序图](/images/堆排序.gif)

```javascript
/**
 * 堆排序
 * @param arr Array 需要排序的数组
 */

```

#### 八、计数排序
​![计数排序图](/images/计数排序.gif)

```javascript
/**
 * 计数排序
 * @param arr Array 需要排序的数组
 */
```

#### 九、桶排序
桶排序，也叫做箱排序，是一个排序算法，也是所有算法中最快、最简单的排序算法。其中的思想是我们首先需要知道所有待排序元素的范围，然后需要有在这个范围内的同样数量的桶，接着把元素放入对应的桶中，最后按顺序输出。
​![桶排序图](/images/桶排序.gif)

```javascript

function bucketSort(arr){

}
```

#### 十、基数排序
​![基数排序图](/images/基数排序.gif)
