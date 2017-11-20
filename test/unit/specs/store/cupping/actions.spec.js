// import 'babel-polyfill'
import { actions } from 'src/store/modules/cupping'
import { api, context } from '../helpers'

const apiResponse = {
  data: {
    cupping: {
      id: 13,
      location: 'the fireside',
      cupDate: '2017-10-16T19:52:10.000Z',
      cupsPerSample: 5,
      hostId: 10,
      open: true,
      cuppedCoffees: [],
      scores: [],
      invites: []
    },
    cuppedCoffee: {
      id: 2,
      roast_date: '2017-07-16T22:52:23.155Z',
      coffee_alias: '6-241',
      coffee_id: 19,
      roaster_id: 3,
      cupping_id: 6
    },
    invite: {
      id: 76,
      status: 'pending',
      cupping_id: 33,
      grader_id: 900
    }
  }
}

const mockCuppingApi = api(apiResponse)

const {
  newCupping,
  newSample,
  newInvite,
  patchCupping
} = actions(mockCuppingApi)

describe('cupping module: actions', () => {
  describe('newCupping', () => {
    it("commits 'setCupping' mutation with expected payload", done => {
      const spy = sinon.spy(context, 'commit')
      newCupping(context, {})
        .then(() => {
          assert(spy.calledWith('setCupping', apiResponse.data.cupping))
          done()
        })
        .catch(e => done(e))
      spy.restore()
    })
    it('returns a promise that resolves to a cupping object', done => {
      newCupping(context, {})
        .then(r => {
          expect(r).to.deep.equal(apiResponse.data.cupping)
          done()
        })
        .catch(e => done(e))
    })
  })
  describe('patchCupping', () => {
    const updateData = {
      location: 'new location',
      cupsPerSample: 2
    }
    it("commits 'updateCupping' mutation with expected payload", done => {
      const spy = sinon.spy(context, 'commit')
      patchCupping(context, updateData)
        .then(() => {
          assert(spy.calledWith('updateCupping', updateData))
          done()
        })
        .catch(e => done(e))
      spy.restore()
    })
    it('returns a promise that resolves to updated data', done => {
      patchCupping(context, updateData)
        .then(r => {
          expect(r).to.deep.equal(updateData)
          done()
        })
        .catch(e => done(e))
    })
  })
  describe('newSample', () => {
    it("commits 'addSample' mutation with expected payload", async function () {
      const spy = sinon.spy(context, 'commit')
      await newSample(context, {})
      expect(spy.calledWith('addSample', apiResponse.data.cuppedCoffee))
        .to.be.true
      spy.restore()
    })
    it('returns a promise that resolves to a cuppedCoffee object', async function () {
      const response = await newSample(context, {})
      expect(response).to.deep.equal(apiResponse.data.cuppedCoffee)
    })
  })
  describe('newInvite', () => {
    it("commits 'addInvite' mutation with expected payload", async function () {
      const spy = sinon.spy(context, 'commit')
      await newInvite(context, {})
      expect(spy.calledWith('addInvite', apiResponse.data.invite))
        .to.be.true
      spy.restore()
    })
    it('returns a promise that resolves to an invite object', async function () {
      const response = await newInvite(context, {})
      expect(response).to.deep.equal(apiResponse.data.invite)
    })
  })
})
