# 异步
## 现在与将来
js程序总是至少分为两个块: 第一块现在运行, 下一块将来运行, 已响应某个事件
伪代码
(```)
    // A
    ajax("url", function() {
        // C
    })
    // B
    执行顺序 A B C // C将会被加入到eventLoop
    A和B发生于现在, 而C将会延迟到将来发生, 并且发生在第三方的控制下(ajax)
    这里发生了控制反转, 回调把控制权交给了第三方来调用你的代码
(```)

## 事件循环
通过下面伪代码来了解下这个概念
(```)
    // eventLoop是一个用作队列的数组
    let eventLoop = [];
    let event;

    // 永远执行
    while (true) {
        if (eventLoop.length) {
            // 拿到队列中的一个事件
            event = eventLoop.shift();

            try {
                event();
            } catch (err) {
                console.log(err)
            }
        }
    }
(```)
我们可以看到有个用while循环实现的持续运行的循环, 循环的每一轮称为一个tick。我们常说的微任务队列就是在这个tick之后运行的, 微任务队列执行完毕之后会进入到下一个tick


## 任务队列
宏任务: setTimeout, setInterval, setImmediate(vue宏任务macroTimerFunc的实现首选), requestAnimationFrame, MessageChannel
微任务: process.nextTick(node环境), MutationObserver, Promise.then catch finally, Object.observe
对于微任务队列的最好的理解方式是, 它是挂在事件循环队列的每个tick之后的一个队列

## 回调地狱(毁灭金字塔)
伪代码
(```)
    // 步骤1
    ajax('url1', function(e) {
        // 步骤2
        ajax(e.url, function(e) {
            // 步骤3
            ajax(e.url, function(e) {
                // 步骤4
                ajax(e.url, function() {

                })
            })
        })
    })
(```)
我们不得不以硬编码的方式将步骤2编码到步骤1中

## promise
Promise具体是什么
promise是一个容器, 里面保存着某个未来才会结束的事件(比如异步操作的结果)

promise对象的状态不受外界影响
只有异步操作的结果可以决定当前是哪一种状态, 其他别的操作无法改变这个状态
promise的状态一旦改变, 就不会再变, 任何时候都能得到这个结果
