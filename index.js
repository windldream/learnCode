
function setName(obj) {
    obj.name = "aa";
    obj = new Object();
    obj.name = "bb";
}

var person = new Object();
setName(person);
console.log(person); // person.name = "aa";

// 1.在ECMAScript中所有函数的参数都是按值传递的(可以把函数的参数想象成局部变量).
// 2.使用var语句声明的变量会自动被添加到最接近的环境中.
// 3.基本类型的值在内存中占据固定大小的空间, 因此被保存到栈内存中.
// 4.引用类型的值是对象, 保存在堆内存中.
// 5.标记清除是目前主流的垃圾收集算法.
// 6.有多个可选参数的情况下, 可以使用对象字面量封装多个可选参数.
// 7.正则表达式中的元字符: ( [ { \ ^ $ | ? * + . } ] )
// 8.传给RegExp构造函数的参数的元字符必须双重转义.
// 9.ECMASript规定使用正则表达式字面量必须像直接调用RegExp构造函数一样,每次都创建新的实例.
// 10.函数名实际上是一个指向函数对象的指针(函数是对象, 函数名是指针).
// 11.每当读取一个基本类型值的时候, 后台就会创建一个对应的基本类型的包装对象.
var s1 = "some text";
var s2 = s1.substring(2);

/*
    var s1 = new String("some text"); // 1. 创建String类型的实例
    var s2 = s1.substring(2); // 2. 在实例上调用这个方法
    s1 = null; // 3. 销毁这个实例

*/

// 12.引用类型与基本包装类型的主要区别在于对象的生存期。使用new操作符创建的引用类型的实例,
// 在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象, 则指存在于一行代码的执行瞬间, 然后立即被销毁.
// 14.replace方法的参数也可以是一个函数。在只有一个匹配项的情况下, 会向这个函数传递3个函数: 模式的匹配项, 
// 模式匹配项在字符串中的位置和原始字符串. 如果存在多个捕获组的情况下, 传递给函数的参数依次是模式的匹配项, 第一个捕获组, 
// 第二个捕获组......, 当最后两个参数仍然是模式的匹配项在字符串中的位置和原始字符串.
// 具名组匹配在原来的基础上新增了最后一个函数参数: 具名组构成的一个对象.
// 15.Web浏览器将全局对象Global作为window对象的一部分加以实现
// 16.每创建一个函数, 就会同时创建他的prototype对象, 这个对象也会自动获得constructor属性.
// 17.构造函数实例中的指针仅指向原型, 而不指向构造函数. 
// 18.构造函数在不返回值的情况下, 默认会返回新对象的实例. 
// 而通过在构造函数的末尾添加return语句, 可以重写调用构造函数时返回的值(只有return引用类型的值才会重写).

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

/*
    寄生组合式继承: 通过构造函数继承属性, 通过原型链的混成方式来继承方法
    本质上, 就是使用寄生式继承来继承超类的原型, 然后再将结果指定给子类型的原型
*/

function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

// 19.闭包只能取得包含函数中任何变量的最后一个值

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

// 20.匿名函数的执行环境具有全局性, 因此其this对象通常指向window.

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

// 21.NodeList对象是基于DOM结构动态执行查询的结果, 因此DOM结构的变化能够自动反应在NodeList对象中.

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

// 22.每个节点都有一个属性ownerDocument, 该属性指向表示整个文档的文档节点.
// 23.cloneNode方法不会复制添加到DOM节点中的JavaScript属性, 例如事件处理程序等. 
// 这个方法只复制特性, (在明确指定的情况下也复制)子节点, 其他的一切都会复制.
// 24.documentElement属性始终指向HTML页面中的<html>元素. body属性指向<body>元素.
// 25.对于HTML页面传给getElementsByTagName()的标签名是不区分大小写的.
// 26.如果在一个包含两个或多个的文本节点的父元素上调用normalize()方法, 则会将所有的文本节点合并成一个节点.
// 浏览器在解析文档是永远不会创建相邻的文本节点. 这种情况只会在执行DOM操作的结果出现.

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

// 27.DOM操作往往是JavaScript程序中开销最大的部分, 而因访问NodeList导致的问题最多. 
// NodeList对象都是"动态的", 这就意味着每次访问NodeList对象, 都会运行一次查询.
// 有鉴于此, 最好的办法就是尽量减少DOM操作.


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

// 28.defaultView属性保存着一个指针, 指向拥有给定文档的窗口

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

// 29. var range = document.createRange(). 
// range.selectNode()方法选择整个节点, 包括其子节点
// range.selectNodeContents()方法则只选择节点的子节点
// select()方法选区文本域的内容
// HTMLInputElement.setSelectionRange 方法可以从一个被 focused 的 <input> 元素中选中特定范围的内容。
// 30.image元素不一定要从添加到文档后才开始下载, 只要设置了src属性就会开始下载
// 31.DOMContentLoaded事件在形成完整的DOM树之后就会触发, 不理会图像, JavaScript文件, CSS文件或其他的资源是否已经下载完毕.

/* 
    事件的处理方法
    事件的event对象的target只包含事件的实际目标(IE中则是srcElement)
*/

var EventUtil = {
    addHandler: function(elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        } else {
            elem['on' + type] = handler;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = true;
        }
    },
    removeHandler: function(elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if(event.detachEvent) {
            elem.detachEvent('on' + type, hander);
        } else {
            elem['on' + type] = null;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    getButton: function(event) {
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1: 
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 1;
                case 7: 
                    return 2;
            }
        }
    },
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return event.wheelDelta;
        } else {
            return -event.detail * 40;
        }
    },
    getCharCode: function(event) {
        if (typeof event.charCode == 'number') {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    }
};

// 32.只要代码中包含了finally子句, 那么无论try还是catch语句块中的return语句都将被忽略.

// 33.JSON字符串必须使用双引号, 在使用JSON.stringify()序列化一个对象时, 所有的函数及原型成员都会被有意忽略.

// 34.JavaScript引擎在扫描代码发现变量声明时, 要么将他们提升至作用域顶部(遇到var声明), 
// 要么将声明放到TDZ中(遇到let和const声明). 访问TDZ中的变量会触发运行时的错误.

// 35.当一个正则表达式添加了u修饰符, 它就从编码单元操作模式切换为字符模式.

// 36.函数参数有自己的作用域和临时死区, 其与函数体的作用域是各自独立的, 也就是说参数的默认值不可访问函数体内声明的变量. 

// 37.JavaScript函数有两个不同的内部方法:[[Call]]和[[Construct]]. 通过new关键字调用函数时, 执行的是[[Construct]]函数,
// 它负责创建一个通常称作实例的新对象, 然后在执行函数体, 将this绑定到实例上.
// 如果不通过new关键字调用函数, 则执行[[Call]]函数, 从而直接执行代码中的函数体.
// 不是所有函数都有[[Construct]]方法(比如箭头函数).因此不是所有函数都可以通过new来调用.

// 38.解构赋值的规则是, 只要等号右边的值不是对象或者数组, 就先将其转为对象.
// 由于undefined和null不是对象, 所以对他们进行解构赋值时就会报错.

// 39.y修饰符的作用与g修饰符类似, 也是全局匹配(后一次匹配都从上一次匹配成功的下一个位置开始).
// 不同之处在于, g修饰符只要在剩余的位置中存在匹配就行, 而y修饰符会确保匹配必须从剩余的第一个位置开始.

// 40.一般来说如果要绑定一个函数的this对象, 可以写成fn.apply(obj, args)的形式.
// 但是如果函数定义了自己的apply方法, 那么就可以写成Function.prototype.apply.call(fn, obj, args).
// 采用Reflect对象可以简化这种操作Reflect.apply(fn, obj, args);

// 41.Generator函数内部的yield语句本身没有返回值, 或者说总是返回undefined.

// 42.ES5的继承实质是先创造子类的实例对象this, 然后再将父类的方法添加到this上面(Parent.apply(this)).
// ES6的继承机制完全不同, 实质是先创造父类的实例对象this(所以必须先调用super方法), 然后再用子类的构造函数修改this.

// 43.ES6规定, 通过super调用父类的方法时, super会绑定子类的this. 由于绑定子类的this, 因此如果通过super对某个属性赋值, 这时super
// 就是this, 赋值的属性会变成子类实例的属性.

// 44.defer与async的区别是, 前者要等到整个页面正常渲染结束才会执行, 而后者一旦下载完成, 渲染引擎就会中断渲染,
// 执行这个脚本以后在渲染. 用一句话说就是defer是'渲染完再执行', async是'下载完再执行'.

// 45.词法作用域是写在代码或者说定义时确定的, 而动态作用域是在运行时确定的(this也是).
// 此法作用域关注函数在何处声明, 而动态作用域关注函数从何处调用.

// 46.Object.create(...)会凭空创建一个'新'对象并把新对象内部的[[prototype]]关联到你指定的对象

// 47.void运算符返回undefined

// 48.调用JSON.stringify()方法时, 如果参数的对象定义了toJSON()方法, 
// JSON字符串化时会首先调用该方法, 然后用它的返回值来进行序列化.

// 49.假值列表: undefined, null, false, NaN, 0, ""

// 50.任务队列的一种理解方式: 挂在事件循环队列的每个tick之后的一个队列.
// 在事件循环的每个tick中, 可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中,
// 而会在当前tick的任务队列末尾添加一个任务.

// 51.Function.apply.bind(f, null) 将f.apply函数体内的this固定为f 再将f函数体内的this固定为null

// 52.调用一个新的函数需要额外的一块预留内存来管理调用栈, 称为栈帧. 尾调用就是一个出现在另一个函数'结尾'处的函数调用.

// 53.闭包: 使得函数可以维持其创建时所在的作用域.

// 54.数组的索引范围:0 <= i <= Math.pow(2, 32) - 1, 在这个范围之外的所以被视为普通的属性键(字符串!).

// 55.正则表达式: 默认情况下量词是贪婪匹配的(尽可能多的匹配), 通过后面添加?可以勉强匹配(尽可能少的匹配).

// 56.正则表达式字面量写法会在加载时编译, 而构造函数会在运行时编译.

// 57.匹配一切: /(?:)/, 不匹配任何字符: /.^/.

// 58.间接调用eval()除了其自己的作用域只能访问全局的变量, 
// new Function()会创建全局作用域的函数(变量能访问全局作用域).

// 59.页面构建阶段的两个步骤: 1.解析HTML代码并构建文档对象模型(DOM) 2.执行JavaScript代码

// 60.无论何时创建函数, 都会创建一个与之相关联的词法环境, 并存储在名为[[Environment]]的内部属性上(也就是说无法直接访问或操作).

// 61.编写自递归函数的规则: 1.知道什么时候终止 2.决定怎样算一个步骤 3.把问题分解成一个步骤和一个较小的问题

// 62.SSR的优点: 1.利于SEO 2.加速首屏渲染 3.服务端可以和客服端共享某些代码, 避免重复定义

// 63.nodejs约定: 1.回调函数的第一个参数，必须是错误对象error 如果有错误发生，错误将通过第一个参数error返回
// 原因是一个有回调函数的函数，执行分两段，第一段执行完之后，任务所在的上下文环境就已经结束了。
// 在这以后抛出的错误，原来的上下文已经无法捕捉，只能当做参数，传入第二阶段
// 2. 第二个参数作为成功响应的数据， 如果没有异常， error会被设为null 第二个成功的数据就会被返回

// 64.如果使用循环, 程序的性能可能更高; 如果使用递归, 程序可能更容易理解.


{
    /**
     * 冒泡排序
     */
    function sortArr(arr) {
        let len = arr.length, i, j, count = 0, num;

        debugger;
        for (j = len - 1; j >= 0; j--) {
            for (i = len - 1; i >= 0; i--) {
                if (arr[i] < arr[i - 1]) {
                    num = arr[i];
                    arr.splice(i, 1);
                    arr.splice(i - 1, 0, num);
                }
                
            }

            count += 1;
        }
        
    }

    let arrs = [5, 9, 3, 1, 2, 8, 4, 7, 6, 11, 1];

    sortArr(arrs);
    console.log('111', arrs);
}


/**
 * 使用iteratorCallback迭代集合, 迭代完成后调用finalCallback
 * 怎么处理iteratorCallback是异步函数的情况
 */
function iterateSeries(collection, iteratorCallback, finalCallback) {
    let length = collection.length, index = 0;

    // for (index = 0; index < length; index++) {
    //     iteratorCallback(collection[index]);

    //     if (index === length - 1) {
    //         finalCallback()
    //     };
    // }

    function iterate(index) {
        if (index === length) {
            return finalCallback();
        }
        
        // 处理iteratorCallback是异步的情况
        iteratorCallback(collection[index], function(index) {
            iterate(index + 1);
        });
    }

    iterate(0);
}

{
    function handleConcurrency(tasks, concurrency, finishCallback) {
        let running = 0, completed = 0, index = 0, length = tasks.length;

        function next() {
            while (running < concurrency && index < length) {
                tasks[index](() => {
                    if (completed === length) {
                        return finishCallback();
                    }

                    completed += 1;
                    running -= 1;

                    next();
                });

                running++;
            }
        }

        next();
    }
}

{
    class TaskQueue {
        constructor(concurrency) {
            this.concurrency = concurrency;
            this.running = 0;
            this.queue = [];
        }

        pushStack(task) {
            this.queue.push(task);
            this.next();
        }

        next() {
            while (this.running < this.concurrency && this.queue.length) {
                const task = this.queue.shift();
                task(() => {
                    this.running--;
                    this.next();
                });
                this.running++;
            }
        }
    }
}

{
    /**
     * Node.js风格函数的promise化
     */
    function promisify(callbackBaseApi) {
        return function() {
            let args = [].slice.call(arguments);

            return new Promise((resolve, reject) => {
                args.push((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (arguments.length <= 2) {
                        resolve(result);
                    } else {
                        resolve([].slice.call(arguments, 1));
                    }
                });

                callbackBaseApi.apply(null, args);
            });
        };
    }
    
}

/**
 * redux-middleWare
 */
{
    function compose(...funs) {
        return (...args) => funs.reduceRight((compose, f) => f(compose), args);
    }

    function applyMiddleware(...middlewares) {
        return (createStore) => (reducer, preloadedState, enhancer) => {
            let store = createStore(reducer, preloadedState, enhancer);
            let dispatch = store.dispatch;
            let chain = [];

            // 对应下文logger的参数store
            const middlewareAPI = {
                getState: store.getState,
                // 使用匿名函数包裹着, 只要store.dispath变化了
                // 闭包中的dispatch也跟着变化
                dispatch: (action) => dispatch(action)
            };
            chain = middlewares.map(middleware => middleware(middlewareAPI));
            // store.dispatch对应着下文logger中的next
            dipatch = compose(...chain)(store.dispatch);

            return {
                ...store,
                 
            };
        };
    }

    function thunkMiddleware({ dispatch, getState }) {
        return next => action => {
            typeof action === 'function' ?
                action(dispatch, getState) :
                next(action);
        };
    }

    let logger = store => next => action => {
        console.log('dispatch:', action);
        next(action);
        console.log('finish', action);
    };

    function promiseMiddleware({ dispatch }) {
        return next => action => {
            if (!isFSA(action)) {
                return isPromise() ?
                    action.then(action) :
                    next(action);
            }
        }
    }
}



/**
 * 多异步串联
 */
const sequenceMiddlewart = ({dispatch, getState}) => next => action => {
    if (!Array.isArray(action)) {
        return next(action);
    }

    action.reduce((result, currAction) => {
        return result.then(() => {
            return Array.isArray(currAction) ?
                Promise.all(currAction.map((item) => dispatch(item))) :
                dispatch(currAction);
        });
    }, Preomise.resolve());
};

/**
 * reducer增强
 */
function undoable(reducer) {
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
        future: []
    };

    return function(state = initialState, action) {
        const {past, present, future} = state;

        switch (action.type) {
            case '@@redux-undo/UNDO':
                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);

                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future]
                };

            case '@@reudx-undo/REDO':
                const next = future[0];
                const newFuture = future.slice(1);

                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture
                };

            default:
                const newPresent = reducer(present, action);

                if (present === newPresent) {
                    return state;
                }

                return {
                    past: [...past, present],
                    present: newPresent,
                    future: []
                };
        }
    };
}

/**
 * compose组合
 */
function compose() {
    let args = [].slice.call(arguments, 0);

    if (args.length ===0) {
        return function(arg) {
            return arg;
        }
    }

    if (args.length === 1) {
        return args[0];
    }

    return args.reduce(function(a, b) {
        return function() {
            let innerArgs = [].slice.call(arguments, 0);
            return a(b.apply(null, innerArgs));
        }
    });
}


/**
 *  JSON解析器
 */
{
    var json_parse = function () {
        let at, 
            ch, 
            escapeChar = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                b: 'b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t'
            },

            text,

            error = function(m) {
                throw {
                    name: 'SyntaxError',
                    message: m,
                    at: at,
                    text: text
                };
            },

            next = function(c) {
                if (c && c !== ch) {
                    error('Expected "' + c + '" instead of "' + ch + '"');
                }

                ch = text.charAt(at);
                at += 1;
                return ch;
            },

            number = function() {
                var number,
                    string = '';

                if (ch === '-') {
                    string = '-';
                    next('-');
                }

                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }

                if (ch === '.') {
                    string += '.';

                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }

                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();

                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }

                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }

                number = +string;

                if (isNaN(number)) {
                    error('Bad number');
                } else {
                    return number;
                }
            },

            string = function() {
                let hex, 
                    i,
                    string = '',
                    uffff;
                
                if (ch === '"') {
                    while (next()) {
                        if (ch === '"') {
                            next();
                            return string;
                        } else if (ch === '\\') {
                            next();
                            if (ch ==='u') {
                                uffff = 0;
                                
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);

                                    if (!isFinite(hex)) {
                                        break;
                                    }

                                    uffff = uffff * 16 + hex;
                                }
                            } else if (typeof escapeChar[ch] === 'string') {
                                string += escapeChar[ch];
                            } else {
                                break;
                            }
                        } else {
                            string += ch;
                        }
                    }
                }

                error('Bad string');
            },

            white = function() {
                while (ch && ch <= ' ') {
                    next();
                }
            },

            word = function() {
                switch (ch) {
                    case 't':
                        next('t');
                        next('r');
                        next('u');
                        next('e');
                        return true;
                    case 'f':
                        next('f');
                        next('a');
                        next('l');
                        next('s');
                        next('e');
                        return false;
                    case 'n':
                        next('n');
                        next('u');
                        next('l');
                        next('l');
                        return null;        
                }

                error('Unexpected "' + ch + '"');
            },

            array = function() {
                var array = [];

                if (ch === '[') {
                    next('[');
                    white();

                    if (ch === ']') {
                        next(']');
                        return array;
                    }

                    while (ch) {
                        array.push(value());
                        white();

                        if (ch === ']') {
                            next(']');
                            return array;
                        }

                        next(',');
                        white();
                    }
                }

                error('Bad array');
            },

            object = function() {
                let key, 
                    object = {};

                if (ch === '{') {
                    next('{');
                    white();

                    if (ch === '}') {
                        next('}');
                        return object;
                    }

                    while (ch) {
                        key = string();
                        white();
                        next(':');
                        object[key] = value();
                        white();

                        if (ch === '}') {
                            next('}');
                            return object
                        }

                        next(',');
                        white();
                    }
                }

                error('Bad object');
            },

            value = function() {
                white();

                switch (ch) {
                    case '{':
                        return object();
                    case '[':
                        return array();
                    case '"':
                        return string();
                    case '-':
                        return number();
                    default:
                        return ch >= '0' && ch <= '9' ? number() : word();
                }
            };

            return function(source, reviver) {
                let result;

                text = source;
                at = 0;
                ch = ' ';
                result = value();
                white();
                if (ch) {
                    error('Syntax error');
                }

                return typeof reviver === 'function' ? 
                    function walk(holder, key) {
                        let k, v, value = holder[key];

                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }

                        return reviver.call(holder, key, value);
                    }({'': result}, '') : result;
            };

    }();
}

/**
 *  获取元素的实际宽高
 */
{
    function getWidthAndHeight(elem) {
        const PORPERTIES = {
            position: 'absolute',
            visibility: 'hidden',
            display: 'block'
        };
        const previous = {};

        for (let key in PORPERTIES) {
            previous[key] = elem.style[key];
            elem.style[key] = PORPERTIES[key];
        }

        const result = {
            width: elem.offsetWidth,
            height: elem.offsetHeight
        };

        for (let key in PORPERTIES) {
            elem.style[key] = previous[key];
        }

        return result;
    }
}

/**
 *  生成器驱动
 */
{
    function async(generator) {
        var iterator = generator();

        function handle(iteratorResult) {
            if (iteratorResult.done) return;

            const iteratorValue = iteratorResult.value;

            if (iteratorValue instanceof Promise) {
                iteratorValue.then(function(res) {
                    handle(iterator.next(res.value));
                }).catch(function(err) {
                    iterator.throw(err);
                });
            }
        }

        try {
            handle(iterator.next());
        } catch (e) {
            iterator.throw(e);
        }
    }
}

/**
 *  使用生成器遍历DOM树
 *  深度优先
 */
{
    function *DomTraversal(element) {
        yield element;
        element = element.firstElementChild;

        while (element) {
            yield *DomTraversal(element);
            element = element.nextElementSibling;
        }
    }
}

/**
 *  使用生成器遍历DOM树
 *  广度优先
 */
{
    function *DomTraversal(element) {
        yield element;
        element = element.firstElementChild;

        while (element) {
            yield element = element.nextElementSibling;          
        }

        DomTraversal(element); 
    }
}

/**
 *  自定义数组
 *  这个方法也不能继承数组的length行为
 */
{
    // function MyArray() {
    //     var superInstance = Array.apply(null, arguments);
    //     copyOwnPropertiesFrom(this, superInstance);
        
    //     function copyOwnPropertiesFrom(target, source) {
    //         Object.getOwnPropertyNames(source)
    //         .forEach(function(propKey) {
    //             var desc = Object.getOwnPropertyDescriptor(source, propKey);
    //             Object.defineProperty(target, propKey, desc);
    //         });

    //         return target;
    //     }
    // }

    // MyArray.prototype = Object.create(Array.prototype);
    // MyArray.prototype.constructor = MyArray;

    function MyArray() {
        Array.apply(this, arguments);
    }

    MyArray.prototype = Object.create(Array.prototype, {
        constructor: {
            value: MyArray,
            writable: true,
            configurable: true,
            enumerable: true
        }
    });
}

/**
 *  返回随机整数
 */
{
    function getRandomInteger(lower, upper) {
        if (arguments.length === 1) {
            upper = lower;
            lower = 0;
        }

        // Mtah.random() => 0 <= r < 1
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
}

/**
 *  手动实现new操作符
 */
{
    function newOperator(Constr, args) {
        var thisValue = Object.create(Constr.prototype); // 设置原型属性
        var result = Constr.apply(thisValue, args); // 设置实例属性

        if (typeof result === 'object' && result !== null) {
            return result;
        }

        return thisValue;
    }
}

/**
 *  复制属性
 */
{
    function copyObject(orig) {
        var copy = Object.create(Object.getPrototypeOf(orig));
        copyOwnPropertiesFrom(copy, orig);

        function copyOwnPropertiesFrom(target, source) {
            Object.getOwnPropertyNames(source)
            .forEach(function(propKey) {
                var desc = Object.getOwnPropertyDescriptor(source, propKey);
                Object.defineProperty(target, propKey, desc);
            });

            return target;
        }
    }
}

/**
 *  构造函数手动模拟apply()
 *  
 */
{
    if (!Function.prototype.construct) {
        Function.prototype.construct = function(argArray) {
            if (!Array.isArray(argArray)) {
                throw new TypeError('argument must be array');
            }

            var constr = this;
            var nullaryFunc = Function.prototype.bind.apply(
                constr, [null].concat(argArray));
        };

        // Function.prototype.construct = function(argArray) {
        //     var constr = this;
        //     var inst = Object.create(constr.prototype);
        //     var result = constr.apply(inst, argArray);

        //     return result ? result : inst;
        // };
    }
}

/**
 *  手工转换生成器
 */
{
    function foo1(url) {
        // 管理生成器的状态
        var state;
        // 生成器范围变量声明
        var val;

        function process(v) {
            switch (state) {
                case 1:
                    console.log('requesting:', url);
                    return request(url);
                case 2:
                    val = v;
                    console.log(val);
                    return;
                case 3:
                    var err = v;
                    console.log('Oops:', err);
                    return false;
            }
        }

        return {
            next: function(v) {
                if (!state) {
                    state = 1;
                    return {
                        done: false,
                        value: process()
                    };
                } else if (state == 1) {
                    state = 2;
                    return {
                        done: true,
                        value: process(v)
                    };
                } else {
                    return {
                        done: true,
                        value: undefined
                    };
                }
            },
            'throw': function(e) {
                if (state == 1) {
                    state = 3;
                    return {
                        done: true,
                        value: process(e)
                    };
                } else {
                    throw e;
                }
            }
        }
    }
}

/**
 *  Generator Runner
 */
{
    function run(gen) {
        var args = [].slice.call(arguments, 1), it;
        it = gen.apply(this, args);

        return Promise.resolve()
            .then(function handleNext(value) {
                var next = it.next(value);

                return (function handleResult(next) {
                    if (next.done) {
                        return next.value;
                    } else if (typeof next.value == 'function') {
                        return new Promise(function(resolve, reject) {
                            next.value(function(err, msg) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(msg);
                                }
                            });
                        })
                        .then(
                            handleNext,
                            function handlerErr(err) {
                                return Promise.resolve(
                                    it.throw(err)
                                )
                                .then(handleResult);
                            }
                        );
                    } else {
                        return Promise.resolve(next.value)
                            .then(
                                handleNext,
                                function handlerErr(err) {
                                    return Promise.resolve(
                                        it.throw(err)
                                    )
                                    .then(handleResult);
                                }
                            );
                    }
                })(next);
            });
    }

    function *foo(val) {
        if (val > 1) {
            val = yield *foo(val - 1);
        }

        return yield Promise.resolve(val);
    }

    function *bar() {
        var r1 = yield *foo(3);
        console.log("11111", r1);
    }

    run(bar);
}

/**
 *  Promise工厂
 */
{
    if (!Promise.wrap) {
        Promise.wrap = function(fn) {
            return function() {
                var args = [].slice.call(arguments);

                return new Promise(function(resolve, reject) {
                    fn.apply(null, args.concat(function(err, v) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(v);
                        }
                    }));
                });
            };
        };
    }
}

/**
 *  Promise.first的polyfill
 */
{
    if (!Promise.first) {
        Promise.first = function(prs) {
            var errCount = 0;
            var len = prs.length;

            return new Promise(function(resolve, reject) {
                prs.forEach(function(pr) {
                    Promise.resolve(pr)
                    .then(resolve, function(err) {
                        if (errCount++ == len - 1) {
                            return reject(err);
                        }
                    });
                });
            });
        };
    }
}

/**
 * 异步执行的函数
 */
{
    function asyncify(fn) {
        var orig_fn = fn,
            intv = setTimeout(function() {
                intv = null;
                if (fn) {
                    fn();
                }
            }, 0);

        fn = null;

        return function() {
            if (intv) {
                // 相当于orig_fn.bind(this, [].slice.call(arguments))
                // 由于fun.bind(thisArg[, arg1[, arg2[, ...]]])的参数形式是这样的
                // 所以这里要借用apply传递参数
                fn = orig_fn.bind.apply(
                    orig_fn,
                    [this].concat([].slice.call(arguments))
                );
            } else {
                orig_fn.apply(this, arguments);
            }
        };
    }
}

/**
 *  Object.is()的polyfill
 */
{
    if (!Object.is) {
        Object.is = function(v1, v2) {
            if (v1 === 0 && v2 === 0) {
                return 1 / v1 === 2 / v2;
            }

            if (v1 !== v1) {
                return v2 !== v2;
            }

            return v1 === v2;
        };
    }
}

/**
 * Number.isNaN的polyfill
 */
{
    if (!Number.isNaN) {
        Number.isNaN = function(num) {
            return num !== num;
        };
    }
}

/**
 * 检测一个值是否是整数
 */
{
    if (!Number.isInteger) {
        Number.isInteger = function(num) {
            return typeof num == 'number' && num % 1 == 0;
        };
    }
}

/**
 * Object.create的polyfill
 */
{
    if (!Object.create) {
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
}

/**
 *  bind函数的polyfill
 */
{
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var args = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                // 当使用new调用fBound的时候函数体内的this指向生成的实例对象, 否则this指向oThis(硬绑定)
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                            args.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;

            // 对应上面的this instanceof fNOP
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
}

/**
 *  使用new来调用函数, 或者说发生构造函数调用时, 会自动执行下面的操作
 *  1.创建(或者说构造)一个全新的对象
 *  2.这个新对象会被执行[[prototype]]连接
 *  3.这个新对象会绑定函数调用的this
 *  4.如果函数没有返回其他对象, 那么new表达式中的函数调用会自动返回这个新对象
 */

/**
 *  模块核心实现
 */
{
    let MyMoudles = (function Manager() {
        let modules = {};

        /**
         * 
         * @param {*} name 新创建模块的ID, 使用该ID可以在系统的其他部分引用该模块
         * @param {*} deps 当前模块以来的模块ID列表
         * @param {*} impl 初始化模块的工厂函数, 该工厂函数接收依赖的模块列表作为参数
         */
        function define(name, deps, impl) {
            for (let i = 0; i < deps.length; i++) {
                deps[i] = modules[deps[i]];
            }

            modules[name] = impl.apply(impl, deps);
        }

        function get(name) {
            return modules[name];
        }

        return {
            define,
            get
        };
    })();
}

/**
 *  ArrayBuffer转为字符串, 参数为ArrayBuffer对象
 */
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

/**
 *  字符串转为ArrayBuffer对象, 参数为字符串
 */
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    
    for (var i = 0, len = str.length; i < len; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
}

/**
 *  修饰器的行为基本如下
 *  @decorator
 *  class A {}
 *  等同于
 *  class A {}
 *  A = decorator(A) || A
 */

/**
 * Mixin模式
 */
{
    function mix(...mixins) {
        class Mix {}

        for (let mixin of mixins) {
            copyProperties(Mix, mixin);
            copyProperties(Mix.prototype, mixin.prototype);
        }

        return Mix;
    }

    function copyProperties(target, source) {
        for (let key of Reflect.ownKeys(source)) {
            if (key !== 'constructor'
                && key !== 'prototype'
                && key !== 'name'
            ) {
                let desc = Object.getOwnPropertyDescriptor(source, key);
                Object.defineProperty(target, key, desc);
            }
        }
    }
}

/**
 * 异步Generator函数执行器
 */
{
    async function takeAsync(asyncIterable, count = Infinity) {
        const result = [];
        const iterator = asyncIterable[Symbol.asyncIterator]();

        while (result.length < count) {
            const {value, done} = await iterator.next();
            
            if (done) {
                break;
            }

            result.push(value);
        }

        return result;
    }
}

/**
 * async function fn(args) {
 *     // ...
 * }
 * 
 * 等同于
 * 
 * function fn(args) {
 *     return spawn(function* () {
 *         // ...
 *     })
 * }
 */
{
    function spawn(genF) {
        return new Promise(function(resolve, reject) {
            var gen = genF();
    
            function step(nextF) {
                try {
                    var next = nextF();
                } catch (e) {
                    return reject(e);
                }
    
                if (next.done) {
                    return resolve(next.value);
                }
    
                Promise.resolve(next.value).then(function(v) {
                    step(function() {
                        return gen.next(v);
                    });
                }, function(e) {
                    step(function() {
                        return gen.throw(e);
                    });
                });
            }
    
            step(function() {
                return gen.next();
            });
        });
    }

}

/**
 * 逐步读取
 */
{
    async function logInOrder(urls) {
        const textPromises = urls.map(async url => {
            const response = await fetch(url);
            return response.text();
        });

        for (const textPromise of textPromises) {
            console.log(await textPromise);
        }
    }
}


/**
 * co模块源码
 */
{
    let slice = Array.prototype.slice;

    co.wrap = function(fn) {
        createPromise._generatorFunction_ = fn;
        return createPromise;

        function createPromise() {
            return co.call(this, fn.apply(this, arguments));
        }
    };

    function co(gen) {
        var ctx = this;
        var args = slice.call(arguments, 1);

        return new Promise(function(resolve, reject) {
            if (typeof gen === 'function') {
                gen = gen.call(ctx, args);
            }

            if (!gen || typeof gen.next !== 'function') {
                return resolve(gen);
            }

            onFulfilled();

            function onFulfilled(res) {
                var ret;

                try {
                    ret = gen.next(res);
                } catch (e) {
                    return reject(e);
                }

                next(ret);
            }

            function onRejected(err) {
                var ret;

                try {
                    ret = gen.throw(err);
                } catch (e) {
                    return reject(e);
                }

                next(ret);
            }

            function next(ret) {
                if (ret.done) {
                    return resolve(ret.value);
                }

                var value = toPromise.call(ctx, ret.value);

                if (value && isPromise(value)) {
                    return value.then(onFulfilled, onRejected);
                }

                return onRejected(
                    new TypeError(
                        'You may only yield a function, promise, generator, array, or objcet, '
                        + 'but the follwing object was paased: "' + String(ret.value) + '"'
                    )
                );
            }
        });

        function toPromise(obj) {
            if (!obj) {
                return obj;
            }

            if (isPromise(obj)) {
                return obj;
            }

            if (isGeneratorFunction(obj) || isGenerator(obj)) {
                return co.call(this. obj);
            }

            if (typeof obj === 'function') {
                return thunkPromise.call(this, obj);
            }

            if (Array.isArray(obj)) {
                return arrayToPromise.call(this, obj);
            }

            if (isObject(obj)) {
                return objectToPromise.call(this, obj);
            }

            return obj;
        }

        function thunkPromise(fn) {
            var ctx = this;
            
            return new Promise(function(resolve, reject) {
                fn.call(ctx, function(err, res) {
                    if (err) {
                        reject(err);
                    }

                    if (arguments.length > 2) {
                        res = slice.call(arguments, 1);
                    }

                    resolve(res);
                });
            });
        }

        function arrayToPromise(obj) {
            Promise.all(obj.map(toPromise, this));
        }

        function objectToPromise(obj) {
            var results = new obj.constructor();
            var keys = Object.keys(obj);
            var promises = [];

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var promise = toPromise.call(this, obj[key]);
                if (promise && isPromise(promise)) {
                    defer(promise, key);
                } else {
                    results[key] = obj[key];
                }
            }

            return Promise.all(promises).then(function() {
                return results;
            });
        }

        function defer(promise, key) {
            results[key] = undefined;
            promises.push(promise.then(function(res) {
                results[key] = res;
            }));
        }

        function isPromise(obj) {
            return 'function' === typeof obj.then;
        }

        function isGenerator(obj) {
            return 'function' === typeof obj.next && 'function' === typeof obj.throw;
        }

        function isGeneratorFunction(obj) {
            var constructor = obj.constructor;

            if (!constructor) {
                return false;
            }

            if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
                return true;
            }

            return isGenerator(constructor.prototype);
        }

        function isObject(val) {
            return Object === val.constructor;
        }
    }
}

/**
 * thunkify源码
 */
{
    function thunkify(fn) {
        return function() {
            var args = new Array(arguments.length);
            var ctx = this;

            for (var i = 0, len = args.length; i < len; i++) {
                args[i] = arguments[i];
            }

            return function(done) {
                var called;

                args.push(function() {
                    if (called) {
                        return;
                    }

                    called = true;
                    done.apply(null, arguments);
                });

                try {
                    fn.apply(ctx, args);
                } catch (err) {
                    done(err);
                }
            };
        };
    }

    /**
     * thunkifyTest
     */

    function f(a, b, callback) {
        var sum = a + b;
        callback("sum", sum);
        callback("sum", sum);
    }

    var ft = thunkify(f);
    var print = console.log.bind(console);
    ft(1, 2)(print);
}

/**
 * Thunk函数(传名调用)
 */
{
    var ThunkEs5 = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return function(callback) {
                args.push(callback);
                return fn.apply(this, args);
            };
        };
    };

    const ThunkEs6 = function(fn) {
        return function(...args) {
            return function(callback) {
                return fn.call(this, ...args, callback);
            };
        };
    };
}

/**
 * 观察者模式
 */
{
    const queueObservers = new Set();
    const observer = fn => queueObservers.add(fn);
    const observable = obj => new Proxy(obj, {
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            queueObservers.forEach(observer => observer());
            return result;
        }
    });

    const person = observable({
        name: 'aa',
        age: 20
    });

    function print() {
        console.log(`${person.name}`, `${person.age}`);
    }

    observer(print);

    person.name = 'bb';
}

/**
 * 链式操作 
 */
var pipe = (function() {
    return function(value) {
        var funcStack = [];
        var oproxy = new Proxy({}, {
            get: function(pipeObject, fnName) {
                if (fnName === 'get') {
                    return funcStack.reduce(function(val, fn) {
                        return fn(val);
                    }, value);
                }

                funcStack.push(window[fnName]);
                return oproxy;
            }
        });

        return oproxy;
    };
})();


/**
 * 数组去重
 */
function dedupe(array) {
    return Array.from(new Set(array));
}

/**
 * 
 * 尾调用优化
 */

function tco(f) {
    let value;
    let active = false;
    let accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);

        if (!active) {
            active = true;

            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }

            active = false;
            return value;
        }
    };
}

var sum = tco(function(x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
});

sum(1, 100000);

/*
    模仿内建数组特性
*/
function toUnit32(value) {
    return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
    let numericKey = toUnit32(key);
    return String(numericKey) == key && numericKey < (Math.pow(2, 32) - 1);
}

function createMyArray(length = 0) {
    return new Proxy({ length }, {
        set(trapTarget, key, value) {
            let currentLength = Reflect.get(trapTarget, 'length');

            if (isArrayIndex(key)) {
                let numericKey = Number(key);

                if (numericKey > currentLength) {
                    Reflect.set(trapTarget, 'length', numericKey + 1);
                }
            } else if (key === 'length') {
                if (value < currentLength) {
                    for (let index = currentLength - 1; index >= value; index--) {
                        Reflect.deleteProperty(trapTarget, index);
                    }
                }
            }

            return Reflect.set(trapTarget, key, value);
        }
    })
}

class MyArray {
    constructor(length = 0) {
        this.lenth = length;

        return new Proxy(this, {
            set(trapTarget, key, value) {
                let currentLength = Reflect.get(trapTarget, 'length');

                if (isArrayIndex(index)) {
                    let numericKey = Number(key);

                    if (numericKey > currentLength) {
                        Reflect.set(trapTarget, 'length', numericKey + 1);
                    }
                } else if (key === 'length') {
                    if (value < currentLength) {
                        for (let index = currentLength - 1; index >= value; index--) {
                            Reflect.deleteProperty(trapTarget, index);
                        }
                    }
                }

                return Reflect.set(trapTarget, key, value);
            }
        });
    }
}


/*
    基于类的继承
*/
class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getArea() {
        return this.length * this.getArea;
    }
}

class Square extends Rectangle {
    constructor(length) {
        // 等价于Rectangle.call(this, length, length);
        super(length, length);
    }
}

/*
    任务执行器
*/
function run(taskDef) {
    let task = taskDef();
    let result = task.next();

    function step() {
        if (!result.done) {
            if (typeof result.value === 'function') {
                result.value(function(err, data) {
                    if (err) {
                        result = task.throw(err);
                        return;
                    }

                    result = task.next(data);
                    step();
                });
            } else {
                result = task.next(result.value);
                step();
            }
        }
    }

    step();
}

/*
    如果给迭代器的next()传递参数, 则这个参数的值就会替代生成器内部上一条yield的语句
*/
function *createIterator() {
    let first = yield 1;
    let second = yield first + 2;
    yield second + 3;
}

let iterator = createIterator();

console.log(iterator.next());  // value: 1, done: false;
console.log(iterator.next(4)); // value: 6, done: false;
console.log(iterator.next(5)); // value: 8, done: false;

/*
    检测是否为可迭代对象
*/
function isIterable(object) {
    return typeof object[Symbol.iterator] === 'function';
}

/*
    尾调用优化
*/ 
function factorial(n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function factorial1(n, p = 1) {
    if (n <= 1) {
        return 1 * p;
    } else {
        let result = n * p;
        return factorial1(n - 1, result);
    }
}

/*
    检查字符串的长度
*/
function codePointLength(text) {
    let result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}

/*
    检测字符占有的编码单元数量
*/
function is32Bit(code) {
    return code.codePointAt(0) > 0xFFFF;
}


/*
    解析XML
*/
function parseXml(xml) {
    var xmlDom = null;

    if (typeof DOMParser != 'undefined') {
        xmlDom = (new DOMParser()).parseFromString(xml, 'text/xml');
        var errors = xmlDom.getElementsByTagName('parsererror');

        if (errors.length) {
            throw new Error('XML parsing error:' + errors[0].textContent);
        }
    } else if (typeof ActiveXObject != 'undefined') {
        xmlDom = createDocument();
        xmlDom.loadXML(xml);

        if (xmlDom.parseError != 0) {
            throw new Error('XML parsing error: ' + xmlDom.parseError.reason);
        }
    } else {
        throw new Error('No XML parser available.');
    }

    return xmlDom;
}

/*
    序列化XML
*/
function serializeXML(xmlDom) {
    if (typeof XMLSerializer != 'undefined') {
        return (new XMLSerializer()).serializeToString(xmlDom);
    } else if (typeof xmlDom.xml != 'undefined') {
        return xmlDom.xml;
    } else {
        throw new Error('Could not serialize XML DOM.');
    }
}

function selectSingleNode(context, expression, namespaces) {
    var doc = (context.nodeType != 9 ? context.ownerDocument : context);

    if (typeof doc.evaluate != 'undefined') {
        var nsresolver = null;

        if (namespaces instanceof Object) {
            nsresolver = function(prefix) {
                return namespaces[prefix];
            };
        }
        
        var result = doc.evaluate(expression, context, nsresolver,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        return (result !== null ? result.singleNodeValue : null);
    } else if (typeof context.selectSingleNode != 'undefined') {
        if (namespaces instanceof Object) {
            var ns = "";
            for (var prefix in namespaces) {
                if (namespaces.hasOwnProperty(prefix)) {
                    ns += "xmlms:" + prefix + "=" + namespaces[prefix] + "' ";
                }
            }

            doc.setProperty('SelectionNamespaces', ns);
        }

        return context.selectSingleNode(expression);
    } else {
        throw new Error('No XPath engine found.');
    }
}
