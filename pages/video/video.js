// pages/video/video.js
import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
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
    panoUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    handel.editTabbar();
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
  handelTypeRequest() {//视频类型切换
    this.setData({
      empty: false
    })
    if (this.data.currType == 0) {
      this.getPanoData();
    }
    if (this.data.currType == 1) {
      this.getheight('#getheight1');
      if (this.data.liveData.length == 0) {
        this.getLiveList();
      }
    }
    if (this.data.currType == 2) {
      this.getheight('#getheight2');
      if (this.data.videoData.length == 0) {
        this.setData({
          loading: true
        })
        this.getVideoList();
      }
    }
  },
  /*
   全景
   */
  getPanoData: function () {
    const _this = this;
    HTTP.GET({
      url: "pano",
      data: { gardenId: app.globalData.gardenId }
    }).then(res => {
      if (res.data.path) {
        const imgUrl = 'https://trace.yufengtek.com/orchard/applet/minifile/index.html?mm=465611615&url=' + encodeURIComponent(res.data.path);
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
        gardenId: app.globalData.gardenId,
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
        loading:false
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
        data: { gardenId: app.globalData.gardenId }
      }).then(res => {
        if (res.length == 0) {
          _this.setData({
            empty: true
          })
        } else {
          _this.setData({
            videoData: res.data,
            isLoading: true,
            empty: false,
            loading:false
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
    handelVideoType(e) {//点击切换小视频、直播  
      const currType = e.currentTarget.dataset.type;
      this.setData({
        currType: currType,
        playIndex: -1
      })
      this.handelTypeRequest();
    },
    switchTabPage(e) {//小视频、直播、全景切换 滑动
      const currType = e.detail.current;
      this.setData({
        currType: currType,
        playIndex: -1
      })

      this.handelTypeRequest();
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