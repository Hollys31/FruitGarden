// pages/traceOrigin/traceOrigin.js
const app = getApp();
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
    proName:'',
    name: '',
    phone: '',
    advice: '',
    nameEmpty: 1,
    phoneEmpty: 1,
    contextEmpty: 1,
    allow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this;
    _this.getOriginInfo();
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';
    if (!phoneNumber) {
      console.log(phoneNumber);
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
  handelsScanCode() {
    handel.handelScanCode(this, { phoneNumber: wx.getStorageSync('phoneNumber') || '', openId: wx.getStorageSync('openId') || '' });
  },
  getPhoneNumber(e) {
    const _this=this;
    if (e.detail.iv) {
      handel.getPhoneNumber(e, _this);
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先授权获取手机号',
      })
    }
  },
  getOriginInfo(){//获取溯源信息
    const _this=this;
    const qrcodeNum = wx.getStorageSync('qrcodeNum') || ''
    handel.handelRequest(this, {
      url: 'origin' + '?' + qrcodeNum+"/"+_this.data.currentPage+'/6',
    }, function (result) {
      console.log(result);
      _this.setData({
        proName: result.produceInfo.type
      })
      let orisechList;
      if (Object.keys(_this.data.originInfo).length==0){
        orisechList=[]
      }else{
        orisechList = _this.data.originInfo.orisechList;
        
      }
      orisechList = orisechList.concat(result.orisechList);
      const orisech ="originInfo.orisechList";
      if (_this.data.currentPage==1){
        _this.setData({
          originInfo: result
        })
      }else{
        _this.setData({
          [orisech]: orisechList
        })
        if (result.orisechList.length<6){
         _this.setData({
           nomore: true
         })
        }
      }
     
    })
  },
  getMoreOriginInfo(){//查看更多溯源信息
    this.setData({
      currentPage: this.data.currentPage+1
    })
    this.getOriginInfo()
  },
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
      [name]: 1
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
        advice: e.detail.value
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
    if (e.detail.value.phone.length == 0 || !(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
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
      handel.handelRequest(this, {
        url: 'saveFeedback',
        method: "POST",
        data:{
          odbkContent: e.detail.value.advice,
          odbkTitle: _this.data.proName,
          qrcodeNum: wx.getStorageSync('qrcodeNum') || '',
          openid: wx.getStorageSync('openId') || '',
          name: e.detail.value.name,
          phone: e.detail.value.phone
        }
      }, function (result) {
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