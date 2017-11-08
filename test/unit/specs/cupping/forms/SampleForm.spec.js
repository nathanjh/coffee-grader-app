import 'babel-polyfill'
import SampleForm from '@/cupping/forms/SampleForm'
import CGAutocomplete from '@/cupping/forms/CGAutocomplete'
import CGNewResourceForm from '@/cupping/forms/CGNewResourceForm'
import { mount } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Cupping from 'src/store/modules/cupping'
import { Toast } from 'quasar'

Vue.use(Vuex)

describe('SampleForm.vue', () => {
  // make a store available to all unit tests
  const store = new Vuex.Store({
    modules: { Cupping }
  })

  describe('rendered content', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SampleForm, { store })
    })
    describe('coffee autocomplete message', () => {
      context('when no coffee is found', () => {
        it('renders a link to create a new coffee', async function () {
          await wrapper.setData({coffeeNotFound: true})

          const link = wrapper.find('[data-link-type="new-coffee"]')
          expect(link.is('a')).to.be.true
        })
        it('calls the coffeeModal open method when clicked', async function () {
          const spy = sinon.stub(wrapper.vm.$refs.coffeeModal, 'open')
          await wrapper.setData({ coffeeNotFound: true })

          const link = wrapper.find('[data-link-type="new-coffee"]')
          link.trigger('click')
          expect(spy.calledOnce).to.equal(true)
          spy.restore()
        })
        describe('coffeeModal', () => {
          it('renders a close button that calls the modal close method when clicked', async function () {
            await wrapper.setData({ coffeeNotFound: true })
            wrapper.find('[data-link-type="new-coffee"]')
              .trigger('click')
            const modalCloseBtn =
              wrapper.find('[data-button-type="coffee-modal-close"]')
            expect(modalCloseBtn.is('button')).to.be.true

            const spy = sinon.stub(wrapper.vm.$refs.coffeeModal, 'close')
            modalCloseBtn.trigger('click')
            expect(spy.calledOnce).to.be.true
          })
        })
      })
      describe('form submit button', () => {
        let submitSampleButton
        beforeEach(() => {
          submitSampleButton =
            wrapper.find('[data-button-type="submit-new-sample"]')
        })
        it('renders a form submit button', () => {
          assert(submitSampleButton.is('button'))
          expect(submitSampleButton.text()).to.include('Submit')
        })
        it('form submit button calls createSample method on click', () => {
          const createSampleHandler = sinon.spy(wrapper.vm, 'createSample')
          submitSampleButton.trigger('click')
          assert(createSampleHandler.calledOnce)
          createSampleHandler.restore()
        })
      })
    })
  })
  describe('data', () => {
    it('has an Object type form property', () => {
      const wrapper = mount(SampleForm, { store })
      expect(wrapper.vm.form).to.be.a('object')
    })
    describe('form', () => {
      let wrapper, form
      beforeEach(() => {
        /* cupping must exist for samples to be added, therefore, we will
           always have a cupping object in the store to initialize our
           cuppingId data property */
        store.commit('updateCupping', { id: 1 })
        wrapper = mount(SampleForm, { store })
        form = wrapper.vm.form
      })
      it('form object has the correct keys', () => {
        const keys = [
          'roastDate',
          'coffeeAlias',
          'coffeeId',
          'roasterId',
          'cuppingId'
        ]
        expect(Object.keys(form)).to.deep.equal(keys)
      })
      it('has a string type coffeeAlias property', () => {
        expect(form.coffeeAlias).to.be.a('string')
      })
      it('coffeeAlias default value is an empty string', () => {
        expect(form.coffeeAlias).to.equal('')
      })
      it('has a roastDate property with null initial value', () => {
        expect(form.roastDate).to.equal(null)
      })
      it('has coffeeId and roasterId properties with null initial values', () => {
        expect(['coffeeId', 'roasterId']
          .every(key => form[key] === null))
          .to.be.true
      })
      it('has a number type cuppingId property with initial value', () => {
        expect(form.cuppingId).not.to.be.null
        expect(form.cuppingId).to.be.a('number')
        expect(form.cuppingId).to.equal(1)
      })
    })
    describe('newCoffeeProps', () => {
      let wrapper, newCoffeeProps
      beforeEach(() => {
        wrapper = mount(SampleForm, { store })
        newCoffeeProps = wrapper.vm.newCoffeeProps
      })
      it('is an object that contains the model and validations objects', () => {
        expect(['model', 'validations']
          .every(key => Object.keys(newCoffeeProps).includes(key) &&
                        newCoffeeProps[key].constructor === Object))
          .to.be.true
      })
      describe('model', () => {
        let model
        beforeEach(() => {
          model = newCoffeeProps.model
        })
        it("has a String type 'name' property with the correct value", () => {
          expect(model.name).to.equal('coffee')
        })
        it("has an Array type 'attributes' property with the correct values ", () => {
          expect(Object.prototype.toString.call(model.attributes))
            .to.equal('[object Array]')
          expect(['name', 'origin', 'producer', 'variety']
            .every(val => model.attributes.includes(val)))
            .to.be.true
        })
      })
      describe('validations', () => {
        let validations
        beforeEach(() => {
          validations = newCoffeeProps.validations
        })
        it('is an object with the correct keys', () => {
          expect(validations).to.be.a('object')
          expect(['name', 'origin', 'producer']
            .every(key => Object.keys(validations).includes(key)))
            .to.be.true
        })
        it("each value is an object with a 'required' key and a boolean value of true", () => {
          for (const attr in validations) {
            expect(validations[attr].required).to.equal(true)
          }
        })
      })
    })
    describe('newRoasterProps', () => {
      let wrapper, newRoasterProps
      beforeEach(() => {
        wrapper = mount(SampleForm, { store })
        newRoasterProps = wrapper.vm.newRoasterProps
      })
      it('is an object that contains the coffeeModel and coffeeValidations objects', () => {
        expect(['model', 'validations']
          .every(key => Object.keys(newRoasterProps).includes(key) &&
                        newRoasterProps[key].constructor === Object))
          .to.be.true
      })
      describe('model', () => {
        let model
        beforeEach(() => {
          model = newRoasterProps.model
        })
        it("has a String type 'name' property with the correct value", () => {
          expect(model.name).to.equal('roaster')
        })
        it("has an Array type 'attributes' property with the correct values ", () => {
          expect(Object.prototype.toString.call(model.attributes))
            .to.equal('[object Array]')
          expect(['name', 'location', 'website']
            .every(val => model.attributes.includes(val)))
            .to.be.true
        })
      })
      describe('validations', () => {
        let validations
        beforeEach(() => {
          validations = newRoasterProps.validations
        })
        it('is an object with the correct keys', () => {
          expect(validations).to.be.a('object')
          expect(['name', 'location']
            .every(key => Object.keys(validations).includes(key)))
            .to.be.true
        })
        it("each value is an object with a 'required' key and a boolean value of true", () => {
          for (const attr in validations) {
            expect(validations[attr].required).to.equal(true)
          }
        })
      })
    })
    describe('coffeeNotFound', () => {
      it('is a boolean type with default value of false', () => {
        const coffeeNotFound =
          mount(SampleForm, { store })
            .vm.coffeeNotFound
        expect(coffeeNotFound).to.equal(false)
      })
    })
    describe('roasterNotFound', () => {
      it('is a boolean type with default value of false', () => {
        const roasterNotFound =
          mount(SampleForm, { store })
            .vm.roasterNotFound
        expect(roasterNotFound).to.equal(false)
      })
    })
  })
  describe('child components', () => {
    it('has a CGAutocomplete child component', () => {
      expect(SampleForm.components['CGAutocomplete'])
        .not.to.be.undefined
      expect(SampleForm.components['CGAutocomplete'])
        .to.equal(CGAutocomplete)
    })
    it('has a CGNewResourceForm child component', () => {
      expect(SampleForm.components['CGNewResourceForm'])
        .not.to.be.undefined
      expect(SampleForm.components['CGNewResourceForm'])
        .to.equal(CGNewResourceForm)
    })
  })
  describe('methods', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SampleForm, { store })
    })
    /* only testing coffee associated handlers, as roaster handlers
       function exactly the same way, but use different props data */
    describe('coffee autocomplete field handlers', () => {
      describe('itemSelectedHandler', () => {
        it('resets the coffeeNotFound property to false', () => {
          wrapper.setData({
            coffeeNotFound: true
          })
          assert(wrapper.vm.coffeeNotFound)
          wrapper.vm.itemSelectedHandler('coffee')
          expect(wrapper.vm.coffeeNotFound).to.equal(false)
        })
        it('sets the local form coffeeId data property', () => {
          const payload = {
            id: 1
          }
          wrapper.vm.itemSelectedHandler('coffee', payload)
          expect(wrapper.vm.form.coffeeId).to.equal(payload.id)
        })
      })
    })
    describe('new-coffee-form event handlers', () => {
      describe('resourceCreatedHandler', () => {
        const payload = {
          coffee: {
            id: 5,
            name: 'Mysore Nuggets',
            origin: 'India'
          }
        }
        it("calls the form-modal's close method", () => {
          const spy = sinon.spy(wrapper.vm.$refs.coffeeModal, 'close')
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(spy.calledOnce).to.be.true
          spy.restore()
        })
        it('renders a toast to communicate coffee successfully created', () => {
          const toastSpy = sinon.spy(Toast.create, 'positive')
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(toastSpy.calledOnce).to.be.true
          toastSpy.restore()
        })
        it('sets the local form coffeeId data property', () => {
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(wrapper.vm.form.coffeeId).to.equal(payload.coffee.id)
        })
        it("calls the autocomplete child component's 'clearInput' method", () => {
          const spy =
            sinon.spy(wrapper.vm.$refs.coffeeAutocomplete, 'clearInput')
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(spy.calledOnce).to.be.true
          spy.restore()
        })
        it('resets the coffeeNotFound property to false', () => {
          wrapper.setData({
            coffeeNotFound: true
          })
          assert(wrapper.vm.coffeeNotFound)
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(wrapper.vm.coffeeNotFound).to.equal(false)
        })
      })
    })
  })
})
