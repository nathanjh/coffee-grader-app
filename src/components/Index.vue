<template>
  <q-layout ref="layout" view="lHh Lpr fff">

    <q-toolbar slot="header" class="glossy">
      <q-toolbar-title>
        Coffee Grader
      </q-toolbar-title>
    </q-toolbar>

    <router-view />

  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
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
    QToolbarTitle
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
    }
  }
}
</script>

<style lang="stylus">
</style>
