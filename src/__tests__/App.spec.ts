import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders app title and navigation links', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true,
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Simourg')
    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Create user')
    expect(wrapper.text()).toContain('Edit user #1')
  })
})
