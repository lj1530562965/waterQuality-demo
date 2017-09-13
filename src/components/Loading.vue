<script>
  export default {
    name: 'Loading',
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<template>
  <div id="Loading">
    数据加载中...
  </div>
</template>
<style>
  #Loading {
    position: absolute;
    z-index: 1000;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 180px;
    line-height: 45px;
    height: 45px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.48);
    background-color: rgba(0, 0, 0, 0.48);
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    font-size: 22px;
  }
</style>