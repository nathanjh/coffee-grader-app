import NewCuppingWizard from '@/cupping/NewCuppingWizard'
import CuppingForm from '@/cupping/forms/CuppingForm'
import SampleForm from '@/cupping/forms/SampleForm'
import InviteForm from '@/cupping/forms/InviteForm'
import Vue from 'vue'
import Vuex from 'vuex'
import Cupping from 'src/store/modules/cupping'
import { shallow, mount } from 'vue-test-utils'

describe('NewCuppingWizard.vue', () => {
  Vue.use(Vuex)
  const store = new Vuex.Store({
    modules: { Cupping }
  })
  describe('child components', () => {
    it('has a CuppingForm component', () => {
      expect(NewCuppingWizard.components['CuppingForm'])
        .to.equal(CuppingForm)
    })
    it('has a SampleForm component', () => {
      expect(NewCuppingWizard.components['SampleForm'])
        .to.equal(SampleForm)
    })
    it('has an InviteForm component', () => {
      expect(NewCuppingWizard.components['InviteForm'])
        .to.equal(InviteForm)
    })
  })
  describe('data', () => {
    it('has a cuppingCreated property with default value of false', () => {
      expect(NewCuppingWizard.data().cuppingCreated)
        .to.equal(false)
    })
    it('has a sampleAdded property with default value of false', () => {
      expect(NewCuppingWizard.data().sampleAdded)
        .to.equal(false)
    })
  })
  describe('methods', () => {
    // let wrapper
    // beforeEach(() => {
    //   wrapper = shallow(NewCuppingWizard)
    // })
    describe('sampleAddedHandler', () => {
      it('sets the sampleAdded property to true (bool) if it was false', () => {
        const wrapper = shallow(NewCuppingWizard)
        expect(wrapper.vm.sampleAdded).to.equal(false)
        wrapper.vm.sampleAddedHandler()
        expect(wrapper.vm.sampleAdded).to.equal(true)
      })
    })
    describe('cuppingCreatedHandler', () => {
      let wrapper
      beforeEach(() => {
        wrapper = mount(NewCuppingWizard, { store })
      })
      it("calls the 'next' method on q-stepper", () => {
        const spy = sinon.spy(wrapper.vm.$refs.wizard, 'next')
        wrapper.vm.cuppingCreatedHandler()
        expect(spy.calledOnce).to.be.true
        spy.restore()
      })
      it('sets the cuppingCreated property to true (bool)', () => {
        expect(wrapper.vm.cuppingCreated).to.equal(false)
        wrapper.vm.cuppingCreatedHandler()
        expect(wrapper.vm.cuppingCreated).to.equal(true)
      })
    })
  })
})
