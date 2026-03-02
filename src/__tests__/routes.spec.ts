import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'
import { ROUTE_NAMES, appRoutes } from '@/router/routes'

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: appRoutes,
  })

describe('Users routes', () => {
  it('contains all stage-2 routes in route registry', () => {
    const router = createTestRouter()

    expect(router.resolve('/users').name).toBe(ROUTE_NAMES.USERS_LIST)
    expect(router.resolve('/users/new').name).toBe(ROUTE_NAMES.USERS_NEW)
    expect(router.resolve('/users/42/edit').name).toBe(ROUTE_NAMES.USERS_EDIT)
  })

  it('renders all pages when navigating between routes', async () => {
    const router = createTestRouter()
    router.push('/users')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Users List')

    await router.push('/users/new')
    await flushPromises()
    expect(wrapper.text()).toContain('Create User')

    await router.push('/users/7/edit')
    await flushPromises()
    expect(wrapper.text()).toContain('Edit User')
    expect(wrapper.text()).toContain('id: 7')
  })
})
