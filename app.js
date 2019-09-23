//app.js
App({
  onLaunch: function (options) {
    const _this = this;
    const path = options.path;
    wx.hideTabBar();
    this.getSystemInfo();
    // if (options.scene != 1011 && options.scene != 1012 && path != 'pages/scanQRCode/scanQRCode') {
    //    wx.reLaunch({
    //     url: '/pages/scanQRCode/scanQRCode',
    //   }) 
    // }
  },
  globalData: {
    IMG_URL_HEAD: 'https://trace.yufengtek.com/orchard/applet',
    userInfo: null,
    systemInfo: null,
    isIphoneX: false,
    checkParams: {/****验证扫码参数****/
      openId: '',//openID
      phoneNumber:'',//手机号码
      qrcodepriNum: '',//二维码值
      qrtype: '',//二维码类型
      blockId: '',//地块ID
      gardenId: '',//果园ID
    },
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
    caseTabbar: {
      "color": "#ccc",
      "selectedColor": "#f66a1c",
      "borderStyle": "white",
      "list": [{
        "selectedIconPath": "/resources/images/tab11.png",
        "iconPath": "/resources/images/tab1.png",
        "pagePath": "/pages/case/index",
        "text": "源地认证"
      },
      {
        "selectedIconPath": "/resources/images/tab22.png",
        "iconPath": "/resources/images/tab2.png",
        "pagePath": "/pages/case/origin",
        "text": "溯源流程"
      },
      {
        "selectedIconPath": "/resources/images/tab33.png",
        "iconPath": "/resources/images/tab3.png",
        "pagePath": "/pages/case/product",
        "text": "立即购买"
      },
      {
        "selectedIconPath": "/resources/images/tab44.png",
        "iconPath": "/resources/images/tab4.png",
        "pagePath": "/pages/case/contact",
        "text": "联系我们"
      }
      ]
    }
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