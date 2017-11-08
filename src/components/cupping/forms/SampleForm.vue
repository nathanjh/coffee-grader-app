<template lang="html">
  <div>
    <!-- render a summary list instead of this spanny nonsense -->
    <q-slide-transition>
      <q-list
      class="fixed-bottom"
      :multiline="true"
      :dense="true"
      v-if="form.coffeeId"
      >
        <q-list-header>Summary</q-list-header>
        <q-item v-if="coffeeInfo.name">
          <q-item-side class="text-grey-7">
            Coffee:
          </q-item-side>
          <q-item-main class="text-italic text-grey-7">
            {{ coffeeInfo.name }} ({{ coffeeInfo.origin }})
          </q-item-main>
        </q-item>
        <q-item v-if="roasterInfo.name">
          <q-item-side class="text-grey-7">
            Roasted by:
          </q-item-side>
          <q-item-main class="text-italic text-grey-7">
            {{ roasterInfo.name }} ({{ roasterInfo.origin }})
          </q-item-main>
        </q-item>
        <q-item v-if="form.roastDate">
          <span class="text-italic text-grey-7">
            On: {{ form.roastDate }}
          </span>
        </q-item>
        <q-item v-if="form.coffeeAlias">
          <span class="text-italic text-grey-7">
            As:
          </span>
          {{ form.coffeeAlias }}
        </q-item>
      </q-list>
    </q-slide-transition>
    <q-field>
      <c-g-autocomplete
        id="coffee-autocomplete"
        ref="coffeeAutocomplete"
        data-autocomplete-type="coffee"
        :model="'coffee'"
        :sublabel="'origin'"
        @itemSelected="itemSelectedHandler('coffee', $event)"
        @noResults="coffeeNotFound = true"
      />
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
    </q-field>
    <q-modal ref="coffeeModal" :content-css="{minHeight: '72vh', minWidth: '50vw'}">
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
          :model="newCoffeeProps.model"
          :validates="newCoffeeProps.validations"
          @coffeeCreated="resourceCreatedHandler('coffee', $event)"
        />
      </q-modal-layout>
    </q-modal>
    <q-field>
      <c-g-autocomplete
        id="roaster-autocomplete"
        ref="roasterAutocomplete"
        data-autocomplete-type="roaster"
        :model="'roaster'"
        :sublabel="'location'"
        @itemSelected="itemSelectedHandler('roaster', $event)"
        @noResults="roasterNotFound = true"
      />
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
    </q-field>
    <q-modal ref="roasterModal" :content-css="{minHeight: '72vh', minWidth: '50vw'}">
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
          :model="newRoasterProps.model"
          :validates="newRoasterProps.validations"
          @roasterCreated="resourceCreatedHandler('roaster', $event)"
        />
      </q-modal-layout>
    </q-modal>

  </div>
</template>

<script>
import CGAutocomplete from './CGAutocomplete'
import CGNewResourceForm from './CGNewResourceForm'
import {
  Toast,
  QField,
  QModal,
  QModalLayout,
  QToolbar,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QBtn,
  QSlideTransition
} from 'quasar'

export default {
  components: {
    CGAutocomplete,
    CGNewResourceForm,
    QField,
    QModal,
    QModalLayout,
    QToolbar,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QBtn,
    QSlideTransition
  },
  data () {
    return {
      form: {
        roastDate: null,
        coffeeAlias: '',
        coffeeId: null,
        roasterId: null,
        cuppingId: this.$store.getters.cupping.id
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
      roasterNotFound: false,
      coffeeInfo: {
        name: '',
        origin: ''
      },
      roasterInfo: {
        name: '',
        origin: ''
      }
    }
  },
  methods: {
    itemSelectedHandler (context, payload) {
      this[`${context}NotFound`] = false
      if (payload && payload.id) {
        this.form[`${context}Id`] = payload.id
        this[`${context}Info`].name = payload.label
        this[`${context}Info`].origin = payload.sublabel
      }
    },
    resourceCreatedHandler (context, payload) {
      this.form[`${context}Id`] = payload[context].id
      this.$refs[`${context}Modal`].close()
      Toast.create
        .positive(`Successfully added ${payload[context].name}!`)
      this.$refs[`${context}Autocomplete`].clearInput()
      this[`${context}NotFound`] = false
      // set the info data property
      this[`${context}Info`].name = payload[context].name
      this[`${context}Info`].origin =
        payload[context].origin || payload[context].location
    }
  }
}
</script>

<style lang="css">
</style>
