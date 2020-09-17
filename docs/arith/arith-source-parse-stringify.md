# JSON.stringify 和 JSON.parse
### 1、JSON.stringify
方法将一个 JavaScript 对象或值转换为 JSON 字符串
#### 语法
`JSON.stringify(value[, replacer [, space]])`

`value` 将要序列化成 一个 JSON 字符串的值。

`replacer（可选）` 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化

`space （可选）` 指定缩进用的空白字符串，用于美化输出。
#### 特点
- 类型会自动转换成对应的原始值。
- undefined、任意函数以及symbol，会被忽略(出现在⾮数组对象的属性值中时)，或者被转换成 null (出现在数组中时)。
- 不可枚举的属性会被忽略。
- 如果⼀个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略。
```typescript
function jsonStringify(obj:unknown):string {
    let type = typeof obj;
    if(type !== "object" || type === null){
        if(/string|undefined|function/.test(type)){
            obj = '"' + obj +'"';
        }
        return String(obj);
    } else {
        let json = [];
        let arr: boolean = (obj && obj.constructor === Array);
        for (let k in obj){
            let v = obj[k];
            let type = typeof v;
            if(/string|undefined|function/.test(type)){
                v = '"' + v + '"'
            } else {
                v = jsonStringify(v);
            }
            json.push((arr ? "" : '"' + k + '":') + String(v))
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}")
    }
}

jsonStringify({x : 5}); // "{"x":5}"
jsonStringify([1, "false", false]) // "[1,"false",false]"
jsonStringify({b: undefined}) // "{"b":"undefined"}"
```
### 2、JSON.parse
- 用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的reviver函数⽤以在返回之 前对所得到的对象执⾏变换(操作)
- 避免在不必要的情况下使⽤ eval ，eval() 是⼀个危险的函数， 他执⾏的代码拥有着执⾏者的 权利。如果你⽤ eval()运⾏的字符串代码被恶意⽅（不怀好意的⼈）操控修改，您最终可能会 在您的⽹⻚/扩展程序的权限下，在⽤户计算机上运⾏恶意代码
```typescript
function jsonParse(opt) {
    let rx_one = /^[\],:{}\s]*$/;
    let rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    let rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-
]?\d+)?/g;
    let rx_four = /(?:^|:|,)(?:\s*\[)+/g;

    if (
        rx_one.test(
            opt
                .replace(rx_two, "@")
                .replace(rx_three, "]")
                .replace(rx_four, "")
        )
    ) {
        return eval("(" + opt + ")");
    }
    return null;
}

// Function版本
let jsonStr = '{ "age": 20, "name": "jack" }';
let json = (new Function('return ' + jsonStr))();
```
看到上面的代码，你是否对那么复杂的正则感到头晕呢？反正我是很晕，所以我找了一个非常好用的正则可视化工具 Regexper 来帮我看懂这些正则，如下图所示。
想了解关于JSON.parse更多知识，请[跳转](https://github.com/youngwind/blog/issues/115)
