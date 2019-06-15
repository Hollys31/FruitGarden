// components/videos/videos.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoData:{
      type:Object,
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    currType:{
      type:Number,
      value:1
    },
    isLoading: {
      type: Boolean,
      value: false
    },
    empty:{
      type: Boolean,
      value: false
    }
  },
  options: {
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    freshHide:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    livePlay(e) {//直播播放
      var curIdx = e.currentTarget.dataset.index;
      this.setData({
        playIndex: curIdx,
      })
    },
    refreshVideo(){//刷新加载不在线视频
      this.setData({
        freshHide: false
      })
      this.triggerEvent('myevent')
    },
    statechange(){
      console.log(e);
    },
    error(e){
      console.log(e);
    }
  }
})
