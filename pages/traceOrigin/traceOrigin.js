// pages/traceOrigin/traceOrigin.js
const app = getApp();
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tabbar: {},
    isIphoneX: app.globalData.isIphoneX,
    originInfo:{},
    currentPage:1,
    nomore:false,
    modalHidden: false,
    name: '',
    phone: '',
    advice: '',
    nameEmpty: 1,
    phoneEmpty: 1,
    contextEmpty: 1,
    allow: false,
    marginTop:'-460rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this;
    _this.getOriginInfo();
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';
    if (!phoneNumber) {
      this.setData({
        allow: true
      })
    }
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
  getOriginInfo(){//获取溯源列表
    const _this=this;
    HTTP.GET({
      url:'origin',
      data: { 
        qrcodeNum: app.globalData.checkParams.qrcodepriNum,
        currentPage: _this.data.currentPage,
        currentSize:6
        }
    }).then(res=>{
      _this.setData({
        loading:false
      })
      let orisechList;
      if (Object.keys(_this.data.originInfo).length == 0) {
        orisechList = []
      } else {
        orisechList = _this.data.originInfo.orisechList;
      }
      orisechList = orisechList.concat(res.data.orisechList);
      const orisech = "originInfo.orisechList";
      if (_this.data.currentPage == 1) {
        _this.setData({
          originInfo: res.data
        })
      } else {
        _this.setData({
          [orisech]: orisechList
        })
        if (res.data.orisechList.length < 6) {
          _this.setData({
            nomore: true
          })
        }
      }
    })
    
  },
  getMoreOriginInfo(){//查看更多溯源列表
    this.setData({
      currentPage: this.data.currentPage+1
    })
    this.getOriginInfo()
  },
  /*
  异常反馈
  */
  openModal() {//显示模态框
    this.setData({
      modalHidden: true,
      nameEmpty: 1,
      phoneEmpty: 1,
      contextEmpty: 1,
    })
  },
  closeModal() {//关闭模态框
    this.setData({
      modalHidden: false,
      nameEmpty: 1,
      phoneEmpty: 1,
      contextEmpty: 1,
      advice: ''
    })
  },
  handelInputFocus(e) {//输入框focus
    const name = e.target.dataset.name;
    this.setData({
      [name]: 1,
      marginTop: '-550rpx'
    })
  },
  handelInputBlur(e) {//输入框blur
    const name = e.target.dataset.name;
    if (name == "nameEmpty") {
      if (e.detail.value.length == 0) {
        this.setData({
          [name]: 0
        })
      }
    }
    if (name == 'phoneEmpty') {
      if (e.detail.value.length == 0 || !(/^1[345678]\d{9}$/.test(e.detail.value))) {
        this.setData({
          [name]: 0
        })
      }
    }
    if (name == "contextEmpty") {
      this.setData({
        isFocus: false,
        advice: e.detail.value,
        marginTop: '-460rpx'
      })
      if (e.detail.value.length == 0) {
        this.setData({
          [name]: 0
        })
      }
    }
  },
  handelviewFocus() {
    this.setData({
      isFocus: true
    })
  },
  saveFeedback(e) {//保存异常反馈
    const _this = this;
    let num = 0;
    if (e.detail.value.name.length == 0) {
      this.setData({
        nameEmpty: 0
      })
      num = 1;
    }
    if (e.detail.value.phone.length == 0 || !(/^1[345678]\d{9}$/.test(e.detail.value.phone))) {
      this.setData({
        phoneEmpty: 0
      })
      num = 1;
    }
    if (e.detail.value.advice.length == 0) {
      this.setData({
        contextEmpty: 0
      })
      num = 1;
    }
    if (num < 1) {
      HTTP.POST({
        url:'saveFeedback',
        data: {
          odbkContent: e.detail.value.advice,
          odbkTitle: _this.data.proName,
          qrcodepriNum: app.globalData.checkParams.qrcodeNum,
          openid: app.globalData.checkParams.openId,
          name: e.detail.value.name,
          phone: e.detail.value.phone
        }
      }).then(res=>{
        wx.navigateTo({
          url: '/pages/feedback/feedback',
        })
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
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    this.setData({
      originInfo: {},
      currentPage: 1,
      nomore: false
    })
    this.getOriginInfo()
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