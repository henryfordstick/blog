# 05 | 原型链
这章详细聊聊 V8 是如何 实现 JS 的对象继承的。

简单地理解，**继承就是一个对象可以访问另外一个对象中的属性和方法**。如 B 对象继承了 A 对象，那么
B 对象就可以访问 A 对象中的属性和方法。

最典型的继承方式有**基于类的设计**和**基于原型继承的设计**。<br/>
C++、Java、C# 等都是基于类继承的设计模式，特点就是规则特别复杂。<br/>
JS 仅仅在对象中引入原型属性，就实现了语言的继承机制，这样使用特别简单。ES6 的 class 只是语法糖。

## 一、原型继承的实现
从 第 03 章 的内存快照中可以看出，JS 对象的每个属性都包含一个隐藏属性 __proto__，我们就把该隐藏属性
称为**对象的原型**，__proto__指向了内存中的另一个对象，称为该对象的**原型对象**，该对象可以直接使用
其原型对象的属性和方法。

当在对象身上寻找某个属性和方法的时候，如果对象本身没有，就会 从 __proto__ 指向的原型对象上去找，如果没有，
继续通过原型对象的 __proto__ 然后一级一级的往上找，最后找到 null 位置。我们把查找属性和方法的路径 __proto__ 叫做**原型链**。

继承的概念：**继承就是一个对象可以访问另外一个对象中的属性和方法，在JavaScript 中，我们通过原型和原型链的方式来实现了继承特性**。

## 二、利用 __proto__ 继承
```js

var animal = {
    type: "Default",
    color: "Default",
    getInfo: function () {
        return `Type is: ${this.type}，color is ${this.color}.`
    }
};
var dog = {
    type: "Dog",
    color: "Black",
};

// 使用dog 的 __proto__ 指向 animal
dog.__proto__ = animal;

dog.getInfo();
// "Type is: Dog，color is Black."
```
:::warning 隐藏属性
在实践应用中不能使用 __proto__ 来实现继承，或者修改原型的属性和方法。
- __proto__ 是隐藏属性，并不是标准定义的，不同浏览器实现的可能不一样，有些叫 `[[prototype]]`
- 其次就是使用该属性会造成性能问题。

正确的方法是使用 构造函数来创建对象。
:::

## 三、构造函数创建对象
```js
function DogFactory(type,color){
    this.type = type
    this.color = color
}

var dog = new DogFactory('Dog','Black');
```
通过 关键字 new 就可以实例化一个对象，那么 V8 在执行 new 的过程中做了哪些事情呢？

```js
// 模仿 new 实例化的过程。
function myNew(fn,...args){
  let obj = {}; // 1、初始化一个空对象
  obj.__proto__ = fn.prototype; // 2、将空对象的原型链指向构造函数的原型
  let ret = fn.apply(obj,args); // 3、将构造函数的 this 指向新创建的对象
  // 4、如果构造函数有返回一个对象，则返回构造函数的返回的对象，如果没有则返回新创建的obj对象
  if((typeof ret === "function" || typeof ret === "object") && ret !== null){
    return ret;
  }
  return obj;
}
```
## 四、构造函数实现继承
在介绍函数的时候，提到函数有两个隐藏的属性 name 和 code，但是实质上函数的隐藏属性不止这两个，还有 prototype。
![函数的隐藏属性](/images/ec19366c204bcc0b30b9b46448cbbee7.jpg)

实例化的对象的 原型链 都指向了 构造函数的原型。

那么构造函数怎么继承构造函数呢，也就是 ES6 里面的 class 继承的时候 使用 extends。那么 ES5 呢？
```js
// 有两个构造函数，Person 和 China，China 继承 Person。
function Person(name,age){
  this.name = name;
  this.age = age;
}

Person.sex = "男";

Person.prototype.say = function(){
  console.log(`大家好，我叫${this.name}，我今年${this.age}`);
};

function China(name,age){
  Person.call(this,name,age);
}

China.prototype = Object.create(Person.prototype,{
  constructor: {
    value: China
  }
});

for(let [key,value] of Object.entries(Person)){
  China[key] = value;
}

let ming = new China("小明",18);
ming.say();
console.log(China.sex);
```
## 五、原型，原型链和构造函数的区别
![原型，原型链和构造函数](/images/prototype-proto-constructor.png)
:::tip 要记牢两点
- `__proto__` 和 `constructor` 属性是对象所独有的
- `prototype` 是函数所独有的（但由于 JS 中函数也是对象，所以函数也有 `__proto__` 和 `constructor`）
:::

`__proto__`：属性的作用就是当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的__proto__属性所指向的那个对象（父对象）里找，一直找，直到__proto__属性的终点null，再往上找就相当于在null上取值，会报错。通过__proto__属性将对象连接起来的这条链路即我们所谓的原型链.

`prototype`：属性的作用就是让该函数所实例化的对象们都可以找到公用的属性和方法。

`constructor`：属性的含义就是指向该对象的构造函数。







