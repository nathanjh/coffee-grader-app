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
      roast_date: "2017-07-16T22:52:23.155Z",
      coffee_alias: "6-241",
      coffee_id: 19,
      roaster_id: 3,
      cupping_id: 6
    }
  }
}

const mockCuppingApi = api(apiResponse)

const { newCupping, newSample } = actions(mockCuppingApi)

describe('cupping module: actions', () => {
  describe('newCupping', () => {
    it("commits 'updateCupping' mutation with expected payload", done => {
      const spy = sinon.spy(context, 'commit')
      newCupping(context, {})
        .then(() => {
          assert(spy.calledWith('updateCupping', apiResponse.data.cupping))
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
})
