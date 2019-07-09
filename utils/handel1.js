const app = getApp()
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var api = require('../lib/api.js');
var qqmapsdk = new QQMapWX({
  key: 'XTNBZ-NZELX-5V342-T4TLG-DSLOQ-Q6FX3'
});
var handle = { //trace.yufengtek.com
  //http://testorchdbs.yufengtek.com/orchard/applet/api
  //https://trace.yufengtek.com/orchard/applet/api
  imgHeader: 'https://trace.yufengtek.com/orchard/applet', //http://192.168.2.169:7070/api/applet/v1
  urlHeader: "https://trace.yufengtek.com/orchard/applet/api", //http://192.168.2.118:7070/api/applet/v1
  reloadTrigger() { //重新加载
    let curpage = getCurrentPages()[0];
    wx.reLaunch({
      url: "/" + curpage.route
    })
  },
  handelRequest(that, obj, callback, errcb) { //request请求
    const _this = this;
    let url = "";
    if (obj.method && obj.method == 'POST') {
      const name = obj.url;
      url = api[name];
      wx.request({
        url: _this.urlHeader + "" + url,
        data: obj.data,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          if (res.data.status == 200) {
            (callback && typeof (callback) === "function") && callback(res.data.data);
          } else {
            if (errcb) {
              (errcb && typeof (errcb) === "function") && errcb(res.data);
            }
          }
        },
        fail: function (err) {
          wx.showToast({
            title: '请求出错',
            icon: 'none',
            duration: 2000
          })
          return;
        },
        complete: function () {
          that.setData({
            loading: false
          })
        }
      })
    } else {
      const keyName = obj.url.split('?')[0];
      const params = obj.url.split('?')[1];
      url = api[keyName] + "/" + params
      wx.request({
        url: _this.urlHeader + "/" + url,
        method: "GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          if (res.data.status == 200) {
            (callback && typeof (callback) === "function") && callback(res.data.data);
          } else {
            if (errcb) {
              (errcb && typeof (errcb) === "function") && errcb(res.data);
            }
          }
        },
        fail: function (err) {
          wx.showToast({
            title: '请求出错',
            icon: 'none',
            duration: 2000
          })
          return;
        },
        complete: function () {
          that.setData({
            loading: false
          })
        }
      })
    }

  },
  getAddress(that) { //获取地址
    const _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(Local) {
        const latitude = Local.latitude
        const longitude = Local.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(LocalRes) {
            const provice = LocalRes.result.ad_info.province;
            const city = LocalRes.result.ad_info.city;
            const district = LocalRes.result.ad_info.district;
            const address = provice + city + LocalRes.result.formatted_addresses.recommend;
            wx.setStorage({
              key: 'latitude',
              data: latitude
            })
            wx.setStorage({
              key: 'longitude',
              data: longitude
            })
            wx.setStorage({
              key: 'orisechProv',
              data: provice
            })
            wx.setStorage({
              key: 'orisechCity',
              data: city
            })
            wx.setStorage({
              key: 'orisechDistrict',
              data: district
            })
            wx.setStorage({
              key: 'orisechAddr',
              data: address
            })
            wx.hideLoading()
          },
          fail: function(error) {
            wx.showToast({
              title: '详细地址获取失败',
              icon: 'none'
            })
          }
        })
      },
      fail() {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '获取位置失败',
        })
      }
    })
  },
  getSetting(that) {
    const _this = this;
    wx.showLoading({
      mask: true,
      title: '定位中...',
    })
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
              } else if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.userLocation'] == true) {
                      wx.showToast({
                        title: '授权成功',
                      })
                      _this.getAddress(that)
                    }
                  }
                })
              }
            }
          })
        } else {
          _this.getAddress(that)
        }
      }
    })

  
  
  },
  checkCode(that, data) {
    const _this = this;
    data.orisechGislong = wx.getStorageSync('longitude') || '';
    data.orisechGislate = wx.getStorageSync('latitude') || '';
    data.orisechProv = wx.getStorageSync('orisechProv') || '';
    data.orisechCity = wx.getStorageSync('orisechCity') || '';
    data.orisechAddr = wx.getStorageSync('orisechAddr') || '';
    _this.handelRequest(that, {
      method: "POST",
      url: 'postCheck',
      data: data
    }, function(res) {
      wx.setStorage({
        key: 'qrcodeNum',
        data: res.qrcodeNum
      });
      wx.setStorage({
        key: 'blockId',
        data: res.gardenInfo.blockId
      })
      wx.setStorage({
        key: 'gardenId',
        data: res.gardenInfo.gardenId
      })
      wx.reLaunch({
        url: '/pages/checking/checking',
      })
    }, function(res) {
      if (res.status == 400) {
        wx.reLaunch({
          url: '/pages/checkfail/checkfail',
        })
      }
    })
  },
  handelScanCode(that, data, code) { //获取用户当前位置后扫码
    var _this = this;
    if (code) { //二维码扫码
      data.qrcodepriNum = code || '';
      _this.checkCode(that, data, code);
    } else { //小程序码扫码
      wx.scanCode({
        success: (resCode) => {
          var arr1 = resCode.result.split('=')[1]
          data.qrcodepriNum = arr1 || resCode.result;
          _this.checkCode(that, data);
        },
        fail: (res) => {
          /*  wx.showToast({
             title: "扫码失败",
             icon: 'none',
             duration: 2000
           }) */
          return
        }
      })
    }
  },
  getPhoneNumber(e, that, code) { //获取用户手机号
    const _this = this;
    _this.handelRequest(that, {
      method: "POST",
      url: 'getWXUserInfo',
      data: {
        session_key: wx.getStorageSync('sessionKey') || '',
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
    }, function(result) {
      wx.setStorageSync('phoneNumber', result.phoneNumber);
      if (code) {
        console.log("二维码是:" + code);
        _this.handelScanCode(that, {
          phoneNumber: result.phoneNumber,
          openId: wx.getStorageSync('openId') || ''
        }, code);
      } else {
        _this.handelScanCode(that, {
          phoneNumber: result.phoneNumber,
          openId: wx.getStorageSync('openId') || ''
        });
      }
    })
  },
  getOpenId: function(that, callback) { //获取openId
    const _this = this;
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          // 发起网络请求
          _this.handelRequest(that, {
            url: 'getOpenid' + '?' + res.code,
          }, function(result) {
            wx.setStorageSync('openId', result.openid);
            wx.setStorageSync('sessionKey', result.session_key);
            (callback && typeof(callback) === "function") && callback(result);
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  editTabbar: function() { //tabbar
    let tabbar = app.globalData.tabBar;
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
module.exports = handle;