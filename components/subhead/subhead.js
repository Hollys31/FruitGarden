// components/subhead/subhead.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
