# React 源码分析（二）React.Children
这一章介绍一下 React.Children，这个方法封装了处理 props.children 的方法。主要作用是处理不可信的数据，比如说
数组可能为 null 或者其他类型等等，这个方法就做了异常，扁平化处理！！！

文章的大纲如下：
- React.Children 探索
- React.Children.map 源码分析
- 总结
- 相关链接

## React.Children 探索
先来看看 React.Children 提供了那些方法呢？

在 React.js 下面有这样一段代码：
```js
import { forEach, map, count, toArray, only } from './ReactChildren';
const React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only
  }
};
...
```
由上面的代码可以看出 Children 提供了 map，forEach，count，toArray，only 等方法。
- `map` 遍历子元素，对每一个子元素执行回调，最终返回一个新的集合。
- `forEach` 遍历子元素，对每一个子元素执行回调，但不像上述的 map 那样最终返回一个新的集合。
- `count` 返回子元素的总和。
- `toArray` 将 children 转换成 Array，对 children 排序时需要使用。
- `only` 返回 children 中仅有的子级。否则抛出异常，接受的参数只能是一个对象，不能是多个对象。

知道了 React.Children 有哪些方法之后，接下来就深入探索一下 React.Children.map 的源码。

## React.Children.map 源码分析
在 ReactChildren.js 文件尾部，可以看到 map 方法在此被导出，其真正的名字应该是 `mapChildren`。
### 一、mapChildren()
```js
// 为什么要使用React.Children.map， 而不是直接使用this.props.children.map
// 1. React.Children.map是一种安全的用法，会默认判断null,undefined，对象，字符串等情况，即使类型不是Array，也不会报错
// 2. React.Children.map会默认展平多维数组
// 3. 迭代器也可以支持输出

function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  // 映射到带有键前缀的内部
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
```
这个方法接受 3 个参数：
- `children` 就是将要被遍历的子组件数组
- `func` 是对单个子组件需要执行的函数
- `context` 则是 func 执行时 this 指针所指向的对象。

### 二、mapIntoWithKeyPrefixInternal()
```js
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  // 对象池的作用是避免频繁的创建和销毁，以避免不必要的性能消耗和内存抖动问题
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  // 将嵌套的数组展平
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  // 用完以后将对象放回池子
  releaseTraverseContext(traverseContext);
}
```
这个方法本身没有什么特别之处，重点是 `getPooledTraverseContext`，`traverseAllChildren`和`releaseTraverseContext`。

### 三、getPooledTraverseContext()
:::warning
此方法是 mapIntoWithKeyPrefixInternal() 方法中包括的三个重要方法之一。
:::
```js
const POOL_SIZE = 10;
const traverseContextPool = [];
// 维护一个对象最大为10的池子，从这个池子取到对象去赋值，用完了清空， 防止内存抖动
// 可以循环使用，创建太多的话，也会占据内存
function getPooledTraverseContext(
  mapResult,
  keyPrefix,
  mapFunction,
  mapContext,
) {
  if (traverseContextPool.length) {
    const traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0,
    };
  }
}
```
`traverseContextPool` 是文件中定义的对象池，`POOL_SIZE`则定义了对象池的大小。

`getPooledTraverseContext` 方法就是从对象池中获取一个 `context` 对象。具体逻辑是若对象池中已存在对象，则`pop`
出来，并将我们调用`React.map`时传入的一些参数赋值给`context`对象中相应的属性。

若对象池为空，则直接返回一个新的`context`对象。

:::tip 对象池
对象池的作用是避免频繁的创建和销毁，以避免不必要的性能消耗和内存抖动的问题。
:::

### 四、traverseAllChildren()
:::warning
此方法是 mapIntoWithKeyPrefixInternal() 方法中包括的三个重要方法之一。
:::
```js
/**
 * 判断传入的子组件是否为空，不是空的继续调用traverseAllChildrenImpl
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }
  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
```
这个方法用以判断传入的子组件是否为空，不是空的再继续调用`traverseAllChildrenImpl`方法。
这里要注意的是，参数中的`callback`并不是我们传入的回调函数，而是之前在`mapIntoWithKeyPrefixInternal`
中传入的`mapSingleChildIntoContext`。
### 五、releaseTraverseContext()
:::warning
此方法是 mapIntoWithKeyPrefixInternal() 方法中包括的三个重要方法之一。
:::
```js
function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
```
在前面通过`getPooledTraverseContext`获得到的`context`对象在使用过后，会通过这个方法将对象内属性清空并重新放入对象池中（当对象池还有空间时）。

看到这里就会有一个疑问。最开始的时候对象池为空，于是直接返回了一个新的`context`对象，使用完之后，通过
`releaseTraverseContext`方法放回对象池中。***而在又一次从对象池中获取对象的过程中，获得到的正是我们刚刚放进去的那一个，那么岂不是对象池中始终只有一个对象？我们接着往下看***。

### 六、traverseAllChildrenImpl()
```js
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext,
) {
  const type = typeof children;
  // 如果 children 为 undefined 或者 boolean，则 将 children 赋值为 null
  if (type === 'undefined' || type === 'boolean') {
    children = null;
  }
  // invokeCallback=true,才触发callBack执行
  let invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    // 判断传入子组件是不是单个对象以及类型的，
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          //如果props.children是单个ReactElement/PortalElement的话 必会触发invokeCallback=true
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }
  // 处理非数组的情况
  // 这里invokeCallback为true时调用callback，这里的callback是mapSingleChildIntoContext
  if (invokeCallback) {
    callback(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );
    return 1;
  }

  let child;
  let nextName;
  let subtreeCount = 0;
  const nextNamePrefix =
    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      // 是数组就递归执行，将数组的每一个子元素作为traverseAllChildrenImpl的第一个参数
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  } else {
    // 迭代器处理
    const iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      if (disableMapsAsChildren) {
        invariant(
          iteratorFn !== children.entries,
          'Maps are not valid as a React child (found: %s). Consider converting ' +
            'children to an array of keyed ReactElements instead.',
          children,
        );
      }

      if (__DEV__) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          if (!didWarnAboutMaps) {
            console.warn(
              'Using Maps as children is deprecated and will be removed in ' +
                'a future major release. Consider converting children to ' +
                'an array of keyed ReactElements instead.',
            );
          }
          didWarnAboutMaps = true;
        }
      }

      const iterator = iteratorFn.call(children);
      let step;
      let ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        // 遍历
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext,
        );
      }
    } else if (type === 'object') {
      let addendum = '';
      if (__DEV__) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead.' +
          ReactDebugCurrentFrame.getStackAddendum();
      }
      const childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum,
      );
    }
  }

  return subtreeCount;
}
```
:::warning
这部分代码是`React.map`实现的核心之一，我们逐段逐段的分析。
:::
```js
  const type = typeof children;
  // 如果 children 为 undefined 或者 boolean，则 将 children 赋值为 null
  if (type === 'undefined' || type === 'boolean') {
    children = null;
  }
  // invokeCallback=true,才触发callBack执行
  let invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    // 判断传入子组件是不是单个对象以及类型的，
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          //如果props.children是单个ReactElement/PortalElement的话 必会触发invokeCallback=true
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }
```
这段代码是用来判断传入的子组件的，主要是判断是不是单个对象以及类型。如果满足条件，则将`invokeCallback`置为`true`。
```js
  // 处理非数组的情况
  // 这里invokeCallback为true时调用callback，这里的callback是mapSingleChildIntoContext
  if (invokeCallback) {
    callback(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );
    return 1;
  }
```
若 invokeCallback 为 true 时调用 callback，这里的 callback 是 mapSingleChildIntoContext。
```js
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      // 是数组就递归执行，将数组的每一个子元素作为traverseAllChildrenImpl的第一个参数
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  }
```
这段代码则是用以处理传入的是数组的情况的。若为数组，则会遍历数组，并将数组中的每一个元素作为 `traverseAllChildrenImpl`的第一个参数，**递归**的调用自身。

### 七、mapSingleChildIntoContext()
前端总是强调 `invokeCallback` 为 true 时调用 `callback` 就是 `mapSingleChildIntoContext`
```js
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  //  traverseContext,
  //  children,
  const {result, keyPrefix, func, context} = bookKeeping;
  // func 就是我们在 React.Children.map(this.props.children, c => c)中传入的第二个函数参数
  let mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    // 数组递归展平
    // React.Children.map(this.props.children, c => [c, [c, [c]]])
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      // 创建一个新的ReactElement
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey,
      );
    }
    result.push(mappedChild);
  }
}
```
在这个方法里，我们从`context`对象中获取到调用`React.map`时传入的回调函数，并执行。

下面这段代码解释了一开始的问题，为什么我们调用`React.map`，尽管预期是一个二维数组，而返回的却是一个一维数组。

```js
if (Array.isArray(mappedChild)) {
// 数组递归展平
// React.Children.map(this.props.children, c => [c, [c, [c]]])
  mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
}
```
如果执行我们传入的回调函数后返回的是一个数组，那么则会将这个数组作为参数，重新走一遍调用 `React.map` 之后的流程，且此时传入的回调函数就只返回本身。

:::tip 对象池中是不是一直只有一个对象？
在当我们传入的回调函数不返回一个数组时确实是这样的，但当返回一个数组，甚至是多维数组时，在此处由于会多次重走流程，于是也会多次向对象池获取对象，然而第一次获取到的对象此时还未被放回对象池中。于是便会直接返回一个新的对象，当整个方法调用完成后，对象池中便会存在多个对象了。
:::

## 总结
整个 React.Children.map 的流程图如下所示：
![React.Children.map 的流程图](/images/library-react-children-map.png)
上面整个流程图清晰的描述了整个 React.Children.map 的流程，整个核心代码实际上不难，重点是一步一步的跟下来，明白其中的原理。React.Children 其他方法也和这个类似，这里就不一一的讲解。

## 相关链接
- [React 源码阅读—React.Children.map](https://blog.csdn.net/hjc256/article/details/99943772)


