let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen');
let babel = require('babel-core');
let types = require('babel-types');

let jsOrigin = 'function eat() {};';
let AST = esprima.parse(jsOrigin);
console.log(AST);

estraverse.traverse(AST, {
    enter(node) {
        console.log('enter', node.type);
        if (node.type === 'Identifier') {
            node.name += '_enter';
        }
    },
    leave(node) {
        console.log('leave', node.type);
        if (node.type === 'Identifier') {
            node.name += '_leave';
        }
    }
});

let orginReback = escodegen.generate(AST);
console.log(orginReback);

let code = 'let sum = (a, b) => a + b;';
let visitor = {
    ArrowFunctionExpression(path) {
        let params = path.node.params;
        let blockStatement = types.blockStatement([types.returnStatement(path.node.body)]);
        let func = types.functionExpression(null, params, blockStatement, false, false);
        path.replaceWith(func);
    }
};
let arrayPlugin = {visitor};
let result = babel.transform(code, {
    plugins: [
        arrayPlugin
    ]
});

console.log(result.code);



