const state = {
  currentMenu: '/layout/home'
}

const mutations = {
  setCurrentMenu (state, value) {
    state.currentMenu = value
  }
}

const actions = {}

const getters = {
  currentMenu: (state) => state.currentMenu
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}