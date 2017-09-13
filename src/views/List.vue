<script>
  import moment from 'moment';
  import AppHeader from '../components/AppHeader.vue';
  import vcList from '../components/List.vue';
  import waterLevel from '../libs/waterQualityLevel';

  let getCurrentLevel = (level) => {
    return '<span class="waterQuality_' + waterLevel[level].index + '">' + level + '</span>';
  }
  export default {
    name: 'waterQualityList',
    components: {
      'vc-AppHeader': AppHeader,
      'vc-List': vcList
    },
    props: {
      beginTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      stationData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        data: [],
        fields: [
          {
            fieldLabel: '站名',
            fieldName: 'name',
            fieldType: 'String',
            headerClass: 'listViewer-List-Name-WaterQuality',
            contentClass: 'listViewer-List-Name-WaterQuality'
          },
          {
            fieldLabel: '水质等级',
            fieldName: 'current_level',
            fieldType: 'Function',
            format: getCurrentLevel,
            headerClass: 'listViewer-List-Level-WaterQuality',
            contentClass: 'listViewer-List-Level-WaterQuality'
          },
          {
            fieldLabel: '地区',
            fieldName: 'addvcd',
            fieldType: 'String',
            headerClass: 'listViewer-List-addvcd-WaterQuality',
            contentClass: 'listViewer-List-addvcd-WaterQuality'
          }
        ]
      }
    },
    watch: {
      stationData: function (val) {
        this.data = val;
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
    methods: {
      onShowStationInfo(data) {
        this.$emit('showChartInfo', data);
      },
      _changeShowType() {
        this.$emit('changeShowType', 'map');
      }
    },
    mounted() {
      this.data = this.stationData;
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>
<template>
  <div id="listViewer">
    <vc-AppHeader>
      <div class="appHeader-listViewer-Time">
        {{header_BeginTime}} 至 {{header_EndTime}}
      </div>
      <div class="btChangeRouterMap" v-on:click="_changeShowType">
        <span class="ion-map"></span>
      </div>
    </vc-AppHeader>
    <vc-List class="listViewer-WaterQualityList" :fields="fields" :data="data" :showIndex="true" v-on:onItemClick="onShowStationInfo"></vc-List>
  </div>
</template>
<style>
.listViewer-List-Name-WaterQuality{
  width: 44%;
  text-align: left;
}
.listViewer-List-Level-WaterQuality{
  min-width: 80px;
  max-width: 80px;
  width: 22%;
}
.listViewer-List-addvcd-WaterQuality{
  min-width: 80px;
  width: 22%;
}
.listViewer-WaterQualityList>.VGList-Content{
  position: absolute;
  top: 82px;
  bottom: 0px;
  width: 100%;
  overflow-y: scroll;
}
</style>