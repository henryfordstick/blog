# 快排和二分查找

## 快速排序
```js
function quickSort(arr){
  if(!Array.isArray(arr) || arr.length < 2) return arr;
  let big = [];
  let small = [];
  let refer = arr[0];

  for(let i = 1; i < arr.length; i++){
    if(arr[i] < refer){
      small.push(arr[i]);
    } else {
      big.push(arr[i])
    }
  }
  return quickSort(small).concat(refer,quickSort(big));
}
```

## 二分查找
```js
function binarySearch(arr,data){
  let first = 0;
  let last = arr.length - 1;
  while(first <= last){
    let mid = (first + last) >> 1;
    if(arr[mid] < data){
      first = mid + 1;
    } else if(arr[mid] > data){
      last = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
```
