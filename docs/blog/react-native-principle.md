# React Native 原理浅析
这章来讲讲React Native的原理，来揭开它的神秘面纱！
- 一、JavaScriptCore
- 二、浏览器工作原理
- 三、React Native架构
- 四、React Native，React和JavaScriptCore的关系
- 五、Bridge各模块简介
- 六、相关链接

关于React Native的更新，可以查看[JS核心理论之《React Native原理浅析》](https://juejin.im/post/6844904146840059918)

## 一、JavaScriptCore
为什么要说JS Engine呢？**因为React Native的核心代码都是用 JS 来写的，没有JS Engine，
那么我们所写的 JS 和 JSX 代码都无法执行，更无法驱动Native的API了**。
`JavaScriptCore`是iOS设备默认支持的，是Webkit默认的JS引擎，所以iOS和Android都支持。

现在只要弄明白`JavaScriptCore`在iOS平台上给React Native提供的接口也仅限于那几个接口，
React Native 剩下的魔法秘密都可以顺藤摸瓜来分析了。

## 二、浏览器工作原理
浏览器的主要作用就是通过解析html来形成DOM tree，然后通过css来点缀和DOM tree上的每一个节点。

### UI层和逻辑层
1. html文本描述了页面应该有哪些功能，css告诉浏览器该长什么样。
2. 浏览器引擎通过解析html和css，翻译成一些列的预定义UI控件。
3. 然后UI控件去调用操作系统绘图指令去绘制图像展现给用户。
4. Javascript可有可无，主要用于html里面一些用户事件响应，DOM操作、异步网络请求和一些简单的计算。
:::tip
- React Native中，步骤1和步骤2是不变的，也是用html语言描述页面有哪些功能，然后stylesheet告诉浏览器引擎每个控件应该长什么样。
- 步骤3是react native自己实现的一套UI控件（两套，android一套，ios一套），这个切换是在`MessageQueque`中进行的，并且还可以发现，他们`tag`也是不一样的。
:::
### JS在React Native中的作用
- 它负责管理UI component的生命周期，管理Virtual DOM。
- 所有业务逻辑都是用javascript来实现或者衔接。
- 调用原生的代码来操纵原生组件。
- Javascript本身是无绘图能力的，都是通过给原生组件发指令来完成。

## 三、React Native架构
![React Native架构](/images/react-native-con.jpeg)
- 绿色部分是应用开发的部分，业务逻辑代码就在这里。
- 蓝色部分是跨平台的代码和引擎，一般不会改写蓝色部分。
- 黄色代码平台相关的代码，做定制化的时候会添加修改代码。是各个平台用来做桥接的
- 红色部分是系统平台的东西。红色上面有一个虚线，表示所有平台相关的东西都通过bridge隔离开来了。

一般开发在绿色部分，有定制化开发需要写黄色部分。

## 四、React Native，React和JavaScriptCore的关系
React是一个纯JS库，所有的React代码和所有其它的js代码都需要JS Engine来解释执行。
React只能做浏览器允许它做的事情, 不能调用原生接口。**可以理解JS是一个函数，接受特定格式的字符串数据，输出计算好的字符串数据**。

JS Engine负责调用并解析运行这个函数。

### React Native 和 React不一样
1. 驱动关系不一样。
    - React由 JavaScriptCore 来驱动。
    - React Native 这里，JavaScriptCore执行了相关的JS代码，然后把计算好的结果
    返给`Native Code`。然后, Native code 根据JS计算出来的结果驱动设备上所有能驱动的硬件。
    也就是说，这里RN可以调用所有原生的接口，所有的硬件。
2. 利用React的Virtual Dom和数据驱动编程概念。简化了我们原生应用的开发， 同时，它不由浏览器去绘制，只计算出绘制指令，最终的绘制还是由原生控件去负责，保证了原生的用户体验。
### React Native组件结构
在一定程度上，React Native和NodeJS有异曲同工之妙。它们都是通过扩展JavaScript Engine, 使它具备强大的本地资源和原生接口调用能力，然后结合JavaScript丰富的库和社区和及其稳定的跨平台能力，
把Javascript的魔力在浏览器之外的地方充分发挥出来。

### JavaScriptCore + React + Bridges 就是 React Native
- JavaScriptCore 负责JS代码解释执行
- React 负责描述和管理`Virtual DOM`，指挥原生组件进行绘制和更新，同时很多计算逻辑也在js里面进行。ReactJS自身是不直接绘制UI的，UI绘制是非常耗时的操作，原生组件最擅长这事情。
- Bridge用来翻译ReactJS的绘制指令给原生组件进行绘制，同时把原生组件接收到的用户事件反馈给React。

要在不同的平台实现不同的效果就可以通过定制`Bridge`来实现。

:::tip
RN厉害在于它能打通JS和Native Code, 让JS能够调用丰富的原生接口,充分发挥硬件的能力, 实现非常复杂的效果,同时能保证效率和跨平台性。
:::
:::tip Bridge的作用
- Bridge的作用就是给RN内嵌的JS Engine提供原生接口的扩展供JS调用.
- 每一个支持原生功能的模块不然有JS模块和原生模块。
- RN中JS和Native分隔非常清晰，JS不会直接引用Native层的对象实例，Native也不会直接引用JS层的对象实例。
- Bridge 原生代码负责管理原生模块并生成对应的JS模块信息供JS代码调用。
:::

## 五、Bridge各模块简介
### RCTRootView
**所有React的绘制都会有这个RCTRootView来管理**。RCTRootView 是 React Native 加载的地方，从这里开始，我们有了JS Engine, 
JS代码被加载进来，对应的原生模块也被加载进来，然后js loop开始运行。 js loop的驱动来源是Timer和Event Loop(用户事件). 
js loop跑起来以后应用就可以持续不停地跑下去了。

RCTRootView做的事情如下：
- 创建并且持有 RCTBridge
- 加载JS Bundle并且初始化JS运行环境.
- JS运行环境准备好以后把加载视图用RCTRootContentView替换加载视图。
- 所有准备工作就绪以后调用AppRegistry.runApplication正式启动RN JS代码。
### RCTRootContentView
- `RCTRootContentView reactTag`在默认情况下在Xcode view Hierarchy debugger 下可以看到，
最顶层为`RCTRootView`, 里面嵌套的是`RCTRootContentView`, 从`RCTRootContentView`开始，每个View都有一个`reactTag`。

- `RCTRootView`继承自`UIView`, `RCTRootView`主要负责初始化`JS Environment`和`React`代码，然后管理整个运行环境的生命周期。 `RCTRootContentView`继承自`RCTView`, `RCTView`继承自`UIView`, RCTView封装了React Component Node更新和渲染的逻辑， 
`RCTRootContentView`会管理所有react ui components. `RCTRootContentView`同时负责处理所有touch事件。

### RCTBridge
:::tip
这是一个加载和初始化专用类，用于前期JS的初始化和原生代码的加载.
:::

- 负责加载各个Bridge模块供JS调用
- 找到并注册所有实现了`RCTBridgeModule protocol`的类, 供JS后期使用.
- 创建和持有 `RCTBatchedBridge`
### RCTBatchedBridge
:::tip
`RCTBridge` 和 `RCTBatchedBridge`,前者负责发号施令，后者负责实施
:::

- 负责`Native`和JS之间的相互调用(消息通信)
- 持有`JSExecutor`
- 实例化所有在`RCTBridge`里面注册了的`native node_modules`
- 创建JS运行环境, 注入`native hooks `和`modules`, 执行 `JS bundle script`
- 管理JS run loop, 批量把所有JS到native的调用翻译成`native invocations`
- 批量管理原生代码到JS的调用，把这些调用翻译成JS消息发送给`JS executor`

### RCTJavaScriptLoader
:::tip
这是实现远程代码加载的核心。热更新，开发环境代码加载，静态jsbundle加载都离不开这个工具。
:::

- 从指定的地方(bundle, http server)加载 script bundle
- 把加载完成的脚本用string的形式返回
- 处理所有获取代码、打包代码时遇到的错误

### RCTContextExecutor
- 封装了基础的JS和原生代码互掉和管理逻辑，是JS引擎切换的基础。
通过不同的`RCTCOntextExecutor`来适配不同的`JS Engine`，让我们的React JS可以在iOS、Android、chrome甚至是自定义的js engine里面执行。
这也是为何我们能在chrome里面直接调试js代码的原因。
- 管理和执行所有N2J调用。
### RCTModuleData
- 加载和管理所有和JS有交互的原生代码。把需要和JS交互的代码按照一定的规则自动封装成JS模块
- 收集所有桥接模块的信息，供注入到JS运行环境
### RCTModuleMethod
:::tip
记录所有原生代码的导出函数地址(JS里面是不能直接持有原生对象的)，同时生成对应的字符串映射到该函数地址。
JS调用原生函数的时候会通过message的形式调用过来
:::
- 记录所有的原生代码的函数地址，并且生成对应的字符串映射到该地址
- 记录所有的block的地址并且映射到唯一的一个id
- 翻译所有`J2N call`，然后执行对应的native方法

:::tip
- 如果是原生方法的调用则直接通过方法名调用，MessageQueue会帮忙把Method翻译成MethodID, 然后转发消息给原生代码，传递函数签名和参数给原生MessageQueue, 最终给RCTModuleMethod解析调用最终的方法
- 如果JS调用的是一个回调block，MessageQueue会把回调对象转化成一个一次性的block id, 然后传递给RCTModuleMethod, 最终由RCTModuleMethod解析调用。基本上和方法调用一样，只不过生命周期会不一样，block是动态生成的，要及时销毁，要不然会导致内存泄漏
:::
### MessageQueue
- 这是核心中的核心。整个`react native`对浏览器内核是未做任何定制的，完全依赖浏览器内核的标准接口在运作。它怎么实现UI的完全定制的呢？它实际上未使用浏览器内核的任何UI绘制功能，注意是未使用UI绘制功能。它利用javascript引擎强大的DOM操作管理能力来管理所有UI节点，每次刷新前把所有节点信息更新完毕以后再给yoga做排版，然后再调用原生组件来绘制。javascript是整个系统的核心语言。
- 我们可以把浏览器看成一个盒子，javascript引擎是盒子里面的总管，DOM是javascript引擎内置的，javascript和javascript引擎也是无缝链接的。react native是怎么跳出这个盒子去调用外部原生组件来绘制UI的呢？秘密就在MessageQueue。
- Javascript引擎对原生代码的调用都是通过一套固定的接口来实现，这套接口的主要作用就是记录原生接口的地址和对应的javascript的函数名称，然后在javascript调用该函数的时候把调用转发给原生接口

## 六、相关链接
- [RN原理](http://blog.poetries.top/2019/10/02/rn-yuanli/)
- [React Native for Android 原理分析与实践：实现原理](https://juejin.im/post/6844903553283129352)
- [深入剖析 JavaScriptCore](https://www.jianshu.com/p/e220e1f34a0b)



















