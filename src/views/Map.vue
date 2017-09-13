<script>
  import L from 'leaflet';
  import Position from '../libs/leaflet-positionmarker';

  import { WGS84ToGCJ02 } from 'istrong-map-coordinate-transformation';
  import { isEmpty, cloneDeep, orderBy, assign } from 'lodash';
  import vcMap from '../components/Map.vue';
  import moment from 'moment';
  import waterLevel from '../libs/waterQualityLevel';

  const popupTpl = '{name}:<span class="waterQuality_{level}">{current_level}</span>类';
  export default {
    name: 'waterQualityMap',
    components: {
      'vc-map': vcMap
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
      },
      positionMarker: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        crs: 'EPSG3857',
        zoom: 8,
        center: [26, 119],
        baseLayers: [],
        thematicLayers: [],
        zoomControl: {},
        layersControl: {},
        data: null,
        vStationLayerName: 'vWaterQualityStation',//矢量站点名称
        vStationMarkers: {},
        positionMarkerId: ''
      }
    },
    watch: {
      stationData: function (val) {
        this.data = val;
        this._loadVStationsToMap();
      },
      positionMarker: function (val) {
        this.positionMarkerId = val;
        this._startPosition();
      }
    },
    mounted() {
      this.data = this.stationData || [];
      this._loadVStationsToMap();
      this._startPosition();
    },
    methods: {
      _loadVStationsToMap() {
        let vMap = this.$refs.map;
        if (!this.data || this.data.length === 0) {
          this.waterQualitys = {};
          return vMap.clearLayer(this.vStationLayerName);
        }
        let layerOpts = {
          latlngBounds: L.latLngBounds([-20, 60], [60, 200]),
          onlyCollisionTooltip: true,
          markerOffset: [1, 1],
          tooltipOffset: [0, 0],
          map: vMap.Map,
          sortByField: 'sort'
        };
        vMap.addCollisionLayer(this.vStationLayerName, layerOpts, this.data, this._vStationsMarkerInit)
      },
      _vStationsMarkerInit(stationInfo, layer) {
        if (!stationInfo.lat || !stationInfo.lng) {
          return;
        }
        let vector = this.vStationMarkers;
        let gcj02 = WGS84ToGCJ02({ lng: stationInfo.lng, lat: stationInfo.lat });
        let latlng = L.latLng(gcj02.lat, gcj02.lng);
        if (vector[stationInfo.id]) {
          layer.removeLayer(vector[stationInfo.id]);
        }

        let marker = new L.Marker(latlng,
          {
            icon: L.icon({
              iconUrl: waterLevel[stationInfo.current_level].img,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            }),
            minZoom: 4,
            feature: stationInfo
          });
        marker.on('click', this._showChartInfo, this);

        let level = parseInt(waterLevel[stationInfo.current_level].index, 10);
        let tooltipContent = L.Util.template(popupTpl, assign({
          level: level
        }, stationInfo));
        let toolTip = (new L.TooltipAutoDirection({//TooltipAutoDirection
          permanent: false,
          sticky: false,
          interactive: true,
          // direction: 'top',
          // offset: [0, -12],
          mapPreclickToClose: false,
          className: 'commonTooltip',
          feature: stationInfo
        }, marker)).setContent(tooltipContent);
        toolTip.on('click', this._showChartInfo, this);
        marker.bindTooltip(toolTip);
        vector[stationInfo.id] = marker;
        return marker;
      },
      _showChartInfo(e) {
        let feature = e.target.options.feature;
        this.$emit('showChartInfo', feature);
      },
      _changeShowType() {
        this.$emit('changeShowType', 'list');
      },
      _startPosition() {
        Position.startPosition(this, this.$refs.map.Map, this.positionMarkerId, this.vStationMarkers);
        this.positionMarkerId = '';
      }
    },
    created() {
      this.positionMarkerId = this.positionMarker;
      let mapConfig = this.$AppConfig.map;
      this.crs = mapConfig.crs;
      this.zoom = mapConfig.zoom;
      this.center = mapConfig.center;
      this.baseLayers = cloneDeep(mapConfig.baseLayers);
      this.thematicLayers = cloneDeep(mapConfig.thematicLayers);
      this.zoomControl = mapConfig.zoomControl;
      this.layersControl = mapConfig.layersControl;

      if (!isEmpty(mapConfig.module) && mapConfig.module.waterQuality && mapConfig.module.waterQuality.baseLayer) {
        let baseLayer = mapConfig.module.waterQuality.baseLayer;
        this.baseLayers.forEach(item => {
          item.checked = (item.id === baseLayer ||
            item.name === baseLayer);
        });
      }
    },
    beforeDestroy() {
    }
  }
</script>
<template>
  <div id="mapViewer">
    <vc-map :crs="crs" :baseLayers="baseLayers" :thematicLayers="thematicLayers" :zoom="zoom" :center="center" :zoomControl="zoomControl"
      :layersControl="layersControl" ref="map"></vc-map>
    <div class="btChangeRouterList" v-on:click="_changeShowType"><span class="ion-ios-list"></span></div>
  </div>
</template>
<style>
</style>