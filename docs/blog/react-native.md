# React Native 使用总结
- 了解App分类
- 背景
- React Native 框架工作原理
- React Native 运行原理

## 了解App分类
目前App的技术栈可以分为四类：
#### Web App 技术栈 
指使用Html开发的移动端网页App,类似微信小程序，整个App都是网页。
- 优点：用户不需要安装，不会占用手机内存。
- 缺点：用户体验不好，不能离线，必须联网。

#### 混合 App 技术栈 （Hybrid App）
混合技术栈指的是开发混合 App 的技术，也就是把 Web 网页放到特定的容器中，然后再打包成各个平台的原生 App。所以，混合技术栈其实是 Web 技术栈 + 容器技术栈，典型代表是 PhoneGap、Cordova、Ionic 等框架。
- 优点：界面复用性强，一个界面，iOS和安卓都可以使用
- 缺点：相对于原生，性能相对有所损害

#### 跨平台 App 技术栈 
跨平台技术栈指的是使用一种技术，同时支持多个手机平台。它与混合技术栈的区别是，不使用 Web 技术，即它的页面不是 HTML5 页面，而是使用自己的语法写的 UI 层，然后编译成各平台的原生 App。

这个技术栈就是纯粹的容器技术栈，React Native、Xamarin、Flutter 都属于这一类。学习时，除了学习容器的 API Bridge，还要学习容器提供的 UI 层，即怎么写页面。
- 优点：
    - 跨平台开发
    - 跳过App Store审核，远程更新代码，提高迭代频率和效率，既有Native的体验，又保留React的开发效率。
- 缺点：不能真正意义上做到跨平台，使用后，对app体积增加。

#### 原生App技术栈 （Native App）
原生技术栈指的是，只能用于特定手机平台的开发技术。比如，安卓平台的 Java 技术栈，iOS 平台的 Object-C 技术栈或 Swift 技术栈。
- 优点：性能高
- 缺点：开发维护成本高，这种技术栈只能用在一个平台，不能跨平台。最重要iOS版本更新也成问题。

## 背景
Facebook 曾致力于使用 HTML5 进行移动端的开发 ，结果发现在性能方面与原生的 App
相差距越来越大。最终，于 2015年3月正式发布了 React Native 框架，此框架专注于移动端 App 的开发。

在最初发布的版本中， React Native 框架只用于开发 iOS 平台的 App, 2015年
9月， Facebook 发布了支持 Android 平台的 React Native 框架 至此， React Native 
框架真正实现了跨平台的移动 App 开发，此举简直就是移动 App 开发人员的福音。

## React Native 框架工作原理

### React Native渲染
在浏览器中，React的JSX源码通过React框架最终渲染成真实的DOM。

而在React Native框架中，JSX 源码通过 React Native 框架编译后，通过对应平台的 Bridge 实现了与原生框架的通信。

<img src="/images/rn-ui.jpg" width="40%" style="margin-right: 10%">
<img src="/images/rn-ui1.jpg" width="40%">
如果我们程序中调用了React Native提供的API，那么 React Native 框架就通过 Bridg 调用原生框架中的方法。

React Native 的底层为 React 框架，所以，如果是 UI 层的变更，那么就
映射为虚拟 DOM 后调用 diff 算法计算出变动后的 JSON 映射文件，最终由 Native
层将此 JSON 文件映射渲染到原生 App 的页面元素上，实现了在项目中只需控制
state 以及 props 变更来引起 iOS Android 平台的 UI 变更。
### React Native 与原生平台通信
![react native 桥接](/images/rn-bridge.jpg)
React Native 与原生框架通信中，采用了 JavaScriptCore作为
JS VM ，中间通过 JSON 文件与 Bridge 行通信,**若使用 Chrome 浏览器进行调
试，那么所有的 JavaScript 代码都将运行在 Chrome 的 V8 引擎中，与原生代码通过
WebSocket进行通信**。

:::tip 生命周期
React Native的生命周期和React是一样的。
:::

## React Native 运行原理
React Native 框架运行起来所依赖的几大组成部分：
- 硬件设备或模拟器，用于运行原生代码。
- Node js 务端，也就是 React Native Packager ，负责源码的打包工作；
- Google Chrome，可以提供中间态的调试工具；
- 后台的 React Native JavaScript 代码；

#### React Native Packager 实现原理
启动React Native项目时，React Native 框架会自动启动 React Native Packager 控制台来进行监昕与打包。

> 更改端口号 `react native start -- port=8088`
>
> 项目初始化 `react-native init --verbose`


## React Native 性能调优
首先，补一下基础的概念。我们的使用App时为什么觉得它很卡呢？

一个动态图像的显示，是由很多**帧**构成，也就是连续变化。而一帧是值一张画面，一秒钟显示的画面数就是
**帧频（FPS）**。 如iOS设备提供的FPS是60，也就是一秒钟跑60个画面。

### React Native性能监控工具
![性能监控](/images/PerfUtil.png)

|名称|说明|
|:-|:-|
|RAM|内存占用|
|JSC|JavaScript堆占用|
|Views|上面的数字是当前屏幕所有view的数量，下面的数字是当前组件所有view的数量|
|UI|FPS(帧频)|
|JS|JavaScript帧频|

### 常见性能低的原因
- console.log语句会占用JavaScript的线程资源，
    - 可以通过`__DEV__`来判断是开发环境，还是生产环境。
    - 配置babel插件`babel-plugin-transform-remove-console`实现自动替换。
- Navigator性能问题，使用`React-Navigation`，其视图使用了原生组件，并使用了`Animated`内库。保证了动画效果。
- Touchable 类组件使用问题，将点击事件包裹在`requestAnimationFrame`中。
- 改变图片大小导致掉帧问题
    -定义样式 `transform [ {scale ｝`
- 改变视图时导致丢帧问题
- ListView 组件性能问题
- 在重绘一个没有改变的视图时 JS 的 FPS 突然下降
    `shouldComponentUpdate`中定义数据更新的条件。
- JavaScript 线程繁忙时导致 JS 线程掉帧 
    - Navigator 切换较慢就是此问题的一种表 可通过使用 InteractionManager来
      解决，而在动画中，可以通过使用 LayoutAnimation 来解决。
    
















    
        
