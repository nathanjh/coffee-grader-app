import CuppingForm from '@/cupping/forms/CuppingForm'
import Vuex from 'vuex'
import Vue from 'vue'
import Cupping from 'src/store/modules/cupping'
import { mount } from 'vue-test-utils'

describe('CuppingForm.vue', () => {
  Vue.use(Vuex)

  describe('rendered content', () => {
    let wrapper, submitCuppingButton
    beforeEach(() => {
      wrapper = mount(CuppingForm)
      submitCuppingButton = wrapper.find('[data-button-type="submit-new-cupping"]')
    })
    it('renders a form submit button', () => {
      assert(submitCuppingButton.is('button'))
      expect(submitCuppingButton.text()).to.include('Submit')
    })
    it('submitCuppingButton calls createCupping method on click', () => {
      const createCuppingHandler = sinon.spy(wrapper.vm, 'createCupping')
      submitCuppingButton.trigger('click')
      assert(createCuppingHandler.calledOnce)
      createCuppingHandler.restore()
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(CuppingForm.data).to.be.a('function')
      expect(CuppingForm.data()).to.be.a('object')
    })
    it('has an object type form property', () => {
      expect(CuppingForm.data().form).to.be.a('object')
    })
    it('form has location, cupDate, and cupsPerSample keys', () => {
      const keys = ['location', 'cupDate', 'cupsPerSample']
      expect(Object.keys(CuppingForm.data().form)).to.deep.equal(keys)
    })
    it('has a string type location property', () => {
      expect(CuppingForm.data().form.location).to.be.a('string')
    })
    it('location default value is an empty string', () => {
      expect(CuppingForm.data().form.location).to.equal('')
    })
    it('has a cupDate property with null initial value', () => {
      expect(CuppingForm.data().form.cupDate).to.equal(null)
    })
    it('has a number type cupsPerSample property', () => {
      expect(CuppingForm.data().form.cupsPerSample).to.be.a('number')
    })
    it('cupsPerSample default value is 3', () => {
      expect(CuppingForm.data().form.cupsPerSample).to.equal(3)
    })
    it("has a Date type 'today' property", () => {
      const today = CuppingForm.data().today
      // test for js Date object instance
      expect(Object.prototype.toString.call(today))
        .to.equal('[object Date]')
    })
  })
  describe('form validations (Vuelidate)', () => {
    const form = CuppingForm.validations.form

    it('validates form.location by requirement', () => {
      expect(Object.keys(form.location)).to.include('required')
      expect(form.location.required).to.be.a('function')
    })
    it('sets the error class for invalid location', done => {
      const wrapper = mount(CuppingForm)
      // location is required...
      wrapper.vm.$v.form.location.$touch()
      wrapper.vm.$nextTick(() => {
        const locationField = wrapper.find('[data-field-type="location"]')
        assert(locationField.hasClass('q-field-with-error'))
        done()
      })
    })
    it('validates form.cupDate by requirement', () => {
      expect(Object.keys(form.cupDate)).to.include('required')
      expect(form.cupDate.required).to.be.a('function')
    })
    it('sets the error class for invalid cupDate', done => {
      const wrapper = mount(CuppingForm)
      // cupDate is required...
      wrapper.vm.$v.form.cupDate.$touch()
      wrapper.vm.$nextTick(() => {
        const cupDateField = wrapper.find('[data-field-type="cup-date"]')
        assert(cupDateField.hasClass('q-field-with-error'))
        done()
      })
    })
    it('validates form.cupsPerSample by type (Number)', () => {
      expect(Object.keys(form.cupsPerSample)).to.include('isNum')
      expect(form.cupsPerSample.isNum).to.be.a('function')
    })
    it('validates form.cupsPerSample by requirement', () => {
      expect(Object.keys(form.cupsPerSample)).to.include('required')
      expect(form.cupsPerSample.required).to.be.a('function')
    })
    it('sets the error class for invalid cupsPerSample', done => {
      const wrapper = mount(CuppingForm)
      // cupsPerSample should be a number...
      wrapper.setData({
        form: {
          cupsPerSample: 'notanumber'
        }
      })
      wrapper.vm.$v.form.cupsPerSample.$touch()
      wrapper.vm.$nextTick(() => {
        const cupsPerSampleField = wrapper.find('[data-field-type="cups-per-sample"]')
        assert(cupsPerSampleField.hasClass('q-field-with-error'))
        done()
      })
    })
  })
  describe('methods', () => {
    /* add a store instance available to tests due to mapped action
    dependency */
    const store = new Vuex.Store({
      modules: {
        Cupping
      }
    })
    describe('vuex actions', () => {
      it("maps newCupping action to local 'submitNewCupping' method", () => {
        expect(CuppingForm.methods.submitNewCupping).to.be.a('function')
      })
    })
    describe('createCupping', () => {
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(CuppingForm.methods, 'submitNewCupping')
            .returns(Promise.resolve({}))
      })
      afterEach(() => {
        actionSpy.restore()
      })
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check for empty inputs', () => {
          const wrapper = mount(CuppingForm, { store })
          wrapper.vm.createCupping()
          expect(wrapper.vm.$v.form.$dirty).to.be.true
        })
        it('returns before dispatching submitNewCupping action if errors', () => {
          mount(CuppingForm, { store })
            .vm.createCupping()
          assert(!actionSpy.called)
        })
      })
      context('when submitNewCupping is successful', () => {
        const validFormData = {
          location: 'Anywhere, USA',
          cupDate: '2017-10-19T02:09:19.953Z',
          cupsPerSample: 5
        }
        it('emits a newCuppingCreated event', async function () {
          const spy = sinon.spy()
          const wrapper = mount(CuppingForm, { store })
          wrapper.setData({ form: validFormData })
          // listen for newCuppingCreated event...
          wrapper.vm.$on('newCuppingCreated', spy)
          await wrapper.vm.createCupping()
          assert(spy.called)
        })
      })
    })
  })
})
