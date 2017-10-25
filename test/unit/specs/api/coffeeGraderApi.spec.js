import 'babel-polyfill'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import store from 'src/store/store'

describe('response interceptors', () => {
  context('on successful http response', () => {
    const authHandler =
      CoffeeGraderApi.interceptors.response.handlers[0]
    let mutationSpy

    beforeEach(() => {
      mutationSpy = sinon.spy(store, 'commit')
    })

    afterEach(() => {
      mutationSpy.restore()
    })
    context('when signing up/ in (store.isLoggedIn == false)', () => {
      context('when access-token response header is received', () => {
        it('commits the updateauth mutation to set headers', () => {
          const authHeaders = { 'access-token': 'xxxxxx' }

          authHandler.fulfilled({
            headers: authHeaders
          })
          expect(mutationSpy.calledWith('updateAuth', authHeaders))
            .to.be.true
        })
      })
      context('when access-token response header is not received', () => {
        it("doesn't commit the updateAuth mutation", () => {
          const authHeaders = {}
          authHandler.fulfilled({
            headers: authHeaders
          })
          expect(mutationSpy.calledWith('updateAuth', authHeaders))
            .to.be.false
        })
      })
    })
    context('when logged in (store.isLoggedIn == true)', () => {
      let oldAuthHeaders
      beforeEach(() => {
        oldAuthHeaders = {
          'access-token': 'WN_0REV0XirpTOmHtTqeNA',
          'client': 'MviFSY919cNzsvaXpNArDg',
          'expiry': '1510000000',
          'token-type': 'Bearer',
          'uid': 'test@test.test'
        }
        store.commit('updateAuth', oldAuthHeaders)
      })
      afterEach(() => store.commit('clearAllSessionData'))
      context('when access-token header is received', () => {
        context('when expiry response header is newer (greater) stored expiry header', () => {
          it('commits the updateAuth mutation to set headers', () => {
            const newAuthHeaders = {
              'access-token': 'Dv-893cfjeiw9FLL_5tw',
              'expiry': '1510000001'
            }

            authHandler.fulfilled({
              headers: newAuthHeaders
            })
            expect(mutationSpy.calledWith('updateAuth', newAuthHeaders))
              .to.be.true
          })
        })
        context('when expiry response header is older (less than) stored expiry header', () => {
          it("doesn't commit the updateAuth mutation", () => {
            const newAuthHeaders = {
              'access-token': 'Dv-893cfjeiw9FLL_5tw',
              'expiry': '1509999999'
            }

            authHandler.fulfilled({
              headers: newAuthHeaders
            })
            expect(mutationSpy.calledWith('updateAuth', newAuthHeaders))
              .to.be.false
          })
        })
      })
      context('when access-token response header is not received', () => {
        it("doesn't commit the updateAuth mutation", () => {
          const authHeaders = { 'x-some-other-header': 'test_value' }

          authHandler.fulfilled({
            headers: authHeaders
          })
          expect(mutationSpy.calledWith('updateAuth', authHeaders))
            .to.be.false
        })
      })
    })
  })
})
