import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    {
      path: '/',
      component: load('Index'),
      props: route => ({
        authHeaders: {
          authToken: route.query.auth_token,
          clientId: route.query.client_id,
          expiry: route.query.expiry,
          uid: route.query.uid
        }
      }),
      children: [
        {
          path: 'cupping-form',
          component: load('cupping/CuppingForm')
        }
      ]
    },
    { path: '/sign-in', component: load('session/SignIn') },
    {
      path: '/sign-up',
      component: load('session/SignUp'),
      props: route => ({ inviteToken: route.query.invite_token })
    },
    // temp component test path
    { path: '/test', component: load('cupping/forms/InviteForm') },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
