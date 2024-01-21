import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'js-md5'
import VueI18n from 'vue-i18n'
import Zh from '@/lang/zh'
import En from '@/lang/en'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'

if (process.env.NODE_ENV !== 'development') {
  // 判断当前环境是本地还是线上环境
  console.log = function () {}
  console.error = function () {}
  console.warn = function () {}
}

Vue.use(VueI18n)
Vue.prototype.$md5 = md5

Vue.config.productionTip = false

// 配置国际化
// 切换语言：this.$i18n.locale = 'en'
const i18n = new VueI18n({
  locale: 'zh', // 设置默认语言
  messages: {
    en: En, // 英文语言包
    zh: Zh, // 中文语言包
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
