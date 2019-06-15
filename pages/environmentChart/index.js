import F2 from '../../f2-canvas/lib/f2';
var handel = require('../../utils/handel.js');
const app = getApp();
Page({
  data: {
    loading: true,
    tabbar: {},
    isIphoneX: app.globalData.isIphoneX,
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
    sorts1: [{
      'id': '1',
      'name': '土壤',
      'type': 'soil'
    }, {
      'id': '2',
      'name': '温度',
      'type': 'temp'
    }, {
      'id': '3',
      'name': '湿度',
      'type': 'humid'
    }, {
      'id': '4',
      'name': '光照',
      'type': 'sunlux'
    }, {
      'id': '5',
      'name': '雨量',
      'type': 'rain'
    }, {
      'id': '6',
      'name': '水肥'
    }],
    chartData: {},
    nodata: false,
    currType: 2,
    latestInfo: {},
    
  },
  onLoad() {
    wx.hideTabBar();
    handel.editTabbar();
    const _this = this;
    this.getChartData('humid', '%');
  },
  handeltype(e) {//点击切换
    console.log(e);
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
      nodata:false,
    })
    if (currIdx == 0) {
      this.setData({
        nodata: true
      })
    }
    if (currIdx == 1) {
      this.getChartData('temp', '℃');
    }
    if (currIdx == 2) {
      this.getChartData('humid', "%");
    }
    if (currIdx == 3) {
      this.getChartData('sunlux', "Lux");
    }
    if (currIdx == 4) {
      this.getChartData('rain', "mm");
    }
    if (currIdx == 5) {
      this.setData({
        nodata: true
      })
    }
  },
  chartInit(canvas, width, height, data, obj, unit) {
    const chart = new F2.Chart({
      el: canvas,
      width,
      height
    });
    chart.source(data, {
      month: {
        type: 'timeCat',
        mask: 'YY-MM'
      },
      value: {
        tickCount: 6,
        alias: '',
        formatter(val) {
          return val
        }
      }
    });
    chart.axis(obj.propertX, {
      label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        }
        if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.axis(obj.propertX, {
      label: {
        rotate: -Math.PI / 7,
        textAlign: 'end',
        textBaseline: 'middle'
      },
    });

    chart.tooltip({
      showCrosshairs: true,
      custom: true, // 自定义 tooltip 内容框
      onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};
        legendItems.map(item => {
          map[item.name] = Object.assign({}, item);
        });
        tooltipItems.map(item => {
          const {
            name,
            value
          } = item;
          if (map[name]) {
            map[name].value = value + " " + unit;
          }
        });
        legend.setItems(Object.values(map));
      },
    });
    chart.line().position(obj.propertX + '*' + obj.propertY).color('type', function (type) {
      if (type == "土壤温度" || type === "土壤湿度") {
        return '#00a0e9'
      } else {
        return obj.color;
      }
    });
    chart.point().position(obj.propertX + '*' + obj.propertY).color(obj.color).style('type', {
      lineWidth: 1,
      fill: '#fff',
      stroke: function stroke(type) {
        if (type === "土壤温度" || type === "土壤湿度") {
          return '#00a0e9'
        } else {
          return obj.color
        }
      }
    });
    chart.render();
    return chart;
  },
  getChartData(type, unit) {
    const _this = this;
    const blockId = wx.getStorageSync('blockId') || '';
    handel.handelRequest(this, {
      url: 'environment' + '?' + blockId + '/' + type,
    }, function (result) {
      let chartList = [];
      let latestInfo = {};
      if (Object.keys(result).length > 0 && result.envDatas && result.envDatas.length>0) {
        chartList = result.envDatas
        const type = result.envDatas[0].type
        latestInfo.info = "当前" + type+" "+ (result.latestEnvDatas.data||0) + '' + unit
          latestInfo.date = result.latestEnvDatas.updateTime;
      }
      if (type == 'humid' && result.humidEnvDatas && result.humidEnvDatas.length > 0) {
        chartList = result.humidEnvDatas
          latestInfo.info = "当前空气湿度：" + (result.humidLatestEnvDatas.data||0) + "% " + "当前土壤湿度：" + (result.soilHumidLatestEnvDatas.data||0) + "%";
          latestInfo.date = result.humidLatestEnvDatas.updateTime||'0000-00-00'
      }
      if (type == 'temp' && result.tempEnvDatas && result.tempEnvDatas.length > 0) {
        chartList = result.tempEnvDatas
        latestInfo.info = "当前空气温度：" + (result.tempLatestEnvDatas.data || 0) + "% " + "当前土壤温度：" + (result.soilTempLatestEnvDatas.data||0) + "℃";
          latestInfo.date = result.tempLatestEnvDatas.updateTime
      }
      if (chartList.length > 0) {
        _this.setData({
          nodata: false,
          latestInfo: latestInfo
        })
        const id = '#' + type
        _this.chartComponent = _this.selectComponent(id);
        _this.chartComponent.init((canvas, width, height) => {
          _this.chartInit(canvas, width, height, chartList, {
            'color': '#1adee2',
            'propertX': 'updateTime',
            'propertY': 'avgData'
          }, unit)
        })
      } else {
        _this.setData({
          nodata: true
        })
      }
    })
  },

});