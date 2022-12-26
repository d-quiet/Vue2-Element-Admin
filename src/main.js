import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as directives from '@/directives'
// 自己定义的插件
import myPlugin from './Plugin'
// 全局引用假的饿了么组件
import elTest from './elTest.vue'
import Print from 'vue-print-nb'
// 注册全局组件
import Components from '@/components'
import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.use(Print);
Vue.use(Components)

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
console.log(directives)
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Vue.component('elTest', elTest)
Vue.use(myPlugin)
Vue.fn()
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
