// reusable validation messages mixin for Vuelidate
export const validationMessages = {
  methods: {
    requiredMessage (field, name) {
      if (!field.required) {
        return `${name} is required`
      }
    },
    invalidMessage (field, name) {
      if (field.$invalid) {
        return `${name} is invalid`
      }
    },
    minLengthMessage (field, name) {
      if (!field.minLength) {
        return `${name} must have at least ${field.$params.minLength.min} characters`
      }
    },
    confirmPasswordMessage (field) {
      if (!field.sameAsPassword) {
        return `passwords must be identical`
      }
    },
    isNumMessage (field, name) {
      if (!field.isNum) {
        return `${name} must be a number`
      }
    }
  }
}
