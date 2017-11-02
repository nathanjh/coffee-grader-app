import 'babel-polyfill'
import CGNewResourceForm from '@/cupping/forms/CGNewResourceForm'
import { mount } from 'vue-test-utils'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import Vue from 'vue'
import Vuex from 'vuex'
import Sessions from 'src/store/modules/sessions'
import { required } from 'vuelidate/lib/validators'
import { Toast } from 'quasar'

Vue.use(Vuex)

describe('CGNewResourceForm.vue', () => {
  const model = {
    name: 'coffee',
    attributes: [
      'name',
      'producer',
      'variety'
    ]
  }
  const validates = {
    name: { required: true },
    producer: { required: true }
  }
  const store = new Vuex.Store({
    modules: { Sessions }
  })
  describe('rendered content', () => {
    let wrapper, createResourceButton, clearFormButton
    beforeEach(() => {
      wrapper = mount(CGNewResourceForm, {
        store,
        propsData: {
          model,
          validates
        }
      })
      createResourceButton =
        wrapper.find('[data-button-type="create-resource"]')
      clearFormButton =
        wrapper.find('[data-button-type="clear-form"]')
    })
    it('renders a form submit button', () => {
      assert(createResourceButton.is('button'))
      expect(createResourceButton.text()).to.include('Submit')
    })
    it('form submit button calls createResource method on click event', () => {
      const submitHandler = sinon.stub(wrapper.vm, 'createResource')
      createResourceButton.trigger('click')
      expect(submitHandler.calledOnce).to.be.true
      submitHandler.restore()
    })
    it('renders a clear-form button', () => {
      assert(clearFormButton.is('button'))
      expect(clearFormButton.text()).to.include('Reset')
    })
    it('clear-form button calls clearForm method on click event', () => {
      const clearFormHandler = sinon.spy(wrapper.vm, 'clearForm')
      clearFormButton.trigger('click')
      expect(clearFormHandler.calledOnce).to.be.true
      clearFormHandler.restore()
    })
  })
  describe('props', () => {
    const props = CGNewResourceForm.props
    const validModelProp = {
      name: 'coffee',
      attributes: ['name', 'origin', 'producer', 'variety']
    }
    it("has a required Object type 'model prop'", () => {
      expect(props.model.type).to.equal(Object)
      expect(props.model.required).to.equal(true)

      const wrapper = mount(CGNewResourceForm, {
        propsData: {
          model: validModelProp
        }
      })
      expect(wrapper.hasProp('model', validModelProp)).to.be.true
    })
    it("validates 'model' object has keys 'name' and 'attributes'", () => {
      const validator = props.model.validator
      expect(validator).to.be.a('function')
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({ a: '', b: '' })).to.equal(false)
    })
    it("validates model's 'name' value is a string", () => {
      const validator = props.model.validator
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({
        name: 9000,
        attributes: []
      })).to.equal(false)
    })
    it("validates model's 'attributes' value is an array of strings", () => {
      const validator = props.model.validator
      expect(validator(validModelProp)).to.equal(true)
      expect(validator({
        name: 'invalid',
        attributes: ['1', 2, null, 4]
      })).to.equal(false)
    })
    it("has an optional Object type 'validates' prop", () => {
      expect(props.validates.type).to.equal(Object)
      expect(props.validates.required).to.equal(false)
      const validationProp = {
        name: {
          required: true
        }
      }
      const wrapper = mount(CGNewResourceForm, {
        propsData: {
          model: validModelProp,
          validates: validationProp
        }
      })
      expect(wrapper.hasProp('validates', validationProp))
        .to.be.true
    })
    it('validates second-tier keys', () => {
      const validator = props.validates.validator
      expect(validator).to.be.a('function')

      const validValidatorsProp = {
        name: { required: true },
        origin: { required: true }
      }
      const invalidProp = {
        name: { minLength: true },
        origin: { someOtherValidator: true },
        producer: { required: true }
      }
      expect(validator(validValidatorsProp)).to.equal(true)
      expect(validator(invalidProp)).to.equal(false)
    })
  })
  describe('data', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(CGNewResourceForm, {
        propsData: { model }
      })
    })
    it("has an Object type 'form' property", () => {
      expect(wrapper.vm.$data.form).to.be.a('object')
    })
    it("'form' object has keys that map to model props attribute values", () => {
      const attributes = wrapper.vm.$props.model.attributes
      const form = wrapper.vm.$data.form

      expect(attributes.every(attr => Object.keys(form).includes(attr)))
        .to.equal(true)
    })
  })
  describe('form validation (Vuelidate)', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(CGNewResourceForm, {
        propsData: {
          model,
          validates
        }
      })
    })
    context("given a 'validates' prop", () => {
      it('validates the correct attributes by requirement', () => {
        const attrs = Object.keys(validates)
        const form = wrapper.vm.$v.form

        expect(attrs.every(attr => {
          return Object.keys(form[attr]).includes('required')
        }))
          .to.be.true
      })
      it('sets the error class for invalid fields', async function () {
        // all fields from validates prop (attrs) are required
        const fields = Object.keys(validates)
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        fields.forEach(field => {
          const inputField = wrapper.find(`[data-field-type="${field}"]`)
          expect(inputField.hasClass('q-field-with-error'))
            .to.be.true
        })
      })
    })
  })
  describe('computed properties', () => {
    describe('authHeaders', () => {
      it('maps the authHeaders getter from the vuex store', () => {
        const wrapper = mount(CGNewResourceForm, {
          store,
          propsData: { model }
        })
        // check for initial values match
        expect(wrapper.vm.authHeaders)
          .to.equal(store.getters.authHeaders)
        // check after mutation committed to the store
        store.commit('updateAuth', {
          'access-token': 'xxxxx',
          'expiry': 'yyyyy'
        })
        expect(wrapper.vm.authHeaders)
          .to.deep.equal(store.getters.authHeaders)
      })
    })
  })
  describe('methods', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(CGNewResourceForm, {
        store,
        propsData: {
          model,
          validates
        }
      })
    })
    describe('errorClassCheck', () => {
      it('is a function', () => {
        expect(wrapper.vm.errorClassCheck).to.be.a('function')
      })
      context("given a String type attribute included in 'validates' prop object", () => {
        it('returns a boolean value', () => {
          const attrs = Object.keys(validates)
          attrs.forEach(attr => {
            expect(wrapper.vm.errorClassCheck(attr))
              .to.be.a('boolean')
          })
        })
      })
      context("given a String type attribute not included in 'validates' prop object", () => {
        it('returns undefined', () => {
          expect(wrapper.vm.errorClassCheck('variety'))
            .to.be.undefined
        })
      })
    })
    describe('errorMessageCheck', () => {
      it('is a function', () => {
        expect(wrapper.vm.errorMessageCheck).to.be.a('function')
      })
      context("given a String type attribute included in 'validates' prop object", () => {
        it('returns the correct error message', () => {
          // 'name' is included in the 'validates' prop
          expect(wrapper.vm.errorMessageCheck('name'))
            .to.equal('name is required')
        })
      })
      context("given a String type attribute not included in 'validates' prop object", () => {
        it('returns undefined', () => {
          expect(wrapper.vm.errorMessageCheck('variety'))
            .to.be.undefined
        })
      })
    })
    describe('touchIfValidates', () => {
      it('is a function', () => {
        expect(wrapper.vm.touchIfValidates).to.be.a('function')
      })
      context("given a String type attribute included in 'validates'", () => {
        it("sets the '$dirty' flag on the correct form field", () => {
          // 'producer' is included in the 'validates' prop
          const producerField = wrapper.vm.$v.form.producer
          wrapper.vm.touchIfValidates('producer')
          expect(producerField.$dirty).to.be.true
        })
      })
      context("given a String type attribute not included in 'validates' prop object", () => {
        it('returns undefined', () => {
          expect(wrapper.vm.touchIfValidates('variety'))
            .to.be.undefined
        })
      })
    })
    describe('parseModelProp', () => {
      describe('maps the model prop to a new object', () => {
        it("maps the model's attribute values to form object's keys", () => {
          const parsedModel = wrapper.vm.parseModelProp()

          expect(model.attributes.every(attr => {
            return Object.keys(parsedModel.form).includes(attr)
          })).to.equal(true)
        })
      })
    })
    describe('parseValidatesProp', () => {
      describe('maps the validates prop to a new object', () => {
        it("maps the validates top-level keys to form object's keys", () => {
          expect(wrapper.vm.parseValidatesProp).to.be.a('function')
          const form =
            wrapper.vm.parseValidatesProp()
              .form
          expect(Object.keys(form))
            .to.deep.equal(Object.keys(validates))
        })
        it('assigns the correct value each of form keys', () => {
          const form =
            wrapper.vm.parseValidatesProp()
              .form
          expect(Object.keys(form).every(attr => {
            return form[attr].required === required
          }))
            .to.be.true
        })
      })
    })
    describe('createResource', () => {
      it('is a function', () => {
        expect(CGNewResourceForm.methods.createResource).to.be.a('function')
      })
      let apiCall
      const coffeeData = {
        coffee: {
          id: 1,
          name: 'some coffee',
          producer: 'some producer',
          variety: 'some variety'
        }
      }
      beforeEach(() => {
        apiCall = sinon.stub(CoffeeGraderApi, 'post')
          .returns(Promise.resolve({
            data: coffeeData
          }))
      })
      afterEach(() => {
        apiCall.restore()
      })
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty', () => {
          wrapper.vm.createResource()
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('creates a toast to communicate form input errors', () => {
          const toastSpy = sinon.spy(Toast, 'create')
          wrapper.vm.createResource()

          expect(toastSpy.calledOnce).to.be.true
          toastSpy.restore()
        })
      })
      context('when form input is valid', () => {
        beforeEach(() => {
          wrapper.setData({
            form: {
              name: 'koooooona',
              producer: 'farmer alfalfa'
            }
          })
        })
        it('calls the api with the correct url', async function () {
          await wrapper.vm.createResource()
          expect(apiCall.calledWith('coffees.json')).to.be.true
        })
        it('calls the api post method with the correct object', async function () {
          await wrapper.vm.createResource()
          const secondArg = apiCall.args[0][1]

          expect(secondArg).to.deep.equal(wrapper.vm.form)
        })
        it('calls the api with correct auth headers', async function () {
          store.commit('updateAuth', {
            'access-token': 'xxxxx',
            'expiry': 'yyyyy'
          })
          const correctAuthHeaders = {
            headers: wrapper.vm.authHeaders
          }

          await wrapper.vm.createResource()
          const thirdArg = apiCall.args[0][2]

          expect(thirdArg).to.deep.equal(correctAuthHeaders)
        })
        context('on successful post response', () => {
          it("emits a 'created' event with the correct name", async function () {
            const spy = sinon.spy()
            /* we're creating a 'coffee' resource,
            so we'll expect a 'coffeeCreated' event' */
            wrapper.vm.$on('coffeeCreated', spy)

            await wrapper.vm.createResource()
            expect(spy.called).to.be.true
          })
          it("emits a 'created' event with the correct payload", async function () {
            const spy = sinon.spy()
            wrapper.vm.$on('coffeeCreated', spy)

            await wrapper.vm.createResource()
            expect(spy.calledWith(coffeeData)).to.be.true
          })
        })
      })
    })
    describe('clearForm', () => {
      it('is a function', () => {
        expect(wrapper.vm.clearForm).to.be.a('function')
      })
      beforeEach(() => {
        wrapper.setData({
          form: {
            name: 'the dude',
            producer: 'the valley',
            variety: 'nice marmot'
          }
        })
        // trigger form validations...
        wrapper.vm.$v.form.$touch()
      })
      it('clears the form fields', () => {
        wrapper.vm.clearForm()
        for (const field in wrapper.vm.form) {
          expect(wrapper.vm.form[field]).to.equal('')
        }
      })
      it('resets the validation object $dirty flag', () => {
        wrapper.vm.clearForm()
        expect(wrapper.vm.$v.form.$dirty).to.equal(false)
      })
    })
  })
})
