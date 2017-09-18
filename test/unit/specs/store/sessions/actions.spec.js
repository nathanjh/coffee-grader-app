import { actions } from 'src/store/modules/sessions'
import { context, api } from '../helpers'

// mock commit as a spy and check the args when successful
// think about error cases?  do we want a way to flag api mock so that it returns an error? like maybe have a separate mocked api that only returns errors, and create an 'error actions' object that uses the bad api to test error cases?
const apiResponse = {
  data: {
    user: 'AMAC'
  },
  headers: {
    'some-fancy-headers': 'xxxxxx'
  }
}
const mockSessionsApi = api(apiResponse)

const { signIn, signUp, setUserFromOAuth } = actions(mockSessionsApi)

describe('sessions module: actions', () => {
  describe('signIn', () => {
    it("commits 'updateUser' and 'updateAuth' mutations with expected payload",
      done => {
        const spy = sinon.spy(context, 'commit')
        signIn(context, {})
          .then(() => {
            assert(spy.calledWith('updateUser', apiResponse.data.user))
            assert(spy.calledWith('updateAuth', apiResponse.headers))
            done()
          })
          .catch(e => done(e))
        spy.restore()
      })
    it('returns a promise that resolves to a user object', (done) => {
      signIn(context, {})
        .then(r => {
          expect(r).to.deep.equal(apiResponse.data.user)
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('signUp', () => {
    it("commits 'updateUser' and 'updateAuth' mutations with expected payload",
      done => {
        const spy = sinon.spy(context, 'commit')
        signUp(context, {})
          .then(() => {
            assert(spy.calledWith('updateUser', apiResponse.data.user))
            assert(spy.calledWith('updateAuth', apiResponse.headers))
            done()
          })
          .catch(e => done(e))
        spy.restore()
      })
    it('returns a promise that resolves to a user object', (done) => {
      signUp(context, {})
        .then(r => {
          expect(r).to.deep.equal(apiResponse.data.user)
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('setUserFromOAuth', () => {
    it("commits 'updateUser' and 'updateAuth' mutations with expected payload",
      done => {
        const spy = sinon.spy(context, 'commit')
        setUserFromOAuth(context, {})
          .then(() => {
            assert(spy.calledWith('updateUser', apiResponse.data.user))
            assert(spy.calledWith('updateAuth', apiResponse.headers))
            done()
          })
          .catch(e => done(e))
        spy.restore()
      })

    it('returns a promise that resolves to a user object', (done) => {
      setUserFromOAuth(context, {})
        .then(r => {
          expect(r).to.deep.equal(apiResponse.data.user)
          done()
        })
        .catch(e => done(e))
    })
  })
})
