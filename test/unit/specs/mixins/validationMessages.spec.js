import { validationMessages } from '@/mixins/validationMessages'

describe('validationMessages mixin', () => {
  describe('methods', () => {
    const {
      methods: {
        requiredMessage,
        invalidMessage,
        minLengthMessage,
        confirmPasswordMessage
      }
    } = validationMessages

    describe('requiredMessage', () => {
      context('given a field where required property is false', () => {
        const field = { required: false }
        it('returns the correct error message', () => {
          expect(requiredMessage(field, 'test'))
            .to.equal('test is required')
        })
      })
      context('given a field where required property is true', () => {
        const field = { required: true }
        it('returns undefined', () => {
          expect(requiredMessage(field, 'test'))
            .to.be.undefined
        })
      })
    })
    describe('invalidMessage', () => {
      context('given a field where $invalid property is true', () => {
        const field = { $invalid: true }
        it('returns the correct error message', () => {
          expect(invalidMessage(field, 'test'))
            .to.equal('test is invalid')
        })
      })
      context('given a field where $invalid property is false', () => {
        const field = { $invalid: false }
        it('returns undefined', () => {
          expect(invalidMessage(field, 'test'))
            .to.be.undefined
        })
      })
    })
    describe('minLengthMessage', () => {
      context('given a field where minLength property is false', () => {
        const field = {
          minLength: false,
          $params: {
            minLength: {
              min: 3
            }
          }
        }
        it('returns the correct error message', () => {
          expect(minLengthMessage(field, 'test'))
            .to.equal('test must have at least 3 characters')
        })
      })
      context('given a field where minLength property is true', () => {
        const field = { minLength: true }
        it('returns undefined', () => {
          expect(minLengthMessage(field, 'test'))
            .to.be.undefined
        })
      })
    })
    describe('confirmPasswordMessage', () => {
      context('given a field where sameAsPassword property is false', () => {
        const field = { sameAsPassword: false }
        it('returns the correct error message', () => {
          expect(confirmPasswordMessage(field))
            .to.equal('passwords must be identical')
        })
      })
      context('given a field where sameAsPassword property is true', () => {
        const field = { sameAsPassword: true }
        it('returns undefined', () => {
          expect(confirmPasswordMessage(field))
            .to.be.undefined
        })
      })
    })
  })
})
