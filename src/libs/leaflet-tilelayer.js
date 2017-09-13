import L from 'leaflet'
class EXTileLayer {
  constructor(options) {
    let { url, tileType, append, ...opts } = options
    this._bLayer = L.tileLayer(url, opts)
    this._bLayer.getTileUrl = (tileType => {
      if (tileType === 'QQ') {
        return this._QQTileUrl
      } else if (tileType === 'STRINGSOFT') {
        return this._StrongsoftTileLayer
      } else {
        return this._bLayer.getTileUrl
      }
    })(tileType)

    if (append) {
      let { url: appendUrl, tileType: appendTileType, ...appendOpts } = append
      let aTileLayer = L.tileLayer(appendUrl, L.extend({}, opts, appendOpts))
      aTileLayer.getTileUrl = (tileType => {
        if (tileType === 'QQ') {
          return this._QQTileUrl
        } else if (tileType === 'STRINGSOFT') {
          return this._StrongsoftTileLayer
        } else {
          return aTileLayer.getTileUrl
        }
      })(appendTileType)
      this._aLayer = aTileLayer

      this._bLayer.on('add', this._addAppend, this)
      this._bLayer.on('remove', this._removeAppend, this)
    }
  }
  onAdd(map) {
    this.map = map
    map.addLayer(this._bLayer)
  }
  onRemove() {
    this.map.removeLayer(this._bLayer)
  }
  _addAppend() {
    this.map = this._bLayer._map
    this.map.addLayer(this._aLayer)
  }
  _removeAppend() {
    this.map.removeLayer(this._aLayer)
  }
  getLayer() {
    return this._bLayer
  }
  getAppendLayer() {
    return this._aLayer
  }
  _QQTileUrl(coords) {
    let { x, y } = coords
    let z = Math.floor(this._getZoomForUrl())
    let s = this._getSubdomain(coords)
    let { tileSize, traffic } = this.options
    let { dx, dy } = {
      dx: Math.floor(x / 10),
      dy: Math.floor(y / 10)
    }
    if (!traffic) {
      y = (1 << (z + Math.floor(256 / tileSize / 2))) - 1 - y
      dx = Math.floor(x / 16)
      dy = Math.floor(y / 16)
    }

    return L.Util.template(this._url, {
      s: s,
      z: z,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      time: parseInt(new Date().getTime() / 1e4, 10)
    })
  }
  _StrongsoftTileLayer(coords) {
    let { x, y } = coords
    let z = Math.floor(this._getZoomForUrl())
    let s = this._getSubdomain(coords)
    let quadkey = ''
    z -= 1
    for (let i = z; i >= 0; --i) {
      let bitmask = 1 << i
      let digit = 0
      if ((x & bitmask) !== 0) {
        digit |= 1
      }
      if ((y & bitmask) !== 0) {
        digit |= 2
      }
      quadkey += digit
    }
    return L.Util.template(this._url, {
      s: s,
      key: quadkey
    })
  }
}
export default EXTileLayer
