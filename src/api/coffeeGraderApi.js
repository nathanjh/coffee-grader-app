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
  store.commit('updateAuth', response.headers)
  return response
}, error => Promise.reject(error))

export default CoffeeGraderApi
