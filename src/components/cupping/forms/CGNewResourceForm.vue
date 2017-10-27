<template lang="html">

</template>

<script>
/* generic 'new' resource form
   - meant to handle coffees, roasters, etc. */
export default {
  props: {
    model: {
      type: Object,
      required: true,
      validator: function (model) {
        return ['name', 'attributes']
          .every(k => Object.keys(model).includes(k)) &&
        typeof model['name'] === 'string' &&
        Array.isArray(model['attributes']) &&
        model['attributes'].every(i => typeof i === 'string')
      }
    }
  }
}
</script>

<style lang="css">
</style>
