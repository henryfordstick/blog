# 深入Typescript系列（一）
> Typescript 官方文档内容繁杂，学习复习的成本高，次系列文章就是整理ts常用的方法。

Typescript简称ts（接下来文中用ts表述），是Javascript的超集。
<br/>
<img src="/images/basis-ts.png" width="30%">
<br/>
ts可以使用js上在提案中的一些语法特性，最主要的是ts是**静态语言**。
:::tip 静态语言
 简单来说，⼀⻔语⾔在编译时报错，那么是**静态语⾔**，如果在运⾏时报错，那么是**动态语⾔**。
::: 
### ts的缺点
- 与实际的框架结合会很坑
- 配置学习成本高
- Typescript的类型系统其实很复杂
### ts的优点
ts的优势也总结为三点：
- 规避⼤量低级错误，避免时间浪费，省时
- 减少多⼈协作项⽬的成本，⼤型项⽬友好，省⼒
- 良好代码提⽰，不⽤反复⽂件跳转或者翻⽂档，省⼼

知道这些以后，接下来就正式开始学习ts的内容:heart:！！！
## 基础变量
js的基础类型有 string、number、undefined、null、boolean、Symbol。

ts增加的基础有 void（空值）、bigint(大数整数类型)、any（表示任何类型）、
unknown（表示任何类型）、never（表示哪些永远不存在值的类型）。

:::tip 类型注意事项
- `any`类型是多⼈协作项⽬的⼤忌，很可能把Typescript变成AnyScript，通常在不得已的情况下， 不应该⾸先考虑使⽤此类型。
- `unknown` 和 `any`都可以表示任何类型，但是当 unknown 类型被确定是某个类型之前,它不能被进⾏任何操作⽐如实例化、getter、函数执⾏等等。
- `never` 类型表⽰的是那些永不存在的值的类型，never 类型是任何类型的⼦类型，也可以赋值给任何类型。
:::
接下来上代码理解一下！
```typescript
let isDone: boolean = false;  // 布尔类型

let decLiteral: number = 6;   // 数字类型
let hexLiteral: number = 0xf00d;

let myName: string = 'Tom';   // 字符串类型


// 没有返回值的函数为void
function alertName(): void {
  alert('My name is Tom');
}
//声明一个 void 类型的只能将它赋值为 undefined 和 null
let unusable:void = undefined;


// 没有明确的值 ts会进行类型推导 声明变量的时候不一定非得指定类型。
let myFavoriteNumber = 'seven';
// 等价于
let myFavoriteNumber2: string = 'seven';


// never 抛出异常的函数永远不会有返回值 
function error(message: string): never {
  throw new Error(message); 
} 
// 空数组，⽽且永远是空的
const empty: never[] = [];


// 联合类型-> 多个类型中选择其中一个
function getString(something: string | number): string {
  return something.toString();
}

//interface类型设置
interface Person {
  readonly id: number; // 只读属性
  name: string;
  age?: number;
  // 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
  // [propName: string]: string; 错误示范
  [propName: string]: any; //任意属性
}
let henry:Person = {
  id: 12345,
  name: 'henryford',
  age: 25,
  sex: '男'
};
```

## 对象类型
#### 1、数组
数组有两种定义方式，⼀种是使⽤泛型，另一种是在元素后面加上`[]`。
```typescript
let fibonacci: number[] = [1, 1, 2, 3, 5]; 
let fibonacci2: Array<number> = [1, 1, 2, 3, 5];

// --------- 用接口表示数组 ---------
interface NumberArray {
  [index: number]: number;
}
let fibonacci3: NumberArray = [1, 1, 2, 3, 5];

// --------- 类数组 ---------
function sum(){
  // 型参表示
  let args: IArguments = arguments;
}
```
#### 2、枚举类型
枚举类型是很多语⾔都拥有的类型,它⽤于声明⼀组命名的常数,当⼀个变量有⼏种可能的取值时,可以将它定义为枚举类型。
```typescript
// 枚举类型
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Days['Sun']); // 0
console.log(Days[0]); // 'Sun'

enum Days2 {
  Sun = 7,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Days2['Sun']); // 7
```




