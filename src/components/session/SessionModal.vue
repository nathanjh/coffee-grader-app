<template lang="html">
  <div>
    <q-modal ref="sessionModal">
    </q-modal>
  </div>
</template>

<script>
import {
  QModal
} from 'quasar'

export default {
  name: 'SessionModal',
  components: {
    QModal
  },
  props: {
    modalOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      signingUp: false
    }
  },
  computed: {
    headerTitle () {
      return this.signingUp ? 'Sign up for an account' : 'Sign in to your account'
    },
    modalHeight () {
      return this.signingUp ? '97vh' : '75vh'
    }
  },
  methods: {
    clearFormOnClose () {
      this.$q.events.$emit('clearForm')
    }
  },
  watch: {
    modalOpen () {
      if (this.modalOpen) this.$refs.sessionModal.open()
    }
  }
}
</script>

<style lang="css">
</style>
