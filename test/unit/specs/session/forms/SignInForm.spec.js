import 'babel-polyfill'
import SignInForm from '@/session/forms/SignInForm'
import AuthButton from '@/session/AuthButton'
import { mount } from 'vue-test-utils'
// quasar provides a global event bus
import { Toast, Events } from 'quasar'
import Vue from 'vue'
import Vuex from 'vuex'
import Sessions from 'src/store/modules/sessions'

describe('SignInForm.vue', () => {
  Vue.use(Vuex)

  describe('rendered content', () => {
    let wrapper, signInButton
    beforeEach(() => {
      wrapper = mount(SignInForm)
      signInButton = wrapper.find('[data-button-type="submit-sign-in"]')
    })
    it('renders a form submit button', () => {
      assert(signInButton.is('button'))
      expect(signInButton.text()).to.include('Sign In')
    })
    it('signIn button calls signIn method on click event', () => {
      const signInHandler = sinon.spy(wrapper.vm, 'signIn')
      signInButton.trigger('click')
      assert(signInHandler.calledOnce)
      signInHandler.restore()
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SignInForm.data).to.be.a('function')
      expect(SignInForm.data()).to.be.a('object')
    })
    it('has a string type oauthBaseURL property', () => {
      expect(SignInForm.data().oauthBaseURL).to.be.a('string')
    })
    it('oauthBaseURL has a default value', () => {
      expect(SignInForm.data().oauthBaseURL).not.to.equal('')
    })
    it('has an object type form property', () => {
      expect(SignInForm.data().form).to.be.a('object')
    })
    it('form has a string type email property', () => {
      expect(SignInForm.data().form.email).to.be.a('string')
    })
    it('form has a string type password property', () => {
      expect(SignInForm.data().form.password).to.be.a('string')
    })
    it('form.email and form.password default values are empty strings', () => {
      expect(SignInForm.data().form.email).to.equal('')
      expect(SignInForm.data().form.password).to.equal('')
    })
  })
  describe('form validations (Vuelidate)', () => {
    const form = SignInForm.validations.form

    it('validates form.email by requirement', () => {
      expect(Object.keys(form.email)).to.include('required')
      expect(form.email.required).to.be.a('function')
    })
    it('validates form.email by email pattern', () => {
      expect(Object.keys(form.email)).to.include('email')
      expect(form.email.email).to.be.a('function')
    })
    it('sets the error class for invalid email', done => {
      const wrapper = mount(SignInForm)
      // email is required...
      wrapper.vm.$v.form.email.$touch()
      wrapper.vm.$nextTick(() => {
        const emailField = wrapper.find('[data-field-type="email"]')
        assert(emailField.hasClass('q-field-with-error'))
        done()
      })
    })
    it('validates form.password by requirement', () => {
      expect(Object.keys(form.password)).to.include('required')
      expect(form.password.required).to.be.a('function')
    })
    it('validates that minimum password length is 6', done => {
      expect(Object.keys(form.password)).to.include('minLength')
      expect(form.password.minLength).to.be.a('function')

      const wrapper = mount(SignInForm)
      wrapper.setData({
        form: {
          password: '12345'
        }
      })
      wrapper.vm.$v.form.password.$touch()

      wrapper.vm.$nextTick(() => {
        const pwField = wrapper.find('[data-field-type="password"]')
        assert(pwField.hasClass('q-field-with-error'))
        done()
      })
    })
    it('sets the error class for invalid password', done => {
      const wrapper = mount(SignInForm)
      // password is required...
      wrapper.vm.$v.form.password.$touch()
      wrapper.vm.$nextTick(() => {
        const pwField = wrapper.find('[data-field-type="password"]')
        assert(pwField.hasClass('q-field-with-error'))
        done()
      })
    })
  })
  describe('methods', () => {
    describe('vuex actions', () => {
      it("maps the signIn action to local 'submitSignIn' method", () => {
        expect(SignInForm.methods.submitSignIn).to.be.a('function')
      })
    })
    describe('signIn', () => {
      /* add a store instance available to signIn tests due to mapped action
      dependency */
      const store = new Vuex.Store({
        modules: { Sessions }
      })
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(SignInForm.methods, 'submitSignIn')
            .returns(Promise.resolve({username: 'test'}))
      })
      afterEach(() => {
        actionSpy.restore()
      })
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs', () => {
          const wrapper = mount(SignInForm, { store })
          wrapper.vm.signIn()
          // $touch method recursively sets $dirty flag for all children
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('creates a toast to communicate form input error to the user', () => {
          const toastSpy = sinon.spy(Toast, 'create')
          mount(SignInForm, { store })
            .vm.signIn()
          assert(toastSpy.calledOnce)
          toastSpy.restore()
        })
        it('returns before dispatching submitSignIn action if error(s)', () => {
          mount(SignInForm, { store })
            .vm.signIn()
          assert(!actionSpy.called)
        })
      })
      context('when signIn is successful', () => {
        it('emits a successfulSignIn event', async function () {
          const spy = sinon.spy()

          const wrapper = mount(SignInForm, { store })
          wrapper.setData({
            form: {
              email: 'test@123.com',
              password: 'password'
            }
          })
          // listen for successfulSignIn event...
          wrapper.vm.$on('successfulSignIn', spy)
          await wrapper.vm.signIn()
          assert(spy.called)
        })
        it('creates a success toast', async function () {
          const spy = sinon.spy(Toast.create, 'positive')

          const wrapper = mount(SignInForm, { store })
          wrapper.setData({
            form: {
              email: 'test@123.com',
              password: 'password'
            }
          })
          await wrapper.vm.signIn()
          assert(spy.called)
          spy.restore()
        })
      })
      // context('when signIn fails', () => {
      //   // api response is an array of errors
      //   it('creates a toast for each error', async function () {
      //     actionSpy.restore()
      //     actionSpy =
      //       sinon.stub(SignInForm.methods, 'submitSignIn')
      //         .returns(Promise.reject(['bad email', 'bad pw']))
      //
      //     const toastSpy = sinon.stub(Toast, 'create')
      //
      //     const wrapper = mount(SignInForm, { store })
      //     wrapper.setData({
      //       form: {
      //         email: 'test@123.com',
      //         password: 'password'
      //       }
      //     })
      //     await wrapper.vm.signIn()
      //     assert(toastSpy.calledTwice)
      //     toastSpy.restore()
      //   })
      // })
    })
  })
  describe('lifecycle hooks', () => {
    describe('created', () => {
      it('has a created hook', () => {
        expect(SignInForm.created).to.be.a('function')
      })
      it('listens for a clearForm event, and clears form data', () => {
        const wrapper = mount(SignInForm)
        // add data and set $dirty flag on all form fields
        wrapper.setData({
          form: {
            email: 'test@123.com',
            password: 'password'
          }
        })
        wrapper.vm.$v.form.$touch()

        Events.$emit('clearForm')

        expect(wrapper.vm.form.email).to.equal('')
        expect(wrapper.vm.form.password).to.equal('')
        // clears all validations
        expect(wrapper.vm.$v.form.$dirty).to.be.false
      })
    })
  })
  describe('social sign-in buttons', () => {
    describe('google', () => {
      let googleBtn
      beforeEach(() => {
        googleBtn = mount(SignInForm).find('[data-button-type="oauth-google"]')
      })
      it('renders the AuthButton component', () => {
        expect(googleBtn.is(AuthButton))
      })
    })
  })
})
