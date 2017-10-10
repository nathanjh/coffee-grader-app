<template lang="html">
  <q-layout view="hhh lpr fff">

    <sign-up-form :inviteToken="inviteToken"/>

    <q-toolbar
      slot="footer"
      color="light"
      class="text-teal-5"
    >
      <q-toolbar-title class="text-center">
          <router-link
            :to="'/sign-in'"
            data-link-type="sign-in"
          >
            {{ linkText }}
          </router-link>
      </q-toolbar-title>
    </q-toolbar>

  </q-layout>
</template>

<script>
// wrapper component to present SignUpForm as a separate page
import SignUpForm from './forms/SignUpForm'
import {
  QLayout,
  QToolbar,
  QToolbarTitle
} from 'quasar'

export default {
  name: 'SignUp',
  components: {
    SignUpForm,
    QLayout,
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
      linkText: 'Already a Member?'
    }
  },
  props: {
    inviteToken: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~variables'

  a
    color inherit

  a:hover
    color: $teal-7
</style>
