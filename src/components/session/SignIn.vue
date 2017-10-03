<template lang="html">
  <q-layout view="hhh lpr fff">
    <div class="layout-padding row justify-center">
      <q-card class="col-12">
        <div class="row justify-center">
          <auth-button :bgColor="'#027be3'"
                       :textColor="'#ffffff'"
                       :authProvider="'google_oauth2'"
                       :providerIcon="'../../statics/btn_google_light_normal.png'"
                       :baseURL="oauthBaseURL"
                       data-button-type="oauth-google"
          >
            Sign in with Google
          </auth-button>
        </div>
      </q-card>
      <div class="row text-faded text-italic justify-center">
        or
      </div>
      <q-card class="col-12">
        <q-field
          icon="account_circle"
          :error="$v.form.email.$error"
          error-label="invalid email"
          data-field-type="email"
        >
          <q-input
            type="email"
            float-label="Email"
            v-model="form.email"
            @input="$v.form.email.$touch"
          />
        </q-field>
        <q-field
          icon="lock_outline"
          :error="$v.form.password.$error"
          error-label="Password must contain at least 6 characters"
          data-field-type="password"
        >
          <q-input
            type="password"
            float-label="Password"
            v-model="form.password"
            @input="$v.form.password.$touch"
          />
        </q-field>
        <div class="row justify-center" style="padding-top: 10px">
          <q-btn
            color="teal"
            class="col-4"
            data-button-type="submit-sign-in"
            @click.prevent="signIn"
          >
            Sign In
          </q-btn>
        </div>
      </q-card>
    </div>
    <q-toolbar slot="footer" color="light" class="text-teal-5">
      <q-toolbar-title class="text-center">
        Need to create an account?
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import AuthButton from '@/session/AuthButton'
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

export default {
  components: {
    AuthButton,
    QLayout,
    QCard,
    QField,
    QInput,
    QBtn,
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      oauthBaseURL: CoffeeGraderApi.defaults.baseURL
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

<style scoped lang="css">
  div.q-card {
    padding: 15px;
  }
</style>
