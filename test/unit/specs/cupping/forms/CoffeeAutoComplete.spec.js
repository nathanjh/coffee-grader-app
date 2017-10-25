import CoffeeAutoComplete from '@/cupping/forms/CoffeeAutoComplete'

describe('CoffeeAutoComplete.vue', () => {
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(CoffeeAutoComplete.data).to.be.a('function')
      expect(CoffeeAutoComplete.data()).to.be.a('object')
    })
    it('has a String type terms property', () => {
      expect(CoffeeAutoComplete.data().terms).to.be.a('string')
    })
    it('terms default value is an empty string', () => {
      expect(CoffeeAutoComplete.data().terms).to.equal('')
    })
  })
  describe('methods', () => {
    describe('search', () => {
      it('is a function', () => {
        expect(CoffeeAutoComplete.methods.search).to.be.a('function')
      })
    })
    describe('selected', () => {
      it('is a function', () => {
        expect(CoffeeAutoComplete.methods.selected).to.be.a('function')
      })
    })
  })
})
