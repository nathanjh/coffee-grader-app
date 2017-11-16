<template lang="html">
  <div>
    <p class="text-grey-9">
      Please add as many samples as you'd like...
      <small>(at least one)</small>
    </p>
    <q-field
      data-field-type="coffee"
      :error="$v.form.coffeeId.$error"
      :error-label="requiredMessage($v.form.coffeeId, 'coffee')"
    >
      <c-g-autocomplete
        id="coffee-autocomplete"
        ref="coffeeAutocomplete"
        data-autocomplete-type="coffee"
        :model="'coffee'"
        :sublabel="'origin'"
        @itemSelected="itemSelectedHandler('coffee', $event)"
        @noResults="coffeeNotFound = true"
        @inputCleared="form.coffeeId = null"
      />
    </q-field>
    <label
      for="coffee-autocomplete"
      class="text-grey-7 text-italic"
    >
      <div v-if="coffeeNotFound">
        couldn't find that coffee...
        <span>
          <a
            @click.prevent="$refs.coffeeModal.open()"
            data-link-type="new-coffee"
          >
            click to add a new one
          </a>
        </span>
      </div>
      <div v-else>
        find a coffee by name, origin, or producer
      </div>
    </label>
    <q-modal
      ref="coffeeModal"
      :content-css="{minHeight: '72vh', minWidth: '50vw'}"
      @close="$refs.newCoffeeForm.clearForm()"
    >
      <q-modal-layout>
        <q-toolbar slot="header" class="bg-light text-teal-5">
          <div class="q-toolbar-title text-center">
            Add a new Coffee
          </div>
          <q-btn
            flat round small
            @click.prevent="$refs.coffeeModal.close()"
            data-button-type="coffee-modal-close"
            icon="close"
          />
        </q-toolbar>
        <c-g-new-resource-form
          ref="newCoffeeForm"
          :model="newCoffeeProps.model"
          :validates="newCoffeeProps.validations"
          @coffeeCreated="resourceCreatedHandler('coffee', $event)"
        />
      </q-modal-layout>
    </q-modal>
    <q-field
      data-field-type="roaster"
      :error="$v.form.roasterId.$error"
      :error-label="requiredMessage($v.form.roasterId, 'roaster')"
    >
      <c-g-autocomplete
        id="roaster-autocomplete"
        ref="roasterAutocomplete"
        data-autocomplete-type="roaster"
        :model="'roaster'"
        :sublabel="'location'"
        @itemSelected="itemSelectedHandler('roaster', $event)"
        @noResults="roasterNotFound = true"
        @inputCleared="form.roasterId = null"
      />
    </q-field>
    <label
      for="roaster-autocomplete"
      class="text-grey-7 text-italic"
    >
      <div v-if="roasterNotFound">
        couldn't find that roaster...
        <span>
          <a
            @click.prevent="$refs.roasterModal.open()"
            data-link-type="new-roaster"
          >
            click to add a new one
          </a>
        </span>
      </div>
      <div v-else>
        find a roaster by name or location
      </div>
    </label>
    <q-modal
      ref="roasterModal"
      :content-css="{minHeight: '72vh', minWidth: '50vw'}"
      @close="$refs.newRoasterForm.clearForm()"
    >
      <q-modal-layout>
        <q-toolbar slot="header" class="bg-light text-teal-5">
          <div class="q-toolbar-title text-center">
            Add a new Roaster
          </div>
          <q-btn
            flat round small
            @click.prevent="$refs.roasterModal.close()"
            data-button-type="roaster-modal-close"
            icon="close"
          />
        </q-toolbar>
        <c-g-new-resource-form
          ref="newRoasterForm"
          :model="newRoasterProps.model"
          :validates="newRoasterProps.validations"
          @roasterCreated="resourceCreatedHandler('roaster', $event)"
        />
      </q-modal-layout>
    </q-modal>
    <div class="row">
      <q-field
        id="roast-date"
        class="col-12"
        data-field-type="roast-date"
        :error="$v.form.roastDate.$error"
        :error-label="requiredMessage($v.form.roastDate, 'roast date')"
      >
        <q-datetime
          type="date"
          v-model="form.roastDate"
          float-label="roast date"
          format="dddd, MMM D YYYY"
          color="amber"
        />
      </q-field>
      <label
        for="roast-date"
        class="text-grey-7 text-italic"
      >
        select a roast date
      </label>
      <q-field
        class="col-12"
        data-field-type="alias"
        id="coffee-alias"
      >
        <q-input
          float-label="coffee alias"
          v-model="form.coffeeAlias"
          color="amber"
          :clearable="true"
        />
      </q-field>
      <label
        for="coffee-alias"
        class="text-grey-7 text-italic"
      >
        choose an alias for blind cuppings
      </label>
    </div>
    <div class="row justify-end" :style="{'padding-right': '5px', 'padding-top': '10px'}">
        <q-btn
          class="col-3"
          :outline="true"
          data-button-type="submit-new-sample"
          @click.prevent="createSample"
          color="grey-7"
        >
          Submit
        </q-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { validationMessages } from '@/mixins/validationMessages'
import CGAutocomplete from './CGAutocomplete'
import CGNewResourceForm from './CGNewResourceForm'
import {
  date,
  Toast,
  QField,
  QInput,
  QModal,
  QModalLayout,
  QToolbar,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QDatetime,
  QBtn,
  QSlideTransition
} from 'quasar'

const { formatDate } = date

export default {
  name: 'SampleForm',
  mixins: [validationMessages],
  components: {
    CGAutocomplete,
    CGNewResourceForm,
    QField,
    QInput,
    QModal,
    QModalLayout,
    QToolbar,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QDatetime,
    QBtn,
    QSlideTransition
  },
  data () {
    return {
      form: {
        roastDate: null,
        coffeeAlias: '',
        coffeeId: null,
        roasterId: null
      },
      newCoffeeProps: {
        model: {
          name: 'coffee',
          attributes: [
            'name',
            'origin',
            'producer',
            'variety'
          ]
        },
        validations: {
          name: { required: true },
          origin: { required: true },
          producer: { required: true }
        }
      },
      newRoasterProps: {
        model: {
          name: 'roaster',
          attributes: [
            'name',
            'location',
            'website'
          ]
        },
        validations: {
          name: { required: true },
          location: { required: true }
        }
      },
      coffeeNotFound: false,
      roasterNotFound: false
    }
  },
  validations: {
    form: {
      roastDate: { required },
      coffeeId: { required },
      roasterId: { required }
    }
  },
  methods: {
    ...mapActions({
      submitNewSample: 'newSample'
    }),
    itemSelectedHandler (context, payload) {
      this[`${context}NotFound`] = false
      if (payload && payload.id) {
        this.form[`${context}Id`] = payload.id
      }
    },
    resourceCreatedHandler (context, payload) {
      this.form[`${context}Id`] = payload[context].id
      this.$refs[`${context}Modal`].close()
      Toast.create
        .positive(`Successfully added ${payload[context].name}!`)
      this.$refs[`${context}Autocomplete`].terms =
        `${payload[context].name} (${payload[context].origin ||
                                     payload[context].location})`
      this[`${context}NotFound`] = false
    },
    formatDate,
    createSample () {
      this.$v.form.$touch()
      if (this.$v.form.$error) return

      this.submitNewSample(this.form)
        .then(response => {
          this.$emit('newSampleAdded')
          this.clearAllFields()
          Toast.create
            .positive("Successfully added sample. Feel free to add as many as you'd like!")
        })
        .catch(error => {
          console.log(error)
        })
    },
    clearAllFields () {
      this.$refs.coffeeAutocomplete.clearInput()
      this.$refs.roasterAutocomplete.clearInput()
      for (const field in this.form) this.form[field] = ''
      this.$v.form.$reset()
    }
  }
}
</script>

<style lang="css">
</style>
