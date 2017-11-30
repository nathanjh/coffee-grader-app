<template lang="html">
  <q-stepper
    ref="wizard"
    :vertical="true"
  >
    <q-step
      title="Time/Place"
    >
      <cupping-form
        @newCuppingCreated="cuppingCreatedHandler"
        data-form-type="cupping-form"
      />
      <q-stepper-navigation
        class="row justify-center"
        v-if="cuppingCreated"
      >
        <q-btn
          class="col-4"
          @click="$refs.wizard.next()"
        >
          next
        </q-btn>
      </q-stepper-navigation>
    </q-step>
    <q-step
      title="Add Samples"
    >
      <sample-form
        @newSampleAdded="sampleAddedHandler"
      />
      <q-stepper-navigation class="row justify-center">
        <q-btn
          class="col-4"
          @click="$refs.wizard.previous()"
        >
          back
        </q-btn>
        <q-btn
          v-if="sampleAdded"
          class="col-4"
          @click="$refs.wizard.next()"
        >
          next
        </q-btn>
      </q-stepper-navigation>
    </q-step>
    <q-step
      title="Invite Coffee-Friends"
    >
      <invite-form/>
      <q-stepper-navigation class="row justify-center">
        <q-btn
          class="col-4"
          @click="$refs.wizard.previous()"
        >
          back
        </q-btn>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<script>
import CuppingForm from './forms/CuppingForm'
import SampleForm from './forms/SampleForm'
import InviteForm from './forms/InviteForm'
import {
  QStepper,
  QStep,
  QStepperNavigation,
  QBtn
} from 'quasar'

export default {
  components: {
    CuppingForm,
    SampleForm,
    InviteForm,
    QStepper,
    QStep,
    QStepperNavigation,
    QBtn
  },
  data () {
    return {
      cuppingCreated: false,
      sampleAdded: false,
      coffeeModel: {
        name: 'coffee',
        attributes: [
          'name',
          'origin',
          'producer',
          'variety'
        ]
      },
      coffeeValidations: {
        name: { required: true },
        origin: { required: true },
        producer: { required: true }
      }
    }
  },
  methods: {
    test (thing) { console.log(thing) },
    sampleAddedHandler () {
      if (!this.sampleAdded) this.sampleAdded = true
    },
    cuppingCreatedHandler () {
      this.cuppingCreated = true
      this.$refs.wizard.next()
    }
  }
}
</script>

<style lang="css">
</style>
