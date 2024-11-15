import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import 'normalize.css'
import '@/assets/css/base.css'
import router from './router'
import store from './store/index'
import qs from 'qs'


new Vue({
  render: h => h(App),  //h为Vue.js里的createElement函数，作用为生成一个App.vue的VNode节点，render拿到这个节点后返回给Vue.js的mount函数，渲染成真实的DOM节点，并挂载到根节点上
  router,  //引入Vue router
  store,
  qs
}).$mount('#app')  //手动挂载到id为app的dom中

