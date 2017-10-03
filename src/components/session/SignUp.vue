<template lang="html">

</template>

<script>
import {
  Toast
} from 'quasar'

import {
  required,
  email,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'

import { mapActions } from 'vuex'

export default {
  props: {
    inviteToken: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteToken: this.inviteToken
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3)
      },
      username: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        confirmPassword: sameAs('password')
      }
    }
  },
  methods: {
    ...mapActions({
      submitSignUp: 'signUp'
    }),
    signUp () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create('Please review fields and try again.')
        return
      }
      this.submitSignUp(this.form)
        .then(response => {
          this.$emit('successfulSignUp')
          Toast.create.positive(`Welcome, ${response.username}, thanks for signing up!`)
        })
        .catch(error => {
          error.full_messages.forEach(e => Toast.create({
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

<style scoped lang="css">
</style>
