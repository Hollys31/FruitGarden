import HTTP from './http.js'
const app = getApp();
var QQMapWX = require('../lib/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'XTNBZ-NZELX-5V342-T4TLG-DSLOQ-Q6FX3'
});
module.exports = {
  wxLogin: new Promise(function (resolve, reject) {//微信登录
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject();
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }),
  getOpenId: function () {//获取openId
    const _this = this;
    return new Promise(function (reolve, reject) {
      _this.wxLogin.then(code => {
        HTTP.GET({ url: 'getOpenid', data: { code: code } }).then(res => {
          app.globalData.checkParams.openId = res.data.openid;
          wx.setStorageSync('sessionKey', res.data.session_key);
          reolve(res.data);
        })
      })
    })
  },
  getSetting:function(){
    return new Promise(function (resolve, reject) {//查看设置并打开位置信息设置
      const _this = this;
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] != true) {
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success: res => {
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none'
                  })
                }
                if (res.confirm) {
                  wx.openSetting({
                    success: res => {
                      if (res.authSetting['scope.userLocation'] == true) {
                        wx.showToast({
                          title: '授权成功',
                        })
                        resolve();
                      }
                    }
                  })
                }
              }
            })
          } else {
            resolve();
          }
        }
      })
    })
  },
  getLocation: new Promise(function (resolve, reject) {//获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success(Local) {
        resolve(Local);
      },
      fail() {
        wx.showToast({
          title: '获取位置失败',
        })
        reject();
      }

    })
  }),
  getAddressInfo: function (location) {//逆解析位置
    return new Promise(function (resolve, reject) {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        success: function (LocalRes) {
          resolve(LocalRes);
        },
        fail: function (error) {
          wx.showToast({
            title: '详细地址获取失败',
            icon: 'none'
          })
          reject();
        }
      })
    })
  },
  getUserAddress: function () {//获取用户位置信息
    const _this = this;
    wx.showLoading({
      mask: true,
      title: '定位中...',
    })
    return new Promise(function(resolve,reject){
      _this.getSetting().then(() => {//设置
        _this.getLocation.then(Local => {//经纬度
          _this.getAddressInfo(Local).then(res => {//逆解析地址
            let params = {};
            params.orisechGislate = Local.latitude;
            params.orisechGislong = Local.longitude;
            params.orisechProv = res.result.ad_info.province;
            params.orisechCity = res.result.ad_info.city;
            params.orisechAddr = params.orisechProv + params.orisechCity + res.result.formatted_addresses.recommend;
            app.globalData.checkParams = Object.assign(app.globalData.checkParams, params);
            wx.hideLoading()
            resolve(params);
          })
        })
      })
    })
  },
  getPhoneNumber: function (e) {//获取用户手机号
    return new Promise(function (resolve, reject) {
      const _this = this;
      HTTP.POST({
        url: 'getWXUserInfo',
        data: {
          session_key: wx.getStorageSync('sessionKey') || '',
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
      }).then((result) => {
        app.globalData.checkParams.phoneNumber = result.data.phoneNumber;
        wx.setStorageSync('phoneNumber', result.data.phoneNumber);//判断是否授权手机号依据
        resolve(result.data.phoneNumber);
      })
    })
  },
  checkCode: function (data) {//验证二维码
    HTTP.POST({
      url: 'postCheck',
      data: data
    },'ok').then((res)=>{
      if(res.status==200){
        let obj={
          qrcodepriNum: res.data.qrcodeNum,
          qrtype: res.data.qr_type,
          gardenId:res.data.gardenInfo.gardenId,
          blockId:res.data.gardenInfo.blockId
        }
        app.globalData.checkParams = Object.assign(app.globalData.checkParams, obj);
        if (res.data.qr_type == 0) {
          wx.reLaunch({
            url: '/pages/case/index',
          })
        } else {
          wx.reLaunch({
            url: '/pages/checking/checking',
          })
        }
      }else{
        wx.reLaunch({
          url: '/pages/checkfail/checkfail',
        })
      } 
    })
  },
  scanCode: function () {
    return new Promise(function (resolve, reject) {
      wx.scanCode({
        success: (resCode) => {
          var arr1 = resCode.result.split('=')[1]
          resolve(arr1);
        },
        fail: (res) => {
          /*  wx.showToast({
             title: "扫码失败",
             icon: 'none',
             duration: 2000
           }) */
        }
      })
    })
  },
  editTabbar: function (tabbar) { //底部自定义tabbar
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
}



