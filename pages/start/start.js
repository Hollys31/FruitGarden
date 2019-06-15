// pages/start/start.js
var handel = require('../../utils/handel.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'20190316093900000011552700360949',
    allow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    handel.getSetting(this);//地理位置授权
    handel.getOpenId(this);//获取openid
    const _this=this;
    if (options.q) {
      var scene = decodeURIComponent(options.q)  // 使用decodeURIComponent解析  获取当前二维码的网址
      // scene.decodeURL()
      console.log(scene );
      var arr1 = scene.split('=');
      console.log(arr1);
      const phoneNumber = wx.getStorageSync('phoneNumber') ||'';
      const openId = wx.getStorageSync('openId') || '';
      if (phoneNumber && openId){
        handel.handelScanCode(_this, { phoneNumber: phoneNumber, openId: openId }, arr1[1]);
      }else{
        _this.setData({
          code: arr1[1],
          allow: true
        })
      }
     
    }else{
     wx.reLaunch({
       url: '/pages/scanQRCode/scanQRCode',
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
  getPhoneNumber(e) {
    const _this=this;
    if (e.detail.iv) {
      handel.getPhoneNumber(e, _this,_this.data.code);
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先授权获取手机号',
      })
    }
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