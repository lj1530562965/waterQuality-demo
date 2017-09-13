import L from 'leaflet'
L.PositionMarker = L.Marker.extend({
  options: {
    interactive: false
  },
  initialize: function (latlng, options) {
    options = options || {}
    options.icon = new L.Icon({
      iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAABNklEQVR42mL8z8AARCSA//8ZGWgJGBlJcg9AADExDHEAEEBD3gMAATTkPQAQQIwoeYDW6ZsGeQQggIZ8DAAE0JD3AEAADXkPAATQkPcAQAANeQ8ABNCQ9wBAAA15DwAE0JD3AEAAsQw5F6NVtgABNORjACCAWIZE8wEPAAigIR8DAAE05D0AEEBD3gMAATTkPQAQQEPeAwABNOQ9ABBAQ94DAAE05D0AEEBD3gMAATTkPQAQQEPeAwABNOQ9ABBAQ94DAAE05D0AEEBD3gMAATTkPQAQQEPeAwABNOQ9ABBAQ94DAAE09IbX0QBAAA35GAAIoKE3LoQ2wQEQQEM+BgACaMh7ACCAhrwHAAJoyHsAIICGvAcAAmjIewAggIa8BwACiHGoL/YACKAhHwMAATTkPQAQYACMBRhZwxdZwwAAAABJRU5ErkJggg==',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    })
    L.Marker.prototype.initialize.call(this, latlng, options)
  },
  onAdd: function (map) {
    L.Marker.prototype.onAdd.call(this, map)
    this.flashCount = 0
    this._startFlash()
  },
  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map)
    this._removed = true
    this._stopFlash()
  },
  _startFlash: function () {
    let that = this
    let flashFunc = function () {
      if (that._removed || that.flashCount > 3) {
        that._map.removeLayer(that)
        return
      }
      let icon = that.options.icon
      let {iconSize} = icon.options
      that.flashCount += iconSize[0] <= 24 ? 1 : 0
      let size = iconSize[0] <= 24 ? 36 : iconSize[0] - 4
      icon.options.iconSize = [size, size]
      icon.options.iconAnchor = [size / 2, size / 2]
      that.setIcon(icon)

      that._flashTimer = window.setTimeout(flashFunc, 300)
    }
    this._flashTimer = window.setTimeout(flashFunc, 300)
  },
  _stopFlash: function () {
    if (!this._flashTimer) {
      return
    }
    window.clearTimeout(this._flashTimer)
  }
});

let Position = {
  startPosition: function ($v, map, positionMarkerId, vectorMarkers) {
    if (!positionMarkerId || positionMarkerId === '') {
      return;
    }
    let marker = vectorMarkers[positionMarkerId];
    if (!marker) {
      return;
    }

    let latLng = marker.getLatLng();
    setTimeout(function () {
      map._onResize();//路由转换时候导致地图不完整的bug——个别浏览器出现
      map.setView(latLng, 10);

      Position.closePosition($v, map);

      $v._positionMarker = new L.PositionMarker(latLng);
      map.addLayer($v._positionMarker)
    }, 500);//延迟500毫秒是为了使路由转换完成
    positionMarkerId = '';
  },
  closePosition: function ($v, map) {
    if ($v._positionMarker) {
      map.removeLayer($v._positionMarker);
      delete $v._positionMarker;
    }
  }
}
export default Position;