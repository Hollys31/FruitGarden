// pages/case/index.js
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    current:0,
    tabbar:{},
    currInd:1,
    flag:true,
    tabArr:[{id:0,name:'土壤'},{id:1,name:'气候'},{id:2,name:'监管'}],
    productInfo:{},
    soilInfo:{},
    climateInfo:{},
    supervision:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tabArr:[{id:0,name:'土壤'},{id:1,name:'气候'},{id:2,name:'监管'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    handel.editTabbar(app.globalData.caseTabbar);
    this.getProductInfo();
    this.getSoilEnv();
    this.getSupervision();
    this.getClimate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  switchSwiperItem(e){//滑动翻页
    const current = e.detail.current;
    this.setData({
      current:current
    });
    if(current!=2){
      this.setData({
        flag: true
      });
    }
  },
  getEnvironment(e){//切换源地环境信息
    const ind = e.currentTarget.dataset.index;
    this.setData({
      currInd:ind
    })
    this.setData({
      flag: false
    })
  },
  getProductInfo(){//获取产品信息
    const _this=this;
    HTTP.GET({
      url:'TRACEAUTH',
      data:{
        qrcodeNum: app.globalData.checkParams.qrcodepriNum
      }
    }).then(res=>{
      _this.setData({
        productInfo:res.data
      })
    })
  },
  getSoilEnv() {//土壤
    const _this = this;
    HTTP.GET({
      url: 'TEACEWEATHER',
      data: {
        gardenId: app.globalData.checkParams.gardenId,
        type: 'soil',

      }
    }).then(res => {
      _this.setData({
        soilInfo: res.data
      })
    })
  },
  getClimate() {//气候
    const _this = this;
    HTTP.GET({
      url: 'TEACEWEATHER',
      data: {
        gardenId: app.globalData.checkParams.gardenId,
        type: 'env',
      
      }
    }).then(res => {
      _this.setData({
        climateInfo: res.data
      })
    })
  },
 
  
  getSupervision(){//监管
    const _this = this;
    HTTP.GET({
      url: 'TEACEWEATHER',
      data: {
        gardenId: app.globalData.checkParams.gardenId,
        type: 'mon',
       
      }
    }).then(res => {
      _this.setData({
        supervision:res.data
      })
    })
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