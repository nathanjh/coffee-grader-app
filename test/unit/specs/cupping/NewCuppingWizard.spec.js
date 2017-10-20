import NewCuppingWizard from '@/cupping/NewCuppingWizard'
import CuppingForm from '@/cupping/forms/CuppingForm'
import { mount } from 'vue-test-utils'

describe('NewCuppingWizard.vue', () => {
  describe('child components', () => {
    it('has a CuppingForm component', () => {
      expect(Object.keys(NewCuppingWizard.components))
        .to.include('CuppingForm')
      expect(NewCuppingWizard.components['CuppingForm'])
        .to.equal(CuppingForm)
    })
  })
})
