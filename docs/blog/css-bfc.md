# BFC 布局
在触及 BFC 问题后上被面试官一顿雷霆爆锤加蹂躏之后，我才意识到自己的浅薄，管中窥豹。所以今天重新认识 BFC，彻底搞懂 BFC。

## 一、常见的定位方案
### 普通流
- 元素按照其在 html 中的先后位置自上而下布局；
- 行内元素水平排列，直到当行被占满然后换行，块级元素则会被渲染成一个完整的新行。
- 所有元素都默认为普通流定位。

### 浮动
- 元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或者右边偏移。
### 绝对定位
- 元素会整体脱离普通流，因此绝对定位元素不会对其兄弟元素造成影响。

## 二、普通流的一些特点
普通流布局时常常遇到一些问题。
```html
<!--<div class="box"></div>-->
<div class="container">
  <div class="a1"></div>
  <div class="a2"></div>
</div>
<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: content-box;
}
.a1{
  width: 100px;
  height: 100px;
  padding: 20px;
  margin: 20px;
  border: 1px solid #000;
}
.a2{
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  padding: 20px;
  margin: 20px;
  border: 1px solid #000;
}
</style>
<!--1、a1,a2 的实际宽高是多少-->
<!--2、container 的实际宽高是多少-->
```
两个问题，第一个问 a1,a2 的实际宽高是多少，第二个父级元素 container 的实际宽高是多少？

这个问题之下，首先我们回答第一问。这个题考查的是 盒模型 content-box 和 border-box 的相关知识点。
:::tip 标准盒模型 和 怪异盒模型
- **标准盒模型（content-box）** 是 W3C 标准。此时 css 定义的宽度只包含元素的 content 宽度，即`总宽度 = width + padding(左右) + border（左右）`。
- **怪异盒模型（border-box）** 解释的与 IE6 之前的版本相同。这个时候定义的宽度是包含元素的 content 宽度 + padding (左右)宽度 + border(左右)宽度。
即`总宽度 = width`。
:::
那么就可以清晰的得出，a1 的实际宽高是`100 + 2 * 20 + 2 * 2 = 142px`，a2 的实际宽高是`100px`。

那么第二个父级元素 container 的实际宽高是多少呢？这个问题就问到基本了，首先要明确一点**container 不是 BFC**。那么接下来有三个引申的问题：
> 1、container 的宽高包含 a1 的 上边距和 a2 的下边距吗？
>
> 2、假如我们在 container 元素上边再加一个元素 box-top，那么此时 container 距离 box-top 的距离是多少？
>
> 3、那么我给 container 元素设置 margin: 10px，那么现在距离 box-top 的距离是多少？

接下来用实际证明一下：
![css普通流](/images/css普通流.jpg)
实际的情况是 container 目前不包括 a1 和 a2 的下边距，实际高度是 `142 + 20 + 100 = 262px`，即上图的红色色块。
![css普通流](/images/css普通流1.jpg)
这里就出问题了，虽然 a1,a2 的外边距没有计算在 container 的大小内，但是却影响了 container 和其他元素的距离。
![css普通流](/images/css普通流2.jpg)
如果给 container 元素设置 margin:10px 也没有阻止 a1 和 a2 外边距的影响。这里 container 距离 box-top 是 20px。

下面总结一下普通流存在的问题：
1. 父元素的大小不计算子元素的 外边距（margin）。
2. 两个子元素的上下 margin 会重叠。
3. 子元素的 外边距 会影响 父元素和其他元素的距离。

鉴于上面普通流对布局的影响，那么 "救世主" BFC 来了，下面我们具体看看 BFC。

## 三、BFC 的作用
BFC（块级格式化上下文 - Block formatting context）是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个 BFC 中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。

### BFC 的布局规则
- 内部的 Box 会在垂直方向一个接一个的放置
- 属于同一个 BFC 的两个相邻 box 的 margin 会重叠
- 是页面上一个隔离的独立容器，里面的元素不会影响到外面的元素，反之亦然。
- BFC 的区域不会和 float box 重叠
- 计算 BFC 的高度，浮动元素也参与计算。
### 触发条件
1. 根元素（html）
2. 浮动元素（元素的 float 不为 none）
3. 定位元素 （元素的 position 属性为 relative 或 absolute）
4. display 的值为 inline-block,table-cell,table,table-caption
5. overflow 值不为 visible

### 应用场景
#### 1、清除内部的浮动，触发父元素的 BFC 属性，会包括 float 元素
防止浮动导致父元素高度塌陷，父级设置为 BFC。

<img src="/images/css-float-height.jpg" width="45%" style="margin-right: 10px" />

解决浮动还有下面几种办法
- 让父元素也浮动起来
- 给父元素添加一个固定高度
- 在浮动元素后面增加一个空元素（伪元素也行），设置 clear: both

#### 2、分属于不同的 BFC，可以阻止 margin 重叠
避免 margin 重叠，两个块相邻就会调至外边距被折叠，方法就是给某个元素套个父元素，且设置为 BFC。
#### 3、阻止元素被浮动元素覆盖，各自是独立的渲染区域
正常的话，左边浮动，右边就会被浮动元素遮盖，现在把右边元素设置为 BFC，这样两个元素就隔离开了
<img src="/images/css-float.jpg" width="45%" style="margin-right: 10px" />
<img src="/images/css-float-bfc.jpg" width="45%"/>
#### 4、自适应两栏布局
实际上自适应两栏布局 上面第 3 种应用场景也算是一种解决方案。

还有其他的办法如：
- 左边左浮动，右边设置 margin-left
![两栏布局](/images/css两栏布局1.jpg)
- 左边绝对定位，右边设置 margin-left
![两栏布局](/images/css两栏布局2.jpg)
- 左侧为绝对定位，右侧元素设置顶线和右线的位置为 0，width 为 100%
![两栏布局](/images/css两栏布局3.jpg)











