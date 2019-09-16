// pages/farmWorks/farmWorks.js
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    loading: true,
    isIphoneX: app.globalData.isIphoneX,
    farmWorkList: [],
    productInfo: {},
    on: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    handel.editTabbar(app.globalData.tabBar);
    this.getProductInfo()
    this.getFarmWorkList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getAllDesc() {//查看完整产品描述
    this.setData({
      on: !this.data.on
    })
  },
  getProductInfo() {//获取产品信息
    const _this = this;
    HTTP.GET({
      url: 'farmProduct',
      data: { qrcodeNum: app.globalData.checkParams.qrcodepriNum }
    }).then(res => {
      _this.setData({
        productInfo: res.data
      })
    })
  },
  getFarmWorkList() {//获取农事记录列表
    const _this = this;
    HTTP.GET({
      url: 'farmWorkList',
      data: { qrcodeNum: app.globalData.checkParams.qrcodepriNum  }
    }).then(res => {
      _this.setData({
        farmWorkList: res.data.farmWorks,
        loading: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      on: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})