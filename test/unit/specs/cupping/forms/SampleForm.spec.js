import 'babel-polyfill'
import SampleForm from '@/cupping/forms/SampleForm'
import CGAutocomplete from '@/cupping/forms/CGAutocomplete'
import CGNewResourceForm from '@/cupping/forms/CGNewResourceForm'
import { mount } from 'vue-test-utils'
import { Toast } from 'quasar'

describe('SampleForm.vue', () => {
  describe('rendered content', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SampleForm)
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
          const createSampleHandler = sinon.stub(wrapper.vm, 'createSample')
          submitSampleButton.trigger('click')
          assert(createSampleHandler.calledOnce)
          createSampleHandler.restore()
        })
      })
    })
  })
  describe('data', () => {
    it('has an Object type form property', () => {
      expect(SampleForm.data().form).to.be.a('object')
    })
    describe('form', () => {
      let form
      beforeEach(() => {
        form = SampleForm.data().form
      })
      it('form object has the correct keys', () => {
        const keys = [
          'roastDate',
          'coffeeAlias',
          'coffeeId',
          'roasterId'
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
    })
    describe('newCoffeeProps', () => {
      let newCoffeeProps
      beforeEach(() => {
        newCoffeeProps = SampleForm.data().newCoffeeProps
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
      let newRoasterProps
      beforeEach(() => {
        newRoasterProps = SampleForm.data().newRoasterProps
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
        const coffeeNotFound = SampleForm.data().coffeeNotFound
        expect(coffeeNotFound).to.equal(false)
      })
    })
    describe('roasterNotFound', () => {
      it('is a boolean type with default value of false', () => {
        const roasterNotFound = SampleForm.data().roasterNotFound
        expect(roasterNotFound).to.equal(false)
      })
    })
  })
  describe('form validations (Vuelidate)', () => {
    const form = SampleForm.validations.form

    it('validates roastDate, coffeeId, and roasterId by requirement', () => {
      expect(
        ['roastDate', 'coffeeId', 'roasterId'].every(k => {
          return Object.keys(form[k]).includes('required')
        })).to.be.true
    })
    describe('sets the error class for invalid fields', () => {
      let wrapper
      beforeEach(() => {
        wrapper = mount(SampleForm)
        wrapper.vm.$v.form.$touch()
      })
      it('for invalid roastDate', async function () {
        await wrapper.update()
        const roastDateField =
          wrapper.find('[data-field-type="roast-date"]')
        assert(roastDateField.hasClass('q-field-with-error'))
      })
      it('for invalid coffeeId', async function () {
        await wrapper.update()
        const coffeeField =
          wrapper.find('[data-field-type="coffee"]')
        assert(coffeeField.hasClass('q-field-with-error'))
      })
      it('for invalid roasterId', async function () {
        await wrapper.update()
        const roasterField =
          wrapper.find('[data-field-type="roaster"]')
        assert(roasterField.hasClass('q-field-with-error'))
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
      wrapper = mount(SampleForm)
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
        it("sets the autocomplete child component's 'terms' data property", () => {
          wrapper.vm.resourceCreatedHandler('coffee', payload)
          expect(wrapper.vm.$refs.coffeeAutocomplete.terms)
            .to.equal(`${payload.coffee.name} (${payload.coffee.origin})`)
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
    describe('vuex actions', () => {
      it("maps newSample action to local 'submitNewSample' method", () => {
        expect(wrapper.vm.submitNewSample).to.be.a('function')
      })
    })
    describe('createSample', () => {
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(wrapper.vm, 'submitNewSample')
            .returns(Promise.resolve({}))
      })
      afterEach(() => actionSpy.restore())
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs', () => {
          wrapper.vm.createSample()
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('returns before dispatching submitNewSample action if errors', () => {
          wrapper.vm.createSample()
          expect(actionSpy.called).to.be.false
        })
      })
      context('when submitNewSample is successful', () => {
        beforeEach(() => {
          wrapper.setData({
            form: {
              roastDate: '2018-01-01',
              coffeeId: 1,
              roasterId: 33
            }
          })
        })
        it('emits a newSampleAdded event', async function () {
          const spy = sinon.spy()
          wrapper.vm.$on('newSampleAdded', spy)
          await wrapper.vm.createSample()
          assert(spy.called)
        })
        it('calls the clearAllFields method', async function () {
          const spy = sinon.spy(wrapper.vm, 'clearAllFields')
          await wrapper.vm.createSample()
          assert(spy.called)
          spy.restore()
        })
        it('creates a toast to communicate success to the user', async function () {
          const toastSpy = sinon.spy(Toast.create, 'positive')
          await wrapper.vm.createSample()
          assert(toastSpy.calledOnce)
          toastSpy.restore()
        })
      })
    })
    describe('clearAllFields', () => {
      it('clears the autocomplete component form fields by calling their clearInput method', () => {
        wrapper.findAll(CGAutocomplete)
          .wrappers.forEach((cmp, idx) => {
            const spy = sinon.spy(cmp.vm, 'clearInput')
            wrapper.vm.clearAllFields()
            expect(spy.called).to.be.true
            spy.restore()
          })
      })
      it('clears the roastDate and coffeeAlias fields by resetting data properties', () => {
        wrapper.setData({
          form: {
            roastDate: '2017-11-29',
            coffeeAlias: 'sample A'
          }
        })
        assert(wrapper.vm.form.roastDate === '2017-11-29')
        assert(wrapper.vm.form.coffeeAlias === 'sample A')

        wrapper.vm.clearAllFields()
        expect(wrapper.vm.form.roastDate).to.equal('')
        expect(wrapper.vm.form.coffeeAlias).to.equal('')
      })
    })
  })
})
