import sessions from 'src/store/modules/sessions'
const { mutations } = sessions

const { updateUser, updateAuth, clearAllSessionData } = mutations

describe('sessions module', () => {
  describe('mutations', () => {
    const authObj = {
      'access-token': 'wwwwww',
      'token-type': 'Bearer',
      'client': 'xxxxxx',
      'expiry': 'yyyyyy',
      'uid': 'zzzzzz'
    }
    const user = { name: 'Pete the Cat', username: 'groooovy' }
    const initialState = () => ({
      user: null,
      auth: {
        isLoggedIn: false,
        headers: null
      }
    })

    describe('updateUser', () => {
      it('mutates the user property', () => {
        const state = initialState()
        updateUser(state, user)
        expect(state.user).to.deep.equal(user)
      })
    })

    describe('updateAuth', () => {
      const state = initialState()
      updateAuth(state, authObj)

      it('mutates the auth headers', () => {
        expect(state.auth.headers).to.deep.equal(authObj)
      })
      it('sets the isLoggedIn property', () => {
        expect(state.auth.isLoggedIn).to.be.true
      })
    })

    describe('clearAllSessionData', () => {
      const state = initialState()

      beforeEach(() => {
        updateAuth(state, authObj)
        updateUser(state, user)
      })

      it('sets the user to null', () => {
        expect(state.user).to.deep.equal(user)
        clearAllSessionData(state)
        expect(state.user).to.be.null
      })
      it('sets auth.headers to null', () => {
        expect(state.auth.headers).to.deep.equal(authObj)
        clearAllSessionData(state)
        expect(state.auth.headers).to.be.null
      })
      it('sets auth.isLoggedIn to false', () => {
        expect(state.auth.isLoggedIn).to.be.true
        clearAllSessionData(state)
        expect(state.auth.isLoggedIn).to.be.false
      })
    })
  })
})
