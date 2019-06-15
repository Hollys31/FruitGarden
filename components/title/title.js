// components/title/title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '圈仔果园',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 20,
    hasBackIcon: false,
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      const _this = this;
      let len = getCurrentPages().length;
      if (len > 1) {
        this.setData({
          hasBackIcon: true
        })
      }
      _this.setData({
        statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
      })

    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handelToHistory(){
     /*  const prePage = getCurrentPages()[getCurrentPages().length - 2].route; */
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
