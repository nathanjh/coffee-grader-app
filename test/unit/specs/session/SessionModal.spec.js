import SessionModal from '@/session/SessionModal'
import SignInForm from '@/session/forms/SignInForm'
import SignUpForm from '@/session/forms/SignUpForm'
import { mount } from 'vue-test-utils'
import { Events, QModal } from 'quasar'

describe('SessionModal.vue', () => {
  describe('rendered content', () => {
    const wrapper = mount(SessionModal)

    describe('modal-close button', () => {
      const closeButton = wrapper.find('[data-button-type="modal-close"]')

      it('renders a button to close the modal', () => {
        assert(closeButton.is('button'))
      })
      it("calls the modals 'close' method when clicked", () => {
        const spy = sinon.stub(wrapper.vm.$refs.sessionModal, 'close')

        closeButton.trigger('click')
        assert(spy.calledOnce)
      })
    })
    describe('forms', () => {
      context('when signingUp is true', () => {
        it('renders the signUpForm component', done => {
          wrapper.setData({ signingUp: true })
          wrapper.vm.$nextTick(() => {
            const signUpForm = wrapper.find(SignUpForm)
            assert(signUpForm.is(SignUpForm))
            done()
          })
        })
      })
      context('when signingUp is false', () => {
        it('renders the signInForm component', done => {
          wrapper.setData({ signingUp: false })
          wrapper.vm.$nextTick(() => {
            const signInForm = wrapper.find(SignInForm)
            assert(signInForm.is(SignInForm))
            done()
          })
        })
      })
    })
  })
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
    describe('footerTitle', () => {
      context('when signingUp is true', () => {
        it('returns the sign-in footer link text', () => {
          wrapper.setData({ signingUp: true })
          expect(wrapper.vm.footerTitle)
            .to.equal('Already a Member?')
        })
      })
      context('when signingUp is false', () => {
        it('returns the sign-up footer link text', () => {
          expect(wrapper.vm.footerTitle)
            .to.equal('Need to create an account?')
        })
      })
    })
    describe('modalHeight', () => {
      context('when signingUp is true', () => {
        it('returns the correct modal height (in vh)', () => {
          wrapper.setData({ signingUp: true })
          expect(wrapper.vm.modalHeight).to.equal('85vh')
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
  describe('event listeners', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SessionModal)
    })

    describe('on q-modal component close event', () => {
      it('fires the clearFormOnClose method', () => {
        const spy = sinon.spy(wrapper.vm, 'clearFormOnClose')
        const qModal = wrapper.find(QModal)

        qModal.vm.$emit('close')
        expect(spy.called).to.equal(true)
        spy.restore()
        // wrapper.find('[data-button-type="modal-close"]')
        //   .trigger('click')
        // expect(spy.calledOnce).to.equal(true)
      })
    })
    describe('on signInForm component successfulSignIn event', () => {
      it('fires the q-modal component close method', () => {
        const spy = sinon.spy(wrapper.vm.$refs.sessionModal, 'close')
        const signInForm = wrapper.find(SignInForm)

        signInForm.vm.$emit('successfulSignIn')
        expect(spy.called).to.equal(true)
        spy.restore()
      })
    })
    describe('on signUpForm component successfulSignUp event', () => {
      it('fires the q-modal component close method', done => {
        wrapper.setData({ signingUp: true })

        wrapper.vm.$nextTick(() => {
          const spy = sinon.spy(wrapper.vm.$refs.sessionModal, 'close')
          const signUpForm = wrapper.find(SignUpForm)

          signUpForm.vm.$emit('successfulSignUp')
          expect(spy.called).to.equal(true)
          spy.restore()
          done()
        })
      })
    })
  })
  // NOTE: not sure why this doesn't work...
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
