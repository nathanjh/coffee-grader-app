import NewCuppingWizard from '@/cupping/NewCuppingWizard'
import CuppingForm from '@/cupping/forms/CuppingForm'
import SampleForm from '@/cupping/forms/SampleForm'
import InviteForm from '@/cupping/forms/InviteForm'
// import { mount } from 'vue-test-utils'

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
})
