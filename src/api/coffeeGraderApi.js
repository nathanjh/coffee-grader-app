import Axios from 'axios'

let url = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/'
  }
})()

console.log('API URL:', url)

const CoffeeGraderApi = Axios.create({
  baseURL: url
})

export default CoffeeGraderApi
