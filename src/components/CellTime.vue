<script>
  import moment from 'moment'
  export default {
    name: 'istrong-CellTime',
    props: {
      format: {
        type: String,
        default: 'MM月DD日 HH时'
      },
      time: {
        type: String,
        required: true
      },
      defaultLabel: {
        type: String,
        default: '-'
      }
    },
    mounted() {
    },
    methods: {
    },
    computed: {
      formatValue: function () {
        return this.time ? moment(this.time).format(this.format) : this.defaultLabel;
      }
    }
  }
</script>

<template>
  <span>{{formatValue}}</span>
</template>
<style>
</style>