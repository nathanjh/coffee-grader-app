import Axios from 'axios'
import store from 'src/store/store'

let url = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/'
  }
})()

console.log('API URL:', url)

const CoffeeGraderApi = Axios.create({
  baseURL: url
})

// response interceptor to set auth headers
CoffeeGraderApi.interceptors.response.use(response => {
  const isLoggedIn = store.getters.isLoggedIn
  // update the store headers if we are signing in or signing up
  if (!isLoggedIn && response.headers['access-token']) {
    store.commit('updateAuth', response.headers)
  }
  // otherwise, only update the store headers with the most recent token
  else if (isLoggedIn && response.headers['access-token'] &&
           response.headers['expiry'] >
           store.state.sessions.auth.headers['expiry']) {
    store.commit('updateAuth', response.headers)
  }
  return response
}, error => Promise.reject(error))

export default CoffeeGraderApi
