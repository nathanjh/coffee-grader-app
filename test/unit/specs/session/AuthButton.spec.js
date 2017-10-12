import AuthButton from '@/session/AuthButton'
import { mount } from 'vue-test-utils'

describe('AuthButton.vue', () => {
  // component relies almost entirely on data passed in by props
  const testPropsData = {
    bgColor: '#ff0000',
    textColor: '#00ff00',
    authProvider: 'test-provider',
    providerIcon: '../statics/fancy_provider_icon.png',
    baseURL: 'https://myApiWithOauth.com/',
    hashMode: false
  }
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
        const wrapper = mount(AuthButton, { propsData: testPropsData })
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
        const wrapper = mount(AuthButton, { propsData: testPropsData })
        assert(wrapper.hasProp('textColor', '#00ff00'))
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
        const wrapper = mount(AuthButton, { propsData: testPropsData })
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
        const wrapper = mount(AuthButton, { propsData: testPropsData })
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
        const wrapper = mount(AuthButton, { propsData: testPropsData })
        assert(wrapper.hasProp('baseURL', 'https://myApiWithOauth.com/'))
      })
    })
    describe('hashMode', () => {
      it('validates boolean type', () => {
        expect(AuthButton.props.hashMode).to.be.a('object')
        expect(AuthButton.props.hashMode.type).to.equal(Boolean)
      })
      it('has a default value', () => {
        expect(AuthButton.props.hashMode.default).to.equal(true)
      })
      it('receives valid data', () => {
        const wrapper = mount(AuthButton, { propsData: testPropsData })
        assert(wrapper.hasProp('hashMode', false))
      })
    })
  })
  describe('computed properties', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(AuthButton, { propsData: testPropsData })
    })
    describe('backgroundStyle', () => {
      it('is a function that returns an object with a background key', () => {
        expect(AuthButton.computed.backgroundStyle).to.be.a('function')
        expect(wrapper.vm.backgroundStyle.background).to.equal('#ff0000')
      })
    })
    describe('textStyle', () => {
      it('is a function that returns an object with a color key', () => {
        expect(AuthButton.computed.textStyle).to.be.a('function')
        expect(wrapper.vm.textStyle.color).to.equal('#00ff00')
      })
    })
    describe('iconStyle', () => {
      it('is a function that returns an object with a background key', () => {
        expect(AuthButton.computed.iconStyle).to.be.a('function')
        expect(wrapper.vm.iconStyle.background).to.match(/fancy_provider_icon/)
      })
    })
    describe('authOriginURL', () => {
      it('returns the current url scheme/host (string)', () => {
        const envStub =
          sinon.stub(process.env, 'NODE_ENV')
            .returns('development')
        expect(wrapper.vm.authOriginURL).to.equal('http://localhost:8080/')
        envStub.restore()
      })
    })
  })
  describe('rendered content', () => {
    let wrapper, envStub
    beforeEach(() => {
      envStub = sinon.stub(process.env, 'NODE_ENV').returns('development')
      wrapper = mount(AuthButton, {
        propsData: testPropsData,
        slots: { default: '<span>sign in with test-provider</span>' }
      })
    })
    afterEach(() => {
      envStub.restore()
    })
    describe('top-level anchor tag', () => {
      it('binds href attribute to computed properties', () => {
        const aTag = wrapper.find('a')
        expect(aTag.element.getAttribute('href'))
          .to.equal(`${testPropsData.baseURL}auth/${testPropsData.authProvider}?origin=${wrapper.vm.authOriginURL}&hashmode=${wrapper.vm.hashMode}`)
      })
    })
    describe('auth-button div', () => {
      it('binds style attr background color from computed properties', () => {
        const btnDiv = wrapper.find('#auth-button')
        assert(btnDiv.hasStyle('background-color', testPropsData.bgColor))
      })
    })
    describe('button text', () => {
      it('renders button text from default slot', () => {
        expect(wrapper.text()).to.include('sign in with test-provider')
      })
      it('binds text-color style attr from computed properties', () => {
        const textSpan = wrapper.find('span.button-text')
        assert(textSpan.hasStyle('color', testPropsData.textColor))
      })
    })
    describe('button image', () => {
      it('renders the button image inline', () => {
        const imgSpan = wrapper.find('span.icon')
        assert(imgSpan.hasStyle('background-image', `url(${testPropsData.providerIcon})`))
      })
    })
  })
})
