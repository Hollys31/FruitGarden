//index.js
const app = getApp();
//获取应用实例
var handel = require('../../utils/handel.js');
const funs = require('../../utils/fun.js')
var qqmapsdk;
Page({
  data: {
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    loading: false,
    buttonClicked: false,
    allow: false,
  },
  onLoad: function () {
    const _this = this;
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';//判断是否授权获取用户手机号
    if (!phoneNumber) {
      this.setData({
        allow: true
      })
    }
    handel.getUserAddress();//获取地理位置
  },
  onReady() {
    // 调用接口
    const _this = this;


  },
  tofeedback() {//到异常反馈
    handel.getOpenId().then(() => {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    })
  },
  handelsScanCode: funs.throttle(function(){//已授权手机号扫码
    const _this = this;
    handel.getOpenId().then(res => {//获取openid
      app.globalData.checkParams.openId = res.openid;
      handel.scanCode().then(code => {//扫码
        app.globalData.checkParams.qrcodepriNum = code;
        app.globalData.checkParams.phoneNumber = wx.getStorageSync('phoneNumber') || '';
        handel.checkCode(app.globalData.checkParams);//验证
      });
    })
  },2000),
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
})
