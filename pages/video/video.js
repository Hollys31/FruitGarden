// pages/video/video.js
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
const funs = require('../../utils/fun.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    loading: true,
    tabbar: {},
    currType: 1,//当前视频类型
    pageHidden: true,
    videoType: [{ 'type': '0', 'name': '全景' }, { 'type': '1', 'name': '直播' }, { 'type': '2', 'name': '小视频' }],
    playIndex: -1,//当前播放视频索引值
    autoplay: false,
    height: 200,
    liveData: [],
    videoData: [],
    isReload: 0,
    currentPage: 1,//直播列表当前页
    isLoading: false,
    empty: false,
    panoUrl: '',
    swiperError: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    handel.editTabbar(app.globalData.tabBar);
    this.getheight('#getheight1');
    this.getLiveList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  myevent() {
    const _this = this;
    this.setData({
      loading: true,
      currentPage: 1,
      playIndex: -1,
      liveData: [],
    })
    this.getLiveList();
  },
  handelTypeRequest(e) {//视频类型切换
    const types = {
      '0': [this.getPanoData, ''],
      '1': [this.getLiveList, 'liveData'],
      '2': [this.getVideoList, 'videoData'],
    };
    const type = types[this.data.currType],
      data = type[1];
    this.setData({
      empty: false
    })
    if (data) {
      this.getheight('#getheight' + this.data.currType);
      if (this.data[data].length == 0) type[0]();
    } else {
      type[0]()
    }
  },
  switchTabPage(e) {//小视频、直播、全景切换 
    let currType = '';
    if (e.type == 'change') {
      currType = e.detail.current
    } else {
      currType = e.currentTarget.dataset.type;
    }
    this.setData({
      currType: currType,
      playIndex: -1
    })
    this.handelTypeRequest();
  },
  /*
   全景
   */
  getPanoData: function () {
    const _this = this;
    HTTP.GET({
      url: "pano",
      data: { gardenId: app.globalData.checkParams.gardenId }
    }).then(res => {
      if (res.data.path) {
        const imgUrl =encodeURIComponent(res.data.path);
        _this.setData({
          panoUrl: imgUrl
        })
      }
    })
  },
  /*
  直播
   */
  getLiveList: function () {//获取直播列表数据
    const _this = this;
    _this.setData({
      isLoading: false,
    })
    HTTP.GET({
      url: 'live',
      data: {
        gardenId: app.globalData.checkParams.gardenId,
        currentPage: _this.data.currentPage,
        currentSize: 3
      }
    }).then(result => {
      let liveData = _this.data.liveData;
      if (liveData && result.data.lives && result.data.lives.length > 0) {
        liveData = liveData.concat(result.data.lives);
      }
      if (result.length == 0 || !result.data.lives || result.data.lives <= 2) {
        _this.setData({
          isLoading: true
        })
      }
      _this.setData({
        liveData: liveData,
        empty: false,
        loading: false
      })
      if (_this.data.liveData.length == 0) {
        _this.setData({
          empty: true,
        })
      }
      _this.getheight('#getheight1');
    })
  },
  /*   
  小视频
   */
  getVideoList: function () {//获取小视频列表数据
    const _this = this;
    _this.setData({
      empty: false
    })
    HTTP.GET({
      url: 'smallVideo',
      data: { gardenId: app.globalData.checkParams.gardenId }
    }).then(res => {
      if (res.data.length == 0) {
        _this.setData({
          empty: true,
          loading: false
        })
      } else {
        _this.setData({
          videoData: res.data,
          isLoading: true,
          empty: false,
          loading: false
        })
      }
      _this.getheight('#getheight2');
    })

  },

  /*
  操作
  */
  getheight(ele) {//获取高度
    const _this = this;
    const query = wx.createSelectorQuery();
    query.select(ele).boundingClientRect()
    query.exec(function (res) {
      _this.setData({
        height: res[0].height + 30
      })
    })
  },

  changeGoodsSwip: function (detail) {//swiper卡死
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError;
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({ currType: 1 });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  },
  error(e) {
    console.log(e);
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
    this.handelTypeRequest()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currType == 1) {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      this.getLiveList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})