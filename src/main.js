// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
var Promise = require('es6-promise').Promise;
window.Promise = Promise;
import Vue from 'vue'
import App from './App'
import router from './router'
import { getConfig } from 'istrong-axiosmodel'

Vue.config.productionTip = false

/* eslint-disable no-new */

getConfig('./config.json', {}, true).then(config => {
  //原则上必须先获取主要的配置，才能对组件进行渲染，这个是由于部分路由的配置在配置中。
  Vue.prototype.$AppConfig = config;
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  });
});