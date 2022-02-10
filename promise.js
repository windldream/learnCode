const isFun = (obj) => typeof obj === "function";
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(handle) {
    if (!isFunc(handle)) {
      throw new Error("MyPromise must accept a function as a parameter");
    }

    this._status = PENDING;
    this._value = undefined;
    // 添加成功回调函数队列
    this._fulfilledQueues = [];
    // 添加失败回调函数队列
    this._rejectedQueues = [];

    try {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve(val) {
    const run = () => {
      // Promise只会被决议一次
      // 并且只能从pending状态切换到resolve状态
      if (this._status !== PENDING) {
        return;
      }

      // 执行成功队列的回调函数
      const runFulfilled = (value) => {
        let cb;
        while ((cb = this._fulfilledQueues.shift())) {
          cb(value);
        }
      };

      // 执行失败队列的回调函数
      const runRejected = (error) => {
        let cb;
        while ((cb = this._rejectedQueues.shift())) {
          cb(error);
        }
      };

      if (val instanceof MyPromise) {
        val.then(
          (value) => {
            this._value = value;
            this._status = FULFILLED;
            runFulfilled(value);
          },
          (err) => {
            this._value = err;
            this._status = REJECTED;
            runRejected(err);
          }
        );
      } else {
        this._value = val;
        this._status = FULFILLED;
        runFulfilled(val);
      }
    };

    // 异步调用(不过这一步是将run函数加入宏任务队列, 真正的promise的then方法是加入微任务队列)
    setTimeout(run, 0);
  }

  _reject(err) {
    if (this._status !== PENDING) {
      return;
    }

    const run = () => {
      this._status = REJECTED;
      this._value = err;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };

    setTimeout(run, 0);
  }

  then(onFulfilled, onRejected) {
    const { _value, _status } = this;

    // then方法返回一个全新的Promise
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      let fulfilled = (value) => {
        try {
          // 值穿透
          // Promise.resolve(233)
          // .then()
          // .then(function (value) {
          //     console.log(value)
          // })
          if (!isFun(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            let res = onFulfilled(value);

            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          onRejectedNext(err);
        }
      };

      let rejected = (error) => {
        try {
          if (!isFun(onRejected)) {
            onRejectedNext(error);
          } else {
            let res = onRejected(error);

            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onRejectedNext(res);
            }
          }
        } catch (err) {
          onRejectedNext(err);
        }
      };

      switch (_status) {
        case PENDING:
          this._fulfilledQueues.push(fulfilled);
          this._rejectedQueues.push(rejected);
          break;
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
      }
    });
  }

  catch(onRejected) {
    this.then(null, onRejected);
  }

  finally(cb) {
    // 不管Promise对象最后状态都会执行的回调
    return this.then(
      (value) => MyPromise.resolve(cb()).then(() => value),
      (err) =>
        MyPromise.resolve(cb()).then(() => {
          throw err;
        })
    );
  }

  // 以下都是定义在MyPromise上的静态方法
  static reolve(value) {
    // 如果参数是Promise实例, 则直接返回
    if (value instanceof MyPromise) {
      return value;
    }

    // 返回一个Promise实例
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(value) {
    return new MyPromise(resolve, (reject) => reject(value));
  }

  static all(list) {
    return new MyPromise((resolve, reject) => {
      let values = [];
      let count = 0;
      for (let [i, p] of list.entries()) {
        this.resolve(p).then(
          (res) => {
            values[i] = res;
            count++;

            // 所有状态都成功决议之后promise的状态才会变为fulfilled
            // 调用的判断条件(count === list.length)传统上称之为门(gate)
            if (count === list.length) {
              resolve(values);
            }
          },
          (err) => {
            // 只要有一个状态是rejected, promise的状态就会被决议位rejected
            reject(err);
          }
        );
      }
    });
  }

  // 称之为竟态, 但是更精确的叫法应该是门闩(latch)它的特性可以描述为"只有第一名取胜"
  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        this.resolve(p).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}
