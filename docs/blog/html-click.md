# 点击一个按钮，浏览器做了什么
JS 和 HTML 之间的交互是通过**事件**实现的。所谓的事件就是 文档 或者 浏览器窗口发生的一些特定的交互瞬间。可以使用
**监听器**来预定事件，以便事件发生时执行相应的代码。通俗来说这种模型就是**观察者模型**。

## 一、首先浏览器怎么处理事件的
- 点击按钮后创建一个 Event 实例
- 然后把事件放到事件队列中，让它等待处理
- EventLoop 循环线程处理这个事件
- 沿着 DOM 路径找到触发事件的元素
- 如果这个元素上有处理这个事件的默认行为，并且要在 DOM 事件处理阶段周期之前执行，就执行它的默认行为。
- 捕获阶段
- 目标阶段
- 冒泡阶段
- 如果这个元素上有处理这个事件的默认行为，并且要在 DOM 事件处理阶段周期之后执行，就执行它的默认行为。

### 1、 事件对象 Event
Event 代表事件的状态，比如事件在其中发生的元素，键盘按键的状态，鼠标的状态，鼠标按钮的状态。

当用户点击某个元素的时候，我们给这个元素注册的事件就会触发，改事件的本质就是一个函数，该函数的形参接受一个 event 对象。
事件通常与函数结合使用，函数不会在事件发生前被执行。
```js
var oDIv = document.getElementById('box');

oDiv.onclick = function(event){
    .........
}
```
### 2、事件流
一个完整的事件系统，通常存在三大角色：
- **事件对象**：用于存储事件的状态
- **事件源对象**：当前事件在操作的对象，如元素节点，文档对象，window对象，XMLHttpRequest对象等。
- **事件监听器**: 当一个事件源生成一个事件对象时，它会调用相应的回调函数进行操作。
#### 2.1 事件捕获（由上往下）
事件捕获用于事件到达预定目标前捕获它。事件将沿着DOM树向下转送，目标节点的每一个祖先节点，直至目标节点。在此过程中，浏览器都会检测针对该事件的捕捉事件监听器，并且运行这件事件监听器。

![事件捕获](/images/5376626-280f5a88570ba54b.png)

#### 2.2 目标阶段
浏览器在查找到已经指定给目标事件的事件监听器之后，就会运行 该事件监听器。目标节点就是触发事件的DOM节点。

#### 2.2 事件冒泡（由下往上）
事件将沿着DOM树向上转送，再次逐个访问目标元素的祖先节点到document节点。该过程中的每一步。浏览器都将检测那些不是捕捉事件监听器的事件监听器，并执行它们。
![事件冒泡](/images/5376626-a069d3cd497c4b10.png)
:::warning 所有事件都要冒泡吗
**所有的事件都要经过捕捉阶段和目标阶段，但是有些事件会跳过冒泡阶段。**
:::

### 3、DOM标准的事件模型
DOM标准同时支持两种事件模型，即捕获型事件与冒泡型事件，但是，捕获型事件先发生。
![事件模型](/images/1225373-21d8b29bb5a5934c.webp)

## 二、一个有趣的例子
上面介绍了浏览器处理事件的整个过程，下面通过一段代码检验一下吧。
```html
<div id="a">
  <div id="b">
    <div id="c"></div>
  </div>
</div>
```
```css
#a{
  width: 300px;
  height: 300px;
  background: pink;
}
#b{
  width: 200px;
  height: 200px;
  background: blue;
}
#c{
  width: 100px;
  height: 100px;
  background: yellow;
}
```
```js
var a = document.getElementById("a"),
    b = document.getElementById("b"),
    c = document.getElementById("c");

c.addEventListener("click",function(event){
  console.log("c1");
});
c.addEventListener("click",function(event){
  console.log("c2");
},true);
b.addEventListener("click",function(event){
  console.log("c1");
},true);
a.addEventListener("click",function(event){
  console.log("a1");
},true);
a.addEventListener("click",function(event){
  console.log("a2");
});
a.addEventListener("click",function(event){
  console.log("a3");
  event.stopImmediatePropagation();

},true);
a.addEventListener("click",function(event){
  console.log("a4");
},true);
```
:::tip addEventListener 和 onclick 区别
- addEventListener 是 DOM 中提供注册事件监听的方法。（添加事件句柄的）
    - 允许给一个事件注册多个监听器
    - 提供一种更精细的手段控制事件监听器的触发阶段
    - 对任何 DOM 元素都有效，不仅仅是 HTML 元素有效。
- addEventListener 提供三个参数，第一个事件句柄，第二个监听的事件，第三个 捕获(true) 冒泡(false 默认)
- onclick 点击事件，多个相同事件后面会覆盖前面的
:::

:::tip stopImmediatePropagation 和 stopPropagation 的区别
stopImmediatePropagation 包含了 stopPropagation 的功能。
- stopImmediatePropagation 可以阻止事件传播，即捕获 或 冒泡。
- stopPropagation 只阻止冒泡
:::

整个结构如下图，从外到内分别是 a -> b -> c：

![布局的结果](/images/5376626-03717ba785e644ea.png)

### 1、点击 c 或者 b 的打印结果
#### 结果
a1 a3
#### 解析
stopImmediatePropagation 能阻止事件捕获，所以不输出 a4，同时拦截了 b 和 c 元素的事件。

### 2、点击 a，输出什么
#### 结果
a1 a2 a3
#### 解析
不应该是 a1 a3 a2 吗？以为 a1 a3 是在捕获阶段调用的， a2 是在冒泡阶段调用的。这样理解是不正确的！

虽然三个处理程序在注册时都指定了 true 和 false。但是现在处于目标阶段，不是 冒泡，也不是捕获。**事件调用的顺序是注册时的顺序**

### 3、注释掉 event.stopImmediatePropagation，点击 c，输出什么
#### 结果
a1 a3 a4 b c1 c2 a2
#### 解析
这个就是完整的 事件捕获 -> 目标阶段 -> 事件冒泡 的流程。


