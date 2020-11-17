# JS 数组去重
## 一、利用 ES6 的方法去重（ES6 中常用）
```javascript
function unique(arr){
  return [...new Set(arr)];
}

function unique1(arr){
  return Array.from(new Set(arr))
}
```
## 二、利用 for 嵌套 for，然后 splice 去重
```javascript
function unique(arr){
  for(var i = 0; i < arr.length; i++){
    for(var j = i + 1; j < arr.length; j ++){
      if(arr[j] === arr[i]){
        arr.splice(j,1);
        j --;
      }
    }
  }
  return arr;
}
```

## 三、利用 indexOf 去重
```javascript
function unique(arr){
  if(!Array.isArray(arr)){
    console.log('error');
    return;
  }
  var array = [];
  for (var i = 0; i < arr.length; i ++){
    if(array.indexOf(arr[i]) === -1){
      array.push(arr[i]);
    }
  }
}
```

## 四、利用 sort()
```javascript
function unique(arr) {
  arr = arr.sort();
  var array = [arr[0]];
  for(var i = 0; i < arr.length; i ++){
    if(arr[i] !== arr[i - 1]){
      array.push(arr[i])
    }
  }
}
```




