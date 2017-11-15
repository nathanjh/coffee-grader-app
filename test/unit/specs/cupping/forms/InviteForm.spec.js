import 'babel-polyfill'
import InviteForm from '@/cupping/forms/InviteForm'
import CGAutocomplete from '@/cupping/forms/CGAutocomplete'
import { mount } from 'vue-test-utils'
import { Toast } from 'quasar'

describe('InviteForm.vue', () => {
  describe('rendered content', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(InviteForm)
    })
    describe('guest invite link', () => {
      let link
      beforeEach(() => {
        link = wrapper.find('[data-link-type="guest-invite"]')
      })
      it('renders the correct link', () => {
        expect(link.is('a')).to.be.true
      })
      it('calls the guestInviteModal open method when clicked', () => {
        const spy =
          sinon.stub(wrapper.vm.$refs.guestInviteModal, 'open')
        link.trigger('click')
        expect(spy.calledOnce).to.equal(true)
        spy.restore()
      })
      describe('guestInviteModal', () => {
        let submitButton
        beforeEach(() => {
          link.trigger('click')
          submitButton =
            wrapper.find('[data-button-type="with-grader-email"]')
        })
        it('renders a form submit button', () => {
          expect(submitButton.is('button')).to.be.true
        })
        it('modal form submit button calls submitButtonHandler with the correct arguments', () => {
          const btnHandlerSpy = sinon.stub(wrapper.vm, 'submitButtonHandler')
          submitButton.trigger('click')
          expect(btnHandlerSpy.calledWith('graderId', wrapper.vm.createInvite))
            .to.be.true
        })
      })
    })
    describe('main form submit button', () => {
      let submitInviteButton, btnHandlerSpy
      beforeEach(() => {
        submitInviteButton =
          wrapper.find('[data-button-type="with-grader-id"]')
        wrapper.setData({
          form: {
            graderId: 33,
            graderEmail: 'mad@monkey.com'
          },
          idButtonDisabled: false
        })
        btnHandlerSpy = sinon.stub(wrapper.vm, 'submitButtonHandler')
      })
      afterEach(() => {
        btnHandlerSpy.restore()
      })
      it('renders a from submit button', () => {
        assert(submitInviteButton.is('button'))
        expect(submitInviteButton.text()).to.include('Submit')
      })
      it('form submit button calls submitButtonHandler with the correct arguments', () => {
        submitInviteButton.trigger('click')
        expect(btnHandlerSpy.calledOnce).to.be.true
        expect(btnHandlerSpy.calledWith('graderEmail', wrapper.vm.createInvite))
          .to.be.true
      })
    })
  })
  describe('data', () => {
    it('has an Object type form property', () => {
      expect(InviteForm.data().form).to.be.a('object')
    })
    describe('form', () => {
      const form = InviteForm.data().form
      it('form has the correct keys', () => {
        const keys = ['graderId', 'graderEmail']
        expect(Object.keys(form)).to.deep.equal(keys)
      })
      it('has a graderId property with null initial value', () => {
        expect(form.graderId).to.be.null
      })
      it('has a string type graderEmail property', () => {
        expect(form.graderEmail).to.be.a('string')
      })
      it('graderEmail initial value is an empty string', () => {
        expect(form.graderEmail).to.equal('')
      })
    })
    describe('graderNotFound', () => {
      it('is a boolean type with default vaule of false', () => {
        const graderNotFound = InviteForm.data().graderNotFound
        expect(graderNotFound).to.equal(false)
      })
    })
    describe('idButtonDisabled', () => {
      it('is a boolean type with default vaule of true', () => {
        const idButtonDisabled = InviteForm.data().idButtonDisabled
        expect(idButtonDisabled).to.equal(true)
      })
    })
    describe('emailButtonDisabled', () => {
      it('is a boolean type with default vaule of true', () => {
        const emailButtonDisabled = InviteForm.data().emailButtonDisabled
        expect(emailButtonDisabled).to.equal(true)
      })
    })
  })
  describe('form validations (Vuelidate)', () => {
    describe('sets the error class for invalid fields', () => {
      let wrapper
      beforeEach(() => {
        wrapper = mount(InviteForm)
      })
      it('for invalid email', async function () {
        wrapper.find('[data-link-type="guest-invite"]')
          .trigger('click')

        wrapper.setData({
          form: {
            graderEmail: 'bad@email...com'
          }
        })
        wrapper.vm.$v.form.$touch()
        await wrapper.update()
        const graderEmailField =
          wrapper.find('[data-field-type="grader-email"]')
        assert(graderEmailField.hasClass('q-field-with-error'))
      })
    })
  })
  describe('child components', () => {
    it('has a CGAutocomplete child component', () => {
      expect(InviteForm.components['CGAutocomplete'])
        .not.to.be.undefined
      expect(InviteForm.components['CGAutocomplete'])
        .to.equal(CGAutocomplete)
    })
  })
  describe('methods', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(InviteForm)
    })
    describe('vuex actions', () => {
      it("maps newInvite action to local 'submitNewInvite' method", () => {
        expect(wrapper.vm.submitNewInvite).to.be.a('function')
      })
    })
    describe('createInvite', () => {
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(wrapper.vm, 'submitNewInvite')
            .returns(Promise.resolve({
              response: {
                username: 'mad monkey'
              }
            }))
      })
      afterEach(() => actionSpy.restore())
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check form empty inputs', () => {
          wrapper.vm.createInvite()
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('returns before dispatching submitNewInvite action if errors', () => {
          wrapper.vm.createInvite()
          expect(actionSpy.called).to.be.false
        })
      })
      context('when submitNewInvite is successful', () => {
        beforeEach(() => {
          wrapper.setData({
            form: {
              graderId: 44
            }
          })
        })
        it('emits a newInviteAdded event', async function () {
          await wrapper.vm.createInvite()
          expect(Object.keys(wrapper.emitted()))
            .to.include('newInviteAdded')
        })
        it('calls the clearAllFields method', async function () {
          const spy = sinon.spy(wrapper.vm, 'clearAllFields')
          await wrapper.vm.createInvite()
          assert(spy.called)
          spy.restore()
        })
        it('creates a toast to communicate success to the user', async function () {
          const toastSpy = sinon.spy(Toast.create, 'positive')
          await wrapper.vm.createInvite()
          assert(toastSpy.calledOnce)
          toastSpy.restore()
        })
      })
    })
    describe('graderSelectedHandler', () => {
      it('resets the graderNotFound data property to false', () => {
        wrapper.setData({
          graderNotFound: true
        })
        assert(wrapper.vm.graderNotFound)
        wrapper.vm.graderSelectedHandler()
        expect(wrapper.vm.graderNotFound).to.equal(false)
      })
      it('sets the idButtonDisabled data property to false', () => {
        assert(wrapper.vm.idButtonDisabled)
        wrapper.vm.graderSelectedHandler()
        expect(wrapper.vm.idButtonDisabled).to.equal(false)
      })
      it('sets the local form graderId data protperty', () => {
        const payload = {
          id: 1
        }
        wrapper.vm.graderSelectedHandler(payload)
        expect(wrapper.vm.form.graderId).to.equal(payload.id)
      })
    })
    describe('graderNotFoundHandler', () => {
      it('sets the graderNotFound and idButtonDisabled props to true', () => {
        wrapper.setData({
          idButtonDisabled: false
        })
        assert(!wrapper.vm.idButtonDisabled &&
               !wrapper.vm.graderNotFound)
        wrapper.vm.graderNotFoundHandler()
        assert(wrapper.vm.idButtonDisabled &&
               wrapper.vm.graderNotFound)
      })
      it('sets the graderId data property to null', () => {
        wrapper.setData({
          form: {
            graderId: 1
          }
        })
        assert(wrapper.vm.form.graderId === 1)
        wrapper.vm.graderNotFoundHandler()
        expect(wrapper.vm.form.graderId).to.equal(null)
      })
    })
    describe('clearAllFields', () => {
      it("clears the autocomplete component form field by calling it's clearInput method", () => {
        const cmp = wrapper.find(CGAutocomplete)
        const spy = sinon.spy(cmp.vm, 'clearInput')
        wrapper.vm.clearAllFields()
        expect(spy.called).to.be.true
        spy.restore()
      })
      it('clears the graderEmail and graderId data properties', () => {
        wrapper.setData({
          form: {
            graderEmail: 'test@test.com',
            graderId: 33
          }
        })
        assert(wrapper.vm.form.graderId === 33)
        assert(wrapper.vm.form.graderEmail === 'test@test.com')

        wrapper.vm.clearAllFields()
        expect(wrapper.vm.form.graderId).to.equal(null)
        expect(wrapper.vm.form.graderEmail).to.equal('')
      })
    })
    describe('submitButtonHandler', () => {
      /* we need to ensure that we never submit an invite with both a valid
         graderId and graderEmail */
      let spy
      beforeEach(() => {
        wrapper.setData({
          form: {
            graderId: 33,
            graderEmail: 'mad@monkey.com'
          }
        })
        spy = sinon.spy()
      })
      it('sets a given form property to null', () => {
        wrapper.vm.submitButtonHandler('graderId', spy)
        expect(wrapper.vm.form.graderId).to.be.null
      })
      it('calls a given function', () => {
        wrapper.vm.submitButtonHandler('graderEmail', spy)
        expect(spy.calledOnce).to.be.true
      })
    })
  })
})
