# React使用总结
探索一下我对react的理解。
## React历史发展
### jQuery时代
在jquery主流的时代，web页面是靠ajax获取后端数据。然后使用jQuery生成
dom结构更新到页面上。随着业务的发展，项目越来越复杂，我们每次请求到数据
或者数据发生更改时，我们就需要重新组装一下DOM结构，然后更新页面。这样频繁的操作
DOM，也使我们页面的性能慢慢的降低。

痛点：**手动同步DOM和数据、频繁的操作DOM**。
### 双向数据绑定MVVM
要解决手动同步DOM和数据的问题，就出现了MVVM模型。MVVM可以实现在数据修改的同时
去更新DOM，DOM的更新也可以同步到数据的更改。这个可以大大降低我们手动维护DOM的
成本。**React虽然属于单向数据流，但是可以手动实现双向数据绑定。**
### 虚拟DOM
虽然有MVVM自动操作DOM，但是没有从根本上解决频繁的操作DOM的问题。为了解决这个
问题，React内部实现了一套虚拟DOM的结构，也就是用js模拟的一套DOM结构。他的作用是
将真实的DOM结构在js中做一套缓存，每次数据更改的时候，react内部先使用算法（即名声显赫的diff算法），
对DOM结构进行对比，找到需要新增、删除、更新的DOM节点，然后一次性对真实的DOM进行更新，
这样可以大大降低操作DOM的次数。

diff算法的运作过程：
- 递归所有虚拟dom的节点，逐层级，逐顺序进行比较。
- 类型不同的节点，会直接删除原来的节点，并用新的节点来代替。
- 节点类型相同，会对比这个节点的所有属性。
  - 如果这个节点的所有属性都相同，那么判断这个节点不需要更新。
  - 如果节点的属性不相同，那么只会更新这个节点的属性。
- 对于同一层的元素，如果只改变了顺序，diff会根据key去优化。
  - 有key，算法只需要调整一下虚拟DOM的顺序即可，不用删除重建。
  - 无key，会严格按照顺序进行比较，发现不同就销毁，重建。

::: tip 虚拟DOM的其他优势
- 将虚拟DOM作为一个兼容层，让我们还能对接非web端的系统，实现跨端开发，这就是RN的思想。
- 同样的，通过虚拟DOM我们可以渲染到其他的平台，比如渲染到SSR，同构渲染等。
- 实现组件的高度抽象化。
:::

### 状态管理
react设计之初主要负责ui层渲染，每个组件有自己的状态，当状态发生变化时，需要使用setState来更新我们的组件。
但如果我们想渲染一个组件的兄弟组件，我们就需要将组件的状态提升到父组件当中，让父组件来管理这两个组件的渲染，
当我们的组件的层次越来越深的时候，状态需要一直往下传，无疑加大了我们代码的复杂度。所以我们需要一个**状态管理中心**，
来帮我们管理state。

#### Redux
这个时候，出现了redux。我们可以将所有的状态交给redux去管理，当我们的某一个state有变化的时候，依赖这个state的组件
就会进行一次重渲染。这样就解决了我们一直把state往下传的问题。redux有action和reducer的概念。
- action是修改state的来源。
- reducer是唯一确定reducer如何变化的入口。

通过以上规范，使得redux的数据流变得非常的清晰。同时也暴露了redux的复杂，**本来那么简单的功能，却需要写那么多的代码**

#### Mobx
后来，有了另一套解决方案，就是mobx，他推崇简约易懂，只需要定义一个可观测的对象store。哪个组件需要状态就需要
状态就进行状态注入，store中的状态改变，会通知注入过状态的组件进行更新。

而且 mobx 内部实现了 shouldComponentUpdate 用来解决常用的性能问题，这使得我们使用 mobx 开发项目的时候可以简单快速的完成很多功能。
但随着项目的不断变大，mobx 也不断暴露出了它的缺点，就是数据流太随意，不好追溯数据的流向，这个缺点正好体现出了 redux 的优点所在，所以针对于小项目来说，
社区推荐使用 mobx，对大项目推荐使用 redux。

#### Context API
随着 react 生态不断发展，状态管理已成为 react 生态圈必不可少的技术，react 官方也在 v16.3.0 版本上推出了自带的状态管理 API。
```jsx harmony
// 创建context
const ThemeContext = React.createContext('light');

class ThemeProvider extends React.component{
  state = { theme: 'light' };

  render() {
    return (
      // 给子组件提供 context
      <ThemeContext.Provider value={this.state.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    return (
      // 子组件使用 context
      <ThemeContext.Consumer>
        {theme => <Button theme={theme} />}
      </ThemeContext.Consumer>
    );
  }
}
```

## React性能优化
我们都知道，React渲染分为两个阶段：
- 生成虚拟DOM。
- 虚拟DOM渲染成真实的DOM。
其中，虚拟 dom 渲染成真实 dom 的过程，这部分是 React 内置的功能，
我们不需要再进行优化，所以我们探讨一下生成虚拟 dom 阶段的优化。
- 避免直接操作DOM，将与DOM操作的事交于React去做。
- 由于DOM diff算法问题，建议同一层级的组件，加上key属性。方便 react 进行 dom diff 时能够保持复用，而不至于直接创建一个新的元素。
- 抽离无状态组件，无状态组件渲染时不需要 new 实例化，可以提高 js 效率；由于无状态组件基于函数式编程思想，同样的属性，必定会渲染出相同的内容，可以起到缓存作用。
- 使用 immutable 库，避免修改引用类型造成副作用，高效实现对象深拷贝，比传统的 deepClone 效率高。
- 抽离 render 函数中的变量和方法，避免每一次 render 方法执行都要重新创建一次。例如我们常常使用 bind 函数区绑定 this，应提前到 constructor 中。
- 使用 PureComponent 代替 Component，相当于是用 shouldComponentUpdate 做了一次浅比较，可以优化不必要的渲染，但对于引用类型的属性，应做好 immutable 处理，以免造成组件不会渲染等问题。
- 使用 react hooks 编写高度可复用的函数式组件，编写更少的代码，更精炼的生命周期实现更高的性能。






