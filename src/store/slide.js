const state = {
  currentMenu: '/layout/dashboard'
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