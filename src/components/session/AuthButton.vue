<template lang="html">

</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    authProvider: {
      type: String,
      required: true
    },
    providerIcon: {
      type: String,
      required: true
    },
    baseURL: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="css">
</style>
