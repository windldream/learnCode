export default class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm;

        if (options) {
            this.deep = !!options.deep;
        } else {
            this.deep = false;
        }

        this.deps = [];
        this.depIds = new Set();
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }
        this.cb = cb;
        this.value = this.get();
    }

    get() {
        window.target = this;
        let value = this.getter.call(this.vm, this.vm);
        window.target = undefined;
        return value;
    }

    update() {
        const oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldValue);
    }

    addDep(dep) {
        const id = dep.id;
        if (!this.depIds.has(id)) {
            this.depIds.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
    }

    teardown() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].remove(this);
        }
    }
}

const bailRE = /[^\w.$]/
function parsePath(path) {  
    if (bailRE.test(path)) {
        return;
    }
    const segments = path.split('.');
    return function (obj) {  
        for (let i = 0; i < segments.length; i++) {
            if (!obj) {
                return;
            }
            obj = obj[segments[i]];
        }
        return obj;
    }
}