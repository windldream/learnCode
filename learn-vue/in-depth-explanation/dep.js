let uid = 0;
export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        remove(this.subs, sub);
    }

    depend() {
        if (window.target) {
            window.target.addDep(this);
        }
    }

    notify() {
        const subs = this.subs;
        for (let i = 0; i < subs.length; i++) {
            subs[i].update();
        }
    }
}

function remove(arr, item) {  
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}