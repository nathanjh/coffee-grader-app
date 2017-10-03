<template>
  <q-layout ref="layout" view="lHh Lpr fff">

    <q-toolbar slot="header" class="glossy">
      <q-toolbar-title>
        Coffee Grader
      </q-toolbar-title>
      <template v-if="loggedIn">
        <img v-if="currentUser && currentUser.image"
             :src="currentUser.image"
             class="avatar"
             data-img-type="avatar">
        <q-icon v-else name="account_circle" data-icon-type="account"/>
        <q-btn flat
               data-button-type="sign-out"
               @click="signOut">
          Sign out
        </q-btn>
      </template>
      <q-btn v-else
             flat
             data-button-type="sign-in"
             @click="triggerModal">
        Sign in
      </q-btn>
    </q-toolbar>

    <router-view />

  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  Toast
} from 'quasar'
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon
  },
  data () {
    return {
      modalOpen: false
    }
  },
  props: ['authHeaders'],
  computed: {
    ...mapGetters({
      loggedIn: 'isLoggedIn'
    }),
    ...mapGetters(['currentUser'])
  },
  methods: {
    ...mapMutations([
      'updateAuth',
      'clearAllSessionData'
    ]),
    ...mapActions(['setUserFromOAuth']),
    signOut () {
      this.clearAllSessionData()
      Toast.create({
        html: 'Successfully signed out',
        icon: 'eject'
      })
    },
    triggerModal () {
      this.modalOpen = true
      setTimeout(() => { this.modalOpen = false }, 500)
    }
  },
  // check whether visiting this page from an OAuth callback/redirect...
  created () {
    // add a guard clause or some sort of null check for this.props.authHeaders
    if (this._props.authHeaders === undefined) return

    const propVals = Object.values(this._props.authHeaders)
    if (propVals.every(val => val !== undefined)) {
      this.updateAuth(this._props.authHeaders)
      // use our new credentials to get the current user
      this.$router.push({path: '/'}, () => {
        this.setUserFromOAuth()
          .then(response => Toast.create.positive(`Welcome back, ${response.username}.`))
          .catch(error => {
            console.log(`Couldn't set user from uid. Status: ${error.status}, ${error.statusText}`)
          })
      })
    }
  }
}
</script>

<style>
</style>
