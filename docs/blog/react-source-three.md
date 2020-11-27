# React 源码分析（三）React Fiber
Fiber 是对 React 核心算法的重构，也是 React 最重要的概念。
- 为什么要用 Fiber 调度
- Fiber 的实现原理
- 总结
- 相关链接

## 为什么要用 Fiber 调度
1. React16 以前的调度算法，使用 JS 引擎自身的函数调用栈，采用自顶向下递归，更新整个子树，这个过程不可打断，不可取消。如果子树特别大的话，主线程就会一直被占用，会造成页面的掉帧，出现卡顿。

2. React16 推出的 Fiber 调度，分为两个阶段，一是 reconciliation 阶段，二是 commit 阶段。
    - **调度阶段（reconciliation）**：fiber 在执行过程中以 fiber 为基本单位，每执行完一个 fiber，都会有一个询问是否有优先级更高的任务的一个判断，如果有优先级更高的任务进来，就中断当前执行，先执行优先级更高的任务。这个阶段会进行 dom diff， 生成 workInProgressTree,并标记好所有的 side effect。
        - 数据结构变成了链表结构
        - 任务+过期时间和设置优先级
        - reconciliation 可以被打断，不会渲染到页面上的；
    - **渲染阶段（commit）**：处理所有的 side effect， 执行更新操作，此阶段不可中断。

3. Fiber 的中文解释是"纤程"，是线程的颗粒化的一个概念。也就是说一个线程可以包含多个 Fiber。<br/>
Fiber 的出现使大量的同步计算可以被拆解、异步化，使浏览器主线程得以调控。从而使我们得到了以下权限：
    - 暂停运行任务
    - 恢复并继续执行任务。
    - 给不同的任务分配不同的优先级。

Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有优先级更高的任务，那就去做优先级高的任务。

## Fiber 的实现原理
React Fiber 的做法是不使用 Javascript 的栈，而是将需要执行的操作放在自己实现的栈对象上。这样就能在内存中保留栈帧，以便更加灵活的控制调度过程，例如我们可以手动操纵栈帧的调用。这对我们完成调度来说是至关重要。

那么 Fiber 调度 进行 diff 计算的时候，会生成一棵 Fiber 树。这棵树是在 Virtual DOM 树的基础上增加额外的信息来生成的，它本质上来说是一个链表。
![fiber树的结构](/images/FiberRoot.png)
Fiber 树在首次渲染的时候会一次性生成，在后续需要 diff 的时候，会根据已有的树和最新的 Virtual DOM 的信息，生成一颗新的树。
这棵树每生成一个新的节点，就会将控制权交回给主线程，去检查有没有优先级更高的任务需要执行，如果没有，则继续构建树的过程。
![fiber树的更新过程](/images/fiber-root-state.png)
如果有优先级更高的任务需要执行，则 Fiber Reconciler 会丢弃正在生成的树，在空闲的时候重新执行一遍。

在构造 Fiber 树的过程中，Fiber Reconciler 会将需要更新的节点信息保存在 Effect List 当中，在渲染阶段执行的时候，会批量的更新相应的节点。

## ReactDOM.render 分析
因为整个执行的过程是从 ReactDOM.render 开始的，所以从这里分析整个执行的过程。

[react 的 3 种启动方式](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html#why-so-many-modes):
- **Legacy 模式**: `ReactDOM.render(<App />, rootNode)`，这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
- **Concurrent 模式**: `ReactDOM.createRoot(rootNode).render(<App />)`，目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。
- **Blocking 模式**:`ReactDOM.createBlockingRoot(rootNode).render(<App />)`，做为 Legacy 和 Concurrent 之间的过渡。

接下来我们从 Legacy 模式入手开始分析源码：
:::warning
为了更加清晰的展示出代码细节和作用，以下对源码部分略有删改。
:::
### 一、render()
```js
export function render(
  //元素
  element: React$Element<any>,
  //容器
  container: Container,
  //应用渲染结束后，调用的函数
  callback: ?Function,
) {
  //错误抓取
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  if (__DEV__) {
    const isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;
    if (isModernRoot) {
      console.error(
        'You are calling ReactDOM.render() on a container that was previously ' +
          'passed to ReactDOM.createRoot(). This is not supported. ' +
          'Did you mean to call root.render(element)?',
      );
    }
  }
  // render方法本质是返回了函数legacyRenderSubtreeIntoContainer
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    //hydrate下面是true， true是让服务端尽可能复用节点，提高性能
    false, // render不会复用节点，因为是前端渲染。
    callback,
  );
}
```
render 的方法本质是返回了 `legacyRenderSubtreeIntoContainer` 函数。

### 二、legacyRenderSubtreeIntoContainer()
```js
// null, element, container, false, callback,
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,  // children 组件
  container: Container, // container dom节点
  forceHydrate: boolean,
  callback: ?Function, // callback 返回函数
) {
  // render中一般渲染的是DOM标签，所以不会有_reactRootContainer存在，
  // 所以第一次渲染，root是不存在的
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    // 创建reactRoot，在dom元素上挂载
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    // 封装了callBack函数,判断是否有callback
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        // 根据fiberRoot获取公共Root实例
        // 就是fiberRoot.current.child.stateNode
        const instance = getPublicRootInstance(fiberRoot); // 获取公共根实例
         // 通过该实例instance 去调用originalCallback方法
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 所谓批处理就是 如 多个 setState 合并到一起才执行
    // 初始化不走批处理逻辑
    unbatchedUpdates(() => {
      // element, fiberRoot, null, callback
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```
由于是第一次渲染更新，所以 root 是 null，只需看 !root 的情况。初始化不走非批处理逻辑`unbatchedUpdates`（立即执行）。

接下来三，四分析一下其中重要的两个方法`legacyCreateRootFromDOMContainer` 和 `updateContainer`；

### 三、legacyCreateRootFromDOMContainer()
创建一个 ReactRooter。
```js
function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  // 是否是服务端渲染
  const shouldHydrate =
    // render的forceHydrate是false，所以会调用shouldHydrateDueToLegacyHeuristic方法来判断是否是服务端渲染
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // /如果不是服务端渲染的话
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // 循环删除container的子节点
    // 为什么要删除？因为React认为这些节点是不需要复用的
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  //container是空的container,0,false
  //ReactRoot是同步的
  //sync 同步
  //async 异步
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```
### 四、updateContainer()
unbatchedUpdates(fn)的简化源码如下：
```js
unbatchedUpdates(fn){
  return fn()
}
```
updateContainer()的作用是更新 container
```js
// updateContainer为啥返回一个ExpirationTime？
// 1. 拿到FiberNode
// 2. 设置expirationTime
// 3. 封装callback
// 4. 新建一个update，添加到fiber的updateQuene里
// 5. scheduleWork (调度流程)
export function updateContainer(
  element: ReactNodeList, // 组件
  container: OpaqueRoot, // fiberFoot
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  // FiberNode
  const current = container.current;
  // 通过 msToExpirationTime 得到currentTime
  const currentTime = requestCurrentTimeForUpdate();

  // 当前批量更新的配置, 是一个全局对象
  const suspenseConfig = requestCurrentSuspenseConfig();
  // 根据给任务分优先级，来得到不同的过期时间
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  // 设置FiberRoot.context  首次执行返回一个emptyContext, 是一个 {}
  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  //   新建一个update
  //   expirationTime: expirationTime,
  //   tag: UpdateState,
  //   payload: null,
  //   callback: null,
  //   next: null,
  //   nextEffect: null,
  const update = createUpdate(expirationTime, suspenseConfig);

  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {

    update.callback = callback;
  }
  // update 添加到 fiber.updateQuene链表
  enqueueUpdate(current, update);
  // 调度和更新当前current对象(HostRootFiber)
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```
拿到 FiberNode，然后根据任务的优先级，得到不同的过期时间 expirationTime，这里重要的是 computeExpirationForFiber 函数，怎么来确定过期时间的。

接下来就是 `enqueueUpdate` 方法，将需要更新的 update 信息添加到 fiber.updateQueue 链表中。最后根据更新的信息做对比更新。

:::warning
这里重要的就是怎么分配优先级`computeExpirationForFiber`，然后就是根据分配好的优先级调度执行 `scheduleWork`。
:::
:::tip Root, ReactRoot, FiberRoot, FiberNode 之间的关系和属性
前面我们看了创建整个 Fiber 的流程，下面就理一理他们之间的关系和属性。
```js
// root = container._reactRootContainer._internalRoot
Root: {
  _reactRootContainer: RootType
}

RootType: {
  _internalRoot: FiberRoot
}

// 一个 ReactDOM.render 只会有一个 FiberRoot
FiberRoot: {
    // 当前应用对应的Fiber对象
    current: uninitializedFiber, FiberNode,
    // root节点 也就是哪个DOM根路径的节点
    containerInfo: containerInfo,
    // 指向当前已经完成准备工作的Fiber Tree Root， 在commit阶段处理
    // 已经处理过的工作和任务就会加到 finishedWork 中。
    finishedWork: null, // Fiber, 链表结构
    // 过期时间，一个非常重要的概念，每个节点都有一个过期时间。
    expirationTime: NoWork, // 这里标志的是一个优先级
}

FiberNode : {
    // FiberNode的类型
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    // Function|String|Symbol|Number|Object
    this.type = null;
    this.stateNode = null;
    // 深度优先遍历的
    // Fiber  表示父级 FiberNode
    this.return = null;
    // 表示第一个子 FiberNode
    this.child = null;
    // 表示紧紧相邻的下一个兄弟 FiberNode
    this.sibling = null;
    this.index = 0;
    // 拿到真实的dom实例
    this.ref = null;
    // 表示新的props  pendingProps 和 memoizedProps 表示旧的 props
    this.pendingProps = pendingProps;
    // 当前fiber的旧props
    this.memoizedProps = null;
    // 更新队列，队列内放着即将要发生的变更状态
    this.updateQueue = null; // 最终会遍历这个update链表
    // 表示经过所有流程处理后的当前的state
    this.memoizedState = null;
    this.contextDependencies = null;

    this.mode = mode;

    // effectTag 更新类型，例如， replace， delete， update
    this.effectTag = NoEffect; // 当需要替换，删除，更新时，来打的一个标记。
    // 下一个将要处理的副作用F
    this.nextEffect = null;
    // 第一个需要处理的副作用
    this.firstEffect = null;
    // 最后一个将要处理的副作用F
    this.lastEffect = null;
    // 过期时间是和优先级有关
    this.expirationTime = NoWork;
    // 子fiber中优先级最高的filber
    this.childExpirationTime = NoWork;
    // 连接上一个状态的fiber，储存了之前的镜像
    this.alternate = null; // 上一次更新时的旧的节点 Fiber = WorkInProgress.alternate   新的alternate会指向旧的，旧的会指向新的。
}
```
:::

### 五、computeExpirationForFiber()
根据给任务分优先级，来得到不同的过期时间。
```js
function computeExpirationForFiber(
  currentTime: ExpirationTime,
  fiber: Fiber,
  suspenseConfig: null | SuspenseConfig,
): ExpirationTime {
  const mode = fiber.mode;
  if ((mode & BlockingMode) === NoMode) {
    return Sync;
  }
  // 除NoPriority以外，这些都与Scheduler优先级相对应。 我们用
  // 递增数字，因此我们可以像数字一样比较它们。 他们从90开始避免与Scheduler的优先级冲突。
  // export const ImmediatePriority: ReactPriorityLevel = 99; // 立即执行，最高等级
  // export const UserBlockingPriority: ReactPriorityLevel = 98; // 用户输入
  // export const NormalPriority: ReactPriorityLevel = 97; // 正常优先级
  // export const LowPriority: ReactPriorityLevel = 96;
  // export const IdlePriority: ReactPriorityLevel = 95;
  // // NoPriority is the absence of priority. Also React-only.
  // export const NoPriority: ReactPriorityLevel = 90;
  const priorityLevel = getCurrentPriorityLevel();
  // 判断当前的mode不是 ConcurrentMode
  // react 新增了三种模式：
          // legacy(当前使用),
          // blocking（实验中，做迁移）,
          // concurrent （实验中，未稳定）
  if ((mode & ConcurrentMode) === NoMode) {
    return priorityLevel === ImmediatePriority ? Sync : Batched;
  }
  // 当前上下文是是RenderContext，则在render阶段中
  if ((executionContext & RenderContext) !== NoContext) {

    return renderExpirationTime;
  }

  let expirationTime;
  if (suspenseConfig !== null) {
    // 根据Suspense超时计算过期时间
    // 时间戳
    // 1.9 | 0  的结果是取整
    expirationTime = computeSuspenseExpiration(
      currentTime,
      suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION,
    );
  } else {

    switch (priorityLevel) {
      case ImmediatePriority:
        expirationTime = Sync;
        break;
      case UserBlockingPriority:
        expirationTime = computeInteractiveExpiration(currentTime);
        break;
      case NormalPriority:
      case LowPriority:
        expirationTime = computeAsyncExpiration(currentTime);
        break;
      case IdlePriority:
        expirationTime = Idle;
        break;
      default:
        invariant(false, 'Expected a valid priority level');
    }
  }

  if (workInProgressRoot !== null && expirationTime === renderExpirationTime) {
    expirationTime -= 1;
  }

  return expirationTime;
}
```
过期时间的计算，通过 | 做了一个批处理： 如 `1.9 | 0` 结果是 1，相当于一个取整的操作。
```js
// precision = 25
// 间隔时间在25ms内， 得到的 expritiontime 时间一样的
// 相当于对25ms内的任务做了一次批处理
function computeExpirationBucket(
  currentTime,
  expirationInMs, // 不同优先级任务会传不同的偏移量，把不同优先级的时间拉开差距
  bucketSizeMs,  // bucketSizeMs 越大，批处理的间隔就越大
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

// 25ms毫秒内，得到的过期时间是一样的
// 向上取整，间隔在 precision 内的两个 num 最终得到的相同的值 如：(60, 25)  (74, 25)， 在25ms内得到的值相同， 相当于做了一次批处理
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}
```
假如同时创建了 100 个任务，那么经过批处理以后的事件都差不多。不同优先级任务会传不同的偏移量，把不同优先级的时间拉开差距，然后就把优先级拉开了差距。

### 六、scheduleWork()
:::warning
React 的核心内容之一，根据优先级进行调度。
:::
```js
/**
 * 1. 先找到FiberRoot
 * 2. 判断是否有高优先级任务打断当前正在执行的任务
 * 3. if: expirationTime === Sync
 *    if: unbatchUpdateContext  调用 performSyncWorkOnRoot 同步的
 *    else: 执行 ensureRootIsScheduled  异步的
 * 4. 执行 ensureRootIsScheduled  => 最终执行后续流程的时候，仍然是执行的performSyncWorkOnRoot
 * @param {*} fiber
 * @param {*} expirationTime
 */
function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  // 检测最近的更新次数
  checkForNestedUpdates();
  warnAboutRenderPhaseUpdatesInDEV(fiber);
  // 找到 rootFiber 并遍历更新子节点的 expirationTime
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }
  // 判断是否有高优先级任务打断当前正在执行的任务
  checkForInterruption(fiber, expirationTime);
  recordScheduleUpdate();

  // 获取当前任务的优先级
  // if：onClick事件: currentPriorityLevel = UserBlockingPriority
  const priorityLevel = getCurrentPriorityLevel();

  // 同步立即执行
  if (expirationTime === Sync) {
    if (
      // 处于unbatchedUpdates中
      // executionContext 当前运行的上下文
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // 不在render阶段和commit阶段
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 注册或更新pendingInteractions——update的集合
      schedulePendingInteractions(root, expirationTime);

      // 传入FiberRoot对象, 执行同步更新
      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root);
      // 注册或更新pendingInteractions——update的集合
      schedulePendingInteractions(root, expirationTime);
      if (executionContext === NoContext) {
        // 立即更新同步队列
        // 故意将其放置在scheduleUpdateOnFiber而不是scheduleCallbackForFiber内，
        // 以保留在不立即刷新回调的情况下调度回调的功能。
        // 我们仅对用户启动的更新执行此操作，以保留旧版模式的历史行为。
        flushSyncCallbackQueue();
      }
    }
  } else {
    ensureRootIsScheduled(root);
    // 注册或更新pendingInteractions——update的集合
    schedulePendingInteractions(root, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    // 只有在用户阻止优先级或更高优先级的更新才被视为离散，即使在离散事件中也是如此
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    //这是离散事件的结果。 跟踪每个根的最低优先级离散更新，以便我们可以在需要时尽早清除它们。
    //如果rootsWithPendingDiscreteUpdates为null，则初始化它
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```
:::tip 关键流程
1. 当过期时间`expirationTime`为 Sync （立即执行时）
    - 判断 当前阶段 为 未批处理的更新内`LegacyUnbatchedContext`。
    - 并且 不在 `RenderContext` 和 `CommitContext` 阶段。
    - 执行 `performSyncWorkOnRoot`。
    - else 执行 `ensureRootIsScheduled`。
2. 否则 执行 `ensureRootIsScheduled`
:::
:::warning performSyncWorkOnRoot 和 ensureRootIsScheduled 区别
- `performSyncWorkOnRoot` 同步，立刻去走调度构建 Fiber，
- `ensureRootIsScheduled` 异步，会走任务系统，慢慢一个一个的调度，最后也会调度 `performSyncWorkOnRoot` 。

`performSyncWorkOnRoot` 是调用浏览器的主线程执行的，`ensureRootIsScheduled` 是一个宏任务。
:::
### 七、ensureRootIsScheduled()
```js
// 1. 判断是否有任务过期，设置最高优先级，需要立即执行
// 2. 没有新的任务,重置
// 3. 上一个任务还没有执行完，来了新的任务，判断优先级，如果上一个任务的优先级高，就继续执行之前的
//  否则取消之前的任务，准备调度新的
// 4. 执行scheduleSyncCallback/scheduleCallback => unstable_scheduleCallback
      // 1. 分成了及时任务，和延时任务
      // 2. 在执行performSyncWorkOnRoot之前，会判断把延时任务加到及时任务里面来
      // 3. 如果任务超过了 timeout ,任务会过期
      // 4. 通过messageChanel，这个宏任务，来在下一次的事件循环里调用performSyncWorkOnRoot
// 5. 如果任务超过了 timeout ,任务会过期
function ensureRootIsScheduled(root: FiberRoot) {
  const lastExpiredTime = root.lastExpiredTime;
  // lastExpiredTime 初始值为 noWork，只有当任务过期时，会被更改为过期时间（markRootExpiredAtTime方法）
  if (lastExpiredTime !== NoWork) { // 说明已经有任务过期了，react的逻辑是立刻执行
    // 任务过期，需要立即执行，react中任务可以被插队，但是不能一直被插队，过期了就立即执行
    // 不同的运行时机，代码就会设置不同的优先级
    root.callbackExpirationTime = Sync;
    root.callbackPriority = ImmediatePriority;
    root.callbackNode = scheduleSyncCallback(
      performSyncWorkOnRoot.bind(null, root),
    );
    return;
  }
  // 获取下一个任务的到期时间。
  const expirationTime = getNextRootExpirationTimeToWorkOn(root);
  const existingCallbackNode = root.callbackNode;
  // 2. 没有新的任务, return
  // expirationTime 的 初始值是NoWork ，就意味着当前没有新的任务要执行
  if (expirationTime === NoWork) {
    // There's nothing to work on.
    if (existingCallbackNode !== null) {
      // 重置
      root.callbackNode = null;
      root.callbackExpirationTime = NoWork;
      root.callbackPriority = NoPriority;
    }
    return;
  }

  // 获取当前时间与任务的优先级
  const currentTime = requestCurrentTimeForUpdate();
  const priorityLevel = inferPriorityFromExpirationTime(
    currentTime,
    expirationTime,
  );

  // 上一个任务还没有执行完，来了新的任务，判断优先级，如果上一个任务的优先级高，就继续执行之前的
  // 否则取消之前的任务，准备调度新的
  // 1. ensureRootIsScheduled 这个函数，是经常会被调用的
  // 2. 宏任务里，执行调度
  // 3. 等着执行你的后续的dom-tree, 对比
  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority;
    const existingCallbackExpirationTime = root.callbackExpirationTime;
  //  上一个任务的优先级高，继续执行， 否则取消之前的任务，准备调度新的
    if (
      existingCallbackExpirationTime === expirationTime &&
      existingCallbackPriority >= priorityLevel
    ) {
       // 优先级高，继续调度历史任务
      return;
    }
    // 优先级低，中断之前的任务，准备调度新的。
    cancelCallback(existingCallbackNode);
  }

  root.callbackExpirationTime = expirationTime;
  root.callbackPriority = priorityLevel;

  let callbackNode;
  // 最高的优先级
  if (expirationTime === Sync) {
    // 1. 把callback添加到syncQueue中
    // 2. 以Scheduler_ImmediatePriority调用Scheduler_scheduleCallback
    callbackNode = scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  } else if (disableSchedulerTimeoutBasedOnReactExpirationTime) {
    callbackNode = scheduleCallback(
      priorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  } else {
    callbackNode = scheduleCallback(
      priorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
      // 设置了过期时间
      {timeout: expirationTimeToMs(expirationTime) - now()},
    );
  }

  // callbackNode为unstable_scheduleCallback方法返回的newTask
  root.callbackNode = callbackNode;
}
```
核心步骤：
1. 有过期任务, 把`fiberRoot.callbackNode`设置成同步回调
```js
root.callbackExpirationTime = Sync;
root.callbackPriority_old = ImmediatePriority;
root.callbackNode = scheduleSyncCallback(
  performSyncWorkOnRoot.bind(null, root),
);
```
2. 没有新的任务, 退出调度
3. 有历史任务(fiberRoot.callbackNode !== null)
    - 新旧任务的过期时间相等, 且旧任务的优先级 >= 新任务优先级, 则退出调度.(新任务会在旧任务执行完成之后的同步刷新钩子中执行)
    - 新旧任务的过期时间不同, 或者且旧任务的优先级 < 新任务优先级, 会取消旧任务.
4. 根据 expirationTime 调用不同的 scheduleCallback, 最后将返回值设置到 fiberRoot.callbackNode
:::tip scheduleSyncCallback 和 scheduleCallback 的区别
1. scheduleSyncCallback:
    - 把 callback 添加到 syncQueue 中
    - 如果还未发起调度, 会以 Scheduler_ImmediatePriority 执行调度 Scheduler_scheduleCallback
2. scheduleCallback:
    - 推断当前调度的优先级(legacymode 下都是 ImmediatePriority)
    - 执行调度 Scheduler_scheduleCallback

两个函数最终都调用了 Scheduler_scheduleCallback => unstable_scheduleCallback。
:::
下面是创建调度的流程图:
![创建调度](/images/ensure-root-isschdeuled.9565075b.png)
### 八、unstable_scheduleCallback
```js
/**
 * 0. unstable_scheduleCallback有延时任务和立即任务
 * 1. 创建新的task
 * 2. 根据task.startTime和currentTime的比较
 * 3. 执行requestHostCallback，
 * 4. 请求主线程回调, 或者主线程延时回调
 * @param {*} priorityLevel 优先级
 * @param {*} callback performSyncWorkOnRoot
 * @param {*} options 可能有，也可能没有
 */
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();

  var startTime;
  var timeout;
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    // 如果有delay参数，则是延时任务，startTime=currentTime + delay
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
    // 得到本次调度的时间
    timeout =
      typeof options.timeout === 'number'
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else {
    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }
  // 生成过期时间
  var expirationTime = startTime + timeout;
  // 新建task
  var newTask = {
    id: taskIdCounter++,
    // performSyncWorkOnRoot
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }
  // 如果是及时任务加入到taskQueue
  // 如果是延时任务加入到timerQueue
  // 只有taskQueue中的任务才会被调度执行
  // 通过advanceTimers函数可以把timerQueue中时间到了的任务添加到taskQueue
  if (startTime > currentTime) {
    // 延时任务， 把延时任务加到timerQueue， timerQuene只是一个容器，不会立即使用它
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 及时任务加到taskQueue，会立即使用这个任务
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
```
核心步骤：
1. 新建`task`对象(基本属性如下图)
    - 将回调函数挂载到 `task.callback` 之上
    ![taskCallback](/images/task.c279b8db.png)
2. 把`task`对象加入到一个队列中(注意: 这里的 2 个队列都是小顶堆数组, 保证优先级最高的任务排在最前面)
    - 如果是及时任务加入到 `taskQueue`
    - 如果是延时任务加入到 `timerQueue`
    - 只有 `taskQueue` 中的任务才会被调度执行
    - 通过 `advanceTimers` 函数可以把`timerQueue`中优先级足够的任务添加到`taskQueue`
    ![taskqueue](/images/queue.8acc9190.png)
3. 请求调度
    - 及时任务直接调用`requestHostCallback(flushWork)`
    - 定时器任务调用`requestHostTimeout`, 当定时器触发之后也会间接调用`requestHostCallback(flushWork)`
    - `requestHostCallback`通过`MessageChanel`的 api 添加一个宏任务,使得最终的回调`performWorkUntilDeadline`在下一个事件循环才会执行

### 九、performWorkUntilDeadline()
```js
// 在超过deadline时执行任务
 // 1. 执行flushwork
  // 2. 判断有没有更多的任务，有更多的任务，在下一个事件循环里再继续调用performWorkUntilDeadline（异步的递归）
  // 好处就是它是一个宏任务，不会持续占着主线程
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // 设置截止时间，刚开始为5ms，后面渐渐动态调整
    deadline = currentTime + yieldInterval;
    const hasTimeRemaining = true;
    try {
      // 执行回调, 返回是否还有更多的任务
      // scheduledHostCallback为传入的callback，此处为flushWork
      // 执行flushwork——递归执行taskQuene里的callBack，也就是 performSyncWorkOnRoot
      const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
      if (!hasMoreWork) {
        // 没有更多任务, 重置消息循环状态, 清空回调函数
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      } else {
        // 有多余的任务, 分离到下一次事件循环中再次调用performWorkUntilDeadline, 进行处理
        // If there's more work, schedule the next message event at the end
        // of the preceding one.
        port.postMessage(null);
      }
    } catch (error) {
      // If a scheduler task throws, exit the current browser task so the
      // error can be observed.
      port.postMessage(null);
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
  // Yielding to the browser will give it a chance to paint, so we can
  // reset this.
  needsPaint = false;
};
// 通过messageChannel双通道来处理任务，messageChannel属于宏认为，异步执行
const channel = new MessageChannel(); // 宏任务
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
// 请求主线程回调, 最快也要下一次事件循环才会调用callback, 所以必然是异步执行
requestHostCallback = function(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
};
```
调度循环的逻辑可以表示如下:
![调度循环的逻辑](/images/requesthostcallback.4605fe3b.png)
当执行完`scheduledHostCallback`之后, 会返回一个`boolean`值表示是否还有新的任务, 如果有新任务, 会再次执行`port.postMessage(null)`, 在下一次事件循环中继续执行回调(flushWork)

`scheduledHostCallback`即`flushWork`, `flushWork`核心调用`workLoop`
:::tip MessageChannel
`MessageChannel` 是一个宏任务，他有两个通道，port1 和 port2。

当执行 `port1.postMessage` 则 `port2.onmessage`， 反过来也一样。

这个类似于递归，可以在下一个事件循环里调用原来的函数，但是这个任务可以被打断。
:::

flushWork->workLoop
### 十、workLoop()
```js
// 1. 根据当前时间把timeQuene里的任务添加到taskQuene中来
// 2. 逐个遍历taskQueue中的任务
// 3. 执行performSyncWorkOnRoot
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  // 根据当前时间把timeQuene里的任务添加到taskQuene中来
  advanceTimers(currentTime);
  // 逐一执行taskQueue中的任务, 直到任务被暂停或全部清空
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 当前任务还未过期, 但是已经超过时间限制, 会退出执行
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }
    const callback = currentTask.callback;
    if (callback !== null) {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      markTaskRun(currentTask, currentTime);
      // 执行callback
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
        markTaskYield(currentTask, currentTime);
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      // 根据当前时间把timeQuene里的任务添加到taskQuene中来
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  // Return whether there's additional work
  // 返回是否还有其他work
  if (currentTask !== null) {
    return true;
  } else {
    let firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
```
整个`scheduledHostCallback`回调的逻辑如下:
![scheduledHostCallback](/images/scheduledhostcallback.0c47242c.png)

最后如果返回 false 退出调度, 如返回 true,则回到`performWorkUntilDeadline`中准备下一次回调

注意: 其中用红色字体标记的逻辑判断调度暂停 (isSchedulerPaused) 和让出控制权 (shouldYieldToHost()) 在 legacyMode 下都是不会成立的

## 总结
以上内容 介绍了 React 的初始化 和调度过程，初始化的内容在文中已经做了总结，包括 FiberRoot 和 FiberNode 的具体结构。
接下来主要总结一下整个调度过程，这一个过程还是比较绕的。

1. 调用`ensureRootIsScheduled`作为开启调度的入口
2. 根据规则准备执行调度
    - 有过期任务, 执行同步调度(`scheduleSyncCallback`). 把返回值设置到`fiberRoot.callbackNode`。
    - 没有新的任务, 退出调度
    - 有历史任务(`FiberRoot.callbackNode !== null`)
        - 新旧任务的过期时间相等, 且旧任务的优先级 >= 新任务优先级, 则退出调度.(新任务会在旧任务执行完成之后的同步刷新钩子中执行)
        - 新旧任务的过期时间不同, 或者且旧任务的优先级 < 新任务优先级, 会取消旧任务.
    - 根据`expirationTime`执行不同的调度(`scheduleSyncCallback`或`scheduleCallback`), 最后将返回值设置到`fiberRoot.callbackNode`
3. 设置调度优先级和回调函数
    - scheduleSyncCallback:

        - 把`performConcurrentWorkOnRoot`添加到`syncQueue`中
        - 如果还未发起调度, 设置当前调度的优先级`Scheduler_ImmediatePriority`
        - 发起调度`Scheduler_scheduleCallback`, 设置回调为`flushSyncCallbackQueueImpl`
    - scheduleCallback:

        - 推断当前调度的优先级(`legacymode` 下都是`ImmediatePriority`)
        - 发起调度`Scheduler_scheduleCallback`, 设置回调为`performConcurrentWorkOnRoot`
4. 发起调度

   - 新建`task`, 将 3 中的回调函数挂载到`task.callback`之上
       - 及时任务: 把`task`加入到`taskQueue`中
       - 延时任务: 把`task`加入到`timerQueue`中
   - 请求调度
       - 设置回调
           - 及时任务: 直接调用`requestHostCallback(flushWork)`, 设置回调为`flushWork`
           - 延时任务
               - 调用`requestHostTimeout(handleTimeout)`设置定时器回调
               - 定时器触发之后调用`requestHostCallback(flushWork)`, 设置回调为`flushWork`
           - `requestHostCallback`函数把`flushWork`设置为`scheduledHostCallback`
       - 添加宏任务
           - `requestHostCallback`通过`MessageChanel`的 `api` 添加一个宏任务,使得最终的回调`performWorkUntilDeadline`在下一个事件循环才会执行

5. 执行调度

   - 循环执行任务队列`taskQueue`中的任务
   - 检测调度环境
       - 是否需要暂停
       - 是否需要把控制权让出给浏览器
   - 退出循环
       - 检测当前任务是否已经执行完成(可能有暂停的任务)
       - 检测定时器队列`timerQueue`中是否有新的任务
       - 如后续还有任务, 返回`true`, 反之返回`false`
6. 结束调度
   - 判断`scheduledHostCallback`的返回值
   - 如为`true`. 会再次执行`port.postMessage`, 在下一次事件循环中继续执行回调(`flushWork`)
   - 如为`false`. 结束调度.

## 相关链接
- [图解 React](http://www.7km.top/)

