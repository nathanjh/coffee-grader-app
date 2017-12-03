<template lang="html">
  <q-list id="new-cupping-summary">
    <template v-if="cuppingHasData">
      <q-list-header>
        {{ summaryTitle }}
      </q-list-header>
      <q-collapsible
        opened
        label="Basic Info"
      >
        <q-item>
          <q-item-side>location</q-item-side>
          <q-item-main>
            {{ cupping.location }}
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side>date/time</q-item-side>
          <q-item-main>
            {{ formatDate(cupping.cupDate, 'dddd, MMM D @ h:mma') }}
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side>cups/sample</q-item-side>
          <q-item-main>
            {{ cupping.cupsPerSample }}
          </q-item-main>
        </q-item>
      </q-collapsible>
      <q-collapsible class="cupping-collection"
        opened
        label="Coffee Samples"
        v-if="!!cupping.cuppedCoffees
        && cupping.cuppedCoffees.length > 0"
      >
        <q-item
          multiline
          v-for="sample in cupping.cuppedCoffees"
          :key="sample.id"
        >
          <q-item-side v-if="!!sample.coffeeAlias" class="token">
            {{ sample.coffeeAlias }}
          </q-item-side>
          <q-item-side v-else icon="local cafe"/>
          <q-item-main>
            {{ sample.coffee.name }} ({{ sample.coffee.origin }}) roasted by
            <a
              v-if="!!sample.roaster.website"
              :href="sample.roaster.website"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ sample.roaster.name }}
            </a>
            <span v-else>{{ sample.roaster.name }}</span>
            on {{ formatDate(sample.roastDate, 'M/D/YYYY')}}
          </q-item-main>
        </q-item>
      </q-collapsible>
      <q-collapsible
        opened
        label="Invites"
        v-if="!!cupping.invites
        && cupping.invites.length > 0"
      >
        <q-item
          v-for="invite in cupping.invites"
          :key="invite.id"
        >
          <q-item-side
            v-if="!!invite.grader && !!invite.grader.image"
            :avatar="invite.grader.image"
          />
          <q-item-side
            v-else
            :icon="!!invite.grader ? 'person' : 'contact mail'"
          />
          <q-item-main>
            {{ !!invite.grader
               ? invite.grader.name
               : invite.graderEmail }}
               {{ !!invite.grader && !!invite.grader.username
                  ? `(${invite.grader.username})`
                  : '' }}
          </q-item-main>
        </q-item>
      </q-collapsible>
    </template>
    <q-item v-else>
      <q-item-main class="text-center text-italic">
        Use the form to create a new cupping...
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmptyObject } from 'src/utils/utils'
import {
  date,
  QList,
  QListHeader,
  QCollapsible,
  QItem,
  QItemSide,
  QItemTile,
  QItemMain,
  QItemSeparator
} from 'quasar'

export default {
  components: {
    QList,
    QListHeader,
    QCollapsible,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QItemSeparator
  },
  computed: {
    ...mapGetters({
      cupping: 'cupping',
      host: 'currentUser'
    }),
    cuppingHasData () {
      return !isEmptyObject(this.cupping)
    },
    summaryTitle () {
      const hostNameExists = (!!this.host && !!this.host.name)

      return hostNameExists
        ? `${this.host.name}'s cupping`
        : 'Your new cupping so far...'
    }
  },
  methods: {
    formatDate (timeStamp, formatStr) {
      return date.formatDate(timeStamp, formatStr)
    }
  }
}
</script>

<style lang="stylus">
  @import '~variables'

  #new-cupping-summary
    &.q-list
      background-color $blue-grey-1
    .q-item-label
      font-style italic
      text-align center
      letter-spacing .1rem
      color $blue-grey-9
    .q-item-link
      background-image linear-gradient(to right bottom, $blue-grey-2, $blue-1)
    .q-collapsible-sub-item
      background-image linear-gradient(to right top, $grey-2, $blue-grey-1)

  .cupping-collection .q-item-side-left
    overflow-wrap break-word
</style>
