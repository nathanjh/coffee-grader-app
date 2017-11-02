<template lang="html">
  <q-card>
    <q-card-title align="center">
      Add a new {{ model.name }}
    </q-card-title>
    <q-card-main>
      <q-field
        v-for="(value, attr, index) in form"
        :key="index"
        :error="errorClassCheck(attr)"
        :error-label="errorMessageCheck(attr)"
        :data-field-type="attr"
      >
        <q-input
          :float-label="attr"
          v-model="form[attr]"
          @blur="touchIfValidates(attr)"
        />
      </q-field>
    </q-card-main>
    <q-card-actions align="around">
      <q-btn
        flat
        class="col-2"
        data-button-type="create-resource"
        @click.prevent="createResource"
      >
        Submit
      </q-btn>
      <q-btn
        color="teal"
        flat
        class="col-2"
        data-button-type="clear-form"
        @click.prevent="clearForm"
      >
        Reset
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
/* generic 'new' resource form
   - meant to handle coffees, roasters, etc. */
import { required } from 'vuelidate/lib/validators'
import { validationMessages } from '@/mixins/validationMessages'
import { mapGetters } from 'vuex'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import {
  QCard,
  QCardTitle,
  QCardMain,
  QCardActions,
  QField,
  QInput,
  QBtn,
  Toast
} from 'quasar'

export default {
  name: 'CGNewResourceForm',
  mixins: [validationMessages],
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardActions,
    QField,
    QInput,
    QBtn
  },
  props: {
    model: {
      type: Object,
      required: true,
      validator: function (model) {
        return ['name', 'attributes']
          .every(k => Object.keys(model).includes(k)) &&
        typeof model['name'] === 'string' &&
        Array.isArray(model['attributes']) &&
        model['attributes'].every(i => typeof i === 'string')
      }
    },
    validates: {
      type: Object,
      required: false,
      validator: function (validates) {
        // currently only 'required' Vuelidate validator supported
        for (const val in validates) {
          const keys = Object.keys(validates[val])
          if (keys.length !== 1 || keys[0] !== 'required') {
            return false
          }
        }
        return true
      }
    }
  },
  data () {
    return this.parseModelProp()
  },
  validations () {
    return this.parseValidatesProp()
  },
  computed: {
    ...mapGetters(['authHeaders'])
  },
  methods: {
    errorClassCheck (attr) {
      if (this.$v.form[attr]) {
        return this.$v.form[attr].$error
      }
    },
    errorMessageCheck (attr) {
      if (this.$v.form[attr] &&
          Object.keys(this.$v.form[attr]).includes('required')) {
        return this.requiredMessage(this.$v.form[attr], attr)
      }
    },
    touchIfValidates (attr) {
      if (this.$v.form[attr]) {
        this.$v.form[attr].$touch()
      }
    },
    parseModelProp () {
      const dataModel = {
        form: {}
      }
      this.model.attributes
        .forEach(attr => {
          dataModel.form[attr] = ''
        })
      return dataModel
    },
    parseValidatesProp () {
      const validations = {
        form: {}
      }
      for (const attr in this.validates) {
        const options = this.validates[attr]
        if (options.required) {
          validations.form[attr] = { required }
        }
      }
      return validations
    },
    createResource () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create('Please review fields and try again.')
        return
      }
      CoffeeGraderApi.post(`${this.model.name}s.json`, this.form, {
        headers: this.authHeaders
      })
        .then(response => {
          this.$emit(`${this.model.name}Created`, response.data)
          this.clearForm()
        })
        .catch(error => {
          console.log(error.response)
          Toast.create({
            html: error.response.data.message,
            icon: 'error_outline'
          })
        })
    },
    clearForm () {
      for (const field in this.form) this.form[field] = ''
      this.$v.form.$reset()
    }
  }
}
</script>

<style scoped lang="stylus">
  div.q-card
    padding 15px
</style>
