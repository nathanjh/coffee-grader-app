<template lang="html">
  <div>
    <q-modal
      ref="sessionModal"
      :content-css="{minHeight: modalHeight, minWidth: '60vw'}"
      v-on:close="clearFormOnClose()"
    >
      <q-modal-layout>
        <q-toolbar
          slot="header"
          glossy
        >
          <div class="q-toolbar-title text-center">
            {{ headerTitle }}
          </div>
          <q-btn
            flat round small
            @click.prevent="$refs.sessionModal.close()"
            data-button-type="modal-close"
            icon="close"
          />
        </q-toolbar>

        <q-toolbar
          slot="footer"
          color="light"
          class="text-teal-5"
        >
          <div class="q-toolbar-title text-center">
            <a @click="signingUp = !signingUp">
              {{ footerTitle }}
            </a>
          </div>
        </q-toolbar>

        <sign-up-form
          v-if="signingUp"
          v-on:successfulSignUp="$refs.sessionModal.close()"
        />

        <sign-in-form
          v-else
          v-on:successfulSignIn="$refs.sessionModal.close()"
        />

      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import SignUpForm from './forms/SignUpForm'
import SignInForm from './forms/SignInForm'

import {
  QModal,
  QModalLayout,
  QToolbar,
  QBtn
} from 'quasar'

export default {
  name: 'SessionModal',
  components: {
    SignUpForm,
    SignInForm,
    QModal,
    QModalLayout,
    QToolbar,
    QBtn
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
    footerTitle () {
      return this.signingUp ? 'Already a Member?' : 'Need to create an account?'
    },
    modalHeight () {
      return this.signingUp ? '85vh' : '75vh'
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

<style scoped lang="stylus">
  @import '~variables'

  a
    color inherit

  a:hover
    color: $teal-7
</style>
