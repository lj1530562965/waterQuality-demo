<script>
  /**************************************************************
   * 简单的table list组件
   *************************************************************/
  import vgCellTime from './CellTime.vue';
  export default {
    name: 'istrong-List',
    components: {
      'vg-cellTime': vgCellTime
    },
    props: {
      fields: {
        type: Array,
        required: true
        // default: [
        //   {
        //     fieldLabel: '时间',
        //     fieldName: 'time',
        //     fieldType: 'Date',//目前有Date,Numng
        //     fixed: 1,//fieldType为Number时候使用
        //     format: 'YYYY年MM月DD日',//fieldType为Date时候使用
        //     defaultLabel: '-',
        //     headerClass: 'chartViewer-FlowList-Header-Val',
        //     contentClass: 'chartViewer-FlowList-Content-Val'
        //   }
        // ]
      },
      data: {
        type: Array,
        required: true
      },
      showIndex: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        datalist: []
      }
    },
    watch: {
      data: function (val) {
        this.datalist = val;//后续可以在这里进行排序操作
      }
    },
    mounted() {
      this.datalist = this.data;
    },
    methods: {
      onItemClick(e) {
        let attr = e.currentTarget.attributes;
        if (!attr.hasOwnProperty('data-index')) {
          return;
        }
        let index = attr.getNamedItem('data-index').value;

        this.$emit('onItemClick', this.datalist[index]);
      }
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<template>
  <div class="VGList">
    <div class="VGList-Header">
      <div v-if="showIndex" class="VGList-Header-Index">序号</div>
      <div v-for="fieldItem in fields" :class="fieldItem.headerClass">{{fieldItem.fieldLabel}}</div>
    </div>
    <div class="VGList-Content">
      <div v-for="(item, index) in datalist" class="VGList-Content-Item" v-bind:data-index="index" v-on:click="onItemClick">
        <div v-if="showIndex" class="VGList-Header-Index">{{index + 1}}</div>
        <div v-for="fieldItem in fields" :class="fieldItem.contentClass">
          <vg-cellTime v-if="fieldItem.fieldType === 'Date'" :format="fieldItem.format" :time="item[fieldItem.fieldName]" :defaultLabel="fieldItem.defaultLabel">
          </vg-cellTime>
          <span v-if="fieldItem.fieldType === 'Number'">
            {{item[fieldItem.fieldName] === undefined ? fieldItem.defaultLabel || '-': (fieldItem.fixed !== undefined ? item[fieldItem.fieldName].toFixed(fieldItem.fixed) : item[fieldItem.fieldName])}}
          </span>
          <span v-if="fieldItem.fieldType === 'String'">
            {{item[fieldItem.fieldName] || fieldItem.defaultLabel || ''}}
          </span>
          <span v-if="fieldItem.fieldType === 'Function'" v-html="fieldItem.format(item[fieldItem.fieldName])">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.VGList{
  font-size: 16px;
}
.VGList-Header,.VGList-Content-Item{
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.VGList-Header{
  color: #666;
  text-align: center;
  height: 30px;
  padding: 6px 0;
  line-height: 30px;
  background-color: #f0eff5;
}
.VGList-Content{
  font-size: 14px;
  width: 100%;
  background-color: #fff;
}
.VGList-Content-Item{
  line-height: 25px;
  text-align: center;
  padding: 3px 0;
}
.VGList-Header-Index{
  min-width: 50px;
  max-width: 50px;
}
</style>