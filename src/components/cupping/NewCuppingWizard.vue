<template lang="html">
  <q-stepper ref="wizard">
    <q-step
      name="cuppingForm"
      title="Let's start with some basic info about your cupping..."
    >
      <cupping-form
        @newCuppingCreated="cuppingCreated = true"
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
      title="let's all add some samples for the best fun"
    >
    </q-step>
  </q-stepper>
</template>

<script>
import CuppingForm from './forms/CuppingForm'
import {
  QStepper,
  QStep,
  QStepperNavigation,
  QBtn
} from 'quasar'

export default {
  components: {
    CuppingForm,
    QStepper,
    QStep,
    QStepperNavigation,
    QBtn
  },
  data () {
    return {
      cuppingCreated: false
    }
  }
}
</script>

<style lang="css">
</style>
