// pages/case/origin.js
var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
   handel.editTabbar(app.globalData.caseTabbar); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handelsScanCode() {//再次扫码
    handel.scanCode().then(code => {//扫码
      app.globalData.checkParams.qrcodepriNum = code;
      handel.checkCode(app.globalData.checkParams);//验证
    });
  },
  getPhoneNumbers(e) {//未授权手机号先获取手机号码扫码
    const _this = this;
    if (e.detail.iv) {
      handel.getOpenId().then(res => {//获取openid
        app.globalData.checkParams.openId = res.openid;
        handel.getPhoneNumber(e).then(phone => {//获取手机号
          app.globalData.checkParams.phoneNumber = phone;
          handel.scanCode().then(code => {//扫码
            app.globalData.checkParams.qrcodepriNum = code;
            handel.checkCode(app.globalData.checkParams);//验证
          });
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