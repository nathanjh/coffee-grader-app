import { mount } from 'vue-test-utils'
import Index from '@/Index'

describe('Index.vue', () => {
  it('displays the title' () => {
    const wrapper = mount(Index)

    expect(wrapper.text()).to.include('Coffee Grader')
  })
})
