# JS 中常用的设计模式
设计模式来源于建筑学，是面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。
- 工厂模式
- 单例模式
- 代理模式
- 命令模式
- 观察者模式
- 职责链模式

## 工厂模式
使用工厂模式代替 new 操作符的一种模式，虽然可能多做一些工作，但是会给系统带来更大的可扩展性和尽量少的修改量。
```typescript
abstract class Noodles {
  // 描述面条长什么样子
  public abstract desc():void;
}

class LZNoodles extends Noodles{
  public desc():void{
    console.log('兰州拉面');
  }
}

class InstantNoodles extends Noodles{
  public desc():void{
    console.log('泡面😄');
  }
}

class BuckleNoodles extends Noodles{
  public desc():void{
    console.log('扣面');
  }
}

// 工厂
class SimpleNoodlesFactory{
  public static Type_LZ: number = 1;
  public static Type_Instant: number = 2;
  public static Type_Buckle: number = 3;

  public static createNoodles(type: number){
    switch (type) {
      case SimpleNoodlesFactory.Type_LZ:
        return new LZNoodles();
      case SimpleNoodlesFactory.Type_Instant:
        return new InstantNoodles();
      case SimpleNoodlesFactory.Type_Buckle:
      default:
        return new BuckleNoodles();
    }
  }
}

const noodles:Noodles = SimpleNoodlesFactory.createNoodles(SimpleNoodlesFactory.Type_LZ);
noodles.desc();
```

## 单例模式
对业务的封装，保证一个类只有一个实例，并提供一个访问他的全局访问点。
```typescript
class Singleton {
  private static instance: Singleton = null;

  constructor() {}
  public static getInstance():Singleton{
    if(this.instance === null){
      return new Singleton();
    }
    return this.instance;
  }
}

Singleton.getInstance();
```
## 代理模式
为一个对象提供一个代替品或者占位符，以便控制对他的访问
```typescript
interface IUserDao {
  save():void;
}

class UserDao implements IUserDao{
  public save():void {
    console.log("--------以保存数据--------");
  }
}

class UserDaoProxy implements IUserDao{
  private target: IUserDao;
  constructor(target: IUserDao) {
    this.target = target;
  }

  public save():void {
    console.log('开始事物');
    this.target.save();
    console.log("--------以保存数据--------");
  }
}

const target: UserDao = new UserDao();
const proxy: UserDaoProxy = new UserDaoProxy(target);
proxy.save();
```

## 命令模式
命令模式解决了 js 的 if 和 else 问题
```typescript
// 1、接收者
class Receiver {
  public action(){
    console.log("执行操作");
  }
}

// 2、抽象命令角色
interface Command {
  execute():void;
}

// 具体命令角色类
class ConCreateCommand implements Command{
  private receiver: Receiver = null;
  constructor(receiver: Receiver) {
    this.receiver = receiver;
  }
  execute(): void {
    this.receiver.action();
  }
}

// 3.调用命令的人
class Invoker {
  private command: Command = null;
  constructor(command: Command) {
    this.command = command;
  }
  public action():void{
    this.command.execute();
  }
}

// 4.执行层
const receiver: Receiver = new Receiver();
const command: Command = new ConCreateCommand(receiver);
const invoker: Invoker = new Invoker(command);

//发送指令 -> 接收指令 -> 执行指令
invoker.action();
```

## 观察者模式
详情查看[实现一个 eventEmitter，拥有四个方法 on, off, once 和 trigger](/arith/arith-source-emitter.html)
## 职责链模式
使多个对象都有机会处理请求，从而避免请求发送者和接受者之间的耦合关系。将这些关系形成一条链，并沿着这条链处理该请求，直到一个对象处理它为止。
```typescript
abstract class Handler {
  public successer: Handler;
  //定义一个抽象方法 处理请求
  public abstract handlerRequest(user: string, days: number): void;
  //获取当前角色的下一个处理者的角色
  public getNextHandler(): Handler {
      return this.successer;
  }
  //设置当前角色的下一个处理者的角色
  public setNextHandler(successer: Handler): void {
      this.successer = successer;
  }
}

//班主任
class HeadTeacher extends Handler {
    public handlerRequest(user: string, days: number): void {
        if (days < 5) {
            console.log("班主任同意", user, "同学请假请求")
        } else {
            console.log("班主任无法处理请求");
        }
        if (this.getNextHandler() != null) {
            const nextHandler = this.getNextHandler();
            nextHandler.handlerRequest(user, days);
            return;
        }
        return null;
    }
}
//院系主任
class Department extends Handler {
    public handlerRequest(user: string, days: number): void {
        if (days < 30) {
            console.log("院系领导同意", user, "同学请假请求")
        } else {
            console.log("院系领导无法处理请求");
        }
        if (this.getNextHandler() != null) {
            const nextHandler = this.getNextHandler();
            nextHandler.handlerRequest(user, days);
            return;
        }
        return null;
    }
}
//学校的领导
class Leader extends Handler {
    public handlerRequest(user: string, days: number): void {
        if (days >= 30) {
            console.log("校级领导", user, "同学请假请求")
        } else if (this.getNextHandler() != null) {
            const nextHandler = this.getNextHandler();
            nextHandler.handlerRequest(user, days);
            return;
        }
        return null;
    }
}

class SimpleFactory {
    public static TYPE_HeadTeacher: number = 1;
    public static TYPE_Department: number = 2;
    public static TYPE_Leader: number = 3;
    public static createHandler(type: number): Handler {
        switch (type) {
            case SimpleFactory.TYPE_HeadTeacher:
                return new HeadTeacher();
            case SimpleFactory.TYPE_Department:
                return new Department();
            case SimpleFactory.TYPE_Leader:
            default:
                return new Leader();
        }
    }
}

const h1: Handler = SimpleFactory.createHandler(SimpleFactory.TYPE_HeadTeacher);
const h2: Handler = SimpleFactory.createHandler(SimpleFactory.TYPE_Department);
const h3: Handler = SimpleFactory.createHandler(SimpleFactory.TYPE_Leader);

h1.setNextHandler(h2);
h2.setNextHandler(h3);
h1.handlerRequest("李四", 35);
```
