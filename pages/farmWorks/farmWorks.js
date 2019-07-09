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
    loading: true,
    isIphoneX: app.globalData.isIphoneX,
    farmWorkList: [],
    productInfo: {},
    coverImg: handel.imgHeader+'/imgs/stok.png?v=11',
    on: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    handel.editTabbar();
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
      on: true
    })
  },
  getProductInfo() {//获取产品信息
    const _this = this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || ''
    HTTP.GET({
      url:'farmProduct',
      data: { qrcodeNum: app.globalData.qrcodeNum}
    }).then(res=>{
      _this.setData({
        productInfo: res.data
      })
    })
  },
  getFarmWorkList() {//获取农事记录列表
    const _this = this;
    HTTP.GET({
      url:'farmWorkList',
      data: { qrcodeNum: app.globalData.qrcodeNum }
    }).then(res=>{
      _this.setData({
        farmWorkList: res.data.farmWorks,
        loading:false
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