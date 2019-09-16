import F2 from '../f2-canvas/lib/f2';

const chartInit=(canvas, width, height, data, obj, unit)=>{
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    padding: ['auto', 'auto', 40, 'auto']
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
}
module.exports = {
  chartInit: chartInit
}