<template lang="html">

</template>

<script>
import { mapActions } from 'vuex'
import CGAutocomplete from './CGAutocomplete'
export default {
  components: {
    CGAutocomplete
  },
  data () {
    return {
      form: {
        graderId: null,
        graderEmail: ''
      },
      userNotFound: false
    }
  },
  methods: {
    ...mapActions({
      submitNewInvite: 'newInvite'
    }),
    createInvite () {
      this.submitNewInvite(this.form)
        .then(response => {
          console.log(response)
          this.$emit('newInviteAdded')
        })
        .catch(error => console.log(error))
    }
  }
}
</script>

<style lang="css">
</style>
