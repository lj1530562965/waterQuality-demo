import config from './chartConfig';
import { cloneDeep, assign } from 'lodash';
import moment from 'moment';
import Highcharts from 'istrong-highcharts';

let mergeOptions = (list, bTime, eTime) => {
  let chartOpt = cloneDeep(config);
  let minTime = parseInt(moment(moment(bTime).format('YYYY-MM-DDTHH:00:00')).format('x'), 10);
  let maxTime = parseInt(moment(moment(eTime).add('hour', 1).format('YYYY-MM-DDTHH:00:00')).format('x'), 10);
  let minVal = list.min;
  let maxVal = list.max;
  let data = list.data;
  let yInterval = (maxVal - minVal) / 6;
  // let xCate = [];     //x轴坐标显示值
  // xCate.push(minTime);

  chartOpt = assign(chartOpt, {
    xAxis: {
      labels: {
        formatter: function () {
          return moment(this.value).format('HH时<br/>DD日')
        },
        autoRotation: 0,
        padding: 30,
        style: {
          textOverflow: 'none'
        }
      },
      lineColor: '#808080',
      lineWidth: 0,
      tickColor: '#808080',
      tickWidth: 1,
      tickLength: 5,
      tickPosition: 'outside',
      gridLineWidth: 1,
      endOnTick: true,
      startOnTick: true,
      tickAmount: 6,
      min: minTime,
      max: maxTime,
      // ceiling: maxTime,
      tickInterval: 1000 * 3600 * 4
    },
    yAxis: [
      {
        lineWidth: 1,
        lineColor: '#808080',
        gridLineDashStyle: 'longdash',
        gridLineColor: '#E0E0E0',
        tickInterval: yInterval,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -5,
          y: 0,
          formatter: function () {
            return this.value.toFixed(3)
          }
        },
        title: {
          text: '',
          align: 'high',
          rotation: 0,
          x: 60,
          y: -12
        },
        max: maxVal,
        min: minVal,
        plotLines: []
      }
    ],
    series: [{
      data: data,
      color: '#5399d7',
      marker: {
        enabled: true,
        symbol: 'circle',
        radius: 4
      }
    }]
  });
  return chartOpt;
}
let renderChart = (chartViewer, chartId, list, bTime, eTime) => {
  if (chartViewer) {
    chartViewer.destroy();
  }

  let chartOpt = mergeOptions(list, bTime, eTime);
  chartOpt.chart.renderTo = chartId;
  chartViewer = new Highcharts.Chart(chartOpt);
  return chartViewer;
};

export default renderChart;
