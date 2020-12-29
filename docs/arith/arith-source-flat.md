# JS 实现数组扁平化（flat）
## 方法一
递归处理
```js
function flat(arr){
  let result = [];
  for(let i = 0; i < arr.length; i++){
    if(Array.isArray(arr[i])){
      result = result.concat(flat(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
```

## 方法二
利用 reduce
```js
function flatten(arr){
  return arr.reduce((pre,cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  },[])
}
```
## 方法三
利用扩展运算符
```js
let arr = [1, 2, [3, 4], [5, [6, 7]]];
while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
}
console.log(flatten(arr))
```

