import defineReactive, { observe } from './defineReactive';
import { arrayMethods } from './utils';
import Dep from './dep';

const hasProto = '__proto__' in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export default class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);

        if (Array.isArray(value)) {
            const argument = hasProto
                ? protoAugment
                : copyAugment;
            argument(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    observeArray(items) {
        for (let i = 0; i < items.length; i++) {
            observe(items[i]);
        }
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[key]);
        }
    }
}

function protoAugment(target, src, keys) {  
    target.__proto__ = src;
}

function copyAugment(target, src, keys) {  
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        def(target, key, src[key]);
    }
}

export function def(obj, key, val, enumerable) {  
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}