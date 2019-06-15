// pages/checking/checking.js
var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fistPart: true,
    mapPart:false,
    showProduct:false,
    count:0,
    className: '',
    animationData: {},
    longitude: 113.324520,
    latitude: 23.099994,
    scale:2,
    productInfo:{},
    markers: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animates()
    this.getProductInfo()
  },
  animates() {//地球放大
    const _this = this;
    this.animate1 = setTimeout(function () {
      _this.setData({
        fistPart: false
      })
    }, 3000);
    this.animate3 = setTimeout(function () {
      _this.setData({
        className: 'scan1'
      }, 4000)
    })
    
  },
  getProductInfo(){//获取产品信息
    const _this=this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || '';
    let Arrs =[{
      iconPath: '/resources/images/loca.png',
      id: 0,
      longitude: 113.324520,
      latitude: 23.099994,
      width: 35,
      height: 35
    }];
    handel.handelRequest(this, {
      url: 'report' + '?' + qrcodeNum
    }, function (result) {
      Arrs[0].longitude=result.gardenInfo.addressGislong;
      Arrs[0].latitude=result.gardenInfo.addressGislatd;
      _this.setData({
        longitude: result.gardenInfo.addressGislong,
        latitude: result.gardenInfo.addressGislatd,
        productInfo:result,
        markers: Arrs
      })
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
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
    const animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.scale1=setTimeout(function () {
      this.setData({
        mapPart: true,
      })
    }.bind(this), 4000)
  
    this.scale3= setTimeout(function () {
      animation.scale(1, 1).step()
      this.setData({
        animationData: animation.export(),
        scale:15,
        showProduct:true
      })
    }.bind(this), 3300)
    this.scale4 = setTimeout(function () {
      this.setData({
        showProduct: true
      })
    }.bind(this), 3400)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.animate1);
    clearTimeout(this.animate2);
    clearTimeout(this.scale1);
    clearTimeout(this.scale2);
    clearTimeout(this.scale3);
    clearTimeout(this.scale4);
  },
  lookDetail(){
    wx.switchTab({
      url: '/pages/index/index',
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