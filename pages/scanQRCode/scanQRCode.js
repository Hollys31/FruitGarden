//index.js
const app = getApp();
//获取应用实例
var handel = require('../../utils/handel.js');
var qqmapsdk;
Page({
  data: {
    loading: false,
    buttonClicked:false,
    allow:false,
    params:{}//扫码验证参数
  },

  onLoad: function () {
    const _this=this;
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';
    if (!phoneNumber){
      this.setData({
        allow:true
      })
    }
    handel.getUserAddress().then(res=>{//获取地理位置
      const params = Object.assign(_this.data.params, res);
      app.globalData.address=res;
      _this.setData({
        params: params
      });
    });
    handel.getOpenId().then(res => {//获取openid
      let params=_this.data.params;
      params.openId = res.openid;
      _this.setData({
        params: params
      });
    })
   
  },
  onReady() {
    // 调用接口
   
  },
  handelsScanCode(){//已授权手机扫码
    const _this=this;
    handel.scanCode().then(code => {//扫码
      let params = _this.data.params;
      params.qrcodepriNum = code;
      params.phoneNumber = wx.getStorageSync('phoneNumber') || '';
      handel.checkCode(params);//验证
    });
  }, 
  getPhoneNumbers(e){//授权手机后扫码
    const _this=this;
    if(e.detail.iv){
      let params = _this.data.params;
      handel.getPhoneNumber(e).then(phone=>{//获取手机号
        params.phoneNumber=phone;
        handel.scanCode().then(code=>{//扫码
          params.qrcodepriNum=code;
          handel.checkCode(params);//验证
        });
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '请先授权获取手机号',
      })
    }
  },
})
