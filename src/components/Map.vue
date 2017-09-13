<script>
  import L from 'leaflet';
  import 'istrong-leaflet-extends';
  import 'istrong-leaflet-collision';
  import TileLayer from '../libs/leaflet-tilelayer';
  import { cloneDeep } from 'lodash';


  export default {
    name: 'BaseMap',
    props: {
      crs: {
        type: String,
        default: 'EPSG3857'
      },
      zoom: {
        type: Number,
        default: 8
      },
      center: {
        type: Array,
        default: function () {
          return [26, 119];
        }
      },
      baseLayers: {
        type: Array,
        required: true
      },
      thematicLayers: {
        type: Array,
        required: true
      },
      zoomControl: {
        type: Object,
        default: function () {
          return {
            enable: true,
            position: 'bottomright'
          }
        }
      },
      layersControl: {
        type: Object,
        default: function () {
          return {
            enable: true,
            position: 'bottomright'
          }
        }
      }
    },
    data() {
      return {
        map: null,
        layers: {
          // layerName: L.Layer
        }
      }
    },
    mounted() {
      this.map = new L.Map('map-container', {
        crs: L.CRS[this.crs],
        zoom: this.zoom,
        center: L.latLng(this.center),
        attributionControl: false,
        zoomControl: false
      });
      if (this.zoomControl.enable) {
        let zoom = L.control.zoom(this.zoomControl);
        this.map.addControl(zoom);
      }
      this._bindTileLayersFromConfig();
    },
    computed: {
      Map: function () {
        return this.map
      }
    },
    methods: {
      _bindTileLayersFromConfig() {
        let { baseLayer, layers} = this._correctionBaseLayers(this.baseLayers);
        let map = this.map;
        if (this.layersControl.enable) {
          let baseMaps = {};
          let checkedLayer;
          layers.forEach(item => {
            let layer = new TileLayer(item);
            baseMaps[item.label] = layer.getLayer();
            if (item.id === baseLayer.id) {
              checkedLayer = layer;
            }
          });
          let overlayMaps = {};
          this.thematicLayers.forEach(item => {
            let layer = new TileLayer(item);
            overlayMaps[item.label] = layer.getLayer();
            if (!!item.checked) {
              layer.onAdd(map);
            }
          });
          checkedLayer.onAdd(map);
          L.control.layers(baseMaps, overlayMaps, this.layersControl).addTo(map);
        } else {
          let layer = new TileLayer(baseLayer);
          layer.onAdd(map);
          this.thematicLayers.forEach(item => {
            if (!!item.checked) {
              let layer = new TileLayer(item);
              layer.onAdd(map);
            }
          });
        }
      },
      _correctionBaseLayers(baseLayers) {
        let baseLayer;
        let nBaseLayers = cloneDeep(baseLayers);
        let filterBaseLayers = nBaseLayers.filter((layer, key) => { return !!layer.checked });
        if (filterBaseLayers.length === 0) {
          nBaseLayers[0].checked = true;
          baseLayer = nBaseLayers[0];
        } else {
          baseLayer = filterBaseLayers[0];
        }
        return {
          baseLayer: baseLayer,
          layers: nBaseLayers
        };
      },
      addCollisionLayer(layerName, layerOpts, stations, markerInitFunc) {
        let layer = this.layers[layerName];
        if (layer && !(layer instanceof L.LayerGroup.Collision)) {
          throw new Error('存在相同名称的图层,但类型不同的图层');
        }
        let updated = !!layer;
        layer = layer || new L.LayerGroup.Collision(layerOpts);
        stations.forEach(station => {
          let marker = markerInitFunc(station, layer);
          if (marker) {
            layer.addLayer(marker);
          }
        });
        this.map.addLayer(layer);
        this.layers[layerName] = layer;
        if (updated) {
          layer.reCollisionLayers();
        }
      },
      clearLayer(layerName) {
        let layer = this.layers[layerName];
        if (layer) {
          layer.clearLayers();
        }
      }
    },
    created() {
    },

    beforeDestroy() {
    }
  }
</script>

<template>
  <div id="map-container">
  </div>
</template>
<style>
  #map-container {
    height: 100%;
  }
</style>