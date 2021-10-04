# 框架方面的问题
## 一、React 的问题
### 1、React无状态组件和纯组件
### 2、react函数组件和类组件的区别，优缺点，用过那些hook 怎么用的？
### 3、介绍HOC
### 4、react元素怎么变成虚拟DOM的，怎么判断是否是变量。
### 5、React中Props和State的区别，特点
### 6、react生命周期，为什么有些生命周期要发生变化呢，类组件和函数组件的优缺点
### 7、React中Context是什么，怎么使用？
### 8、React中如何加测页面绘制性能，有哪些性能优化方式？
 FP FCP FMP
### 9、React中如何阻止事件冒泡？
### 10、React一键换肤的原理
### 11、redux用过哪些中间件，redux原理
### 12、react-native 和 react 的区别
### 13、react 和 react-dom 的作用
### 14、怎么处理类组件的this绑定问题
### 15、setState除了传递类组件还可以传递什么
### 16、React 组件之间通信
### 17、多个useState怎么优化
### 18、useContext 用的怎么样
### 19、useEffect 第二个参数传入的参考值，如果是对象，则传入对象的某个属性值。
### 20、React 中 纯组件的特点
### 21、react 各个hooks 的区别，使用场景，自定义 hooks
### 22、react 15 和 16 的区别，唠源码
### 23、RN 的 性能优化，和 mui 的区别
### 24、RN 的原理，和几个框架的对比
### 25、react 受控组件和非受控组件的区别
- ① 组件受不受 setState 的影响，受影响即为受控，不受影响即为不受控，不受控组件使用 ref 获取其中的值。
- ② 受控组件可以及时反映输入的组件，进行状态验证，没有更改 state对应的值，页面就不会重新渲染。非受控组件用户可以控制输入。
- ③ 两者都满足一次性检索，例如表单提交
- ④ 受控组件可以及时验证。
- ⑤ 受控组件可以及时的禁用提交按钮
### 26、vue实现双向绑定,defineProperty 和 Proxy的优缺点
### 27、PureComponent 怎么 深比较，性能问题 （不可变数据）
### 28、React 中性能优化
### 29、使用 react-navigation 和 redux 的初衷
### 30、redux 和 mobx 的 区别
### 31、react 虚拟DOM，原理和作用
### 32、react 17 的新特性
### 33、react 性能优化，项目的性能优化等等
### 34、RN 的内存问题及处理
### 35、RN 常见的错误及兼容性问题
### 36、react native 原理，和flutter 的区别
### 37、对rn 的脚手架做过哪些封装
### 38、react native 做过哪些性能优化，Hermes JS 的更改，原理
### 39、React-SSR 的原理，流程
### 40、react hooks 原理，使用的时候注意哪些问题，useState 的原理
### 41、vue 的 双向绑定的实现，vue2 和 vue3 的简单原理
### 42、useCallback 和 useMemo的区别
### 43、React SSR 遇到的问题
### 44、vue/react 的 dom diff 过程，二者有什么差异
### 45、react-redux 的原理
### 46、react hooks 的作用，为什么不能在useEffect外面包裹if呢
### 47、虚拟dom的优势
### 48、react fiber 的结构，原理
### 49、React 组件之间的通信问题
### 50、render props
### 51、react是怎么将事件和 浏览器绑定的
### 52、虚拟dom解决了啥，然后给你个场景分析操作dom和虚拟dom的差异
### 53、redux介绍， 内部实现原理，中间件在什么时候执行


## 二、场景性问题
### 1、封装一个React.Alert,介绍其中的核心部分。
### 2、react函数组件和类组件的区别，优缺点，用过那些hook 怎么用的？
### 3、useState初始值为1，改成2，里面的状态会变吗
### 4、使用React编写一个自定义组件，实现一个60秒倒计时功能，要求：
- ① 初始状态，左侧数字为60，右侧按钮为START (如下图)：
- ② 点击START，按钮变为STOP，左侧数字每秒减1帧，减小到0
   是重置为初始状态；
- ③ 点击STOP，停止倒计时并立即重置为初始状态。
- ④ 最好使用React Hook实现。
```typescript jsx
import React, {useCallback, useEffect, useRef, useState} from 'react';

const Home = () => {
    const intervalRef = useRef<any>(null);
    const [count,setCount] = useState<number>(60);
    const [text,setText] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current)
        }
    },[]);

    useEffect(() => {
        if(text){
            clearInterval(intervalRef.current);
            if (count === 0) {
                setCount(60);
            } else {
                intervalRef.current = setInterval(() => {
                    setCount((preCount) => preCount - 1);
                }, 1000);
            }
        } else {
            clearInterval(intervalRef.current);
            setCount(60);
        }

    },[text,count]);

    const onGetCaptcha = useCallback(() => {
        setText(t => !t);
    },[]);

    return (<>
          <span>{count}s</span>
          <button onClick={onGetCaptcha}>
              {text ? 'STOP' : 'START'}
          </button>
      </>
    );
};

export default Home;
```
### 5、说一下整个 React SSR 的大致流程
### 6、使用 react hoc 实现一个输入组件，然后可以实时的去控制输入组件，并且在submit 提交的时候再判断一次。
### 7、有没有模块化导航器，状态管理器，有没有上传npm的插件
### 8、说说项目中用到的高阶函数，简写一下，如果遇到参数冲突的话，怎么解决
### 9、怎么在react 函数组件中实现类组件 this.name 这种特性
### 10、项目中 token 加密是怎么回事
### 11、介绍 code push，code push server 的搭建过程
### 12、写一个React的高阶函数，处理两个输入的变量
```js
// my name is __Join__
// he say __hello world__
```
