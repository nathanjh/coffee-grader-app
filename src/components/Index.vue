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
  QToolbarTitle
} from 'quasar'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
