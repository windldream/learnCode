# Webpack原理解析

## 前言

Webpack是一个打包模块化JavaScript的工具, 在webpack里一切文件皆模块, 通过Loader转换文件, 通过Plugin注入钩子, 最后输出由多个模块组成的文件, webpack专注与构建模块化项目.
<https://www.webpackjs.com/>
一切文件如Javascript, CSS, SCSS, 图片, 模板, 对于webpack来说都是一个个模块, 这样的好处是能清晰地描述各个模块之间的依赖关系, 以方便Webpack对模块进行组合和打包, 最终会输出浏览器能使用的静态资源.

## 核心概念

entry: 入口, Webpack执行构建的第一步将从entry开始, 可抽象成输入
module: 模块, 在webpack里一切皆模块, 一个模块对应着一个文件. webpack会从配置的entry开始, 递归找出所有依赖的模块
chunk: 代码块, 一个Chunk由多个模块组合而成, 用于代码合并与分割
loader: 模块转换器, 用于将模块的原内容按照需求转换成新内容
plugin: 扩展插件, 在webpack构建流程中的特定时机会广播对应的事件, 插件可以监听这些事件的发生, 在特定的时机做对应的事情

## 构建流程

1.初始化参数: 从配置文件和shell语句中读取与合并参数, 得出最终的参数
2.开始编译: 用上一步得到的参数初始化Compiler对象, 加载所有配置的插件, 通过执行对象的run方法开始编译
3.确定入口: 根据配置中的entry找出所有入口文件
4.编译模块: 从入口文件出发, 调用所有配置的Loader对模块进行翻译, 再找出该模块依赖的模块, 再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5.完成模块编译: 再经过第四步使用Loader翻译完所有模块后, 得到了每个模块被翻译后的最终内容以及他们之间的依赖关系
6.输出资源: 根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的chunk, 再将每个Chunk转换成一个单独的文件加入到输出列表中, 这是可以修改输出内容的最后机会
7.输出完成: 在确定好输出内容后, 根据配置确定输出的路径和文件名, 将文件的内容写入文件的系统中

## 流程细节

webpack的构建流程可以分为以下三大阶段:

1. 初始化: 启动构建, 读取与合并配置参数, 加载Plugin, 实例化Compiler
2. 编译: 从entry发出, 针对每个Module串行调用对应的Loader去翻译文件的内容, 再找出该Module依赖的Module, 递归地进行编译处理
3. 输出: 将编译后的Module组合成Chunk, 将Chunk转换成文件, 输出到文件系统中
![监听模式的构建流程](https://user-gold-cdn.xitu.io/2018/5/30/163afa5281ec6372?imageslim '流程图')

### 1.初始化阶段(事件名 解释)

初始化参数: 从配置文件和Shell语句中读取与合并参数, 得出最终的参数. 再这个过程中还会执行配置文件中的插件实例化语句new Plugin()

实例化Compiler: 用上一步得到的参数初始化Compiler实例, Compiler负责文件的监听和启动编译. 在Compiler实例中包含完整的Webpack配置, 全局只有一个Compiler实例

加载插件: 依次调用插件的apply方法, 让插件可以监听后续的所有事件节点. 同时向插件传入compiler实例的引用, 以方便插件通过compiler调用Webpack提供的api

environment: 开始应用Node.js风格的文件系统到compiler对象, 以方便后续的文件寻找和读取

entry-option: 读取配置的Entrys, 为每个Entry实例化一个对应的EntryPlugin, 为后面该Entry的递归解析工作做准备

after-plugins: 调用完所有内置的和配置的插件的apply方法

after-resolvers: 根据配置初始化完resolver, resolver负责在文件系统中寻找指定路径的文件

### 2.编译阶段

run: 启动一次新的编译

watch-run: 和run类似, 区别在于它是在监听模式下启动的编译, 在这个事件中可以获取到是哪些文件发生了变化导致重新启动一次新的编译

compile: 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler对象

compilation: 当Webpack以开发模式运行时, 每当检测到文件变化, 一次新的Compilation将被创建. 一个Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等. Compilation对象也提供了很多事件回调供插件做扩展

make: 一个新的Compilation创建完毕, 即将从Entry开始读取文件, 根据文件类型和配置的Loader对文件进行编译, 编译完后再找出该文件依赖的文件, 递归的编译和解析

after-compile: 一次Compilation执行完成

invalid: 当遇到文件不存在、文件编译错误等异常时会触发该事件, 该事件不会导致Webpack退出

在编译阶段, 最重要的要数compilation事件了, 因为在compilation阶段调用了Loader完成了每个模块的转换的操作, 在compilation阶段又包括很多小的事件, 他们分别是:
build-module: 使用对应的Loader去转换一个模块

normal-module-loader: 用Loader对一个模块转换完后, 使用acorn解析转换后的内容, 输出对应的抽象语法树(AST), 以方便Webpack后面对代码进行分析

program: 从配置的入口模块开始, 分析其AST, 当遇到require等导入其它模块语句时, 便将其加入到依赖的模块列表, 同时对新找出的依赖模块递归分析, 最终搞清所有模块的依赖关系

seal: 所有模块及其依赖的模块都通过Loader转换完成后, 根据依赖关系开始生成Chunk

### 3.输出阶段

should-emit: 所有需要输出的文件已经生成好, 询问插件哪些文件需要输出, 哪些不需要

emit: 确定好要输出哪些文件后, 执行文件输出, 可以在这里获取和修改输出内容

after-emit: 文件输出完毕

done: 成功完成一次完成的编译和输出流程

failed: 如果在编译和输出流程中遇到异常导致Webpack退出时, 就会直接跳转到本步骤, 插件可以在本事件中获取到具体的错误原因

## 输出文件分析

webpack输出的boundle.js

```javascript
    (function(modules) {

        // 模拟 require 语句
        function __webpack_require__() {
        }

        // 执行存放所有模块数组中的第0个模块
        __webpack_require__(0);

    })([/*存放所有模块的数组*/])
```

```javascript
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
```

bundle.js能直接运行在浏览器中的原因在于输出的文件中通过__webpack_require__函数定义了一个可以在浏览器中执行的加载函数来模拟Node.js中的require语句

原来一个个独立的模块文件都被合并到了一个单独的boundle.js的原因是, 浏览器不能像Node.js那样快速地在本地加载一个个模块文件, 而必须通过网络请求去加载还未得到的文件. 如果模块的数量很多, 则加载事件会很长, 因此将所有模块都存放在了数组中, 执行一次网络加载

## 编写Loader

Loader就像一个翻译员, 能将源文件经过转化后输出新的结果, 并且一个文件还可以链式地经过多个翻译员翻译
以处理SCSS文件为例:

1. 先将SCSS源代码提交给sass-loader, 将SCSS转换成CSS
2. 将sass-loader输出的CSS提交给css-loader处理, 找出CSS中依赖的资源, 压缩CSS等
3. 将css-loader输出的CSS提交给style-loader处理, 转换成通过脚本加载的Javascript代码

### Loader的职责

从上面的例子可以看出loader的职责是单一的, 只需完成一种转换, 一个源文件如果需要多步转换才能正常使用, 就需要多个Loader转换
在调用多个Loader去转换一个文件时, 每个Loader会链式的顺序执行, 第一个Loader将会拿到需处理的原内容, 上一个Loader处理后的结果会传给下一个接着处理, 最后的Loader将处理后的最终结果返回给Webpack
所以, 在你开发一个Loader时, 请保持其职责的单一性, 你只需关心输入和输出

### Loader基础

由于Webpack是运行在Node.js之上的, 一个Loader其实就是一个Node.js模块, 这个模块需要导出一个函数. 这个导出的函数的工作就是获得处理前的原内容, 对原内容执行处理后, 返回处理后的内容
一个最简单的Loader的源码如下:

```javascript
  module.exports = function(source) {
    // source为compiler传递给Loade 的一个文件的原内容
    // 该函数需要返回处理后的内容, 这里简单起见, 直接把原内容返回了, 相当于该Loader没有做任何转换
    return source;
  };
```

由于Loader运行在Node.js中, 你可以调用任何Node.js自带的API, 或者安装第三方模块进行调用:

```javascript
const sass = require('node-sass');
module.exports = function(source) {
  return sass(source);
};
```

上面的Loader都只是返回了原内容转换后的内容, 但有些场景下还需要返回除了内容之外的东西
例如以用babel-loader转换ES6代码为例, 它还需要输出转换后的ES5代码对应的Source Map, 以方便调试源码. 为了把Source Map也一起随着ES5代码返回给Webpack, 可以这样写:

```javascript
module.exports = function(source) {
  // 通过this.callback告诉Webpack返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用this.callback返回内容时, 该Loader必须返回undefined，
  // 以让Webpack知道该Loader返回的结果在this.callback中，而不是return中
  return;
};
```

其中的this.callback是Webpack给Loader注入的 API, 以方便Loader和Webpack之间通信. this.callback的详细使用方法如下:

```javascript
this.callback(
    // 当无法转换原内容时, 给Webpack返回一个 Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了AST语法树, 可以把这个AST返回,
    // 以方便之后需要AST的Loader复用该AST, 以避免重复生成AST, 提升性能
    abstractSyntaxTree?: AST
);
```

Source Map的生成很耗时, 通常在开发环境下才会生成 Source Map, 其它环境下不用生成, 以加速构建. 为此Webpack为Loader提供了 this.sourceMap API去告诉Loader当前构建环境下用户是否需要Source Map. 如果你编写的Loader会生成 Source Map, 请考虑到这点.

### 缓存加速

在有些情况下, 有些转换操作需要大量计算非常耗时, 如果每次构建都重新执行重复的转换操作, 构建将会变得非常缓慢. 为此Webpack会默认缓存所有Loader的处理结果, 也就是说在需要被处理的文件或者其依赖的文件没有发生变化时, 是不会重新调用对应的Loader去执行转换操作的

如果你想让Webpack不缓存该Loader的处理结果, 可以这样:

```javascript
module.exports = function(source) {
  // 关闭该Loader的缓存功能
  this.cacheable(false);
  return source;
};
```

### 抽象语法树()

<https://astexplorer.net/>
在计算机科学中, 抽象语法树(Abstract Syntax Tree, AST)或简称语法树(Syntax tree)是源代码语法结构的一种抽象表示. 它以树状的形式表现编程语言的语法结构, 树上的每个节点都表示源代码中的一种结构. 之所以说语法是“抽象”的, 是因为这里的语法并不会表示出真实语法中出现的每个细节. 比如, 嵌套括号被隐含在树的结构中, 并没有以节点的形式呈现; 而类似于if-condition-then这样的条件跳转语句, 可以使用带有两个分支的节点来表示

和抽象语法树相对的是具体语法树(通常称作分析树)一般的, 在源代码的翻译和编译过程中, 语法分析器创建出分析树, 然后从分析树生成AST. 一旦AST被创建出来, 在后续的处理过程中, 比如语义分析阶段, 会添加一些信息.

#### 抽象语法树的用途

代码语法的检查, 代码风格的检查, 代码的格式化, 代码的高亮, 代码错误提示, 代码自动补全等等
如: JSLint、JSHint 对代码错误或风格的检查, 发现一些潜在的错误IDE的错误提示, 格式化, 高亮, 自动补全等等 代码的混淆压缩 如：UglifyJS2等

优化变更代码，改变代码结构达到想要的结构
代码打包工具webpack, rollup等等CommonJS、AMD、CMD、UMD等代码规范之间的转化CoffeeScript、TypeScript、JSX等转化为原生Javascript

#### 抽象语法树的生成过程

js为例:  
词法分析(lexical analysis): 进行词法分析的程序或者函数叫作词法分析器(Lexical analyzer, 简称Lexer) 也叫扫描器(Scanner, 例如typescript源码中的scanner.ts)字符流转换成对应的Token流.
tokenize: tokenize就是按照一定的规则, 例如token令牌(通常代表关键字, 变量名, 语法符号等将代码分割为一个个的“串”, 也就是语法单元). 涉及到词法解析的时候, 常会用到tokennize.
语法分析(parse analysis): 是编译过程的一个逻辑阶段. 语法分析的任务是在词法分析的基础上将单词序列组合成语法树, 如“程序”, “语句”, “表达式”等等.语法分析程序判断源程序在结构上是否正确. 源程序的结构由上下文无关文法描述

```jacascript
  const a = 1;
  const b = a + 1;
```

词法解析过程: 一边扫描源代码一边进行分类,例如扫描到第一行const a = 1, 首先扫描到const, 会生成一个语法单元说这是关键字const, 接着扫描到a, 这是变量名a, 接着操作符=, 接着常量1,等等, 构成一个个token流. 语法分析过程: 将token流转化为一个有元素层级嵌套所组成的代表程序语法结构的树, 这个树被叫做抽象语法树AST

## 编写 Plugin

Webpack通过Plugin机制让其更加灵活, 以适应各种应用场景. 在Webpack运行的生命周期中会广播出许多事件, Plugin可以监听这些事件, 在合适的时机通过Webpack提供的API改变输出结果
一个最基础的 Plugin 的代码是这样的:

```javascript
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack会调用BasicPlugin实例的apply方法给插件实例传入compiler对象
  apply(compiler){
      // 监听Webpack广播的事件
    compiler.plugin('compilation', function(compilation) {
    })
  }
}
```

// 导出 Plugin

```javascript
module.exports = BasicPlugin;
// 在使用这个Plugin时, 相关配置代码如下:
const BasicPlugin = require('./BasicPlugin.js');
module.export = {
  plugins:[
    new BasicPlugin(options)
  ]
}
```

Webpack启动后, 在读取配置的过程中会先执行new BasicPlugin(options)初始化一个BasicPlugin获得其实例. 在初始化compiler对象后, 再调用basicPlugin.apply(compiler)给插件实例传入compiler对象. 插件实例在获取到compiler对象后, 就可以通过compiler.plugin(事件名称, 回调函数)监听到Webpack广播出来的事件. 并且可以通过compiler对象去操作Webpack.

### Compiler和Compilation

在开发Plugin时最常用的两个对象就是Compiler和Compilation, 它们是Plugin和Webpack之间的桥梁. Compiler和Compilation的含义如下:
Compiler对象包含了Webpack环境所有的的配置信息, 包含options, loaders, plugins这些信息, 这个对象在Webpack启动时候被实例化, 它是全局唯一的, 可以简单地把它理解为Webpack实例
Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等. 当Webpack以开发模式运行时, 每当检测到一个文件变化, 一次新的Compilation将被创建. Compilation对象也提供了很多事件回调供插件做扩展. 通过Compilation也能读取到Compiler对象.

Compiler和Compilation的区别在于: Compiler代表了整个Webpack从启动到关闭的生命周期, 而Compilation只是代表了一次新的编译

### 事件流

Webpack就像一条生产线, 要经过一系列处理流程后才能将源文件转换成输出结果. 这条生产线上的每个处理流程的职责都是单一的, 多个流程之间有存在依赖关系, 只有完成当前处理后才能交给下一个流程去处理. 插件就像是一个插入到生产线中的一个功能, 在特定的时机对生产线上的资源做处理.
Webpack通过Tapable来组织这条复杂的生产线. Webpack在运行过程中会广播事件, 插件只需要监听它所关心的事件, 就能加入到这条生产线中, 去改变生产线的运作. Webpack的事件流机制保证了插件的有序性, 使得整个系统扩展性很好

Webpack的事件流机制应用了发布-订阅模式, 和Node.js中的EventEmitter非常相似, Compiler和Compilation都继承自Tapable, 可以直接在Compiler和Compilation对象上广播和监听事件, 方法如下:
// 广播出事件 event-name为事件名称, 注意不要和现有的事件重名params为附带的参数
compiler.apply('event-name',params)

// 监听名称为event-name的事件, 当event-name事件发生时, 函数就会被执行
// 同时函数中的params参数为广播事件时附带的参数
compiler.plugin('event-name', function(params) {

});

Tapable的原理其实就是发布-订阅模式, 核心代码可以概括如下

```javascript
  class SyncHook{
    constructor(){
        this.hooks = [];
    }

    // 订阅事件
    plugin(name, fn) {
        this.hooks.push(fn);
    }

    // 发布
    apply() {
        this.hooks.forEach(hook => hook(...arguments));
    }
  }
```
