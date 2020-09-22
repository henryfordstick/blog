# 实现一个eventEmitter，拥有四个方法on, off, once 和 trigger
先理清两个概念，发布订阅（eventEmitter）和观察者模式，它们两个具体有什么关系呢？

**发布订阅是观察者模式的一个变种(升级版)**

## 观察者模式
观察者模式定义了对象间一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

观察者模式有一个别名叫“发布-订阅模式”，或者说是“订阅-发布模式”，订阅者和订阅目标是联系在一起的，当订阅目标发生改变时，逐个通知订阅者。

## 发布订阅模式
*实际上24种基本的设计模式中并没有发布订阅模式，他只是观察者模式的一个别称*。

但是经过时间的沉淀，似乎他已经强大了起来，已经独立于观察者模式，成为另外一种不同的设计模式。

在现在的发布订阅模式中，称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为消息代理或调度中心或中间件，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者。

上图解释一下概念！
![发布订阅](/images/发布订阅.png)
- 消息中心：负责存储消息与订阅者之间的关系，有消息触发时，负责通知订阅者。
- 订阅者：去消息中心订阅消息。
- 发布者：通过消息中来发布自己的消息。


## 观察者模式和发布订阅模式的区别
![发布订阅和观察者区别](/images/发布订阅和观察者区别.png)

**观察者模式：** 观察者（Observer）直接订阅（Subscribe）主题（Subject），而当主题被激活的时候，会触发（Fire Event）观察者里的事件。

**发布订阅模式：** 订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Topic），当发布者（Publisher）发布该事件（Publish topic）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

**总结一下：** 
##### 从表面上讲
- 观察者模式里，只有两个角色 —— 观察者 + 被观察者。
- 而发布订阅模式里，却不仅仅只有发布者和订阅者两个角色，还有一个消息中心。

##### 往更深层次讲
- 观察者和被观察者，是松耦合的关系。
- 发布者和订阅者，则完全不存在耦合。

##### 从使用层面上讲
- 观察者模式，多用于单个应用内部。
- 发布订阅模式，则更多的是一种跨应用的模式(cross-application pattern)，比如我们常用的消息中间件。

***总之，他们都是实现了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。***

## 代码实现发布订阅
追根溯源理解了他们的概念和思想以后，接下来回归主题手动实现一个发布订阅。
```javascript
/**
 * 实现一个EventEmitter类，这个类包含一下方法：on/off/once/trigger
 * 1、on 添加订阅者（往消息中心添加事件）。同一个事件名称可能有多个订阅者。
 * 2、off 删除订阅者 如果不传callback，则删除订阅者，否则仅删除callback对应的订阅者
 * 3、once 添加订阅者，但订阅者只接收一次消息，以后就不再接收了。
 * 4、trigger 发布事件，遍历指定的事件，然后循环触发订阅者。
 */

class EventEmitter{
    constructor(){
        this.eventQueue = {};
    }
    // 添加订阅者，这里往消息中心添加事件。同一个订阅名称可能会有多个订阅者。
    on(eventName,callback){
        this.eventQueue[eventName] = this.eventQueue[eventName] || [];
        this.eventQueue[eventName].push(callback);
    }
    
    // 删除订阅者，如果不传callback，则全部删除，否则仅删除对应的callback
    off(eventName,callback){
        if(this.eventQueue[eventName]){
            this.eventQueue[eventName] = callback ? this.eventQueue[eventName].filter(x => x !== callback) : [];
        } else {
            return false;
        }
    }
    
    // 添加订阅者，但是只执行一次
    once(eventName,callback){
        let fn = (...args) => {
            callback.apply(null,args);
            this.off(eventName,fn);
        };
        this.on(eventName,fn);
    }

    trigger(eventName,...args){
        if(this.eventQueue[eventName]){
            this.eventQueue[eventName].forEach((fn) => fn(...args))
        }
    }
}
// ------------------ 测试用例 --------------------
let test = new EventEmitter();

test.on('name',(name) => {
    console.log(name + '第一个订阅');
});

test.on('name',(name) => {
    console.log(name + '第二个订阅');
});

test.on('name',(name) => {
    console.log(name + '第三个订阅');
});

test.trigger('name','李四'); // 这里三个订阅者同时收到消息

test.once('name',(name) => { // 这里添加一个订阅一次的订阅者
    console.log(name + '第四个订阅'); 
});

test.trigger('name','张三'); // 这里四个订阅者同时收到消息

test.trigger('name','小红'); // 这里只触发三个订阅者，因为第四个订阅者只订阅了一次
```

## 相关链接
- [发布订阅模式与观察者模式](https://blog.csdn.net/hf872914334/article/details/88899326)
- [观察者模式 vs 发布订阅模式](https://zhuanlan.zhihu.com/p/51357583)











