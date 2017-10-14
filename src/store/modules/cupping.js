const state = {
  cupping: {}
}

export const mutations = {
  updateCupping (state, cupping) {
    state.cupping = cupping
  },
  clearCupping (state) {
    state.cupping = {}
  }
}

const getters = {
  cupping: state => state.cupping
}

export default {
  state,
  mutations,
  getters
}
