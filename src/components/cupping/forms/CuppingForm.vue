<template lang="html">
  <div>
    <p v-if="newCupping" class="text-grey-9">
      Let's start with some basic info about your cupping....
    </p>
    <p v-else class="text-grey-9">
      Feel free to update your cupping info... <small>(and click submit)</small>
    </p>
    <div class="row">
      <q-field
        class="col-12"
        icon="place"
        :error="$v.form.location.$error"
        :error-label="requiredMessage($v.form.location, 'location')"
        data-field-type="location"
      >
        <q-input
          float-label="Place"
          v-model="form.location"
        />
      </q-field>
      <q-field
        class="col-12"
        icon="schedule"
        helper="Date / Time"
        data-field-type="cup-date"
        :error="$v.form.cupDate.$error"
        :error-label="requiredMessage($v.form.cupDate, 'date/time')"
      >
        <q-datetime
          type="datetime"
          :min="today"
          v-model="form.cupDate"
          float-label="Time"
          format="dddd, MMM D @ h:mma"
        />
      </q-field>
      <q-field
        class="col-12"
        icon="local cafe"
        data-field-type="cups-per-sample"
        :error="$v.form.cupsPerSample.$error"
        :error-label="requiredMessage($v.form.cupsPerSample, 'cups per sample') ||
                      isNumMessage($v.form.cupsPerSample, 'cups per sample')"
      >
        <q-input
          type="number"
          float-label="Number of cups per sample"
          v-model="form.cupsPerSample"
        />
      </q-field>
    </div>
    <div class="row justify-end">
        <q-btn
          class="col-3"
          :outline="true"
          color="grey-7"
          data-button-type="submit-cupping"
          @click.prevent="newCupping
                          ? createCupping()
                          : updateCupping()"
          :disable="!okToSubmit"
        >
          Submit
        </q-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { validationMessages } from '@/mixins/validationMessages'
import { isNum } from 'src/utils/validators/customValidators'
import { isEmptyObject } from 'src/utils/utils'
import {
  Toast,
  QCard,
  QField,
  QInput,
  QDatetime,
  QBtn
} from 'quasar'

const today = new Date()

export default {
  name: 'CuppingForm',
  mixins: [validationMessages],
  components: {
    QCard,
    QField,
    QInput,
    QDatetime,
    QBtn
  },
  data () {
    return {
      form: {
        location: '',
        cupDate: null,
        cupsPerSample: 3
      },
      today
    }
  },
  validations: {
    form: {
      location: { required },
      cupDate: { required },
      cupsPerSample: {
        required,
        isNum
      }
    }
  },
  computed: {
    ...mapGetters(['cupping']),
    newCupping () {
      return isEmptyObject(this.cupping)
    },
    okToSubmit () {
      if (this.newCupping) return true
      else {
        return !Object.keys(this.form)
          .every(key => this.form[key] === this.cupping[key])
      }
    }
  },
  methods: {
    ...mapActions({
      submitNewCupping: 'newCupping',
      submitUpdateCupping: 'patchCupping'
    }),
    createCupping () {
      this.$v.form.$touch()
      if (this.$v.form.$error) return

      this.submitNewCupping(this.form)
        .then(response => {
          this.$emit('newCuppingCreated')
        })
        .catch(error => {
          console.log(error)
          error.forEach(e => Toast.create({
            html: e,
            icon: 'error_outline'
          }))
        })
    },
    updateCupping () {
      console.log('update cupping!')
      this.$v.form.$touch()
      if (this.$v.form.$error) return

      this.submitUpdateCupping(this.form)
        .then(() => {
          this.$emit('cuppingUpdated')
        })
        .catch(error => {
          console.log(error)
          error.forEach(e => Toast.create({
            html: e,
            icon: 'error_outline'
          }))
        })
    }
  },
  created () {
    if (!this.newCupping) {
      Object.keys(this.form)
        .forEach(key => {
          this.form[key] = this.cupping[key]
        })
    }
  }
}
</script>

<style lang="css">
</style>
