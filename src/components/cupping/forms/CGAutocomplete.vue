<template lang="html">
  <div>
    <q-input
      color="amber"
      v-model="terms"
      :float-label="model"
      :clearable="true"
      @change="notifyIfCleared"
      :data-input-type="model"
    >
      <q-autocomplete
      @search="search"
      :min-characters="3"
      @selected="selected"
      :debounce="500"
      />
    </q-input>
  </div>
</template>

<script>
/* wrapper component for QAutocomplete
   - meant to handle users, coffees, roasters queries */
import { mapGetters } from 'vuex'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import {
  QSearch,
  QInput,
  QAutocomplete
} from 'quasar'

export default {
  name: 'CGAutocomplete',
  components: {
    QSearch,
    QInput,
    QAutocomplete
  },
  props: {
    model: {
      type: String,
      required: true,
      validator: function (value) {
        return [
          'coffee',
          'roaster',
          'user'
        ].indexOf(value) !== -1
      }
    },
    sublabel: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      terms: ''
    }
  },
  computed: {
    ...mapGetters(['authHeaders'])
  },
  methods: {
    parseCollection (collection, sublabel) {
      return collection.map(item => {
        return {
          label: item.name,
          sublabel: item[sublabel],
          value: (function () {
            return item[sublabel] ? `${item.name} (${item[sublabel]})`
              : item.name
          })(),
          id: item.id
        }
      })
    },
    search (terms, done) {
      CoffeeGraderApi.get(`${this.model}s/search.json`, {
        params: { term: terms },
        headers: this.authHeaders
      })
        .then(response => {
          console.log(response.data[`${this.model}s`])
          const collection = response.data[`${this.model}s`]
          if (collection.length === 0) {
            this.$emit('noResults')
            done([])
          }
          done(this.parseCollection(collection, this.sublabel))
        })
        .catch(() => done([]))
    },
    selected (item) {
      console.log(item)
      this.$emit('itemSelected', item)
    },
    clearInput () {
      this.terms = ''
    },
    notifyIfCleared (val) {
      if (val !== '') return
      this.$emit('inputCleared')
    }
  }
}
</script>

<style lang="css">
</style>
