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
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import {
  QInput,
  QAutocomplete
} from 'quasar'

const parseCollection = (collection) => collection.map(item => {
  return {
    label: item.name,
    sublabel: item.origin,
    value: item.id
  }
})
export default {
  components: {
    QInput,
    QAutocomplete
  },
  data () {
    return {
      terms: ''
    }
  },
  methods: {
    search (terms, done) {
      CoffeeGraderApi.get('coffees/search.json', {
        params: { term: terms },
        headers: this.$store.state.sessions.auth.headers
      })
        .then(response => {
          console.log(response.data.coffees)
          done(parseCollection(response.data.coffees))
        })
        .catch(() => done([]))
    },
    selected (item) {
      console.log(item)
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
