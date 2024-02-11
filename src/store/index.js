import Vue from 'vue'
import Vuex from 'vuex'
// 引入持久化存储插件
import createPersistedState from 'vuex-persistedstate'

import User from './user'
import Slide from './slide'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    User,
    Slide,
  },
  /* vuex数据持久化配置 */
  plugins: [
    createPersistedState({
      // 存储方式
      storage: window.localStorage,
      // 存储的 key 的key值
      key: "vuex",
      // 要存储的模块
      paths: ['User', 'Slide']
    })
  ]
})
