
function throttle(fn, gapTime = 1500) {//节流函数
  let _lastTime = null
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
function debounce(fn, delay) {//防抖函数 按钮多次提交执行最后一次
  let delays = delay || 2000,
    timer,
    _this = this,
    args = arguments;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(_this, args)
    }, delays)
  }
}
module.exports = {
  throttle: throttle,
  debounce: debounce
}