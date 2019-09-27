# javaScript高级程序设计读书笔记

1.在ECMAScript中所有函数的参数都是按值传递的(可以把函数的参数想象成局部变量)

```javascript
function setName(obj) {
    obj.name = "aa";
    obj = new Object();
    obj.name = "bb";
}
var person = new Object();
setName(person);
console.log(person); // person.name = "aa";
```

2.使用var语句声明的变量会自动被添加到最接近的环境中

3.基本类型的值在内存中占据固定大小的空间, 因此被保存到栈内存中

4.引用类型的值是对象, 保存在堆内存中

5.标记清除是目前主流的垃圾收集算法

6.有多个可选参数的情况下, 可以使用对象字面量封装多个可选参数

7.正则表达式中的元字符: ( [ { \ ^ $ | ? * + . } ] )

8.传给RegExp构造函数的参数的元字符必须双重转义

9.ECMASript规定使用正则表达式字面量必须像直接调用RegExp构造函数一样,每次都创建新的实例

10.函数名实际上是一个指向函数对象的指针(函数是对象, 函数名是指针)

11.每当读取一个基本类型值的时候, 后台就会创建一个对应的基本类型的包装对象

```javascript
var s1 = "some text";
var s2 = s1.substring(2);

// 上面代码的内部流程
/*
    var s1 = new String("some text"); // 1. 创建String类型的实例
    var s2 = s1.substring(2); // 2. 在实例上调用这个方法
    s1 = null; // 3. 销毁这个实例

*/
```

12.引用类型与基本包装类型的主要区别在于对象的生存期. 使用new操作符创建的引用类型的实例, 在执行流离开当前作用域之前都一直保存在内存中. 而自动创建的基本包装类型的对象, 则指存在于一行代码的执行瞬间, 然后立即被销毁.

13.replace方法的参数也可以是一个函数. 在只有一个匹配项的情况下, 会向这个函数传递3个函数: 模式的匹配项,
模式匹配项在字符串中的位置和原始字符串. 如果存在多个捕获组的情况下, 传递给函数的参数依次是模式的匹配项, 第一个捕获组,
第二个捕获组......, 当最后两个参数仍然是模式的匹配项在字符串中的位置和原始字符串.
具名组匹配在原来的基础上新增了最后一个函数参数: 具名组构成的一个对象.

14.Web浏览器将全局对象Global作为window对象的一部分加以实现

15.每创建一个函数, 就会同时创建他的prototype对象, 这个对象也会自动获得constructor属性.

16.构造函数实例中的指针仅指向原型, 而不指向构造函数.

17.构造函数在不返回值的情况下, 默认会返回新对象的实例.
而通过在构造函数的末尾添加return语句, 可以重写调用构造函数时返回的值(只有return引用类型的值才会重写).

18.组合继承

```javascript
/*
    组合继承: 将原型链和借用构造函数的技术组合到一块
    使用原型链实现对原型属性和方法的继承, 而通过借用构造函数来实现对实例属性的继承
*/
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    console.log(name);
};

function SubType(name, age) {
    // 使用借用构造函数继承实例的属性
    SuperType.call(this);
    this.age = age;
}

// 使用原型链实现对原型属性和方法的继承
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
    console.log(this.age);
};
```

19.寄生组合式继承

```javascript
/*
    寄生组合式继承: 通过构造函数继承属性, 通过原型链的混成方式来继承方法
    本质上, 就是使用寄生式继承来继承超类的原型, 然后再将结果指定给子类型的原型
*/

function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
```

19.闭包只能取得包含函数中任何变量的最后一个值

```javascript
function createFunctions() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        // result[i] = function() {
        //     return i;
        // };

        result[i] = function(num) {
            return function() {
                return num;
            }
        }(i);
    }

    return result;
}
```

20.匿名函数的执行环境具有全局性, 因此其this对象通常指向window.

```javascript
var name = "The Window";
var object = {
    name: 'My object',
    getName: function() {
        return this.name;
    }
};

/*
    赋值语句的返回值就是所赋的值(也就是右边的值)
    (object.getName = object.getName)()相当于下面这段代码
    (function() {
        return this.name;
    })();
*/
(object.getName = object.getName)(); // "The Window"
```

21.NodeList对象是基于DOM结构动态执行查询的结果, 因此DOM结构的变化能够自动反应在NodeList对象中.

```javascript
function convertToArray(nodes) {
    var array = null;

    try {
        array = Array.prototype.slice.call(nodes, 0);
    } catch(err) {
        array = new Array();

        for (var i = 0, len = nodes.length; i < len; i++) {
            array.push(nodes[i]);
        }
    }

    return array;
}
```

22.每个节点都有一个属性ownerDocument, 该属性指向表示整个文档的文档节点.

23.cloneNode方法不会复制添加到DOM节点中的JavaScript属性, 例如事件处理程序等.
这个方法只复制特性, (在明确指定的情况下也复制)子节点, 其他的一切都会复制.

24.documentElement属性始终指向HTML页面中的html元素. body属性指向body元素.

25.对于HTML页面传给getElementsByTagName()的标签名是不区分大小写的

26.如果在一个包含两个或多个的文本节点的父元素上调用normalize()方法, 则会将所有的文本节点合并成一个节点.
浏览器在解析文档是永远不会创建相邻的文本节点. 这种情况只会在执行DOM操作的结果出现.

27.动态加载js和css文件

```javascript
function loadScriptString(code) {
    var script = document.createElement('script');
    script.type = "text/javascript";

    try {
        script.appendChild(document.createTextNode(code));
    } catch(err) {
        script.text = code;
    }

    document.body.appendChild(script);
}

function loadStyleString(css) {
    var style = document.createElement('style');
    style.type = 'text/css';

    try {
        style.appendChild(document.createTextNode(css));
    } catch(err) {
        style.styleSheet.cssText = css;
    }

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}
```

28.DOM操作往往是JavaScript程序中开销最大的部分, 而因访问NodeList导致的问题最多.
NodeList对象都是"动态的", 这就意味着每次访问NodeList对象, 都会运行一次查询.
有鉴于此, 最好的办法就是尽量减少DOM操作.

29.判断DOM节点的包含关系

```javascript
/*
    判断节点是不是另一个节点的后代
    compareDocumentPosition方法返回16表示给定的节点是参考节点的后代
*/
function contains(refNode, otherNode) {
    if (typeof refNode.contains === 'function') {
        return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition === 'function') {
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        var node = otherNode.parentNode;

        do {
            if (node === refNode) {
                return true;
            } else {
                node = node.parentNode;
            }
        } while (node !== null);

        return false;
    }
}
```

30.defaultView属性保存着一个指针, 指向拥有给定文档的窗口

31.获取偏移量

```javascript
/*
    获取元素在页面上的偏移量
*/
function getElementLeft(elem) {
    var actualLeft = elem.offsetLeft;
    var current = elem.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft
}

function getElementTop(elem) {
    var actualTop = elem.offsetTop;
    var current = elem.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop
}
```

32.获取浏览器视口大小

```javascript
/*
    获取浏览器视口大小
*/
function getViewport() {
    // 混杂模式下
    if (document.compatMode == 'BackCompat') {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
}
```

33.获取元素在页面中相对于视口的位置

```javascript
/*
    获取元素在页面中相对于视口的位置
    elem.getBoundingClientRect()方法返回元素在页面中相对于视口的位置
*/
function getBoundingClientRect(elem) {
    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;

    if (elem.getBoundingClientRect) {
        if (typeof arguments.callee.offset !== 'number') {
            var temp = document.createElement('div');
            temp.style.cssText = 'position:absolute;left:0;top:0;';
            document.body.appendChild(tmep);
            // 获取元素相对于的偏移量
            arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }

        var rect = elem.getBoundingClientRect();
        var offset = arguments.callee.offset;

        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset
        };
    } else {
        var actualLeft = getElementLeft(elem);
        var actualTop = getElementTop(elem);

        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + elem.offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + elem.offsetHeight - scrollTop
        };
    }
}
```

34.var range = document.createRange().
range.selectNode()方法选择整个节点, 包括其子节点
range.selectNodeContents()方法则只选择节点的子节点
select()方法选区文本域的内容
HTMLInputElement.setSelectionRange方法可以从一个被focused的input元素中选中特定范围的内容.

35.image元素不一定要从添加到文档后才开始下载, 只要设置了src属性就会开始下载

36.DOMContentLoaded事件在形成完整的DOM树之后就会触发, 不理会图像, JavaScript文件, CSS文件或其他的资源是否已经下载完毕.

37.只要代码中包含了finally子句, 那么无论try还是catch语句块中的return语句都将被忽略.

38.JSON字符串必须使用双引号, 在使用JSON.stringify()序列化一个对象时, 所有的函数及原型成员都会被有意忽略.
