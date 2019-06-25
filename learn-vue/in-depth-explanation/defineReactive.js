import Observer from './observer';
import { isObject, hasOwn } from './utils';


export default function defineReactive(data, key, val) {
    let childOb = observe(val);  
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            dep.depend();

            if (childOb) {
                childOb.dep.depend();
            }
            return val;
        },
        set: function (newVal) {  
            if (val === newVal) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    })
}

export function observe(value, asRootData) {
    if (!isObject(value)) {
        return;
    }

    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob;
}