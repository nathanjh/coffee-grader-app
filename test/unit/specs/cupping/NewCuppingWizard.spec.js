import NewCuppingWizard from '@/cupping/NewCuppingWizard'
import CuppingForm from '@/cupping/forms/CuppingForm'
import SampleForm from '@/cupping/forms/SampleForm'
import InviteForm from '@/cupping/forms/InviteForm'
import { shallow } from 'vue-test-utils'

describe('NewCuppingWizard.vue', () => {
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
  describe('methods', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(NewCuppingWizard)
    })
    describe('sampleAddedHandler', () => {
      it('sets the sampleAdded property to true (bool) if it was false', () => {
        expect(wrapper.vm.sampleAdded).to.equal(false)
        wrapper.vm.sampleAddedHandler()
        expect(wrapper.vm.sampleAdded).to.equal(true)
      })
    })
  })
})
