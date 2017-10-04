<template lang="html">
  <q-layout view="hhh lpr fff">
    <div class="layout-padding row justify-center">
      <q-card class="col-12">
        <q-field
          icon="person"
          data-field-type="name"
          :error="$v.form.name.$error"
        >
          <q-input
            float-label="Name"
            v-model="form.name"
            @input="$v.form.name.$touch"
          />
        </q-field>
        <q-field
          icon="person_outline"
          data-field-type="username"
          :error="$v.form.username.$error"
        >
          <q-input
            float-label="Username"
            v-model="form.username"
            @input="$v.form.username.touch"
          />
        </q-field>
        <q-field
          icon="mail_outline"
          data-field-type="email"
          :error="$v.form.email.$error"
        >
          <q-input
            type="email"
            float-label="Email"
            v-model="form.email"
            @input="$v.form.email.touch"
          />
        </q-field>
        <q-field
          icon="lock"
          data-field-type="password"
          :error="$v.form.password.$error"
        >
          <q-input
            type="password"
            float-label="Password"
            v-model="form.password"
            @input="$v.form.password.$touch"
          />
        </q-field>
        <q-field
          icon="lock_outline"
          data-field-type="password-confirmation"
          :error="$v.form.confirmPassword.$error"
        >
          <q-input
            type="password"
            float-label="Confirm Password"
            v-model="form.confirmPassword"
            @input="$v.form.confirmPassword.$touch"
          />
        </q-field>
        <div
          class="row justify-center"
          style="padding-top: 10px"
        >
          <q-btn
            color="teal"
            class="col-4"
            data-button-type="submit-sign-up"
            @click.prevent="signUp"
          >
            Sign Up
          </q-btn>
        </div>
      </q-card>
    </div>
    <q-toolbar
      slot="footer"
      color="light"
      class="text-teal-5"
    >
      <q-toolbar-title class="text-center">
        <slot>
          <router-link :to="'/sign-in'">
            Already a Member?
          </router-link>
        </slot>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import {
  Toast,
  QLayout,
  QCard,
  QField,
  QInput,
  QBtn,
  QToolbar,
  QToolbarTitle
} from 'quasar'

import {
  required,
  email,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'

import { mapActions } from 'vuex'

export default {
  components: {
    QLayout,
    QCard,
    QField,
    QInput,
    QBtn,
    QToolbar,
    QToolbarTitle
  },
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

<style scoped lang="stylus">
  @import '~variables'

  div.q-card
    padding 15px

  a
    color inherit

  a:hover
    color: $teal-7
</style>
