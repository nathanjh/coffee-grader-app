<template lang="html">
  <q-stepper
    ref="wizard"
    :vertical="true"
  >
    <q-step
      title="Time/Place"
    >
      <cupping-form
        @newCuppingCreated="$refs.wizard.next()"
        data-form-type="cupping-form"
      />
      <q-stepper-navigation class="row justify-center">
        <q-btn
          v-if="cuppingCreated"
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
        @newSampleAdded="test('woot')"
      />
      <q-stepper-navigation class="row justify-center">
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
      <invite-form
        @newInviteAdded="test('wootywoot')"
      />
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
      cuppingCreated: true,
      sampleAdded: true,
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
    test (thing) { console.log(thing) }
  }
}
</script>

<style lang="css">
</style>
