import 'babel-polyfill'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import store from 'src/store/store'

describe('response interceptors', () => {
  context('on successful http response', () => {
    const authHandler =
      CoffeeGraderApi.interceptors.response.handlers[0]
    let mutationSpy

    beforeEach(() => {
      mutationSpy = sinon.stub(store, 'commit')
    })

    afterEach(() => {
      mutationSpy.restore()
    })

    it('commits the updateAuth mutation to set headers', () => {
      const authHeaders = { 'access-token': 'xxxxxx' }

      authHandler.fulfilled({
        headers: authHeaders
      })
      expect(mutationSpy.calledWith('updateAuth', authHeaders))
        .to.be.true
    })
  })
})
