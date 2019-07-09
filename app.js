//app.js

App({
  onLaunch: function (options) {
    wx.hideTabBar();
    this.getSystemInfo();
    /*  wx.removeStorage({key: 'qrcodepriNum'}) */
    /* if (options.scene != 1011 && options.scene != 1012) {
      wx.reLaunch({
        url: '/pages/scanQRCode/scanQRCode',
      })
    } */
  },
  globalData: {
    userInfo: null,
    qrcodepri_num: '',
    systemInfo: null,
    isIphoneX: false,
    openId:'',//openID
    qrcodeNum:'',//二维码值
    qrtype:'',//二维码类型
    blockId:'',//地块ID
    gardenId:'',//果园ID
    address:{},//位置信息
    tabBar: {
      "color": "#494949",
      "selectedColor": "#06caac",
      "borderStyle": "white",
      "list": [{
        "selectedIconPath": "/resources/images/index1.png",
        "iconPath": "/resources/images/index.png",
        "pagePath": "/pages/index/index",
        "text": "首页"
      },
      {
        "selectedIconPath": "/resources/images/farm1.png",
        "iconPath": "/resources/images/farm.png",
        "pagePath": "/pages/farmWorks/farmWorks",
        "text": "农事"
      },
      {
        "selectedIconPath": "/resources/images/video1.png",
        "iconPath": "/resources/images/video.png",
        "pagePath": "/pages/video/video",
        "text": "视频"
      },
      {
        "selectedIconPath": "/resources/images/environment1.png",
        "iconPath": "/resources/images/environment.png",
        "pagePath": "/pages/environmentChart/index",
        "text": "环境"
      }
      ]
    },
  },
  getSystemInfo: function () { //获取设备信息
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        t.globalData.isIphoneX = res.model.indexOf("iPhone X") > -1 ? true : false;
      }
    });
  },
})