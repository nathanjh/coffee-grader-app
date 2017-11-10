import 'babel-polyfill'
import InviteForm from '@/cupping/forms/InviteForm'
import CGAutocomplete from '@/cupping/forms/CGAutocomplete'
import { mount } from 'vue-test-utils'

describe('InviteForm.vue', () => {
  describe('data', () => {
    it('has an Object type form property', () => {
      expect(InviteForm.data().form).to.be.a('object')
    })
    describe('form', () => {
      const form = InviteForm.data().form
      it('form has the correct keys', () => {
        const keys = ['graderId', 'graderEmail']
        expect(Object.keys(form)).to.deep.equal(keys)
      })
      it('has a graderId property with null initial value', () => {
        expect(form.graderId).to.be.null
      })
      it('has a string type graderEmail property', () => {
        expect(form.graderEmail).to.be.a('string')
      })
      it('graderEmail initial value is an empty string', () => {
        expect(form.graderEmail).to.equal('')
      })
    })
    describe('userNotFound', () => {
      it('is a boolean type with default vaule of false', () => {
        const userNotFound = InviteForm.data().userNotFound
        expect(userNotFound).to.equal(false)
      })
    })
  })
  describe('child components', () => {
    it('has a CGAutocomplete child component', () => {
      expect(InviteForm.components['CGAutocomplete'])
        .not.to.be.undefined
      expect(InviteForm.components['CGAutocomplete'])
        .to.equal(CGAutocomplete)
    })
  })
  describe('methods', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(InviteForm)
    })
    describe('vuex actions', () => {
      it("maps newInvite action to local 'submitNewInvite' method", () => {
        expect(wrapper.vm.submitNewInvite).to.be.a('function')
      })
    })
    describe('createInvite', () => {
      let actionSpy
      beforeEach(() => {
        actionSpy =
          sinon.stub(wrapper.vm, 'submitNewInvite')
            .returns(Promise.resolve({}))
      })
      afterEach(() => actionSpy.restore())
      describe('validates form input for errors', () => {
        it('sets all form fields to dirty to check form empty inputs')
        it('returns before dispatching submitNewInvite action if errors')
      })
      context('when submitNewInvite is successful', () => {
        beforeEach(() => {
          wrapper.setData({
            form: {
              graderId: 44
            }
          })
        })
        it('emits a newInviteAdded event', async function () {
          await wrapper.vm.createInvite()
          expect(Object.keys(wrapper.emitted()))
            .to.include('newInviteAdded')
        })
      })
    })
  })
})
