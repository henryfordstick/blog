# React 源码分析（一）JSX 转换
本篇文章提纲：
- React 和 Vue 对比的优缺点
- React JSX 原理
- 总结
:::warning 关于 react 版本
此系列文章中，react 版本为 16.13.0，react-dom 版本为 16.13.0。
:::

## React 和 Vue 对比的优缺点
- 两个都有虚拟 DOM

- vue 做了内部优化，源码简单。两个更新属性的内部机制是不相同的。

- react 用在大型项目比较好一些，react 比 vue 代码好组织一点。
    - 作者给了最大的自由度，和 ts 代码结合起来相当好，hooks 写起来代码更加简单。

- vue 封装的多，自由度少，框架内部做了优化。

- 两个代码中的细节不同。

## React JSX 原理
先看一段简单的 JSX 代码：
```jsx harmony
import React from 'react';
import ReactDOM from 'react-dom';

function App(){
  return (
    <div className="xx">
        abcd
        <span className="span">feg</span>
        <span className="span">feg</span>
        <span className="span">feg</span>
    </div>
  );
}

// 有三个参数，第一个组件，第二个页面body下的根节点。第三个是页面渲染后的回调。

ReactDOM.render(<App/>,document.getElementById('root'),() => {
  // 处理render之后的逻辑
})
```
将上面的 JSX 代码通过 babel 编译以后的效果：
```js
// jsx的语法会自动编译的
// 编译的结果如下所示
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "xx"
  }, "abcd", /*#__PURE__*/_react.default.createElement("span", {
    className: "span"
  }, "feg"), /*#__PURE__*/_react.default.createElement("span", {
    className: "span"
  }, "feg"), /*#__PURE__*/_react.default.createElement("span", {
    className: "span"
  }, "feg"));
} // 有三个参数，第一个组件，第二个页面body下的根节点。第三个是页面渲染后的回调。


_reactDom.default.render( /*#__PURE__*/_react.default.createElement(App, null), document.getElementById('root'), function () {// 处理render渲染的逻辑
});
```
可以看出，通过 babel 编译以后是将 jsx 转换成 React.createElement 的函数调用模式。我们再来看一下 React.createElement 在做什么？

### 一、createElement

```js
function createElement(type, config, children) {
  let propName;
  // 提取保留名称,实际传入组件中的props
  const props = {};
  // 四个保留参数
  let key = null; // 优化渲染
  let ref = null; // 真实节点引用
  let self = null;
  let source = null; // 开发环境代码配置

  //标签的属性不为空时 说明标签有属性值 特殊处理：把key和ref赋值给单独的变量
  if (config != null) {
    // ref和key是两个特殊的属性，要单独处理
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key; // 无论传入的key是什么类型，最后都处理成字符串
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    //config中剩余属性,且不是原生属性(RESERVED_PROPS对象的属性)，则添加到新props对象中
    // 遍历config得到props
    for (propName in config) {
      if (
        // 遍历属性，拿到属性名
        hasOwnProperty.call(config, propName) &&
        // 判断是否为保留属性名
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        // 将属性挂载
        props[propName] = config[propName];
      }
    }
  }
  // createElement可以传递N个参数，N-2就是子元素的个数
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    //声明一个数组
    const childArray = Array(childrenLength);
    //依次将children push到数组中
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // 冻结array 返回原来的childArray且不能被修改 防止有人修改库的核心对象 冻结对象大大提高性能
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray; // 父组件内部通过this.props.children获取子组件的值
  }

  // 为子组件设置默认值 一般针对的是组件
  // class com extends React.component 则com.defaultProps获取当前组件自己的静态方法
  // 判断是否有defaultProps
  if (type && type.defaultProps) { // 如果当前组件中有默认的defaultProps则把当前组件的默认内容 定义到defaultProps中
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // 重点，仅当节点为undefined的时使用默认值
      if (props[propName] === undefined) { // 如果父组件中对应的值为undefined 则把默认值赋值赋值给props当作props的属性
        props[propName] = defaultProps[propName];
      }
    }
  }
  // 错误提示
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) { // 开发key的错误提示
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) { // 开发ref的错误提示
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  // 创建一个ReactElement
  return ReactElement(
    type, // 元素类型
    key, // 优化渲染
    ref, // 真实节点引用
    self, //
    source, // 开发环境代码配置
    ReactCurrentOwner.current,
    props, //props：1.config的属性值 2.children的属性（字符串/数组）3.default的属性值
  );
}
```
从上面代码可以看出 createElement 最后返回了 ReactElement 对象，createElement 传入了三个参数：

- type 指的是 ReactElement 的类型，有字符串、class 类型、function 类型、Fragment 等等
- config 就是传进来的绑在当前节点或者组件上的所有属性，在源码里可以看到 config 里的 key, ref 会被单独拎出来放在 ReactElement 上
- children 可能一个或者多个，最后 children 会经过处理，在 ReactElement 的 props.children 返回，分两种情况：单个或者数组的形式。

### 二、ReactElement
ReactElement 返回虚拟 dom 对象。
```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  // reactElement在内部就是这么一个object
  const element = {
    // 用来表明react类型，一个Symbol类型
    // 通过Symbol类型可以用来避免一些可能的xss注入
    // 因为react最终渲染dom时候，确保是react.createElement类型 需要判断$$typeof===REACT_ELEMENT_TYPE
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,

    // 负责记录创建此元素的组件
    _owner: owner,
  };

  return element; //返回虚拟dom对象
};
```

## 总结
React 中的 jsx 通过 babel 编译成 js 节点。

createElement 的作用是：
 - 判断 ref，key 的属性，然后将其他属性添加到 props 里面
 - 取出 children，赋值给 props.children
 - 返回 ReactElement 元素

react 元素必须有`$$typeof`这个属性，通过`isValidElement`判断元素是否有这个属性，没有就报错。
- 作用是防止直接将 react 的元素动态传入数据库，这样做的危险是可能会造成 xss 攻击。
- 这种功能一般不建议。`$$typeof`的核心是用 Sybmol 处理的变量，JSON.stringify 不支持转化 Sybmol 类型，转化结果为空。






