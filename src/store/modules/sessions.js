import CoffeeGraderApi from 'src/api/coffeeGraderApi'

export const STORAGE_KEY = 'coffee-grader'

let initialState = {}

if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}
else {
  initialState = {
    user: null,
    auth: {
      isLoggedIn: false,
      headers: null
    }
  }
}

const mutations = {
  updateUser (state, user) {
    state.user = user
  },
  updateAuth (state, authObj) {
    const newAuthHeaders = {
      'access-token': authObj['access-token'] || authObj['authToken'],
      'token-type': authObj['token-type'] || 'Bearer',
      'client': authObj.client || authObj.clientId,
      'expiry': authObj.expiry,
      'uid': authObj.uid
    }
    if (!state.auth.isLoggedIn) { state.auth.isLoggedIn = true }
    state.auth.headers = newAuthHeaders
  },
  clearAllSessionData (state) {
    state.auth.isLoggedIn = false
    state.auth.headers = null
    state.user = null
  }
}

export const actions = api => ({
  signIn ({commit}, form) {
    // console.log('sign in!')
    return new Promise((resolve, reject) => {
      api.post('auth/sign_in.json', {
        email: form.email,
        password: form.password
      })
        .then(response => {
          // console.log(response)
          commit('updateUser', response.data.user)
          resolve(response.data.user)
        })
        .catch(error => {
          // console.log(error.response)
          reject(error.response.data.errors)
        })
    })
  },
  signUp ({commit}, form) {
    // console.log('Sign up!')
    return new Promise((resolve, reject) => {
      api.post('auth.json', {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        invite_token: form.inviteToken
      })
        .then(response => {
          // console.log(response)
          commit('updateUser', response.data.user)
          resolve(response.data.user)
        })
        .catch(error => {
          // console.log(error.response.data.errors)
          reject(error.response.data.errors)
        })
    })
  },
  setUserFromOAuth ({commit, state}) {
    return new Promise((resolve, reject) => {
      api.get('users', {
        params: {
          uid: state.auth.headers.uid
        },
        headers: state.auth.headers
      })
        .then(response => {
          // console.log(response)
          commit('updateUser', response.data.user)
          resolve(response.data.user)
        })
        .catch(error => {
          reject(error.response)
        })
    })
  }
})

const getters = {
  isLoggedIn: state => state.auth.isLoggedIn,
  authHeaders: state => state.auth.headers,
  currentUser: state => state.user
}

export default {
  state: initialState,
  mutations,
  actions: actions(CoffeeGraderApi),
  getters
}
