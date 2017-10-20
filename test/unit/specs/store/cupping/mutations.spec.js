import { mutations } from 'src/store/modules/cupping'
const { updateCupping, clearCupping } = mutations

describe('cupping module: mutations', () => {
  const initialState = () => ({
    cupping: {}
  })
  const cupping = {
    id: 1,
    location: 'Cafe Grumpy Chelsea circa 2009',
    cupDate: 'Fri Oct 13 2017 20:01:59 GMT-0700 (PDT)',
    cupsPerSample: 3,
    host_id: 224,
    open: true,
    cuppedCoffees: [],
    scores: [],
    invites: []
  }
  describe('updateCupping', () => {
    it('mutates the cupping property', () => {
      const state = initialState()
      updateCupping(state, cupping)
      expect(state.cupping).to.deep.equal(cupping)
    })
  })
  describe('clearCupping', () => {
    it('sets the cupping property to an empty object', () => {
      const state = initialState()
      updateCupping(state, cupping)
      expect(state.cupping).to.deep.equal(cupping)
      clearCupping(state)
      expect(state.cupping).to.deep.equal({})
    })
  })
})
