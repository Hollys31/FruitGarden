//index.js
const app = getApp();
//获取应用实例
var handel = require('../../utils/handel.js');
var qqmapsdk;
Page({
  data: {
    loading: false,
    buttonClicked:false,
    allow:false
  },

  onLoad: function () {
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';
    if (!phoneNumber){
      console.log(phoneNumber);
      this.setData({
        allow:true
      })
    }
    handel.getOpenId(this);//获取openid
    handel.getSetting(this);//地理位置授权
  },
  onReady() {
    // 调用接口
   
  },
  handelsScanCode(){
    handel.handelScanCode(this, { phoneNumber: wx.getStorageSync('phoneNumber') || '', openId: wx.getStorageSync('openId') || '' });
  },
  getPhoneNumbers(e){
    const _this=this;
    if(e.detail.iv){
      console.log(e.detail.iv);
      handel.getPhoneNumber(e, _this);
    }else{
      wx.showToast({
        icon:'none',
        title: '请先授权获取手机号',
      })
    }
  },
})
