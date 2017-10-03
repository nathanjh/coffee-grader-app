import SignUp from '@/session/SignUp'
import { mount } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Sessions from 'src/store/modules/sessions'
import { Toast, Events } from 'quasar'

describe('SignUp.vue', () => {
  Vue.use(Vuex)

  const validFormData = {
    name: 'test name',
    username: '7estUs3r',
    email: 'test@123.com',
    password: 'password',
    confirmPassword: 'password'
  }

  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SignUp.data).to.be.a('function')
    })
    it('has an object type form property', () => {
      expect(SignUp.data().form).to.be.a('object')
    })
    it('form has a string type name property', () => {
      expect(SignUp.data().form.name).to.be.a('string')
    })
    it('form has a string type username property', () => {
      expect(SignUp.data().form.username).to.be.a('string')
    })
    it('form has a string type email property', () => {
      expect(SignUp.data().form.email).to.be.a('string')
    })
    it('form has a string type password property', () => {
      expect(SignUp.data().form.password).to.be.a('string')
    })
    it('form has a string type confirmPassword property', () => {
      expect(SignUp.data().form.confirmPassword).to.be.a('string')
    })
    it('form has a string type inviteToken property', () => {
      const wrapper = mount(SignUp)
      expect(wrapper.vm.form.inviteToken).to.be.a('string')
    })
    it('all form field values default to empty strings', () => {
      const form = mount(SignUp).vm.form
      for (const field in form) {
        expect(form[field]).to.equal('')
      }
    })
  })
  describe('props', () => {
    it('has a props object', () => {
      expect(SignUp.props).to.be.a('object')
    })
    describe('inviteToken', () => {
      it('validates String type', () => {
        expect(SignUp.props.inviteToken).to.be.a('object')
        expect(SignUp.props.inviteToken.type).to.equal(String)
      })
      it('default value is an empty string', () => {
        expect(SignUp.props.inviteToken.default).to.equal('')
      })
      it('receives valid data', () => {
        const wrapper = mount(SignUp, { propsData: { inviteToken: '123abc' } })
        assert(wrapper.hasProp('inviteToken', '123abc'))
      })
    })
  })
  describe('form validations (Vuelidate)', () => {
    const formValidationObj = SignUp.validations.form
    it('validates name, username, email, password by requirement', () => {
      const requiredFields =
        Object.keys(formValidationObj)
          .filter(field => field !== 'confirmPassword')
          .reduce((form, field) => {
            form[field] = formValidationObj[field]
            return form
          }, {})
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
  })
  describe('methods', () => {
    describe('vuex actions', () => {
      it("maps the signUp action to local 'submitSignUp' method", () => {
        expect(SignUp.methods.submitSignUp).to.be.a('function')
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
          sinon.stub(SignUp.methods, 'submitSignUp')
            .returns(Promise.resolve({ username: 'test' }))
      })
      afterEach(() => {
        actionSpy.restore()
      })
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs', () => {
          const wrapper = mount(SignUp, { store })
          wrapper.vm.signUp()
          // $touch method recursively sets $dirty flag for all children
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('creates a toast to communicate form imput error to the user', () => {
          const toastSpy = sinon.spy(Toast, 'create')
          mount(SignUp, { store })
            .vm.signUp()
          assert(toastSpy.calledOnce)
          toastSpy.restore()
        })
        it('returns before dispatching submitSignUp action if error(s)', () => {
          mount(SignUp, { store })
            .vm.signUp()
          assert(!actionSpy.called)
        })
      })
      context('when signUp is successful', () => {
        it('emits a successfulSignUp event', async function () {
          const spy = sinon.spy()

          const wrapper = mount(SignUp, { store })
          wrapper.setData({ form: validFormData })
          // listen for successfulSignUp event...
          wrapper.vm.$on('successfulSignUp', spy)
          await wrapper.vm.signUp()
          assert(spy.called)
        })
        it('creates a success toast', async function () {
          const spy = sinon.spy(Toast.create, 'positive')

          const wrapper = mount(SignUp, { store })
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
        expect(SignUp.created).to.be.a('function')
      })
      it('listens for a clearForm event, and clears form data', () => {
        const wrapper = mount(SignUp)
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
