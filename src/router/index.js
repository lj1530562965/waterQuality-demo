import Vue from 'vue'
import Router from 'vue-router'
import App from '../views/Main.vue'
import Info from '../views/Chart.vue'

Vue.use(Router)

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
export default new Router({
  routes: [
    {
      name: 'main',
      path: '/',
      component: App
    },
    {
      name: 'info',
      path: '/Info',
      component: Info
    }
  ]
})
