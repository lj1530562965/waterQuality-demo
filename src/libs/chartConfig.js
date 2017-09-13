/**
 * Created by cr1 on 2017/4/12.
 */

//基础highcharts配置
let config = {
  chart: {
    type: 'line',
    marginRight: 10,
    marginLeft: 60,
    marginTop: 10,
    marginBottom: 35,
    alignTicks: false
  },
  title: {
    text: '',
    x: 0,
    y: 0
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#303030'
    }
  },
  lang: {
    noData: '暂无数据'
  },
  plotOptions: {
    series: {
      dataLabels: {
        shape: 'callout',
        backgroundColor: '#E56824',
        style: {
          color: '#FFFFFF',
          textShadow: 'none'
        }
      },
      marker: {
        enabled: false
      }
    }
  },
  subtitle: {
    text: '',
    x: 0,
    y: 0
  },
  tooltip: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  noDestory: true
};

export default config;