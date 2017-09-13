<script>
  /***********************************************
   * 一个app的二级标题，基本是用来显示时间之类的,只是用来规范样式
   **********************************************/
  export default {
    name: 'istrong-AppSecondHeader'
  }
</script>

<template>
  <div class="appSecondHeader">
    <slot></slot>
  </div>
</template>
<style>
.appSecondHeader{
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #000;
  text-align: left;
  letter-spacing: 1px;
  padding: 0px 8px;
}
</style>