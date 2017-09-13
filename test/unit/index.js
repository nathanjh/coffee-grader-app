import Vue from 'vue'
import Quasar from 'quasar'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false

// global vue instance dependencies
Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuelidate) // Form validation library
// to mock global registration of router-view/router-link components
const routerView = {
  name: 'router-view',
  render: h => h('div')
}
const routerLink = {
  name: 'router-link',
  render: h => h('div')
}
//
// [routerView, routerLink].forEach(globalComponent => {
//   Vue.component(globalComponent.name, globalComponent)
// })
Vue.component('router-view', routerView)
Vue.component('router-link', routerLink)
// require all test files (files that end with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
