import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import { snakeizeCamelKeys } from 'src/utils/utils'

const state = {
  cupping: {}
}

export const mutations = {
  setCupping (state, cupping) {
    state.cupping = cupping
  },
  updateCupping (state, updates) {
    for (const field in updates) {
      if (state.cupping[field] !== undefined) {
        state.cupping[field] = updates[field]
      }
    }
  },
  clearCupping (state) {
    state.cupping = {}
  },
  addSample (state, sample) {
    state.cupping.cuppedCoffees
      .push(sample)
  },
  addInvite (state, invite) {
    state.cupping.invites
      .push(invite)
  }
}

export const actions = api => ({
  newCupping ({ commit, rootState }, form) {
    return new Promise((resolve, reject) => {
      api.post('cuppings.json', {
        location: form.location,
        cup_date: form.cupDate,
        cups_per_sample: form.cupsPerSample,
        host_id: rootState.sessions.user.id
      }, {
        headers: rootState.sessions.auth.headers
      })
        .then(response => {
          commit('setCupping', response.data.cupping)
          resolve(response.data.cupping)
        })
        .catch(error => {
          console.log(error.response.data)
          reject(error.response.data)
        })
    })
  },
  patchCupping ({ state, commit, rootState }, data) {
    const formData = snakeizeCamelKeys(
      Object.assign({}, data, { hostId: rootState.sessions.user.id })
    )
    return new Promise((resolve, reject) => {
      api.patch(`cuppings/${state.cupping.id}.json`, formData, {
        headers: rootState.sessions.auth.headers
      })
        .then(response => {
          console.log(response)
          commit('updateCupping', data)
          resolve(data)
        })
        .catch(error => {
          console.log(error)
          reject(error.response.data)
        })
    })
  },
  newSample ({ state, commit, rootState }, form) {
    return new Promise((resolve, reject) => {
      api.post(`cuppings/${state.cupping.id}/cupped_coffees.json`, {
        roast_date: form.roastDate,
        coffee_alias: form.coffeeAlias,
        coffee_id: form.coffeeId,
        roaster_id: form.roasterId,
        cupping_id: state.cupping.id
      }, {
        headers: rootState.sessions.auth.headers
      })
        .then(response => {
          commit('addSample', response.data.cuppedCoffee)
          resolve(response.data.cuppedCoffee)
        })
        .catch(error => {
          console.log(error.response.data)
          reject(error.response.data)
        })
    })
  },
  newInvite ({ state, commit, rootState }, form) {
    return new Promise((resolve, reject) => {
      api.post(`cuppings/${state.cupping.id}/invites.json`, {
        grader_id: form.graderId,
        grader_email: form.graderEmail,
        cupping_id: state.cupping.id
      }, {
        headers: rootState.sessions.auth.headers
      })
        .then(response => {
          commit('addInvite', response.data.invite)
          resolve(response.data.invite)
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
