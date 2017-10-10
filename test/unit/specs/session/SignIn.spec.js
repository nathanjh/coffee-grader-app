import SignIn from '@/session/SignIn'
import SignInForm from '@/session/forms/SignInForm'
import { mount } from 'vue-test-utils'

describe('SignIn.vue', () => {
  describe('rendered content', () => {
    it('renders the signInForm component', () => {
      const form =
        mount(SignIn)
          .find(SignInForm)
      expect(form.is(SignInForm)).to.equal(true)
    })

    it('renders a sign-up link', () => {
      const link =
        mount(SignIn)
          .findAll('a')
            .at(1)
      const linkText = SignIn.data().linkText

      expect(link.element.getAttribute('href')).to.equal('#/sign-up')
      expect(link.text()).to.include(linkText)
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SignIn.data).to.be.a('function')
      expect(SignIn.data()).to.be.a('object')
    })
    it('has a string type linkText property', () => {
      expect(SignIn.data().linkText).to.be.a('string')
    })
  })
})
