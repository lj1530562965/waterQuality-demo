<template>
  <div id="app">
    <transition v-bind:name="transitionName">
      <keep-alive>
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>

  import 'istrong-fonticon';

  export default {
    name: 'app',
    data() {
      return {
        transitionName: 'slide-left',
      }
    },
    // dynamically set transition based on route change
    watch: {
      '$route'(to, from) {
        let isBack = this.$router.isBack;
        this.transitionName = isBack ? 'slide-right' : 'slide-left'
        this.$router.isBack = false;
      }
    }
  }
</script>

<style>
html,body{
  height: 100%;
  margin: 0px;
  padding: 0px;
}
#app {
  height: 100%;
}
.child-view {
  transition: all .8s cubic-bezier(.55,0,.1,1);
} 
.slide-left-enter, .slide-right-leave-active {
  opacity: 0.5;
  -webkit-transform: translate(400px, 0);
  transform: translate(400px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0.5;
  -webkit-transform: translate(-400px, 0);
  transform: translate(-400px, 0);
}
.appSecondHeader{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.appSecondHeader>div{
  margin: 0px 15px;
}
.appHeader-listViewer-Time{
  font-size: 14px;
  color: #000000;
  letter-spacing:1px;
}
/*start Map.vue*/
#mapViewer{
  width: 100%;
  height: 100%;
}
.commonTooltip{
  background: #fff!important;
}
/*
.commonTooltip{
  background: rgba(196, 232, 255, 0.81)!important;
  border-color: #3179C2!important;
  color: #3179C2!important;
}
.commonTooltip:before {
    border-top-color: #3179C2!important;
}*/
/*end Map.vue*/
/*切换到list的按钮样式*/
.btChangeRouterList{
  position: absolute;
  z-index: 10000;
  top: 10px;
  right: 10px;
  font-size: 20px;
  background-color: #fff;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}
/*切换到List的按钮样式*/
/*切换到Map的按钮样式*/
.btChangeRouterList,.btChangeRouterMap{
  color: #5399d7;
}
.btChangeRouterMap{
  font-size: 20px;
}



/*start 水质样式*/
.waterQuality_1{
  color: #8EDBE4
}
.waterQuality_2{
  color: #81CC9C
}
.waterQuality_3{
  color: #E5A367
}
.waterQuality_4{
  color: #D26863
}
.waterQuality_5{
  color: #625236
}
.waterQuality_6{
  color: #25262B
}
/*end 水质样式*/

/*start Chart.vue*/

/*end Chart.vue*/
</style>