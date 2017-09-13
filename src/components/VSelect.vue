<script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        selected: '',
        selectName: ''
      }
    },
    mounted() {
      this.selected = this.data[0].key;
      this.selectName = this.data[0].value;
    },
    methods: {
      change() {
        let selectItem;
        this.data.forEach((item, i) => {
          if (item.key === this.selected) {
            selectItem = item;
            return true;
          }
        });
        this.selectName = selectItem.value;
        this.$emit('change', selectItem);
      }
    },
    created() {
      // created 中 
    }
  }
</script>
<template>
  <div class="vSelect">
    <span>{{selectName}}</span>
    <select v-model="selected" v-on:change="change">
      <option v-for="item in data" v-bind:value="item.key">{{item.value}}</option>
    </select>
  </div>
</template>
<style>
.vSelect{
  font-size: 14px;
  margin: 0;
  opacity: 1;
  background-color: #f6f6f6;
  color: #333;
  text-shadow: 0 1px 0 #f3f3f3;
  border:1px solid #ddd;
  border-radius: .3125em;
  padding: .7em 1em;
  padding-right: 2.5em;

  display: block;
  position: relative;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none!important;
  height: 20px;
}

.vSelect:after{
  right: .5625em;
  top: 50%;
  margin-top: -11px;
  content: "";
  position: absolute;
  display: block;
  width: 22px;
  height: 22px;
  background-color: rgba(0,0,0,.3);
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 1em;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20%20width%3D%2214px%22%20height%3D%2214px%22%20viewBox%3D%220%200%2014%2014%22%20style%3D%22enable-background%3Anew%200%200%2014%2014%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cpolygon%20style%3D%22fill%3A%23FFFFFF%3B%22%20points%3D%2211.949%2C3.404%207%2C8.354%202.05%2C3.404%20-0.071%2C5.525%207%2C12.596%2014.07%2C5.525%20%22%2F%3E%3C%2Fsvg%3E");
}
.vSelect>span{
  display: block;
  text-overflow: ellipsis;
  overflow: hidden!important;
  white-space: nowrap;
}
.vSelect>select{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  cursor: pointer;
  opacity: 0;
  z-index: 100;
  border: solid 1px #000;
  /*很关键：将默认的select选择框样式清除*/
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
}
</style>