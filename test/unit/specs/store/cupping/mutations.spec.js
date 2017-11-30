import { mutations } from 'src/store/modules/cupping'
const {
  setCupping,
  updateCupping,
  clearCupping,
  addSample,
  addInvite
} = mutations

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
  const cuppedCoffee = {
    id: 2,
    roast_date: '2017-07-16T22:52:23.155Z',
    coffee_alias: '6-241',
    coffee_id: 19,
    roaster_id: 3,
    cupping_id: 6
  }
  const invite = {
    id: 55,
    status: 'pending',
    cupping_id: 1,
    grader_id: 22
  }
  describe('setCupping', () => {
    it('mutates the cupping property', () => {
      const state = initialState()
      setCupping(state, cupping)
      expect(state.cupping).to.deep.equal(cupping)
    })
  })
  describe('updateCupping', () => {
    let state
    beforeEach(() => {
      state = initialState()
      setCupping(state, cupping)
    })
    context('given an object with valid keys', () => {
      it('updates specific cupping property values', () => {
        expect(state.cupping.cupsPerSample).to.equal(3)
        const updates = {
          location: 'new location',
          cupsPerSample: 5
        }

        updateCupping(state, updates)
        expect(state.cupping.cupsPerSample).to.equal(updates.cupsPerSample)
        expect(state.cupping.location).to.equal(updates.location)
      })
    })
    // make sure it doesnt update if given bad keys
    context('given an object with invalid keys', () => {
      const mixedBag = {
        cupsPerSample: 7,
        badKey: 'badValue'
      }
      it('ignores invalid keys/values', () => {
        updateCupping(state, mixedBag)
        expect(Object.keys(state.cupping)).not.to.include('badKey')
      })
      it('still updates any valid keys given', () => {
        updateCupping(state, mixedBag)
        expect(state.cupping.cupsPerSample).to.equal(mixedBag.cupsPerSample)
      })
    })
  })
  describe('clearCupping', () => {
    it('sets the cupping property to an empty object', () => {
      const state = initialState()
      setCupping(state, cupping)
      expect(state.cupping).to.deep.equal(cupping)
      clearCupping(state)
      expect(state.cupping).to.deep.equal({})
    })
  })
  describe('addSample', () => {
    it("adds a cuppedCoffee (or 'sample') to the cuppings cuppedCoffees collection", () => {
      const state = initialState()
      // first add a cupping...
      setCupping(state, cupping)
      assert(state.cupping.cuppedCoffees.length === 0)
      addSample(state, cuppedCoffee)
      expect(state.cupping.cuppedCoffees.length).to.equal(1)
      expect(state.cupping.cuppedCoffees[0]).to.deep.equal(cuppedCoffee)
    })
  })
  describe('addInvite', () => {
    it("adds an invite to the cupping's invites collection", () => {
      const state = initialState()
      setCupping(state, cupping)
      assert(state.cupping.invites.length === 0)
      addInvite(state, invite)
      expect(state.cupping.invites.length).to.equal(1)
      expect(state.cupping.invites[0]).to.deep.equal(invite)
    })
  })
})
