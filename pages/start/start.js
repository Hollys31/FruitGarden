// pages/start/start.js
const app = getApp();
var handel = require('../../utils/handel.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allow: false,
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    if (options.q) {
      var scene = decodeURIComponent(options.q)  // 使用decodeURIComponent解析  获取当前二维码的网址
      var arr1 = scene.split('=');
      app.globalData.checkParams.qrcodepriNum = arr1[1];
      const phoneNumber = wx.getStorageSync('phoneNumber') || '';
      if (phoneNumber) {//手机是否授权
        Promise.all([handel.getUserAddress(), handel.getOpenId()]).then(res => {
          app.globalData.checkParams.phoneNumber = phoneNumber;
          handel.checkCode(app.globalData.checkParams);//验证
        })
      } else {
        _this.setData({
          allow: true,
        })
      }
    } else {
      wx.reLaunch({
        url: '/pages/scanQRCode/scanQRCode',
      })
    }
  },
  
  getPhoneNumber(e) {//授权获取手机号后扫码
    const _this = this;
    if (e.detail.iv) {
      Promise.all([handel.getUserAddress(), handel.getOpenId()]).then(res => {
        handel.getPhoneNumber(e).then(res => {
          handel.checkCode(app.globalData.checkParams);//验证
        })
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先授权获取手机号',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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