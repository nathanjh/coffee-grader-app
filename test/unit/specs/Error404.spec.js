import { mount } from 'vue-test-utils'
import Error404 from '@/Error404'

describe('Error404.vue', () => {
  it('displays an error message', () => {
    const { message } = Error404.data()
    const wrapper = mount(Error404)

    expect(wrapper.text()).to.include(message)
  })
})
