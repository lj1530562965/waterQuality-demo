<script>
  import moment from 'moment';
  import { fetch } from 'istrong-axiosmodel';
  import AppHeader from '../components/AppHeader.vue';
  import vcList from '../components/List.vue';
  import LineChart from '../components/LineChart.vue';
  import waterLevel from '../libs/waterQualityLevel';

  let getCurrentLevel = (level) => {
    if (level === '') {
      return '';
    }
    return '<span class="waterQuality_' + waterLevel[level].index + '">' + level + '</span>';
  }
  let judgeFunc = {
    judgeSmall: function (value, ran) {
      var level;
      var sort = ran.sort;
      for (var key in sort) {
        var levelVal = judgeFunc._filterDate(sort[key]);
        if (!levelVal) {
          levelVal = parseFloat(sort[key]);
          if (value <= levelVal) {
            level = key;
            break;
          } else {
            continue;
          }
        } else if (value > levelVal[0] && value <= levelVal[1]) {
          level = key;
          break;
        } else {
          continue;
        }
      }
      return level;
    },
    judgeBig: function (value, ran) {
      var sort = ran.sort;
      var level;
      for (var key in sort) {
        var levelVal = judgeFunc._filterDate(sort[key]);
        if (!levelVal) {
          levelVal = parseFloat(sort[key]);
          if (value >= levelVal) {
            level = key;
            break;
          } else {
            continue;
          }
        } else if (value >= levelVal[0] && value < levelVal[1]) {
          level = key;
          break;
        } else {
          continue;
        }
      }
      return level;
    },
    //过滤  1.5-2 前后的数
    _filterDate: function (data) {
      var index = data.indexOf("-");
      var prev, next, arr = [];
      if (index === -1) {
        return;
      } else {
        prev = data.substr(0, index);
        arr.push(parseFloat(prev));
        next = data.substr(index + 1);
        arr.push(parseFloat(next));
      }
      return arr;
    }
  }
  export default {
    name: 'waterQualityChart',
    data() {
      return {
        id: '',
        name: '',
        beginTime: moment(),
        endTime: moment(),
        monitorItems: [],
        data: [],
        listData: [],
        listField: [
          {
            fieldLabel: '指标',
            fieldName: 'key',
            fieldType: 'String',
            headerClass: 'chartViewer-Header-Key-WaterQuality',
            contentClass: 'chartViewer-Content-Key-WaterQuality'
          },
          {
            fieldLabel: '检测值',
            fieldName: 'val',
            fieldType: 'String',
            headerClass: 'chartViewer-Header-Val-WaterQuality',
            contentClass: 'chartViewer-Content-Val-WaterQuality'
          },
          {
            fieldLabel: '水质等级',
            fieldName: 'level',
            fieldType: 'Function',
            format: getCurrentLevel,
            headerClass: 'chartViewer-Header-level-WaterQuality',
            contentClass: 'chartViewer-Content-level-WaterQuality'
          }
        ]
      }
    },
    components: {
      'vc-AppHeader': AppHeader,
      'vc-List': vcList,
      'vc-Line': LineChart
    },
    methods: {
      getChartData() {
        fetch('waterQuality.details', {
          basicData: {
            id: this.id,
            time: ['[', moment(this.beginTime).format('YYYY-MM-DDTHH:mm:ss'), ',', moment(this.endTime).format('YYYY-MM-DDTHH:mm:ss'), ']'].join('')
          }
        }).then(result => {
          let data = result.data;
          if (data.length > 0) {
            let newestData = data[data.length - 1];
            let list = [];
            this.monitorItems.forEach((item, i) => {
              let itemVal = newestData[item.field];
              let min = item.min;
              let max = item.max;
              let range = item.range;
              let level = '';
              if (itemVal !== undefined) {
                let _itemVal = parseFloat(itemVal);
                if (!range && min !== undefined && max !== undefined) {
                  level = min <= _itemVal <= max ? 'Ⅰ' : '劣Ⅴ';
                } else if (range) {
                  let judge = range.judge;
                  if (judge === "<=") {
                    level = judgeFunc.judgeSmall(_itemVal, range);
                  } else {
                    level = judgeFunc.judgeBig(_itemVal, range);
                  }
                  if (!level) {
                    level = '劣Ⅴ'
                  }
                }
              }
              list.push({
                key: item.name,
                val: itemVal !== undefined ? itemVal + (item.unit || '') : '',
                level: level
              });
            });
            this.listData = list;
          }
          this.data = data;
        });
      },

      routerToMap() {
        this.$router.replace({
          name: 'main',
          params: {
            showType: 'map',
            id: this.id
          }
        });
      }
    },
    computed: {
      header_BeginTime: function () {
        return moment(this.beginTime).format('DD日HH时mm分');
      },
      header_EndTime: function () {
        return moment(this.endTime).format('DD日HH时mm分');
      }
    },
    mounted() {
    },
    created() {
      this.monitorItems = this.$AppConfig.module.waterQuality.monitorItems;
    },
    beforeDestroy() {
    },
    beforeRouteEnter(to, from, next) {
      let { id, name, beginTime, endTime } = to.query;
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.id = id;
        vm.name = name;
        vm.beginTime = moment(beginTime);
        vm.endTime = moment(endTime);
        vm.getChartData();
      });
    }
  }
</script>
<template>
  <div id="chartViewer">
    <vc-AppHeader>
      <div class="appHeader-listViewer-Time">{{header_BeginTime}} 至 {{header_EndTime}}</div>
      <div class="btChangeRouterMap" v-on:click="routerToMap">
        <span class="ion-ios-location"></span>
      </div>
    </vc-AppHeader>
    <div class="div-chart-hr"></div>
    <div class="chartViewer-WaterQualityChart-Page">
      <div class="chartViewer-Chart-Name">{{name}}</div>
      <vc-List :data="listData" :fields="listField" class="chartViewer-WaterQualityChart-List"></vc-List>
      <div class="div-chart-hr"></div>
      <div class="chartViewer-Chart">
        <vc-Line :fields="monitorItems" :data="data" :beginTime="beginTime" :endTime="endTime" class="chartViewer-WaterQualityChart"></vc-Line>
        <div class="noData" v-if="data === undefined || data.length === 0">无数据</div>
      </div>
    </div>
  </div>
</template>
<style>
#chartViewer{
  width: 100%;
  height: 100%;
  font-size: 16px;
  overflow-x: hidden;
}
.div-chart-hr{
  height: 15px;
  width: 100%;
  background-color:  #EEEDF1;
}
.chartViewer-WaterQualityChart-Page{
  position: absolute;
  top: 55px;
  width: 100%;
  bottom: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.chartViewer-WaterQualityChart-Page>div{
  float: left;
}
.chartViewer-Chart-Name{
  width: 100%;
  line-height: 30px;
  height: 30px;
  text-align: center;
}
.chartViewer-WaterQualityChart-List{
  width: 100%;
  font-size: 14px!important;
}
.chartViewer-WaterQualityChart-List>.VGList-Header{
  background-color: #fff;
}
.chartViewer-WaterQualityChart-List>.VGList-Content{
  font-size: 12px;
}
.chartViewer-Header-Key-WaterQuality,.chartViewer-Content-Key-WaterQuality{
  text-align: left;
  padding-left: 15px;
  width: 40%;
}
.chartViewer-Header-Val-WaterQuality,.chartViewer-Content-Val-WaterQuality{
  text-align: left;
  min-width: 120px;
  width: 36%;
}
.chartViewer-Header-level-WaterQuality,.chartViewer-Content-level-WaterQuality{
  text-align: center;
  min-width: 60px;
  width: 18%;
  padding-right: 15px;
}

.chartViewer-Chart{
  width: 100%;
  height: 210px;
  background-color: #fff;
  position: relative;
}
.chartViewer-WaterQualityChart{
  width: 100%;
  height: 210px;
  background-color: #fff;
}
.noData{
  position: absolute;
  z-index: 100;
  width: 100%;
  text-align: center;
  line-height: 210px;
  top: 0px;
  text-shadow: 0 1px 1px #cccccc;
  letter-spacing: 2px;
  transform:rotate(-15deg);
}

</style>