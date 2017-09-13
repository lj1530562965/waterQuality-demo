<script>
  import moment from 'moment';
  import vSelect from './VSelect.vue';
  import renderChart from '../libs/wqCharts';

  export default {
    props: {
      fields: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      beginTime: {
        type: Object,
        required: true
      },
      endTime: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        selectItems: [],
        selected: {}
      }
    },
    watch: {
      'data': function () {
        this.renderChart();
      }
    },
    components: {
      'vg-Select': vSelect
    },
    mounted() {
    },
    methods: {
      elementsChanged(elements) {
        this.selected = elements;
        this.renderChart();
      },
      renderChart() {
        let selectedField = this.selected.key;
        let selectedName = this.selected.value;
        let vueLine = this.$refs.vueLine;
        let data = [];
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;
        this.data.forEach(item => {
          if (item[selectedField] !== undefined) {
            data.push({
              x: parseInt(moment(item.time).format('x'), 10),
              y: item[selectedField]
            });

            min = Math.min(min, item[selectedField]);
            max = Math.max(max, item[selectedField]);
          }
        });
        if (data.length === 0 && this.selected.info.min !== undefined) {
          min = this.selected.info.min;
          max = this.selected.info.max;
        }
        renderChart(this._chart, 'vueLine', {
          data: data,
          min: min,
          max: max
        }, this.beginTime, this.endTime);
      }
    },

    created() {
      // created 中 
      let selectItems = [];
      this.fields.forEach((item, i) => {
        selectItems.push({
          value: item.name,
          key: item.field,
          info: item
        })
      });
      this.selectItems = selectItems;
      this.selected = selectItems[0];
    }
  }
</script>
<template>
  <div>
    <div id="vueLine"></div>
    <vg-Select v-on:change="elementsChanged" :data="selectItems" class="schemaSelect"></vg-Select>
  </div>
</template>
<style>
#vueLine{
  width: 100%;
  height: 180px!important;
  margin-top:30px; 
}
.schemaSelect{
  position: absolute!important;
  padding: 2px 1px!important;
  padding-right: 32px!important;
  z-index: 2;
  right: 3px;
  top: 2px;
  width: 70px;
}
</style>