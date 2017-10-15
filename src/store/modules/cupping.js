import CoffeeGraderApi from 'src/api/coffeeGraderApi'

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

export const actions = api => ({
  newCupping ({ commit, rootState }, form) {
    console.log(`new cupping hosted by: ${rootState.sessions.user}`)
    return new Promise((resolve, reject) => {
      api.post('/cuppings.json', {
        params: {
          location: form.location,
          cup_date: form.cupDate,
          cups_per_sample: form.cupsPerSample,
          host_id: rootState.sessions.user.id
        },
        headers: rootState.sessions.auth.headers
      })
        .then(response => {
          console.log(response)
          commit('updateCupping', response.cupping)
          resolve(response.cupping)
        })
        .catch(error => {
          console.log(error.response.data)
          reject(error.response.data)
        })
    })
  }
})

const getters = {
  cupping: state => state.cupping
}

export default {
  state,
  mutations,
  actions: actions(CoffeeGraderApi),
  getters
}
