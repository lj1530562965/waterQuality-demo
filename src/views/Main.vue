<script>
  import moment from 'moment';
  import { fetch } from 'istrong-axiosmodel';
  import vgLoading from '../components/Loading.vue';
  import vgMap from './Map.vue';
  import vgList from './List.vue';

  export default {
    name: 'waterQualityMain',
    components: {
      'vg-Map': vgMap,
      'vg-List': vgList,
      'vg-Loading': vgLoading
    },
    data() {
      return {
        showType: 'list',
        positionMarkerId: '',
        stationData: [],
        chartIntervalDay: -1,
        taskDelay: 300000,
        loading: false,
        beginTime: '',
        endTime: ''
      }
    },
    mounted() {
      if (this.taskDelay <= 0) {
        this.getData();
      } else {
        this._startTask();
      }
    },
    methods: {
      //开启刷新任务管理器
      _startTask() {
        let lastTime = 0;
        let that = this;
        let taskFunc = () => {
          if (lastTime > 0 && window.performance.now() - lastTime < that.taskDelay) {
            that._tack = window.requestAnimationFrame(taskFunc);
            return;
          }
          lastTime = window.performance.now();
          that.beginTime = moment().add('days', that.chartIntervalDay).format('YYYY-MM-DDTHH:mm:ss');
          that.endTime = moment().format('YYYY-MM-DDTHH:mm:ss');
          that.getData();
          that._tack = window.requestAnimationFrame(taskFunc);
        }
        this._tack = window.requestAnimationFrame(taskFunc);
      },
      _stopTask() {
        if (this._tack) {
          window.cancelAnimationFrame(this._tack);
          delete this._tack;
        }
      },
      getData() {
        this.loading = true;
        fetch('waterQuality.waterQuality', {
          basicData: {
          }
        }).then(result => {
          this.stationData = result.data;
          this.loading = false;
        });
      },
      showChartInfo(params) {
        this.$router.push({
          name: 'info',
          query: {
            id: params.id,
            name: params.name,
            beginTime: this.beginTime,
            endTime: this.endTime
          }
        });
      },
      changeShowType(type) {
        this.showType = type;
      }
    },
    created() {
      let moduleConfig = this.$AppConfig.module;
      if (moduleConfig && moduleConfig.waterQuality) {
        let opts = moduleConfig.waterQuality;
        this.showType = opts.defaultContent || 'list';
        this.chartIntervalDay = opts.chartIntervalDay !== undefined ? opts.chartIntervalDay : -1;
        this.taskDelay = opts.taskDelay !== undefined ? opts.taskDelay : 300000;
      }
      this.beginTime = moment().add('days', this.chartIntervalDay).format('YYYY-MM-DDTHH:mm:ss');
      this.endTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    },
    beforeDestroy() {
      this._stopTask();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (from.path === '/Info' && to.params.showType) {
          vm.showType = to.params.showType;
          vm.positionMarkerId = to.params.id;
          setTimeout(function () {
            vm.positionMarkerId = '';
          }, 1000);
        }
      });
    }
  }
</script>
<template>
  <div class="pageMain">
    <vg-Map :beginTime="beginTime" :endTime="endTime" :stationData="stationData" v-on:changeShowType="changeShowType" v-on:showChartInfo="showChartInfo"
      :positionMarker="positionMarkerId" v-if="showType !== 'list'"></vg-Map>
    <vg-List :beginTime="beginTime" :endTime="endTime" :stationData="stationData" v-on:changeShowType="changeShowType" v-on:showChartInfo="showChartInfo"
      v-if="showType === 'list'"></vg-List>
    <vg-Loading v-if="loading"></vg-Loading>
  </div>
</template>
<style>
.pageMain{
  width: 100%;
  height: 100%;
}
</style>