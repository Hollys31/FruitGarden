// pages/index/index.js
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tabbar: {},
    isIphoneX: app.globalData.isIphoneX,
    mainInfo: {},
    originInfo: {},
    modalInfo: {},
    modalHidden: false,
    coverImg1: handel.imgHeader + '/imgs/origin.png?v=13',
    coverImg2: handel.imgHeader + '/imgs/indck.png?v=13',
    coverImg3: handel.imgHeader + '/imgs/indrk.png?v=13',
    coverImg4: handel.imgHeader + '/imgs/indns.png?v=13',
    coverImg5: handel.imgHeader + '/imgs/indzz.png?v=13',
    coverImg6: handel.imgHeader + '/imgs/indcz.png?v=13'
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
  closeModal() {//关闭模态框
    this.setData({
      modalHidden: false,
      modalInfo: {}
    })
  },
  getModalOriginInfo(e) {//溯源流程弹窗信息
    const _this = this;
    const type = e.currentTarget.dataset.type;
    _this.setData({
      modalHidden: true
    })
    HTTP.GET({
      url: 'originInfo',
      data: { type: type, qrcodeNum: app.globalData.qrcodeNum }
    }).then(result => {
      let originInfo = result.data.originInfo;
      originInfo.type = type;
      _this.setData({
        modalInfo: originInfo
      })
    })
  },
  getHomeInfo() {//获取首页信息数据
    const _this = this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || '';
    HTTP.GET({
      url: 'homeInfo',
      data: { qrcodeNum: app.globalData.qrcodeNum}
    }).then(result => {
      _this.setData({
        mainInfo: result.data
      })
    })
  },
  
  getOriginInfo() {//获取溯源流程数据信息
    const _this = this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || ''
    HTTP.GET({
      url: 'originFlow',
      data: {qrcodeNum:app.globalData.qrcodeNum}
    }).then(result => {
      _this.setData({
        originInfo: result.data,
        loading:false
      })
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
    this.setData({
      modalHidden: false,
      modalInfo: {}
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