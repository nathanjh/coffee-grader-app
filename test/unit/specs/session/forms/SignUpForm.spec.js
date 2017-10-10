import SignUpForm from '@/session/forms/SignUpForm'
import { mount } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Sessions from 'src/store/modules/sessions'
import { Toast, Events } from 'quasar'

describe('SignUpForm.vue', () => {
  Vue.use(Vuex)

  const validFormData = {
    name: 'test name',
    username: '7estUs3r',
    email: 'test@123.com',
    password: 'password',
    confirmPassword: 'password'
  }

  describe('rendered content', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SignUpForm)
    })
    describe('signUp button', () => {
      let signUpButton
      beforeEach(() => {
        signUpButton = wrapper.find('[data-button-type="submit-sign-up"]')
      })
      it('renders a form submit button', () => {
        assert(signUpButton.is('button'))
        expect(signUpButton.text()).to.include('Sign Up')
      })
      it('signUp button calls signUp method on click event', () => {
        const signUpHandler = sinon.spy(wrapper.vm, 'signUp')
        signUpButton.trigger('click')
        assert(signUpHandler.calledOnce)
        signUpHandler.restore()
      })
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SignUpForm.data).to.be.a('function')
    })
    it('has an object type form property', () => {
      expect(SignUpForm.data().form).to.be.a('object')
    })
    it('form has a string type name property', () => {
      expect(SignUpForm.data().form.name).to.be.a('string')
    })
    it('form has a string type username property', () => {
      expect(SignUpForm.data().form.username).to.be.a('string')
    })
    it('form has a string type email property', () => {
      expect(SignUpForm.data().form.email).to.be.a('string')
    })
    it('form has a string type password property', () => {
      expect(SignUpForm.data().form.password).to.be.a('string')
    })
    it('form has a string type confirmPassword property', () => {
      expect(SignUpForm.data().form.confirmPassword).to.be.a('string')
    })
    it('form has a string type inviteToken property', () => {
      const wrapper = mount(SignUpForm)
      expect(wrapper.vm.form.inviteToken).to.be.a('string')
    })
    it('all form field values default to empty strings', () => {
      const form = mount(SignUpForm).vm.form
      for (const field in form) {
        expect(form[field]).to.equal('')
      }
    })
  })
  describe('props', () => {
    it('has a props object', () => {
      expect(SignUpForm.props).to.be.a('object')
    })
    describe('inviteToken', () => {
      it('validates String type', () => {
        expect(SignUpForm.props.inviteToken).to.be.a('object')
        expect(SignUpForm.props.inviteToken.type).to.equal(String)
      })
      it('default value is an empty string', () => {
        expect(SignUpForm.props.inviteToken.default).to.equal('')
      })
      it('receives valid data', () => {
        const wrapper = mount(SignUpForm, { propsData: { inviteToken: '123abc' } })
        assert(wrapper.hasProp('inviteToken', '123abc'))
      })
    })
  })
  describe('form validations (Vuelidate)', () => {
    const formValidationObj = SignUpForm.validations.form
    const requiredFields =
      Object.keys(formValidationObj)
        .filter(field => field !== 'confirmPassword')
        .reduce((form, field) => {
          form[field] = formValidationObj[field]
          return form
        }, {})
    it('validates name, username, email, password by requirement', () => {
      for (const field in requiredFields) {
        expect(Object.keys(requiredFields[field])).to.include('required')
        expect(requiredFields[field].required).to.be.a('function')
      }
    })
    it('validates confirmPassword', () => {
      expect(Object.keys(formValidationObj.confirmPassword))
        .to.include('confirmPassword')
      expect(formValidationObj.confirmPassword.confirmPassword)
        .to.be.a('function')
    })
    it('sets the error class for invalid required field entries', done => {
      const wrapper = mount(SignUpForm)
      // name, username, email, password are required...
      wrapper.vm.$v.form.$touch()
      wrapper.vm.$nextTick(() => {
        Object.keys(requiredFields).forEach(field => {
          assert(wrapper.find(`[data-field-type="${field}"]`)
            .hasClass('q-field-with-error'))
        })
        done()
      })
    })
  })
  describe('methods', () => {
    describe('vuex actions', () => {
      it("maps the signUp action to local 'submitSignUp' method", () => {
        expect(SignUpForm.methods.submitSignUp).to.be.a('function')
      })
    })
    describe('signUp', () => {
      /* add a store instance available to signUp tests due to mapped action
      dependency */
      const store = new Vuex.Store({
        modules: { Sessions }
      })
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(SignUpForm.methods, 'submitSignUp')
            .returns(Promise.resolve({ username: 'test' }))
      })
      afterEach(() => {
        actionSpy.restore()
      })
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs', () => {
          const wrapper = mount(SignUpForm, { store })
          wrapper.vm.signUp()
          // $touch method recursively sets $dirty flag for all children
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('creates a toast to communicate form imput error to the user', () => {
          const toastSpy = sinon.spy(Toast, 'create')
          mount(SignUpForm, { store })
            .vm.signUp()
          assert(toastSpy.calledOnce)
          toastSpy.restore()
        })
        it('returns before dispatching submitSignUp action if error(s)', () => {
          mount(SignUpForm, { store })
            .vm.signUp()
          assert(!actionSpy.called)
        })
      })
      context('when signUp is successful', () => {
        it('emits a successfulSignUp event', async function () {
          const spy = sinon.spy()

          const wrapper = mount(SignUpForm, { store })
          wrapper.setData({ form: validFormData })
          // listen for successfulSignUp event...
          wrapper.vm.$on('successfulSignUp', spy)
          await wrapper.vm.signUp()
          assert(spy.called)
        })
        it('creates a success toast', async function () {
          const spy = sinon.spy(Toast.create, 'positive')

          const wrapper = mount(SignUpForm, { store })
          wrapper.setData({ form: validFormData })

          await wrapper.vm.signUp()
          assert(spy.called)
          spy.restore()
        })
      })
      // context('when signUp fails')
    })
  })
  describe('lifecycle hooks', () => {
    describe('created', () => {
      it('has a created hook', () => {
        expect(SignUpForm.created).to.be.a('function')
      })
      it('listens for a clearForm event, and clears form data', () => {
        const wrapper = mount(SignUpForm)
        // add data and set $dirty flag on all form fields
        wrapper.setData({ form: validFormData })
        const form = wrapper.vm.form

        wrapper.vm.$v.form.$touch()

        Events.$emit('clearForm')
        // clears all form fields
        for (const field in form) {
          expect(form[field]).to.equal('')
        }
        // clears all validations
        expect(wrapper.vm.$v.form.$dirty).to.be.false
      })
    })
  })
})
