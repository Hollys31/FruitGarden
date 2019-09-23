import HTTP from '../../utils/http.js'
var handel = require('../../utils/handel.js');
import { chartInit } from '../../model/chartset.js'
const app = getApp();
Page({
  data: {
    IMG_URL_HEAD: app.globalData.IMG_URL_HEAD,
    loading: true,
    tabbar: {},
    opts:{
      lazyLoad:true
    },
    isIphoneX: app.globalData.isIphoneX,
    dateType: "",
    sorts: [{
      'id': '1',
      'name': '土壤',
      'iconClass': 'icon-chart1',
      'type': 'soil',

    }, {
      'id': '2',
      'name': '温度',
      'iconClass': 'icon-chart2',
      'type': 'temp',

    }, {
      'id': '3',
      'name': '湿度',
      'iconClass': 'icon-chart3',
      'type': 'humid',

    }, {
      'id': '4',
      'name': '光照',
      'iconClass': 'icon-chart4',
      'type': 'sunlux',

    }, {
      'id': '5',
      'name': '雨量',
      'iconClass': 'icon-chart5',
      'type': 'rain',
      'top': '0rpx',
      'left': '626rpx'
    }, {
      'id': '6',
      'name': '水肥',
      'type': 'sf',
      'iconClass': 'icon-chart6',
    }],
    actions : {
      '1': ['temp', '℃', { count: 0 }],
      '2': ['humid', '%', { count: 0 }],
      '3': ['sunlux', 'Lux', { count: 0 }],
      '4': ['rain', 'mm', { count: 0 }],
    },
    chartData: {},
    nodata: false,
    currType: 2,
    latestInfo: {},
    swiperError: 0,
   
  },
  onLoad() {
    wx.hideTabBar();
    handel.editTabbar(app.globalData.tabBar);
    const _this = this;
    this.getChartData('humid', '%');
  },
  handeltype(e) {//点击切换
    const ind = e.currentTarget.dataset.index;
    this.setData({
      currType: ind
    })
  },
  switchTabPage(e) { //滑动切换
    const _this = this;
    const currIdx = e.detail.current;
    const hideIdx = this.data.hideIdx;
    let sorts = this.data.sorts;
    this.setData({
      currType: currIdx,
      nodata: false,
    })
    if (currIdx == 0 || currIdx == 5) {
      this.setData({
        nodata: true
      })
    }else{
      let action = _this.data.actions[currIdx],
        name = action[0],
        unit = action[1],
        count = action[2].count;
      if (count==0){
        _this.data.actions[currIdx][2].count=1;
        this.getChartData(name, unit);
      }
      
    }
  },

  chartDataRequest(type,unit){//环境数据信息请求
    const _this = this;
    return new Promise(function(resolve,reject){
      HTTP.GET({
        url: 'environment',
        data: { gardenId: app.globalData.checkParams.gardenId, type: type }
      }).then(res => {
        let chartList = [];
        let latestInfo = {};
        let dateType = "";
        switch (type){
          case 'humid':
            if (res.data.humidEnvDatas && res.data.humidEnvDatas.length > 0) {
              chartList = res.data.humidEnvDatas
              dateType = res.data.humidEnvDatas[0].dataType;
              latestInfo.info = "当前空气湿度：" + (res.data.humidLatestEnvDatas.data || 0) + "% " + "当前土壤湿度：" + (res.data.soilHumidLatestEnvDatas.data || 0) + unit;
              latestInfo.date = res.data.humidLatestEnvDatas.updateTime || '0000-00-00'
            }
          break;
          case 'temp':
            if (res.data.tempEnvDatas && res.data.tempEnvDatas.length > 0) {
              chartList = res.data.tempEnvDatas
              dateType = res.data.tempEnvDatas[0].dataType;
              latestInfo.info = "当前空气温度：" + (res.data.tempLatestEnvDatas.data || 0) + "% " + "当前土壤温度：" + (res.data.soilTempLatestEnvDatas.data || 0) + unit;
              latestInfo.date = res.data.tempLatestEnvDatas.updateTime
            }
            break;
            default:
            if (Object.keys(res.data).length > 0 && res.data.envDatas && res.data.envDatas.length > 0) {
              chartList = res.data.envDatas
              dateType = res.data.envDatas[0].dataType;
              const type = res.data.envDatas[0].type
              latestInfo.info = "当前" + type + " " + (res.data.latestEnvDatas.data || 0) + '' + unit
              latestInfo.date = res.data.latestEnvDatas.updateTime;
            }
        }
        if (chartList.length > 0) {
          _this.setData({
            nodata: false,
            latestInfo: latestInfo,
            dateType: dateType,
            loading:false
          })
          resolve(chartList);
        } else {
          _this.setData({
            nodata: true,
            dateType: '',
            loading: false
          })
        }
      })
    })
  },
  getChartData(type, unit) {
    const _this = this;
    const id = '#' + type;
    _this.chartComponent = _this.selectComponent(id);
    this.chartDataRequest(type,unit).then(res=>{
      _this.chartComponent.init((canvas, width, height) => {
        chartInit(canvas, width, height, res, {
          'color': '#1adee2',
          'propertX': 'updateTime',
          'propertY': 'avgData'
        }, unit)
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
          this.setData({ currType: 2 });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  },
});