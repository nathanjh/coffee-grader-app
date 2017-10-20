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
    }
  }
}

const mockCuppingApi = api(apiResponse)

const { newCupping } = actions(mockCuppingApi)

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
})
