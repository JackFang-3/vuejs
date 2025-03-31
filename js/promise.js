const promise = new Promise((resolve, reject) => {});
promise.then((res) => {});
promise.catch((rej) => {});

// 异步任务的三个状态
/**
 * pending
 * resolved / fulfilled
 * rejectd / fulfiled
 */
class MyPromise {
  constructor(executor) {
    // 设置promise的状态
    this.PromiseState = "pending";

    // 设置promise的执行结果
    this.PromiseResult = undefined;

    // 回调函数的容器
    this.callbacks = [];

    // 抛出异常改变promise的状态
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  // 修改状态，不可逆,执行从pending->成功/失败
  // 设置结果值
  resolve(value) {
    if (this.PromiseState == "pending") {
      this.PromiseState = "fulfilled";
      this.PromiseResult = value;
    }
  }

  reject(error) {
    if (this.PromiseState == "pending") {
      this.PromiseState = "fulfiled";
      this.PromiseResult = error;
    }
  }

  //异步封装then
  then(onFulFilled, onFulFiled) {
    // 对应同步
    if (this.PromiseState == "fulfilled") {
      onFulFilled(this.PromiseResult);
    } else if (this.PromiseState == "fulfiled") {
      onFulFiled(this.PromiseResult);
    }

    //因为构造函数里面如果是异步，会先执行这里
    if (this.PromiseState == "pending") {
      // 保存回调函数
      this.callbacks.push({ onFulFilled, onFulFiled });
    }
  }

  // 修改状态
  // 设置结果值
  // 异步：改变状态以后才开始执行回调函数 queueMicrotask
  resolve(value) {
    if (this.PromiseState == "pending") {
      this.PromiseState = "fulfilled";
      this.PromiseResult = value;
    }

    if (this.callbacks.length) {
      queueMicrotask(() => {
        this.callbacks.forEach((resolveFn) => {
          resolveFn.onFulFilled(value);
        });
      });
    }

    /**
     * queueMicrotask是注册一个微任务，是目前浏览器端为数不多可以直接注册微任务的函数。
     * 也可以使用其他方法，可能有人说这个api不兼容等，当然我们重写肯定希望所有能力一模一样，
     * 但是实际生产中不可能拿这个封装Promise来调。
     *  */
  }
}

// 验证MyPromise
const myPromise = new MyPromise((resolve, reject) => {
  resolve(100);
});
console.log("myPromise", myPromise);
