var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: '',
    flag: false,
    isIphoneX: app.globalData.isIphoneX,
    tabbar: {},
    pageHidden: true
  },

  onLoad: function(e) {
    let url = e.url
    this.setData({
      URL: url
    })
    this.setData({
      flag: true
    })
    wx.hideTabBar();
    handel.editTabbar(app.globalData.tabBar);
  }
  
})