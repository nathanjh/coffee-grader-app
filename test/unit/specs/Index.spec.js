import 'babel-polyfill'
import { createLocalVue, shallow, mount } from 'vue-test-utils'
import Index from '@/Index'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Sessions from 'src/store/modules/sessions'
import { Toast } from 'quasar'

describe('Index.vue', () => {
  Vue.use(Vuex)
  /* add a store instance available to all tests, as vuex binding 'loggedIn' needs
  to be available to the render function (it's used in the template) */
  const store = new Vuex.Store({
    modules: { Sessions }
  })
  describe('rendered content', () => {
    it('displays the title', () => {
      const wrapper = mount(Index, { store })
      expect(wrapper.text()).to.include('Coffee Grader')
    })
    context('when logged in', () => {
      let wrapper, signOutHandler
      beforeEach(() => {
        // mutate the store before rendering component so tests can run synchronously
        store.commit('updateAuth', {})
        store.commit('updateUser', { name: 'Johnny5' })
        signOutHandler = sinon.spy(Index.methods, 'signOut')
        wrapper = mount(Index, { store })
      })
      afterEach(() => {
        wrapper.vm.$store.commit('clearAllSessionData')
        signOutHandler.restore()
      })
      it('renders a sign-out button', () => {
        const signOutButton = wrapper.find('[data-button-type="sign-out"]')
        assert(signOutButton.is('button'))
        expect(signOutButton.text()).to.include('Sign out')
      })
      it('signOut button calls signOut method on click event', () => {
        const signOutButton = wrapper.find('[data-button-type="sign-out"]')
        signOutButton.trigger('click')
        assert(signOutHandler.calledOnce)
      })
      context('when currentUser object has an image property', () => {
        it("renders the user's image in the header", done => {
          wrapper.vm.$store.commit('updateUser', { image: 'noice-pic' })
          wrapper.vm.$nextTick(() => {
            const avatar = wrapper.find('[data-img-type="avatar"]')
            assert(avatar.is('img'))
            expect(avatar.element.getAttribute('src')).to.equal('noice-pic')
            done()
          })
        })
      })
      context('when no currentUser.image available', () => {
        it('renders a generic user icon in the header', () => {
          const acctIcon = wrapper.find('[data-icon-type="account"]')
          assert(acctIcon.is('i'))
          expect(acctIcon.text()).to.equal('account_circle')
        })
      })
    })
    context('when not logged in', () => {
      it('renders a sign-in button', () => {
        const wrapper = mount(Index, { store })
        const signInButton = wrapper.find('[data-button-type="sign-in"]')
        assert(signInButton.is('button'))
        expect(signInButton.text()).to.include('Sign in')
      })
      it('signIn button calls triggerModal method on click event', () => {
        const handler = sinon.stub(Index.methods, 'triggerModal')
        const wrapper = mount(Index, { store })
        const signInButton = wrapper.find('[data-button-type="sign-in"]')
        signInButton.trigger('click')
        assert(handler.called)
        handler.restore()
      })
    })
  })
  describe('computed properties', () => {
    it('has a loggedIn property', () => {
      expect(Index.computed.loggedIn).to.be.a('function')
    })
    it('has a currentUser property', () => {
      expect(Index.computed.currentUser).to.be.a('function')
    })
  })
  describe('methods', () => {
    describe('vuex mutations', () => {
      it('maps the updateAuth mutation to a method', () => {
        expect(Index.methods.updateAuth).to.be.a('function')
      })
      it('maps the clearAllSessionData mutation to a method', () => {
        expect(Index.methods.clearAllSessionData).to.be.a('function')
      })
    })
    describe('vuex actions', () => {
      it('maps the setUserFromOAuth action to a method', () => {
        expect(Index.methods.setUserFromOAuth).to.be.a('function')
      })
    })
    describe('signOut', () => {
      it('commits the clearAllSessionData mutation', () => {
        const spy = sinon.spy(Index.methods, 'clearAllSessionData')
        const wrapper = shallow(Index, { store })
        wrapper.vm.signOut()
        assert(spy.calledOnce)
        spy.restore()
      })
      it('creates a quasar Toast', () => {
        const spy = sinon.spy(Toast, 'create')
        const wrapper = shallow(Index, { store })
        wrapper.vm.signOut()
        assert(spy.calledOnce)
        spy.restore()
      })
    })
    describe('triggerModal', () => {
      it('sets the modalOpen data property to true', () => {
        const wrapper = shallow(Index, { store })
        expect(wrapper.vm.$data.modalOpen).to.equal(false)
        wrapper.vm.triggerModal()
        expect(wrapper.vm.$data.modalOpen).to.equal(true)
      })
      it('resets modalOpen to false in 500ms', done => {
        const wrapper = shallow(Index, { store })
        wrapper.vm.triggerModal()
        setTimeout(() => {
          expect(wrapper.vm.$data.modalOpen).to.equal(false)
          done()
        }, 500)
      })
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(Index.data).to.be.a('function')
      expect(Index.data()).to.be.a('object')
    })
    it('has a boolean type modalOpen property', () => {
      expect(Index.data().modalOpen).to.be.a('boolean')
    })
    it('modalOpen has an initial value of false', () => {
      expect(Index.data().modalOpen).to.equal(false)
    })
  })
  describe('props', () => {
    it('has an authHeaders prop', () => {
      const wrapper = shallow(Index, { store })
      expect(wrapper.hasProp('authHeaders')).to.be.true
    })
  })
  describe('lifecycle hooks', () => {
    describe('created', () => {
      it('has a created hook', () => {
        expect(Index.created).to.be.a('function')
      })
      context('with valid authHeaders prop values', () => {
        const localVue = createLocalVue()
        localVue.use(VueRouter)

        let mockHeaders, router, options

        beforeEach(() => {
          // mock headers object
          mockHeaders = {
            authToken: 'wwwww',
            clientId: 'xxxxx',
            expiry: 'yyyyy',
            uid: 'zzzzz'
          }
          router = new VueRouter({
            routes: [{ path: '/', component: Index }]
          })
          options = {
            localVue,
            store,
            router,
            propsData: {
              authHeaders: mockHeaders
            }
          }
        })
        it('calls the updateAuth mutation', () => {
          const spy = sinon.spy(Index.methods, 'updateAuth')
          shallow(Index, options)
          assert(spy.calledOnce)
          spy.restore()
        })
        it('reloads the page', () => {
          const spy = sinon.spy(router, 'push')
          shallow(Index, options)
          assert(spy.calledWith({ path: '/' }))
          spy.restore()
        })
        it('dispatches the setUserFromOAuth action', () => {
          // to force the onSuccess callback on router.push...
          const pusher = sinon.stub(router, 'push').callsArg(1)
          const stub = sinon.stub(Index.methods, 'setUserFromOAuth')
          stub.returns(Promise.resolve({username: 'test'}))
          shallow(Index, options)
          assert(stub.calledOnce)

          stub.restore()
          pusher.restore()
        })
        it('creates a quasar toast on success')
        it('creates a quasar toast on failure')
      })
      context('without vaild authHeaders prop values', () => {
        it("doesn't call the updateAuth mutation", () => {
          const mockHeaders = {
            authToken: 'wwwww',
            clientId: 'xxxxx',
            expiry: 'yyyyy',
            uid: undefined
          }
          const spy = sinon.spy(Index.methods, 'updateAuth')
          shallow(Index, {
            store,
            propsData: {
              authHeaders: mockHeaders
            }
          })
          assert(!spy.called)
          spy.restore()
        })
      })
    })
  })
})
