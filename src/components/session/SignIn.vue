<template lang="html">

</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { Toast } from 'quasar'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    ...mapActions({
      submitSignIn: 'signIn'
    }),
    signIn () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create('Please review fields and try again.')
        return
      }
      this.submitSignIn(this.form)
        .then(response => {
          this.$emit('successfulSignIn')
          Toast.create.positive(`Welcome back, ${response.username}.`)
        })
        .catch(error => {
          error.forEach(e => Toast.create({
            html: e,
            icon: 'error_outline'
          }))
        })
    }
  },
  created () {
    // quasar global event bus
    this.$q.events.$on('clearForm', () => {
      for (let field in this.form) this.form[field] = ''
      this.$v.form.$reset()
    })
  }
}
</script>

<style lang="css">
</style>
