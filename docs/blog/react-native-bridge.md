# React Native 桥接之路
React Native 是 Facebook 开源的跨平台框架，为了讲解方便，我将 React Native 简称为 RN。RN 官网说能用 JavaScript 编写原生移动应用，而且用 JS 解决不了的问题，也可以呼叫原生同学。
那么这里就牵扯到了 RN 与 Native 的通信问题，接下来我从下面几个话题由浅入深探讨一下！！！
- 说说 RN 的故事
- RN 为什么能编写原生应用
- RN 是如何构造应用布局的
- 根据项目唠桥接
- 相关链接


## 说说 RN 的故事
Facebook 曾致力于使用 HTML5 进行移动端的开发 ，结果发现在性能方面与原生的 App 相差距越来越大。最终，Facebook 放弃了 RN 技术路线，于 2015 年 3 月正式发布了 RN 框架，此框架专注于移动端 App 的开发。

在最初发布的版本中， RN 框架只用于开发 iOS 平台的 App, 2015 年 9 月， Facebook 发布了支持 Android 平台的 RN 框架 至此， RN 框架真正实现了跨平台的移动 App 开发，此举简直就是移动 App 开发人员的福音。

## RN 为什么能编写原生应用
在讲这个问题之前，我们先看一下 RN 的架构图。
![React Native 架构](/images/react-native-con.jpeg)
- 绿色部分是应用开发的部分，业务逻辑代码就在这里。
- 蓝色部分是跨平台的代码和引擎，一般不会改写蓝色部分。
- 黄色代码平台相关的代码，做定制化的时候会添加修改代码。是各个平台用来做桥接(Bridge)的。
- 红色部分是系统平台的东西。红色上面有一个虚线，表示所有平台相关的东西都通过 Bridge 隔离开来了。

一般情况下，开发所写的 JS 代码都在绿色部分，黄色部分是用 原代码写的桥接组件，其他部分不用涉及。

或许这样的解释有点笼统，没关系，我们下面详细讲解一下 RN 的整个运行过程。
### RN 的架构
那么我们把前面架构图的的虚线上面部分再画详细点，就得到了下面这张图😁！

![RN 原理](/images/rn-bridge.jpg)

我们可以把 RN 的整个架构分为三层：
- 第一层是用 React 写的 JS 代码层（也就是架构图中**绿色部分**），这里的代码跑在 JS 引擎`JavaScriptCore`上。在 Debug 模式下跑在 Chrome 浏览器的 V8 引擎上，通过`Websocket`发送到移动设备。

- 第二层是桥接 JS 和 Native。在 0.59 所有的通信都需要经过 JSON 序列化以后通过 Bridge 异步通信。0.59 开始用了新架构 Fabric 实现的 JSI 实现了 js 和 native 的直接共享内存调用，而无需再经过 Bridge。

- 第三层是 Native 层，主要渲染原生组件和传递事件。React 写的 **Virtual DOM 节点是利用`yoga`解析**，映射为原生组件，所以能实现一套代码在 Android 和 iOS 原生端使用。

React 自身是不直接绘制 UI 的，UI 绘制是非常耗时的操作，原生组件最擅长这事情。
:::tip
在一定程度上，React Native 和 NodeJS 有异曲同工之妙。它们都是通过扩展 JavaScript Engine, 使它具备强大的本地资源和原生接口调用能力，然后结合 JavaScript 丰富的库和社区和及其稳定的跨平台能力， 把 Javascript 的魔力在浏览器之外的地方充分发挥出来。
:::

### Yoga 引擎
**Yoga 是一个基于 *Flexbox* 的跨平台布局引擎**，最初是 Facebook 在 2014 年推出的一个 CSS 布局的开源库，2016 年改版并更名为 Yoga。

**Flexbox**(CSS Flexible Box) 是用来处理 web 上的复杂布局。Yoga 并没有实现全部 CSS Flexbox。
它省略了非布局属性，如设置颜色。Yoga 改进了一些 Flexbox 的属性来提供更好的从右到左的支持。最后，Yoga 增加了一个新的比例（AspectRatio）属性来处理在布置某些元素如图片时常见的需求。

## RN 是如何构造应用布局的
在此之前，先说说 RN 的工作方式。
### 线程模型
![RN 工作方式](/images/rn-old-ui.jpeg)
RN 中有三个线程，分别如下：
- MAIN Thread/UI Thread: 也叫 UI 线程，运行 Android / iOS 应用程序的主要应用程序的线程，它具有访问 UI 的权限，并且只能通过此线程更改 UI。
- Shadow Thread: 是 RN 使用 React 库进行布局计算和构造 UI 界面的线程。
- JS Thread: React 等 JavaScript 代码都在这个线程中执行。

此外，还有一类 Native Modules 线程，不同的 Native Modules 可以运行在不同的线程中。

### 启动过程
知道了 RN 的线程关系之后，接下来看 RN 是怎么运行的。

首先呢，App 启动时初始化 React Native 运行时环境（即 Bridge），Bridge 准备好以后开始 Native 渲染。

那么整个初始化 Bridge 过程分为 4 部分：
- 加载 JavaScript 代码：开发模式下从网络下载，生产环境从设备存储中读取。
- 初始化 Native Module：根据 Native Module 注册信息，加载并实例化所有 Native Module。
- 注入 Native Module 信息：取 Native Module 注册信息，作为全局变量注入到 JS Context 中。
- 初始化 JavaScript 引擎： 即 JavaScriptCore。

Bridge 建立之后，JavaScript 代码开始执行，渲染用户界面并实现业务功能。

![RN 工作方式 2](/images/rn-new-ui.jpeg)

渲染界面的过程：

- JS 线程将视图信息(结构、样式、属性等) 传递给 Shadow 线程。
- 创建出用于布局计算的 Shadow Tree。
- Shadow 线程计算好布局之后，再将完整的视图信息（包括宽高、位置等）传递给 UI 线程，UI 线程据此创建 Native View。

用户动作反馈的过程：
- 对于用户输入，则先由 UI 线程将相关信息打包成事件消息传递到 Shadow 线程。
- Shadow 线程再根据 Shadow Tree 建立的映射关系生成相应元素的指定事件。
- 最后将事件传递到 JS 线程，执行对应的 JS 回调函数。

## 根据项目唠桥接
我前面讲了 RN 的基本原理，明白他是怎么运行的。那么日常生产中，我们可以用 RN 完成大部分工作，但是如果想用一些现成原生代码，或者让原生来处理一些高性能的多线程代码时怎么办？

要实现原生与 JS 通信，就要使用 RN 的 Bridge 来实现，这里就需要我们自己封装 Bridge 。包括咱们自己项目中用到继承 FIDO，安全键盘，Bugly 等等的 SDK 都需要用到桥接。

接下来我就从代码层面讲讲 Bridge，其中也包括我在项目中遇到的坑点。

### FIDO 模块
FIDO 模块调用了第三方的 SDK，然后由原生实现部分 UI 的交互部分。这里只需要 JS 调用原生提供的方法以及 JS 监听原生方法提供的回调。
#### 一、添加 FIDOModules
FIDOModules 是桥接核心的代码所在文件夹，其中 mobile 是工程名称，这里随意添加的。
**Android 代码**
```java
/**
 * android/app/src/main/java/com/mobile/FIDO/FIDOModules.java
 */
package com.mobile.FIDO;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
// ...

public class FIDOModules extends ReactContextBaseJavaModule{
    private final String SET_NAME = "FIDOModules";
    private final ReactApplicationContext reactContext;

    public FIDOManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    // 这个函数用于返回一个字符串名字，这个名字在 JavaScript 端标记这个模块
    @Override
    public String getName() {
        return SET_NAME;
    }

    // 要导出一个方法给 JavaScript 使用，Java 方法需要使用注解 @ReactMethod
    @ReactMethod
    public void fidoInit(Promise promise) throws ClassNotFoundException{
        try {
            WritableMap map = Arguments.createMap();
            // ...
            promise.resolve(messageString);
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }

    @ReactMethod
    public void fidoRegister(ReadableMap map) {
        // 获取 map 中的数据
        String userName = map.getString("userName");

        // 如果要做一些延时的操作，需要在 Android 的子线程中去调用
        // 如果用 UI 线程，就不用写
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // ...
            }
        });

    }

    // 原生模块可以在没有被调用的情况下往 JavaScript 发送事件通知。
    // 最简单的办法就是通过 RCTDeviceEventEmitter ，这可以通过 ReactContext 来获得对应的引用
    private void sendEvent(
        ReactContext reactContext,
        String eventName,
        @Nullable WritableMap params
    ) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // 封装了一下返回的参数
    private void sendJSCode(String listenName, String title, String status, String res) {
        WritableMap params = Arguments.createMap();
        params.putString("msg", title);
        params.putString("status", status);
        params.putString("res", res);
        Log.e("传输的数据", "数据"+params);
        sendEvent(this.reactContext, listenName, params);
    }

    public void onSuccess(int reqType, String response) {
        // 原生模块给 JS 发送事件
        sendJSCode("register", "注册成功", "0", response);
    }
    // ......
    // 这里只贴出了桥接所需的核心代码，其他代码省略掉了
}
```
对应的 iOS 代码如下：
```c
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


NS_ASSUME_NONNULL_BEGIN

@interface FTFIDOManager : RCTEventEmitter <RCTBridgeModule,NSURLSessionDelegate,NSURLSessionDataDelegate,NSURLSessionTaskDelegate>

@property (nonatomic,strong)NSMutableData *responseData;

@end

NS_ASSUME_NONNULL_END
```
```c
// FIDOModules.m     省略掉 .h 文件

#define FT_FIDO_INIT fidoInit
#define FT_FIDO_REGISTER fidoRegister

// 声明成员变量 ...
@property (nonatomic, strong) NSString * username;

@implementation FTFIDOManager

// 为了实现 RCTBridgeModule 协议，你的类需要包含 RCT_EXPORT_MODULE() 宏
RCT_EXPORT_MODULE(FIDOModules)

RCT_REMAP_METHOD(FT_FIDO_INIT,
   resolver:(RCTPromiseResolveBlock)resolve
   rejecter:(RCTPromiseRejectBlock)reject
){
  // ...
  if(supportType){
    resolve(supportType);
  }else{
    NSError *error = [NSError errorWithDomain:NSCocoaErrorDomain code:1 userInfo:@{@"error":@"获取失败"}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_EXPORT_METHOD(FT_FIDO_REGISTER:(NSDictionary *) json){
    // 在 oc 中，收到的是一个字典
    userName = [json objectForKey:@"userName"];
}

#prama 给 js 端发送事件
// 这里需要注册事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"register"];
}

// 封装了一下返回的参数
- (void)sendJSCode:(NSString *)listenName
             title:(NSString *)title
            status:(NSString *)status
               res:(NSString *)res
{
  [self sendEventWithName:listenName body:@{@"msg": title,@"status": status,@"res":res}];
}

- (void)onSuccess:(NSString *)uafResponse
{
    // 原生模块给 JS 发送事件
    [self sendJSCode:@"register" title:@"注册成功" status:@"0" res:res];
}
@end
```
#### 二、注册模块
在 Android 中需要在应用的 Package 类的`createNativeModules`方法中添加这个模块，如果没有被注册，则在 JavaScript 中无法访问到。
```java
/**
 * android/app/src/main/java/com/mobile/FIDO/FIDOPackage.java
 */
package com.by_mobile.FTFIDO;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FIDOPackage implements ReactPackage {
    // 用来在注册导入RN的原生模块
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        // 这里添加FIDOModules
        modules.add(new FIDOModules(reactContext));
        return modules;
    }

    // 添加自定义的视图管理类
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
```
接下来需要到`MainApplication.java`中添加，因为 APP 启动时，先执行`MainApplication.java`，然后再执行`MainActivity.java`创建一个`MainActivity`。
```java
/**
 * android/app/src/main/java/com/mobile/MainApplication.java
 */
package com.mobile;
import com.mobile.FIDO.FIDOPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    ...
    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new FIDOPackage());
      return packages;
    }
    ...
  };
  ...
}
```
#### 三、JavaScript 端封装调用
一般将 RN 桥接部分的 JavaScript 代码封装起来，使用的时候调用一下就行了。
```typescript jsx
import {
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  Platform,
} from 'react-native';


const {FIDOModules} = NativeModules;

const {fidoInit, fidoRegister} = FIDOModules;

let EventEmitter = Platform.OS === 'ios'
    ? new NativeEventEmitter(FIDOModules)
    : DeviceEventEmitter;
let register;

export async function initFido(fn:Function) {
  try {
    let msg:Array<{title: string}>= await fidoInit();
    ...
    fn && fn(msg);
  } catch (e) {
    fn && fn(e);
  }
}

export async function registerFido(fn: (e: Event) => void) {
  ...
  await fidoRegister(options);
  register && register.remove();
  register: EventEmitter = EventEmitter.addListener('register', (e: Event) => {
    fn && fn(e);
  });
}
```
### SafeKey 模块
安全键盘模块有一个特殊的需求，这边由于键盘是在 TEE 系统实现的，然后输入框需要用 RN 视图组件中的 TextInput 。现在需要使用`findNodeHandle`将 RN 中 TextInput 组件的 tag 值
获取到，然后传递给 Native 那边，Native 收到后通过 tag 值再获取对应的组件对象，最后和安全键盘绑定。整个实现的核心代码如下所示：

:::tip 获取 uimanager 类
Android 部分的代码中注册模块，给 JS 提供调用方法等都和 FIDO 大同小异。这里只是展示 tag 需要的核心代码！！！

Android 这里需要在`com`文件夹下在创建`facebook/react/uimanager/`文件夹，将`SafeKeyModule.java`文件写到新创建的文件夹下面，方便获取到 RN 的
`uimanager`类。
:::
```java
/**
 * android/app/src/main/java/com/facebook/react/uimanager/SafeKeyModule.java
 */
package com.facebook.react.uimanager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.views.textinput.ReactEditText;

public class SafeKeyModule extends ReactContextBaseJavaModule {

    private static final String SET_NAME = "SafeKeyboard";

    public SafeKeyModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {return SET_NAME;}

    /**
     * 获取 reactTag  RN端通过 findNodeHandle() 获取
     * 这里是重点，也是整个 Native 调用 RN 组件的关键
     * @param id
     */
    private ReactEditText getEditById(int id) {
        UIViewOperationQueue uii = this.getReactApplicationContext().getNativeModule(UIManagerModule.class).getUIImplementation().getUIViewOperationQueue();
        return (ReactEditText) uii.getNativeViewHierarchyManager().resolveView(id);
    }

    @ReactMethod
    public void initSafeKeyboard(ReadableMap msg){
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // 这里获取 TextInput 组件的 tag
                final int reactTag = msg.getInt("reactTag");
                // 这里根据 TextInput 组件获取对象
                textInput = getEditById(reactTag);
                ...
            }
        });
    }
}
```

Objective-c 对应的代码如下：
```c
#import "RFTSafeKeyModule.h"
#import <React/RCTUIManager.h>
#import <React/RCTBaseTextInputView.h>
#import <React/RCTBridge.h>

#define RFT_KEYBOARD_INIT initSafeKeyboard

@interface RFTSafeKeyModule()
@property (strong,nonatomic) UITextField * textInput;
@end

@implementation RFTSafeKeyModule
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(SafeKeyboard)

RCT_EXPORT_METHOD(RFT_KEYBOARD_INIT:(nonnull NSDictionary *)msg){
    // 这里 ui 需要在主线程中调用
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *reactTag = [msg objectForKey:@"reactTag"];

    // 获取 input
    if(reactTag){
        // 获取 TextInput 的核心代码
      self.textInput = (UITextField *)(((RCTBaseTextInputView*)[self->_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);

      // 改变输入光标的颜色
      if([noChangeNumber integerValue] == 0){
        self.textInput.tintColor = [UIColor colorWithWhite:1.0 alpha:0];
      }
    }
  });
}
@end
```

JavaScript 代码实现：
```typescript jsx
import * as React from 'react';
import {
  NativeModules,
  TextInput,
  findNodeHandle,
  NativeAppEventEmitter,
} from 'react-native';

const {SafeKeyboard} = NativeModules;
const {
  initSafeKeyboard
} = SafeKeyboard;

export default const SafeInput:React.FC = ():JSX.element => {
  const refs = React.useRef<null!>();

  React.useEffect(() => {
    setTimeout(() => {
      initSafeKeyboard({
        reactTag: findNodeHandle(refs),
      })
    },200)
  },[]);

  return (
    <TextInput
        ref={refs}
        ...
      />
  );
}
```

### 结语
关于 RN 的桥接我这里只是讲了一小部分，其中有些特殊的需求和爬过的坑也不止这一点，更要实践的探索和解决。比如还有调用原生 UI 组件等其他使用方法，有兴趣可以参考 RN 的官网，理解所有的原理和流程以后，才能写出更优秀的代码。

## 相关链接
- [React Native 官网](https://reactnative.dev/)
- [React Native 如何构建应用布局](https://www.freecodecamp.org/news/how-react-native-constructs-app-layouts-and-how-fabric-is-about-to-change-it-dd4cb510d055/)















