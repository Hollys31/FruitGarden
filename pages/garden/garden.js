// pages/teaPlantation/teaPlantation.js
var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    loading:true,
    isIphoneX: app.globalData.isIphoneX,
    gardenInfo:{},
    coverImg: handel.imgHeader +"/imgs/orban.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGardenInfo()
  },
 getGardenInfo(){//获取果园信息
   const _this=this;
   const blockId = wx.getStorageSync('blockId') || '';
   const gardenId = wx.getStorageSync('gardenId') || '';
   console.log(blockId);
   handel.handelRequest(this, {
     url: 'orchard' + '?' + gardenId + '/' + blockId,
   }, function (result) {
     console.log(result);
     _this.setData({
      gardenInfo: result
     })
   })
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