<template lang="html">
  <div>
    <p class="text-grey-9">
      Use the field below to search for already-registered users, or
      <a
        data-link-type="guest-invite"
        @click.prevent="$refs.guestInviteModal.open()"
      >
        click here
      </a>
      to send an invitation via email
    </p>
    <q-field
      data-field-type="grader"
    >
      <c-g-autocomplete
        id="grader-autocomplete"
        ref="graderAutocomplete"
        data-autocomplete-type="grader"
        :model="'user'"
        :sublabel="'username'"
        @noResults="graderNotFoundHandler"
        @itemSelected="graderSelectedHandler($event)"
        @inputCleared="form.graderId = null"
      />
    </q-field>
    <label
      for="grader-autocomplete"
      class="text-grey-7 text-italic"
    >
      <div v-if="graderNotFound">
        couldn't find that user...please
        <a
          data-link-type="guest-invite"
          @click.prevent="$refs.guestInviteModal.open()"
        >
          click
        </a>
        to send an invitation and sign-up link via email
      </div>
      <div v-else>
        find a registered user by name
      </div>
    </label>
    <div class="row justify-end" style="padding-right: 5px;">
      <q-btn
        class="col-3"
        :outline="true"
        data-button-type="with-grader-id"
        @click.prevent="submitButtonHandler('graderEmail', createInvite)"
        color="grey-7"
        :disable="idButtonDisabled || form.graderId === null"
      >
        Submit
      </q-btn>
    </div>
    <q-modal
      ref="guestInviteModal"
      :content-css="{minHeight: '36vh', minWidth: '55vw'}"
      @close="form.graderEmail = ''; $v.form.graderEmail.$reset()"
    >
      <q-modal-layout>
        <q-toolbar slot="header" class="bg-light text-teal-5">
          <div class="q-toolbar-title text-center">
            invite a guest via email
          </div>
          <q-btn
            flat round small
            @click="$refs.guestInviteModal.close()"
            icon="close"
          />
        </q-toolbar>
        <p class="text-grey-7 text-italic"
           style="padding: 5px;"
        >
          Please enter your guest's email address to send an invite and sign-up link.
        </p>
        <q-field
          class="col-12"
          data-field-type="grader-email"
          icon="mail_outline"
          :error="$v.form.graderEmail.$error"
          :error-label="requiredMessage($v.form.graderEmail, 'email') ||
                        invalidMessage($v.form.graderEmail, 'email')"
          style="padding: 3px;"
        >
          <q-input
            float-label="email"
            v-model="form.graderEmail"
            @blur="$v.form.graderEmail.$touch()"
          />
        </q-field>
        <div class="row justify-end" style="padding-right: 5px;">
          <q-btn
            class="col-2"
            :outline="true"
            data-button-type="with-grader-email"
            @click.prevent="submitButtonHandler('graderId', createInvite)"
            :disabled="form.graderEmail === '' ||
                       $v.form.graderEmail.$error"
            color="grey-7"
          >
            Submit
          </q-btn>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
import { requiredUnless, email } from 'vuelidate/lib/validators'
import { validationMessages } from '@/mixins/validationMessages'
import CGAutocomplete from './CGAutocomplete'
import {
  Toast,
  QModal,
  QModalLayout,
  QToolbar,
  QField,
  QInput,
  QBtn
} from 'quasar'
export default {
  name: 'InviteForm',
  mixins: [validationMessages],
  components: {
    CGAutocomplete,
    QModal,
    QModalLayout,
    QToolbar,
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
      form: {
        graderId: null,
        graderEmail: ''
      },
      graderNotFound: false,
      idButtonDisabled: true,
      emailButtonDisabled: true
    }
  },
  validations () {
    return {
      form: {
        graderId: {
          required: requiredUnless('graderEmail')
        },
        graderEmail: {
          email,
          required: requiredUnless('graderId')
        }
      }
    }
  },
  methods: {
    ...mapActions({
      submitNewInvite: 'newInvite'
    }),
    createInvite () {
      this.$v.form.$touch()
      if (this.$v.form.$error) return

      this.submitNewInvite(this.form)
        .then(response => {
          console.log(response)
          this.$emit('newInviteAdded')
          this.clearAllFields()
          this.$refs.guestInviteModal.close()
          Toast.create
            .positive(`Successfully invited ${response.graderEmail ||
                                              response.grader.name}.`)
        })
        .catch(error => console.log(error))
    },
    graderSelectedHandler (payload) {
      this.graderNotFound = false
      this.idButtonDisabled = false
      if (payload && payload.id) this.form.graderId = payload.id
    },
    graderNotFoundHandler () {
      this.graderNotFound = true
      this.idButtonDisabled = true
      if (this.form.graderId) this.form.graderId = null
    },
    clearAllFields () {
      this.$refs.graderAutocomplete.clearInput()
      this.form.graderId = null
      this.form.graderEmail = ''
      this.$v.$reset()
    },
    submitButtonHandler (prop, callback) {
      this.form[prop] = null
      callback()
    }
  }
}
</script>

<style lang="css">
</style>
