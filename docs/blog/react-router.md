# 前端路由的原理
react-router 等前端路由的原理大致相同，可以实现无刷新的条件下切换显示不同的页面。

路由本质就是页面 URL 发生改变时，页面的显示结果也根据URL的变化而变化，但是页面不会刷新。

## hash 实现前端路由
### 一、hash 的原理
早期的路由就是通过 hash 来实现的，**改变 URL 的 hash 值是不会刷新页面的**。如下面列子所示：
```js
window.location.hash = "edit";

// http://localhost:3000       改变前
// http://localhost:3000/#edit 改变后
```
当路由改变后可以用 onhashchange 事件来监听，根据变化来展示和隐藏相应的页面。
```js
function routeTo(targetName){ // 通过 location.hash 跳转
  console.log('jump to route name',targetName);
  location.hash = targetName;
}

// 获取跳转的路由
window.addEventListener("hashchange",function(event){
  console.log(event);
});

// 或者
window.onhashchange = function(event){
  console.log(event);
}
```
### 二、hash 的缺点
hash 的兼容性较好，但是也有许多缺点
- 搜索引擎对带有 hash 的页面不太友好
- 带有 hash 的页面内难以追踪用户行为

## History 实现前端路由
H5 的 History 是一个底层的接口，不继承任何的接口。History 允许我们操作浏览器会话历史记录。

### 一、History的属性和方法
History 提供一些属性和方法如下所示：

History 的属性：
- `History.length` 返回在会话历史中有多少条记录，包含了当前的会话页面。如果打开一个新的浏览器窗口，那么 length 的值为 1。
- `History.state` 保存了会发出 popState 事件的方法，所传递过来的属性对象。

History 的方法：
- `History.back()` 返回浏览器历史会话中的上一页，跟浏览器的回退功能相同。

- `History.forward()` 指向浏览器历史中的下一页，跟浏览器的前进功能相同。

- `History.go()` 可以跳转到浏览器会话历史中的某一个记录页。

- `History.pushState()` pushState 可以将给定的数据压入到浏览器会话历史栈中，该方法接收 3 个参数，对象，title 和一串 url。
pushState 后会改变当前页面的 url，但是不会伴随着刷新。

- `History.replaceState()` replaceState 将当前页面的 url 替换成指定的数据，replaceState 后会改变当前页面的 url，但是不会刷新页面。

pushState 和 replaceState 的相同点，**都会改变当前页面的 url，但是不会刷新页面**。

不同点是**pushState 是压入浏览器的会话栈中的，会使得 history.length 加 1，而 replaceState 是替换当前的这条会话历史，因此不会增加 length**。

### 二、BOM 对象的 history
history 是浏览器在 BOM 对象模型中的重要属性，history 完全继承了 History 接口，因此拥有其身上的所有属性和方法。
```js
function routeTo(targetName){
  console.log('jump to route name',targetName);
  push(targetName);
}

function push(targetName) {
  var state = {page_name: targetName};

}
```







