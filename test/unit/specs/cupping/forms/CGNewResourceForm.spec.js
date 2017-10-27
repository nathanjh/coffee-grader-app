import CGNewResourceForm from '@/cupping/forms/CGNewResourceForm'

describe('CGNewResourceForm.vue', () => {
  describe('props', () => {
    const props = CGNewResourceForm.props
    const validModelProp = {
      name: 'coffee',
      attributes: ['name', 'origin', 'producer', 'variety']
    }
    it("has a required Object type 'model prop'", () => {
      expect(props.model.type).to.equal(Object)
      expect(props.model.required).to.equal(true)
    })
    it("validates 'model' object has keys 'name' and 'attributes'", () => {
      const validator = props.model.validator
      expect(validator).to.be.a('function')
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({ a: '', b: '' })).to.equal(false)
    })
    it("validates model's 'name' value is a string", () => {
      const validator = props.model.validator
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({
        name: 9000,
        attributes: []
      })).to.equal(false)
    })
    it("validates model's 'attributes' value is an array of strings", () => {
      const validator = props.model.validator
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({
        name: 'invalid',
        attributes: ['1', 2, null, 4]
      })).to.equal(false)
    })
  })
})
