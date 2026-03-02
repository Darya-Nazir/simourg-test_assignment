import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import App from '@/App.vue'
import { userClient } from '@/client/clients'
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
    vi.spyOn(userClient, 'getUsers').mockResolvedValue({
      data: {
        first: 1,
        prev: null,
        next: null,
        last: 1,
        pages: 1,
        items: 0,
        data: [],
      },
      error: null,
    })
    vi.spyOn(userClient, 'getUserById').mockResolvedValue({
      data: {
        id: 7,
        name: 'Grace Hopper',
        email: 'grace@example.com',
        status: 'active',
      },
      error: null,
    })

    const router = createTestRouter()
    router.push('/users')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
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
