    /**
     * @desc 函数节流
     * @param func 函数
     * @param wait 延迟执行毫秒数
     * @param type 1 表时间戳版，2 表定时器版
     */
    function throttle(func, wait, type) {
      if (type === 1) {
        let previous = 0;
      } else if (type === 2) {
        let timeout;
      }
      return function () {
        let context = this;
        let args = arguments;
        if (type === 1) {
          let now = Date.now();

          if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
          }
        } else if (type === 2) {
          if (!timeout) {
            timeout = setTimeout(() => {
              timeout = null;
              func.apply(context, args)
            }, wait)
          }
        }

      }
    }


    /**
     * @description: 防抖函数
     * @params {*}
     * @return {*}
     * @param {*} fn 
     * @param {*} delay 延迟
     * @param {*} immediate 是否立即执行
     */
    function deBounce(fn, delay = 500, immediate) {
      let timer = null,
        immediateTimer = null;

      return function () {
        let args = arguments,
          context = this;

        // 第一次触发
        if (immediate && !immediateTimer) {

          fn.apply(context, args);
          //重置首次触发标识，否则下个周期执行时会受干扰
          immediateTimer = setTimeout(() => {
            immediateTimer = null;
          }, delay);
        }
        // 存在多次执行时，重置动作需放在timer中执行；
        if (immediateTimer) clearTimeout(immediateTimer);
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
          fn.apply(context, args);
          timer = null;
          immediateTimer = null;
        }, delay);
      }
    }
    module.exports = {
      deBounce: deBounce
    }