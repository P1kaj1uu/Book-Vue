const state = {
  userInfo: null
}

const mutations = {
  setUserInfo(state, value) {
    state.userInfo = value
  }
}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
