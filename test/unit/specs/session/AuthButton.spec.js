import AuthButton from '@/session/AuthButton'
import { mount } from 'vue-test-utils'

describe('AuthButton.vue', () => {
  describe('props', () => {
    it('has a props object', () => {
      expect(AuthButton.props).to.be.a('object')
    })

    describe('bgColor', () => {
      it('validates String type', () => {
        expect(AuthButton.props.bgColor).to.be.a('object')
        expect(AuthButton.props.bgColor.type).to.equal(String)
      })
      it('has a default value', () => {
        expect(AuthButton.props.bgColor.default).to.equal('#ffffff')
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, {
          propsData: {
            bgColor: '#ff0000'
          }
        })
        assert(wrapper.hasProp('bgColor', '#ff0000'))
      })
    })
    describe('textColor', () => {
      it('validates String type', () => {
        expect(AuthButton.props.textColor).to.be.a('object')
        expect(AuthButton.props.textColor.type).to.equal(String)
      })
      it('has a default value', () => {
        expect(AuthButton.props.textColor.default).to.equal('#000000')
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, {
          propsData: {
            textColor: '#ff0000'
          }
        })
        assert(wrapper.hasProp('textColor', '#ff0000'))
      })
    })
    describe('authProvider', () => {
      it('validates String type', () => {
        expect(AuthButton.props.authProvider).to.be.a('object')
        expect(AuthButton.props.authProvider.type).to.equal(String)
      })
      it('is required', () => {
        assert(AuthButton.props.authProvider.required)
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, {
          propsData: {
            authProvider: 'test-provider'
          }
        })
        assert(wrapper.hasProp('authProvider', 'test-provider'))
      })
    })
    describe('providerIcon', () => {
      it('validates String type', () => {
        expect(AuthButton.props.providerIcon).to.be.a('object')
        expect(AuthButton.props.providerIcon.type).to.equal(String)
      })
      it('is required', () => {
        assert(AuthButton.props.authProvider.required)
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, {
          propsData: {
            providerIcon: '../statics/fancy_provider_icon.png'
          }
        })
        assert(wrapper.hasProp('providerIcon', '../statics/fancy_provider_icon.png'))
      })
    })
    describe('baseURL', () => {
      it('validates String type', () => {
        expect(AuthButton.props.baseURL).to.be.a('object')
        expect(AuthButton.props.baseURL.type).to.equal(String)
      })
      it('is required', () => {
        assert(AuthButton.props.baseURL.required)
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, {
          propsData: {
            baseURL: 'https://myApiWithOauth.com/'
          }
        })
        assert(wrapper.hasProp('baseURL', 'https://myApiWithOauth.com/'))
      })
    })
  })
})
