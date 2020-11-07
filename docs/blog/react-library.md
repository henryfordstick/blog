# React 使用总结
探索一下我对 react 的理解。
## React 历史发展
### jQuery 时代
在 jQuery 主流的时代，web 页面是靠 ajax 获取后端数据。然后使用 jQuery 生成
DOM 结构更新到页面上。随着业务的发展，项目越来越复杂，我们每次请求到数据
或者数据发生更改时，我们就需要重新组装一下 DOM 结构，然后更新页面。这样频繁的操作
DOM，也使我们页面的性能慢慢的降低。

痛点：**手动同步 DOM 和数据、频繁的操作 DOM**。
### 双向数据绑定 MVVM
要解决手动同步 DOM 和数据的问题，就出现了 MVVM 模型。MVVM 可以实现在数据修改的同时
去更新 DOM，DOM 的更新也可以同步到数据的更改。这个可以大大降低我们手动维护 DOM 的
成本。**React 虽然属于单向数据流，但是可以手动实现双向数据绑定。**
### 虚拟 DOM
虽然有 MVVM 自动操作 DOM，但是没有从根本上解决频繁的操作 DOM 的问题。为了解决这个
问题，React 内部实现了一套虚拟 DOM 的结构，也就是用 js 模拟的一套 DOM 结构。他的作用是
将真实的 DOM 结构在 js 中做一套缓存，每次数据更改的时候，react 内部先使用算法（即名声显赫的 diff 算法），
对 DOM 结构进行对比，找到需要新增、删除、更新的 DOM 节点，然后一次性对真实的 DOM 进行更新，
这样可以大大降低操作 DOM 的次数。

diff 算法的运作过程：
- 递归所有虚拟 dom 的节点，逐层级，逐顺序进行比较。
- 类型不同的节点，会直接删除原来的节点，并用新的节点来代替。
- 节点类型相同，会对比这个节点的所有属性。
  - 如果这个节点的所有属性都相同，那么判断这个节点不需要更新。
  - 如果节点的属性不相同，那么只会更新这个节点的属性。
- 对于同一层的元素，如果只改变了顺序，diff 会根据 key 去优化。
  - 有 key，算法只需要调整一下虚拟 DOM 的顺序即可，不用删除重建。
  - 无 key，会严格按照顺序进行比较，发现不同就销毁，重建。

::: tip 虚拟 DOM 的其他优势
- 将虚拟 DOM 作为一个兼容层，让我们还能对接非 web 端的系统，实现跨端开发，这就是 RN 的思想。
- 同样的，通过虚拟 DOM 我们可以渲染到其他的平台，比如渲染到 SSR，同构渲染等。
- 实现组件的高度抽象化。
:::

### 状态管理
react 设计之初主要负责 ui 层渲染，每个组件有自己的状态，当状态发生变化时，需要使用 setState 来更新我们的组件。
但如果我们想渲染一个组件的兄弟组件，我们就需要将组件的状态提升到父组件当中，让父组件来管理这两个组件的渲染，
当我们的组件的层次越来越深的时候，状态需要一直往下传，无疑加大了我们代码的复杂度。所以我们需要一个**状态管理中心**，
来帮我们管理 state。

#### Redux
这个时候，出现了 redux。我们可以将所有的状态交给 redux 去管理，当我们的某一个 state 有变化的时候，依赖这个 state 的组件
就会进行一次重渲染。这样就解决了我们一直把 state 往下传的问题。redux 有 action 和 reducer 的概念。
- action 是修改 state 的来源。
- reducer 是唯一确定 reducer 如何变化的入口。

通过以上规范，使得 redux 的数据流变得非常的清晰。同时也暴露了 redux 的复杂，**本来那么简单的功能，却需要写那么多的代码**

#### Mobx
后来，有了另一套解决方案，就是 mobx，他推崇简约易懂，只需要定义一个可观测的对象 store。哪个组件需要状态就需要
状态就进行状态注入，store 中的状态改变，会通知注入过状态的组件进行更新。

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

## React 性能优化
我们都知道，React 渲染分为两个阶段：
- 生成虚拟 DOM。
- 虚拟 DOM 渲染成真实的 DOM。
其中，虚拟 dom 渲染成真实 dom 的过程，这部分是 React 内置的功能，
我们不需要再进行优化，所以我们探讨一下生成虚拟 dom 阶段的优化。
- 避免直接操作 DOM，将与 DOM 操作的事交于 React 去做。
- 由于 DOM diff 算法问题，建议同一层级的组件，加上 key 属性。方便 react 进行 dom diff 时能够保持复用，而不至于直接创建一个新的元素。
- 抽离无状态组件，无状态组件渲染时不需要 new 实例化，可以提高 js 效率；由于无状态组件基于函数式编程思想，同样的属性，必定会渲染出相同的内容，可以起到缓存作用。
- 使用 immutable 库，避免修改引用类型造成副作用，高效实现对象深拷贝，比传统的 deepClone 效率高。
- 抽离 render 函数中的变量和方法，避免每一次 render 方法执行都要重新创建一次。例如我们常常使用 bind 函数区绑定 this，应提前到 constructor 中。
- 使用 PureComponent 代替 Component，相当于是用 shouldComponentUpdate 做了一次浅比较，可以优化不必要的渲染，但对于引用类型的属性，应做好 immutable 处理，以免造成组件不会渲染等问题。
- 使用 react hooks 编写高度可复用的函数式组件，编写更少的代码，更精炼的生命周期实现更高的性能。






