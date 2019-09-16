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
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    currType: 0,
    mainInfo: {},
    originInfo: {},
    modalInfo1: {},
    modalInfo2: {},
    modalInfo3: {},
    modalInfo4: {},
    modalHidden: false,
    origins: [{ id: 0, name: 'warehouse' }, { id: 1, name: 'pluck' }, { id: 2, name: 'farm' }, { id: 3, name: 'plant' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.hideTabBar();
    handel.editTabbar(app.globalData.tabBar);
    this.getHomeInfo();
    this.getOriginInfo();
    let types = [['warehouse', 'modalInfo1'], ['pluck', 'modalInfo2'], ['farm', 'modalInfo3'], ['plant', 'modalInfo4']];
    types.map(item => {
      this.getModalOriginInfo(item[0], item[1]);
    })
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
  getModalOriginInfo(type, objname) {//溯源流程弹窗信息
    const _this = this;
    HTTP.GET({
      url: 'originInfo',
      data: { type: type, qrcodeNum: app.globalData.checkParams.qrcodepriNum }
    }).then(result => {
      let originInfo = result.data.originInfo;
      originInfo.type = type;
      let name = objname;
      console.log(name);
      _this.setData({
        [name]: originInfo
      })
    })
  },
  getHomeInfo() {//获取首页信息数据
    const _this = this;
    HTTP.GET({
      url: 'homeInfo',
      data: { qrcodeNum: app.globalData.checkParams.qrcodepriNum }
    }).then(result => {
      _this.setData({
        mainInfo: result.data
      })
    })
  },
  getOriginInfo() {//获取溯源流程数据信息
    const _this = this;
    HTTP.GET({
      url: 'originFlow',
      data: { qrcodeNum: app.globalData.checkParams.qrcodepriNum }
    }).then(result => {
      _this.setData({
        originInfo: result.data,
        loading: false
      })
    })
  },
  handelModal(e) {//模态框行为
    const _this = this;
    const current = e.currentTarget.dataset.current;
    _this.setData({
      modalHidden: true,
      currType: current
    })
  },
  switchTabPage(e) {//弹窗信息切换
    const curr = e.detail.current;
    this.setData({
      currType: curr
    })
  },
  changeGoodsSwip(detail) {//swiper卡顿
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError;
        console.log(swiperError);
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({ currType: 1 });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
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