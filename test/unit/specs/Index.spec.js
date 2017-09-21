import 'babel-polyfill'
import { createLocalVue, mount } from 'vue-test-utils'
import Index from '@/Index'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Sessions from 'src/store/modules/sessions'
import { Toast } from 'quasar'

describe('Index.vue', () => {
  Vue.use(Vuex)

  describe('rendered content', () => {
    it('displays the title', () => {
      const wrapper = mount(Index)

      expect(wrapper.text()).to.include('Coffee Grader')
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
      let store
      before(() => {
        store = new Vuex.Store({
          modules: { Sessions }
        })
      })
      it('commits the clearAllSessionData mutation', () => {
        const spy = sinon.spy(Index.methods, 'clearAllSessionData')
        const wrapper = mount(Index, { store })
        wrapper.vm.signOut()
        assert(spy.calledOnce)
        spy.restore()
      })
      it('creates a quasar Toast', () => {
        const spy = sinon.spy(Toast, 'create')
        const wrapper = mount(Index, { store })
        wrapper.vm.signOut()
        assert(spy.calledOnce)
        spy.restore()
      })
    })
    describe('triggerModal', () => {
      it('sets the modalOpen data property to true', () => {
        const wrapper = mount(Index)
        expect(wrapper.vm.$data.modalOpen).to.equal(false)
        wrapper.vm.triggerModal()
        expect(wrapper.vm.$data.modalOpen).to.equal(true)
      })
      it('resets modalOpen to false in 500ms', done => {
        const wrapper = mount(Index)
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
    it('modalOpen has an inital value of false', () => {
      expect(Index.data().modalOpen).to.equal(false)
    })
  })
  describe('props', () => {
    it('has an authHeaders prop', () => {
      const wrapper = mount(Index)
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

        let mockHeaders, store, router, options

        beforeEach(() => {
          // mock headers object
          mockHeaders = {
            authToken: 'wwwww',
            clientId: 'xxxxx',
            expiry: 'yyyyy',
            uid: 'zzzzz'
          }
          store = new Vuex.Store({
            modules: { Sessions }
          })
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
          mount(Index, options)
          assert(spy.calledOnce)
          spy.restore()
        })
        it('reloads the page', () => {
          const spy = sinon.spy(router, 'push')
          mount(Index, options)
          assert(spy.calledWith({ path: '/' }))
          spy.restore()
        })
        it('dispatches the setUserFromOAuth action', () => {
          // to force the onSuccess callback on router.push...
          const pusher = sinon.stub(router, 'push').callsArg(1)
          const stub = sinon.stub(Index.methods, 'setUserFromOAuth')
          stub.returns(Promise.resolve({username: 'test'}))
          mount(Index, options)
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
          mount(Index, {
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
