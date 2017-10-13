import CuppingForm from '@/cupping/forms/CuppingForm'

describe('CuppingForm.vue', () => {
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(CuppingForm.data).to.be.a('function')
      expect(CuppingForm.data()).to.be.a('object')
    })
    it('has a string type location property', () => {
      expect(CuppingForm.data().location).to.be.a('string')
    })
    it('location default value is an empty string', () => {
      expect(CuppingForm.data().location).to.equal('')
    })
    it('has a cupDate property with null initial value', () => {
      expect(CuppingForm.data().cupDate).to.equal(null)
    })
    it('has a number type cupsPerSample property', () => {
      expect(CuppingForm.data().cupsPerSample).to.be.a('number')
    })
    it('cupsPerSample default value is 3', () => {
      expect(CuppingForm.data().cupsPerSample).to.equal(3)
    })
  })
  describe('computed properties', () => {
    it('maps getter for currentUser from vuex store')
  })
  describe('methods', () => {
    describe('vuex actions', () => {
      it("maps newCupping action to local 'submitNewCupping' method")
    })
    describe('createCupping', () => {
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs')
        it('returns before dispatching submitNewCupping action if errors')
      })
    })
  })
})
