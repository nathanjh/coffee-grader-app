import SignUp from '@/session/SignUp'
import SignUpForm from '@/session/forms/SignUpForm'
import { mount } from 'vue-test-utils'

describe('SignUp.vue', () => {
  describe('rendered content', () => {
    it('renders the signUpForm component', () => {
      const form =
        mount(SignUp)
          .find(SignUpForm)
      expect(form.is(SignUpForm)).to.equal(true)
    })
    it('renders a sign-in link', () => {
      const link =
        mount(SignUp)
          .find('[data-link-type="sign-in"]')

      const linkText = SignUp.data().linkText

      expect(link.element.getAttribute('href')).to.equal('#/sign-in')
      expect(link.text()).to.include(linkText)
    })
  })
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(SignUp.data).to.be.a('function')
      expect(SignUp.data()).to.be.a('object')
    })
    it('has a string type linkText property', () => {
      expect(SignUp.data().linkText).to.be.a('string')
    })
  })
  describe('props', () => {
    it('has a props object', () => {
      expect(SignUpForm.props).to.be.a('object')
    })
    describe('inviteToken', () => {
      it('validates String type', () => {
        expect(SignUpForm.props.inviteToken).to.be.a('object')
        expect(SignUpForm.props.inviteToken.type).to.equal(String)
      })
      it('default value is an empty string', () => {
        expect(SignUpForm.props.inviteToken.default).to.equal('')
      })
      it('receives valid data', () => {
        const wrapper = mount(SignUpForm, { propsData: { inviteToken: '123abc' } })
        assert(wrapper.hasProp('inviteToken', '123abc'))
      })
    })
  })
})
