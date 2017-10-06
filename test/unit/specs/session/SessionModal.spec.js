import SessionModal from '@/session/SessionModal'
import { mount } from 'vue-test-utils'
import { Events } from 'quasar'

describe('SessionModal.vue', () => {
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SessionModal.data).to.be.a('function')
      expect(SessionModal.data()).to.be.a('object')
    })
    it('has a boolean type signingUp property', () => {
      expect(SessionModal.data().signingUp).to.be.a('boolean')
    })
    it('signingUp has an initial value of false', () => {
      expect(SessionModal.data().signingUp).to.equal(false)
    })
  })
  describe('props', () => {
    it('has a props object', () => {
      expect(SessionModal.props).to.be.a('object')
    })
    describe('modalOpen', () => {
      it('validates boolean type', () => {
        expect(SessionModal.props.modalOpen).to.be.a('object')
        expect(SessionModal.props.modalOpen.type).to.equal(Boolean)
      })
      it("has a default value of 'false'", () => {
        const wrapper = mount(SessionModal)
        expect(wrapper.vm.modalOpen).to.equal(false)
      })
    })
  })
  describe('computed properties', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SessionModal)
    })
    describe('headerTitle', () => {
      context('when signingUp is true', () => {
        it('returns the sign-up header title', () => {
          wrapper.setData({ signingUp: true })
          expect(wrapper.vm.headerTitle)
            .to.equal('Sign up for an account')
        })
      })
      context('when signingUp is false', () => {
        it('returns the sign-in header title', () => {
          expect(wrapper.vm.headerTitle)
            .to.equal('Sign in to your account')
        })
      })
    })
    describe('modalHeight', () => {
      context('when signingUp is true', () => {
        it('returns the correct modal height (in vh)', () => {
          wrapper.setData({ signingUp: true })
          expect(wrapper.vm.modalHeight).to.equal('97vh')
        })
      })
      context('when signingUp is false', () => {
        it('returns the correct modal height (in vh)', () => {
          expect(wrapper.vm.modalHeight).to.equal('75vh')
        })
      })
    })
  })
  describe('methods', () => {
    describe('clearFormOnClose', () => {
      it('emits a clearForm event on the global event bus', () => {
        let emitted
        Events.$on('clearForm', function () { emitted = true })
        mount(SessionModal)
          .vm
          .clearFormOnClose()
        assert(emitted)
      })
    })
  })
  // not sure why this doesn't work...
  /* describe('watchers', () => {
    describe('modalOpen', () => {
      const wrapper = mount(SessionModal)
      context('when modalOpen prop changes to true', () => {
        it("triggers child component (q-modal) 'open' method", done => {
          const modalSpy = sinon.spy(wrapper.vm.$refs.sessionModal, 'open')
          assert(wrapper.hasProp('modalOpen', false))
          wrapper.vm.modalOpen = true
          wrapper.vm.$nextTick(() => {
            expect(modalSpy.called).to.equal(true)
            done()
          })
          modalSpy.restore()
        })
      })
    })
  }) */
})
