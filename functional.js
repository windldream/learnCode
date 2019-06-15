function fail(thing) {
    throw new Error(thing);
}

function warn(thing) {
    console.log(`WARING: ${thing}`);
}

function note(thing) {
    console.log(`NOTE: ${thing}`);
}

function isIndexed(data) {
    return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
    if (!_.isNumber(index)) {
        fail('Expected a number as the index');
    }

    if (!isIndexed(a)) {
        fail('Not supported on non-indexed type');
    }

    if (index < 0 || index > a.length - 1) {
        fail('Index value is out of bounds');
    }

    return a[index];
}

function second(a) {
    return nth(a, 1);
}

function existy(x) {
    return x != null;
}

function truthy(x) {
    return x !== false && existy(x);
}

function cat() {
    var head = _.first(arguments);

    if (existy(head)) {
        return head.concat.apply(head, _.rest(arguments));
    } else {
        return [];
    }
}

function construct(head, tail) {
    return cat([head], _.toArray(tail));
}

function mapcat(fun, coll) {
    return cat.apply(null, _.map(coll, fun));
}

function butLast(coll) {
    return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
    return butLast(mapcat(e => construct(e, inter), coll));
}

function rename(obj, newNames) {
    return _.reduce(newNames, function(o, nu, old) {
        if (_.has(obj, old)) {
            o[nu] = obj[old];
            return o;
        } else {
            return o;
        }
    }, _.omit.apply(null, construct(obj, _.keys(newNames))));
}

let globals = {};

function makeBindFun(resolver) {
    return function(k, v) {
        let stack = globals[k] || [];
        globals[k] = resolver(stack, v);
        return globals;
    };
}

var stackBinder = makeBindFun(function(stack, v) {
    stack.push(v);
    return stack;
});

var stackUnbinder = makeBindFun(function(stack) {
    stack.pop();
    return stack;
});

var dynamicLookup = function(k) {
    var slot = globals[k] || [];
    return _.last(slot);
};

function createWeirdScaleFunction(FACTOR) {
    return function(v) {
        this['FACTOR'] = FACTOR;
        let captures = this;

        return _.map(v, _.bind(function(n) {
            return n * this['FACTOR'];
        }, captures));
    };
}

function finder(valueFun, bestFun, coll) {
    return _.reduce(coll, function(best, current) {
        var bestValue = valueFun(best);
        var currentValue = valueFun(current);

        return (bestValue === bestFun(bestValue, currentValue)) ? best : current; 
    });
}

function best(fun, coll) {
    return _.reduce(coll, function(x, y) {
        return fun(x, y) ? x : y;
    });
}

function repeat(times, value) {
    return _.map(_.range(times), () => value);
}

function repeatedly(times, fun) {
    return _.map(_.range(times), fun);
}

function iterateUnitl(fun, check, init) {
    let ret = [];
    let result = fun(init);

    while (check(result)) {
        ret.push(result);
        result = fun(result);
    }

    return ret;
}

function always(value) {
    return function() {
        return value;
    }
}

function uniqueString(len) {
    return Math.random().toString(16).substr(2, len);
}

function makeUniqueStringFunction(start) {
    let counter = start;

    return function(prefix) {
        return `${prefix}${counter++}`;
    };
}

function fnull(fun) {
    let defaults = _.rest(arguments);

    return function() {
        let args = _.map(arguments, (e, i) => {
            return existy(e) ? e : defaults[i]
        });

        return fun.apply(null, args);
    };
}

function defaults(d) {
    return function(o, k) {
        let val = fnull(_.identity, d[k]);
        return o && val(o[k]);
    }
}

function doSomeThing(config) {
    let lookup = defaults({critical: 108});
    return lookup(config, 'critical');
}

function checker() {
    var validators = _.toArray(arguments);

    return function(obj) {
        return _.reduce(validators, function(errs, check) {
            if (check(obj)) {
                return errs;
            } else {
                return _.chain(errs).push(check.message).value();
            }
        }, []);
    }
}

function validator(message, fun) {
    let f = function() {
        return fun.apply(arguments);
    };

    f['message'] = message;
    return f;
}

function aMap(obj) {
    return _.isObject(obj);
}

function dispatch() {
    let funs = _.toArray(arguments);
    let size = funs.length;

    return function(target) {
        let ret = undefined;
        let args = _.rest(arguments);

        for (let funIndex = 0; funIndex < size; funIndex++) {
            let fun = funs[funIndex];
            ret = fun.apply(fun, construct(target, args));

            if (existy(ret)) {
                return ret;
            }
        }

        return ret;
    };
}

function isa(type, action) {
    return function(obj) {
        if (type === obj.type) {
            action(obj);
        }
    };
}

function rightAwayInvoker() {
    let args = _.toArray(arguments);
    let method = args.shift();
    let target = args.shift();

    return method.apply(target, args);
}

function curry(fun) {
    return function(arg) {
        fun(arg);
    };
}

function curry2(fun) {
    return function(secondArg) {
        return function(firstArg) {
            return fun(firstArg, secondArg);
        };
    };
}

function curry3(fun) {
    return function(last) {
        return function(middle) {
            return function(first) {
                return fun(first, middle, last);
            };
        };
    };
}

function toHex(n) {
    let hex = n.toString(16);
    return (hex.length < 2) ? [0, hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
    return ['#', toHex(r), toHex(g), toHex('b')].join('');
}

function partial1(fun, arg1) {
    return function() {
        let args = construct(arg1, arguments);
        return fun.apply(fun, args);
    };
}

function partial2(fun, arg1, arg2) {
    return function() {
        let args = cat([arg1, arg2], arguments);
        return fun.apply(fun, args);
    };
}

function partial(fun) {
    let pargs = _.rest(arguments);

    return function() {
        let args = cat(pargs, _.toArray(arguments));
        return fun.apply(fun, args);
    };
}

function myLength(ary) {
    if (_.isEmpty(ary)) {
        return 0;
    } else {
        return 1 + myLength(_.rest(ary));
    }
}

function cycle(times, ary) {
    if (times <= 0) {
        return [];
    } else {
        return cat(ary, cycle(times - 1), ary);
    }
}

function constructPair(pair, rests) {
    return [construct(_.first(pair), _.first(rests)),
            construct(second(pair), second(rests))];
}

function unzip(pairs) {
    if (_.isEmpty(pairs)) {
        return [[], []];
    }

    return constructPair(_.first(pairs), unzip(_.rest(pairs)));
}

let influences = [
    ['Lisp', 'Smalltalk'],
    ['Lisp', 'Scheme'],
    ['Smalltalk', 'Self'],
    ['Scheme', 'JavaScirpt'],
    ['Scheme', 'Lua'],
    ['Self', 'Lua'],
    ['Self', 'JavaScript']
];

function nexts(graph, node) {
    if (_.isEmpty(graph)) {
        return [];
    }

    let pair = _.first(graph);
    let from = _.first(pair);
    let to = second(pair);
    let more = _.rest(graph);

    if (_.isEqual(node, from)) {
        return construct(to, next(more, node));
    } else {
        return nexts(more, node);
    }
}

function tcLength(ary, n) {
    let l = n ? n : 0;

    if (_.isEmpty(ary)) {
        return l;
    } else {
        return tcLength(_.rest(ary), l + 1);
    }
}

function andify() {
    let preds = _.toArray(arguments);

    return function() {
        let args = _.toArray(arguments);

        let everything = function(ps, truth) {
            if (_.isEmpty(ps)) {
                return truth;
            } else {
                return _.every(args, _.first(ps))
                        && everything(_.rest(ps), truth);
            }
        };

        return everything(preds, true);
    };
}

function orify() {
    let preds = _.toArray(arguments);

    return function() {
        let args = _.toArray(arguments);

        let something = function(ps, truth) {
            if (_.isEmpty(ps)) {
                return truth;
            } else {
                return _.some(args, _.first(ps))
                        || something(_.rest(ps), truth);    
            }
        };

        return something(preds, false);
    }
}

function evenSteven(n) {
    if (n === 0) {
        return true;
    } else {
        return oddJohn(Math.abs(n) - 1);
    }
}

function oddJohn(n) {
    if (n === 0) {
        return false;
    } else {
        return evenSteven(Math.abs(n) - 1);
    }
}

function flat(array) {
    if (_.isArray(array)) {
        return cat.apply(cat, _.map(array, flat));
    } else {
        return [array];
    }
}

function deepClone(obj) {
    if (!existy(obj) || !_.isObject(obj)) {
        return obj;
    }

    let temp = new obj.constructor;

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            temp[key] = deepClone(obj[key]);
        }
    }

    return temp;
}

function visit(mapFun, resultFun, array) {
    if (_.isArray(array)) {
        return resultFun(_.map(array, mapFun));
    } else {
        return resultFun(array);
    }
}

function postDepth(fun, ary) {
    return visit(partial1(postDepth, fun), fun, ary);
}

function preDepth(fun, ary) {
    return visit(partial1(preDepth, fun), fun, fun(ary));
}

function influenceWithStrategy(strategy, lang, graph) {
    let results = [];

    strategy(function(x) {
        if (_.isArray(x) && _.first(x) === lang) {
            results.push(second(x));
        }

        return x;
    }, graph);

    return results;
}

function evenOline(n) {
    if (n === 0) {
        return true;
    } else {
        return partial1(oddOline, Math.abs(n) - 1);
    }
}

function oddOline(n) {
    if (n === 0) {
        return false;
    } else {
        return partial1(evenOline, Math.abs(n) - 1);
    }
}

function trampoline(fun) {
    let result = fun.apply(fun, _.rest(arguments));

    while (_.isFunction(result)) {
        result = result();
    }

    return result;
}

function isEvenSafe(n) {
    if (n === 0) {
        return true;
    } else {
        trampoline(partial1(oddOline, Math.abs(n) - 1));
    }
}

function isOddSafe(n) {
    if (n === 0) {
        return false;
    } else {
        trampoline(partial1(evenOline, Math.abs(n) - 1));
    }
}

function generator(seed, current, step) {
    return {
        head: current(seed),
        tail: function() {
            console.log('forced');
            return generator(step(seed), current, step);
        }
    }
}

function genHead(gen) {
    return gen.head;
}

function genTail(gen) {
    return gen.tail();
}

function genTake(n, gen) {
    let doTake = function(x, g, ret) {
        if (x === 0) {
            return ret;
        } else {
            return partial(doTake, x - 1, genTail(g), cat(ret, genHead(g)));
        }
    };

    return trampoline(doTake, n, gen, []);
}

let groupFrom = curry2(_.groupBy)(_.first);
let groupTo = curry2(_.groupBy)(second);

function influenced(graph, node) {
    return _.map(groupFrom(graph)[node], second);
}

let rand = partial1(_.random, 1);

function randString(len) {
    let ascii = repeatedly(len, partial1(rand, 35));
    
    return _.map(ascii, function(n) {
        return n.toString(36);
    }).join('');
}

function generateRandomCharacter() {
    return rand(26).toString(36);
}

function generateString(charGen, len) {
    return repeatedly(len, charGen).join('');
}

let composeRandomString = partial1(generateString, generateRandomCharacter);

function skipTake(n, coll) {
    let ret = [];
    let sz = _.size(coll);

    for (let index = 0; index < sz; index += n) {
        ret.push(coll[index]);
    }

    return ret;
}

function summ(array) {
    let result = 0;
    let sz = array.length;

    for (let i = 0; i < sz; i++) {
        result += sz[i];
    }

    return result;
}

function sumRec(array, seed) {
    if (_.isEmpty(array)) {
        return seed;
    } else {
        return sumRec(_.rest(array), _.first(array) + seed);
    }
}

function deepFreeze(obj) {
    if (!Object.isFrozen(obj)) {
        Object.freeze(obj);
    }

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _.isObject(obj)) {
            deepFreeze(obj);
        }
    }
}

function merge() {
    return _.extend.apply(null, construct({}, arguments));
}

function Queue(elems) {
    this._q = elems;
}

Queue.prototype = {
    enqueue: function(thing) {
        return new Queue(this._q + thing);
    }
}

function LazyChain(obj) {
    this._calls = [];
    this._target = obj;
}

LazyChain.prototype.invoke = function(methodName) {
    var args = _.rest(arguments);

    this._calls.push(function(target) {
        let meth = target[methodName];

        return meth.apply(target, args);
    });

    return this;
}

LazyChain.prototype.force = function() {
    return _.reduce(this._calls, function(target, thunk) {
        return thunk(target);
    }, this._target);
};

LazyChain.prototype.tap = function(fun) {
    this._calls.push(function(target) {
        fun(target);
        return target;
    });

    return this;
};

function LazyChainChainChain() {
    let isLC = obj instanceof LazyChain;

    this.calls = isLC ? cat(obj._calls, []) : [];
    this._target = isLC ? obj._target : obj;
}

function go() {
    let d = $.Deferred();

    $.when('')
        .then(function() {
            setTimeout(function() {
                console.log('sub-task 1');
            }, 5000);
        })
        .then(function() {
            setTimeout(function() {
                console.log('sub-task 2');
            }, 10000);
        })
        .then(function() {
            setTimeout(function() {
                d.resolve('done');
            }, 15000);
        })

    return d.promise();
}

function pipeline(seed) {
    return _.reduce(_.rest(arguments), function(l, r) {
        return r(l);
    }, seed);
}

function actions(acts, done) {
    return function(seed) {
        let init = {
            values: [],
            state: seed
        };

        let intermediate = _.reduce(acts, function(stateObj, action) {
            let result = action(stateObj.state);
            let values = cat(stateObj.values, [result.answer]);

            return {
                values: values, 
                state: result.state
            };
        }, init);

        let keep = _.filter(intermediate.values, existy);

        return done(keep, intermediate.state);
    };
}

function lift(answerFun, stateFun) {
    return function() {
        let args = _.toArray(arguments);

        return function(state) {
            let ans = answerFun.apply(null, construct(state, args));
            let s = stateFun ? stateFun(state) : ans;

            return {
                answer: ans,
                state: s
            };
        };
    };
}

let push = lift((stack, e) => construct(e, stack));

let pop = lift(_.first, _.rest);

let stackAction = actions([
    push(1),
    push(2),
    pop(),
], (values, state) => values);

function lazyChain(obj) {
    let calls = [];

    return {
        invoke: function(methodName) {
            let args = _.rest(arguments);

            calls.push((target) => {
                let meth = target[methodName];

                return meth.apply(target, args);
            });

            return this;
        },
        force: function() {
            return _.reduce(calls, (ret, thunk) => thunk(ret), obj);
        }
    }
}

function deferredSort(ary) {
    return lazyChain(ary).invoke('sort');
}

function force(thunk) {
    return thunk.force();
}

// function polyToString(obj) {
//     if (obj instanceof String) {
//         return obj
//     } else if (obj instanceof Array) {
//         return stringifyArray(obj);
//     } 

//     return obj.toString();
// }

function stringifyArray(ary) {
    return `[${_.map(ary, polyToString).join(',')}]`;
}

let polyToString = dispatch(
    s => (_.isString(s) ? s : undefined),
    s => (_.isArray(s) ? stringifyArray(s) : undefined),
    s => (_.isObject(s) ? JSON.stringify(s) : undefined),
    s => s.toString()
);

function Container(val) {
    this._value = val;
    this.init(val);
}

Container.prototype.init = _.identity;

let Hole = function(val) {
    Container.call(this, val);
};

let HoleMixin = {
    setValue: function(newValue) {
        let oldVal = this._value;

        this.validate(newValue);
        this._value = newValue;
        this.notify(oldVal, newValue);
        return this._value;
    }
};

let ObserverMixin = (function() {
    let _watchers = [];

    return {
        watch: function(fun) {
            _watchers.push(fun);
            return _.size(_watchers);
        },
        notify: function(oldVal, newVal) {
            _.each(_watchers, function(watcher) {
                watcher.call(this, oldVal, newVal);
            });

            return _.size(_watchers);
        }
    }
})();

let ValidateMixin = {
    addValidator: function(fun) {
        this._validator = fun;
    },
    init: function(val) {
        this.validate(val);
    },
    validate: function(val) {
        if (existy(this._validator) 
                && !this._validator(val)) {
            fail('Attempted to set invalid value' + polyToString(val));
        }
    }
};

_.extend(Hole.prototype, HoleMixin, ValidateMixin, ObserverMixin);

let SwapMixin = {
    swap: function(fun) {
        let args = _.rest(arguments);
        let newValue = fun.apply(this, construct(this._value, args));

        return this.setValue(newValue);
    }
};

let SnapshotMixin = {
    snapshot: function() {
        return deepClone(this._value);
    } 
};

function schonfinkelize(fn) {
    var slice = Array.prototype.slice,
        stored_args = slice.call(arguments, 1);

    return function() {
        var new_args = slice.call(arguments),
            args = stored_args.concat(new_args);
        return fn.apply(null, args);
    };
}

function Sandbox() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] == 'string') ? args : args[0],
        i;
    
    if (!(this instanceof Sandbox)) {
        return new Sandbox(modules, callback);
    }

    this.a = 1;
    this.b = 2;

    if (!modules || modules === '*') {
        modules = [];

        for (i in Sandbox.modules) {
            if (Sandbox.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }

    for (i = 0; i < modules.length; i += 1) {
        Sandbox.modules[modules[i]](this);
    }

    callback(this);
}

Sandbox.modules = {};

Sandbox.modules.dom = function(box) {

};

Sandbox.modules.event = function(box) {
    
};

Sandbox.modules.ajax = function(box) {
    
};

Sandbox.prototype = {
    name: 'My Application',
    version: '1.0',
    getName: function() {
        return this.name;
    }
}

var klass = function(Parent, props) {
    var Child, F, i;

    Child = function() {
        if (Child.uber && Child.uber.hasOwnProperty('__construct')) {
            Child.uber.__construct.apply(this, arguments);
        }

        if (Child.prototype.hasOwnProperty('__construct')) {
            Child.prototype.__construct.apply(this, arguments);
        }
    };

    Parent = Parent || Object;
    F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;

    for (i in props) {
        if (props.hasOwnProperty(i)) {
            Child.prototype[i] = props[i];
        }
    }

    return Child;
};

function extendDeep(parent, child) {
    var i,
        toStr = Object.prototype.toString,
        astr = '[Object Array]';

    child = child || {};

    for (var i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] == 'object') {
                child[i] = (toStr.call(parent[i]) == astr) ? [] : {};
                extendDeep(parent[i], child[i]);
            }
        } else {
            child[i] = parent[i];
        }
    }

    return child;
}

function Sale(price) {
    this.price = price || 100;
}

Sale.prototype.getPrice = function() {
    return this.price;
};

Sale.decorators = {};

Sale.decorators.fedtax = {
    getPrice: function() {
        var price = this.uber.getPrice();
        price += price * 5 / 100;
        return price;
    }
};

Sale.decorators.quebec = {
    getPrice: function() {
        var price = this.uber.getPrice();
        price += price * 7.5 / 100;
        return price;
    }
};

Sale.decorators.money = {
    getPrice: function() {
        return '$' + this.uber.getPrice().toFixed(2);
    }
}

Sale.decorators.cdn = {
    getPrice: function() {
        return 'CDN$' + this.uber.getPrice().toFixed(2);
    }
}

Sale.prototype.decorate = function(decorator) {
    var F = function() {},
        overrides = this.constructor.decorators[decorator],
        i,
        newObj;
    
    F.prototype = this;
    newObj = new F();
    newObj.uber = F.prototype;

    for (i in overrides) {
        if (overrides.hasOwnProperty(i)) {
            newObj[i] = overrides[i];
        }
    }

    this.price = newObj.getPrice();

    return newObj;
}

var publisher = {
    subscribers: {
        any: []
    },
    subsribe: function(fn, type) {
        type = type || 'any';

        if (typeof this.subscribers[type] == 'undefined') {
            this.subscribers[type] = [];
        }

        this.subscribers[type].push(fn);
    },
    unsubscribe: function(fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    },
    publish: function(publication, type) {
        this.visitSubscribers('publish', publication, type);
    },
    visitSubscribers: function(action, arg, type) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[type],
            i,
            max = subscribers.length;

        for (i = 0; i < max; i++) {
            if (action == 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] == fn) {
                    this.subscribers.splice(i, 1);
                }
            }
        }
    }
};

function makePublisher(o) {
    for (var i in publisher) {
        if (publisher.hasOwnProperty(i) && typeof publisher[i] == 'function') {
            o[i] = publisher[i];
        }
    }

    o.subscribers = {
        any: []
    };
}

function require(file, callback) {
    var script = document.getElementsByTagName('script')[0],
        newJs = document.createElement('script');

    newJs.onreadystatechange = function() {
        if (newJs.readySate == 'loaded' || ready.readySate == 'complete') {
            newJs.onreadystatechange = null;
            callback();
        }
    };

    newJs.onload = function() {
        callback();
    };

    newJs.src = file;
    script.parentNode.insertBefore(newJs, script);
}


// function depthSearch(graph, nodes, seen) {
//     if (!_.isEmpty(nodes)) {
//         return rev(seen);
//     }

//     let node = _.first(nodes);
//     let more = _.rest(nodes);

//     if (_.contains(seen, node)) {
//         return depthSearch(graph, more, seen);
//     } else {
//         return depthSearch(graph, cat(nexts(graph, node), more), construct(node, seen));
//     }
// }