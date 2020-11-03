# React Native桥接之路
React Native 是Facebook开源的跨平台框架，为了讲解方便，我将React Native简称为RN。RN官网说能用JavaScript编写原生移动应用，而且用JS解决不了的问题，也可以呼叫原生同学。
那么这里就牵扯到了RN与Native的通信问题，接下来我从下面几个话题由浅入深探讨一下！！！
- 说说RN的故事
- RN为什么能编写原生应用
- RN是如何构造应用布局的


## 说说RN的故事
Facebook 曾致力于使用 HTML5 进行移动端的开发 ，结果发现在性能方面与原生的 App 相差距越来越大。最终，Facebook 放弃了RN 技术路线，于 2015年3月正式发布了 RN 框架，此框架专注于移动端 App 的开发。

在最初发布的版本中， RN 框架只用于开发 iOS 平台的 App, 2015年9月， Facebook 发布了支持 Android 平台的 RN 框架 至此， RN 框架真正实现了跨平台的移动 App 开发，此举简直就是移动 App 开发人员的福音。

## RN为什么能编写原生应用
在讲这个问题之前，我们先看一下RN的架构图。
![React Native架构](/images/react-native-con.jpeg)
- 绿色部分是应用开发的部分，业务逻辑代码就在这里。
- 蓝色部分是跨平台的代码和引擎，一般不会改写蓝色部分。
- 黄色代码平台相关的代码，做定制化的时候会添加修改代码。是各个平台用来做桥接(Bridge)的。
- 红色部分是系统平台的东西。红色上面有一个虚线，表示所有平台相关的东西都通过 Bridge 隔离开来了。

一般情况下，开发所写的JS代码都在绿色部分，黄色部分是用 原代码写的桥接组件，其他部分不用涉及。

或许这样的解释有点笼统，没关系，我们下面详细讲解一下RN的整个运行过程。
### RN的原理
那么我们把前面架构图的的虚线上面部分再画详细点，就得到了下面这张图😁！

![RN原理](/images/rn-bridge.jpg)

我们可以把RN的整个架构分为三层：
- 第一层是用React写的JS代码层（也就是架构图中**绿色部分**），这里的代码跑在JS引擎`JavaScriptCore`上。在Debug模式下跑在Chrome浏览器的V8引擎上，通过`Websocket`发送到移动设备。

- 第二层是桥接JS和 Native。在0.59所有的通信都需要经过JSON序列化以后通过Bridge异步通信。0.59开始用了新架构Fabric实现的JSI实现了js 和 native的直接共享内存调用，而无需再经过Bridge。

- 第三层是Native层，主要渲染原生组件和传递事件。React写的 **Virtual DOM 节点是利用`yoga`解析**，映射为原生组件，所以能实现一套代码在 Android 和 iOS原生端使用。

React自身是不直接绘制UI的，UI绘制是非常耗时的操作，原生组件最擅长这事情。
:::tip
在一定程度上，React Native和NodeJS有异曲同工之妙。它们都是通过扩展JavaScript Engine, 使它具备强大的本地资源和原生接口调用能力，然后结合JavaScript丰富的库和社区和及其稳定的跨平台能力， 把Javascript的魔力在浏览器之外的地方充分发挥出来。
:::

### Yoga引擎
**Yoga是一个基于 *Flexbox* 的跨平台布局引擎**，最初是Facebook在2014年推出的一个CSS布局的开源库，2016年改版并更名为Yoga。

**Flexbox**(CSS Flexible Box) 是用来处理 web 上的复杂布局。Yoga 并没有实现全部 CSS Flexbox。
它省略了非布局属性，如设置颜色。Yoga 改进了一些 Flexbox 的属性来提供更好的从右到左的支持。最后，Yoga 增加了一个新的比例（AspectRatio）属性来处理在布置某些元素如图片时常见的需求。



## RN是如何构造应用布局的

                                             





