# CSS 面试题总结
## 一、基础问题
### 1、css中选择器的优先级，说说常用的选择器
- 通配符（*）
- 元素选择器（div / p）
    - 关系选择器(**父元素 > 子元素** | 祖先 后代 | 前一个 + 后一个 | 兄 ~ 弟)
    - 伪元素选择器（::before  ::after ::first-line 元素第一行）
- 类选择器
    - 属性选择器
    - 伪类选择器  （nth-child | first-child | last-child）

- ID 选择器
- 内联样式
- !important

关于伪类和伪元素的区别   （是否创造了新元素）
- 伪类选择器 和DOM中的元素样式不一样，它并不改变任何DOM内容
- 伪元素选择器 逻辑上存在但在文档树中却无须标识的“幽灵”分类。
![伪类和伪元素](/images/687953-20151201014246499-443921388.jpg)
### 2、盒模型（普通盒模型和怪异盒模型）
[盒模型](/blog/css-bfc.html#二、普通流的一些特点)
### 3、BFC
[BFC](/blog/css-bfc.html)
### 4、flex布局
设置父元素为 FFC，具体详见 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- 父元素设置 display: flex   inline-flex
    - flex-direction : row / column / row-reverse / column-reverse
    - flex-wrap: no-wrap  wrap
    - flex-flow: row | no-wrap
    - justify-content: flex-start | flex-end | center | space-between | space-around
    - align-content: flex-start | flex-end | center | space-between | space-around | stretch
    - align-item: flex-start | flex-end | center | baseline | stretch
- 子元素属性
    - order: 0 数字越小，排列越靠前
    - flex-shrink: 属性定义了项目的缩小比例，默认为1, 当 0 时不缩小
    - flex-grow: 属性定义项目的放大比例，默认为0, flex-grow属性都为1
    - flex-basis: 是否占用多余的空间
    - flex: auto<1 1 auto> | none<0 0 auto> (快捷值)
    - align-self: auto | flex-start | flex-end | center | baseline | stretch;
### 5、介绍 @support，@media，calc
@support 判断浏览器是否支持某个属性

@media 媒体查询

calc 计算属性
### 6、rem、em、vh、vw、px 的区别
- px 像素，相对长度单位，网页设计常用的基本单位
- em 相对长度单位。相对于当前对象内文本的字体尺寸
- rem rem是相对于HTML根元素的字体大小
- vw、vh、vmax、vmin这四个单位都是基于视口
    - vw、vh 长度等于视口度的1/100
    - vmin和vmax是相对于视口的高度和宽度两者之间的最小值或最大值
- %（百分比）就是相对于父元素
### 7、实现页面滚动
overflow-y: scroll
### 8、display 的属性有哪些
![display 的属性](/images/1610415297373.jpg)
### 9、display:none 和 visiblity 的区别

### 10、伪类常见有哪些，伪元素和伪类
### 11、position 的属性有哪些
- absolute
- relative
- static
- fixed
- sticky、相对于最近的一个滚动祖先元素、该值总是创建一个新的层叠上下文（stacking context）。注意，一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是最近的真实可滚动祖先。这有效地抑制了任何“sticky”行为



## 二、场景问题
### 1、两列布局，怎么让两列的高度随着内容大小同高呢？
- ① padding-bottom: 9999px; margin-bottom: -9999px;
- ② 背景图撑大
- ③ 使用js来实现
### 2、实现水平垂直居中
### 3、两列布局（左边固定，右边自适应）
flex布局
box盒模型布局
grid布局
position
float
### 4、怎么处理1像素问题
- 由来：不同设备有不同的像素比，css 像素 和 物理像素的区别
- 解决方案
    - 根据媒体查询 设置 transform: scaleY 方向的缩小 @media
    - viewport + rem
    - border-image
### 5、用css实现一个三角形，使其位于屏幕中心，并实现loading效果（持续旋转）
### 6、flex 布局 实现八个元素分两行平均摆放。
### 7、移动端适配问题
### 8、怎么用css 实现一个钟表的指针旋转
### 9、介绍双飞翼布局和圣杯布局
### 10、css 优化
• 内联首屏关键css
• 异步加载css
• 文件压缩
• 去除无用css
• 有选择的使用选择器
    • 保持简单，不要使用嵌套过多过于复杂的选择器。
    • 通配符和属性选择器效率最低，需要匹配的元素最多，尽量避免使用。
    • 不要使用类选择器和ID选择器修饰元素标签，如h3#markdown-content，这样多此一举，还会降低效率。
    • 不要为了追求速度而放弃可读性与可维护性。
• 减少使用昂贵的属性
    • 所有需要浏览器进行操作或计算的属性相对而言都需要花费更大的代价
    • box-shadow/border-radius/filter/透明度/:nth-child
• 优化重排与重绘
ⅰ. 改变font-size和font-family
ⅱ. 改变元素的内外边距
ⅲ. 通过JS改变CSS类
ⅳ. 通过JS获取DOM元素的位置相关属性（如width/height/left等）
ⅴ. CSS伪类激活
ⅵ. 滚动滚动条或者改变窗口大小
 此外，我们还可以通过CSS Trigger15查询哪些属性会触发重排与重绘。
值得一提的是，某些CSS属性具有更好的重排性能。如使用Flex时，比使用inline-block和 float时重排更快，所以在布局时可以优先考虑Flex。               float时重排更快，所以在布局时可以优先考虑Flex。
• 不要使用@import
    • 使用@import引入CSS会影响浏览器的并行下载？？
    • 多个@import会导致下载顺序紊乱？？
### 11、从li中改变最后一个孩子的样式
- 伪类选择器 last-child
- 添加类名称
### 12、简单说下%、px、rem、em、rpx、upx、vw、vh、vm的区别及使用场景？结合盒模型,说一下如何增加点击区域?
### 13、css  flex套flex宽度自适应实现单行文本省略
### 14、css中的特性三通过矩阵中的怎样变换得到的？
### 15、用 flex 实现下图效果。容器宽高不定，子元素宽高固定？
![](/images/css-flex-layout.jpg)

display: flex;

align-self(2): center   align-self(3): flex-end
### 16、什么是雪碧图，如何展示雪碧图中指定位置的图片
background-position
优：减少加载网页图片时对服务器的请求次数,提高页面的加载速度
缺：CSS雪碧的最大问题是内存使用，影响浏览器的缩放功能


## 三、html 方面问题
### 1、html 页面的生命周期
- ① load 浏览器已经加载了所有的资源
- ② DOMContentLoaded 浏览器已经完全加载了HTML，DOM树已经构建完毕之后会运行该事件，但是像是<img>和样式表等外部资源可能并没有下载完毕。所以js可以访问所有DOM节点，初始化界面
- ③ beforeunload/unload 当用户离开页面的时候触发 。可以询问用户是否保存了更改以及是否确定要离开页面

由此有下面的方法：
- window.onload window对象上的onload事件在所有文件包括样式表，图片和其他资源下载完毕后触发
- window.onbeforeunload
- window.unonload 用户离开页面的时候，window对象上的unload事件会被触发
### 2、事件流的过程，怎么阻止事件冒泡。
[点击按钮](/blog/html-click.html)
##### 防止冒泡和捕获
w3c的方法是e.stopPropagation()，IE则是使用e.cancelBubble = true
##### 取消默认事件
w3c的方法是e.preventDefault()，IE则是使用e.returnValue = false;
##### react 中阻止事件冒泡
react有专属的阻止事件冒泡方法，e.nativeEvent.stopImmediatePropagation();
### 3、从获得 HTML 到解析页面全流程，为什么栅格线程使用 GPU 计算而不是 CPU 计算
#### (1) 构建 DOM 树
首先浏览器无法理解 html，需要 HTML 解析器将其解析成 DOM 树。这个树的根节点是 document
#### (2) 样式计算
样式计算的目的是为了每个DOM 节点有具体的样式，可以分为三个步骤
- 把 css 文件 内容转化为 document.styleSheets
- 转化样式表中的属性值，使其标准化
- 继承默认样式后计算每个 DOM 节点的属性值
#### (3) 布局阶段
有了 DOM 树和 DOM 树中元素的样式，还不知道 DOM 元素的几何位置信息。

首先遍历 DOM 树中的 可见节点，将其加到布局树中，不可见节点会被布局树忽略掉。接下来就要计算布局树中每个元素的坐标位置了。
#### (4) 分层
对布局树进行分层，并生成图层树。
- 拥有层叠上下文属性的元素会被提升为单独的一层
- 需要剪裁（clip）的地方也会被创建为图层
#### (5) 绘制
在完成图层树的构建之后，渲染引擎会对图层树中的每个图层进行绘制，这个阶段输出待绘制的列表。
#### (6) 栅格化
栅格化是渲染引擎中的合成线程来操作，合成线程会将图层划分为图块，然后会按照视口附近的图块优先生成位图。渲染进程维护了一个栅格化的线程池。栅格化过程需要GPU来加速，并保存在GPU的内存中。
#### (7) 合成和显示
所有的图块都光栅化完成以后，然后给浏览器进程发送命令，浏览器进程将页面绘制到内存中，最后将内存中的信息显示到页面上。

GPU 的计算单元比 CPU 大，GPU 擅长利用多核心处理单一的任务。
### 4、影响首屏加载的因素有哪些，分别如何进行优化，performance 有哪些相关的指标



