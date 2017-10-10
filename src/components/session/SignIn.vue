<template lang="html">
  <q-layout view="hhh lpr fff">

    <sign-in-form/>

    <q-toolbar slot="footer" color="light" class="text-teal-5">
      <q-toolbar-title class="text-center">
        <router-link
          :to="'/sign-up'"
          data-link-type="sign-up"
        >
          {{ linkText }}
        </router-link>
      </q-toolbar-title>
    </q-toolbar>

  </q-layout>
</template>

<script>
// wrapper component to present SignInForm as a separate page
import SignInForm from './forms/SignInForm'
import {
  QLayout,
  QToolbar,
  QToolbarTitle
} from 'quasar'

export default {
  name: 'SignIn',
  components: {
    SignInForm,
    QLayout,
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
      linkText: 'Need to create an account?'
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
