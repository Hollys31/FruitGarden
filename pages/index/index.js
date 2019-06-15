// pages/index/index.js
var handel = require('../../utils/handel.js');
var api = require('../../lib/api.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tabbar: {},
    isIphoneX: app.globalData.isIphoneX,
    originIsShow: false,
    mainInfo: {},
    originInfo: {},
    coverImg1: handel.imgHeader+'/imgs/origin.png',
    coverImg2: handel.imgHeader+'/imgs/indck.png',
    coverImg3: handel.imgHeader + '/imgs/indrk.png',
    coverImg4: handel.imgHeader + '/imgs/indns.png',
    coverImg5: handel.imgHeader + '/imgs/indzz.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.hideTabBar();
    handel.editTabbar();
    this.getHomeInfo();
    this.getOriginInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getHomeInfo() {//获取首页信息数据
    const _this = this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || ''
    handel.handelRequest(this, {
      url: 'homeInfo' + '?' + qrcodeNum,
    }, function (result) {
    //  console.log(result);
      _this.setData({
        mainInfo: result
      })
    })
  },
  getOriginInfo() {//获取溯源流程数据信息
    const _this = this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || ''
    handel.handelRequest(this, {
      url: 'originFlow' + '?' + qrcodeNum,
    }, function (result) {
      console.log(result);
      _this.setData({
        originInfo: result
      })
    })
  },
  lookProduce() {//查看产品生产环境
    this.setData({
      originIsShow:true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

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