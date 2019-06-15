// components/circle/circle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: '/resources/images/orange.png',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      const _this=this;
      let progressNum = 0;
      var timer = setInterval(function () {
        progressNum++;
        if (progressNum >= 100) {
          clearInterval(timer)
        }
        _this.setData({
          count: progressNum
        })
      },28)
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
