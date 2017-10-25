<template lang="html">
  <div>
    <q-input color="amber" v-model="terms" placeholder="coffee">
      <q-autocomplete
      @search="search"
      :min-characters="3"
      @selected="selected"
      :debounce="1000"
      />
    </q-input>
    <button @click="testCall">test</button>
  </div>
</template>

<script>
/* wrapper component for QAutocomplete
   - meant to handle users, coffees, roasters queries */
import { mapGetters } from 'vuex'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import {
  QInput,
  QAutocomplete
} from 'quasar'

export default {
  name: 'CGAutocomplete',
  components: {
    QInput,
    QAutocomplete
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
          value: item.name,
          id: item.id
        }
      })
    },
    search (terms, done) {
      CoffeeGraderApi.get('coffees/search.json', {
        params: { term: terms },
        headers: this.authHeaders
      })
        .then(response => {
          console.log(response.data.coffees)
          const coffees = response.data.coffees
          if (coffees.length === 0) {
            this.$emit('noResults')
            done([])
          }
          done(this.parseCollection(response.data.coffees, 'origin'))
        })
        .catch(() => done([]))
    },
    selected (item) {
      console.log(item)
      this.$emit('itemSelected', item)
    },
    testCall () {
      CoffeeGraderApi.get('cuppings/17.json', {
        headers: this.$store.state.sessions.auth.headers
      })
        .then(response => console.log(response))
        .catch(e => console.log(e))
    }
  }
}
</script>

<style lang="css">
</style>
