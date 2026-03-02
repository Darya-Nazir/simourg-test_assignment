import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userClient } from '@/client/clients'
import { useUsersStore } from '@/stores/users'

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('parses route query and applies defaults for invalid values', () => {
    const store = useUsersStore()

    store.applyRouteQuery({ page: '2', limit: '10', search: '  ada  ' })

    expect(store.page).toBe(2)
    expect(store.limit).toBe(10)
    expect(store.search).toBe('ada')

    store.applyRouteQuery({ page: '0', limit: '-1', search: 42 as never })

    expect(store.page).toBe(1)
    expect(store.limit).toBe(5)
    expect(store.search).toBe('')
  })

  it('loads paginated users using current query state', async () => {
    const store = useUsersStore()
    store.applyRouteQuery({ page: '3', limit: '5', search: 'grace' })

    const getUsersSpy = vi.spyOn(userClient, 'getUsers').mockResolvedValue({
      data: {
        first: 1,
        prev: 2,
        next: 4,
        last: 7,
        pages: 7,
        items: 33,
        data: [
          {
            id: 2,
            name: 'Grace Hopper',
            email: 'grace@example.com',
            status: 'active',
          },
        ],
      },
      error: null,
    })

    await store.fetchUsers()

    expect(getUsersSpy).toHaveBeenCalledWith({ page: 3, limit: 5, search: 'grace' })
    expect(store.items).toHaveLength(1)
    expect(store.total).toBe(33)
    expect(store.totalPages).toBe(7)
    expect(store.error).toBeNull()
  })

  it('clears list and keeps normalized error on fetch failure', async () => {
    const store = useUsersStore()

    vi.spyOn(userClient, 'getUsers').mockResolvedValue({
      data: null,
      error: {
        code: 'HTTP_ERROR',
        message: 'Request failed',
        status: 500,
      },
    })

    await store.fetchUsers()

    expect(store.items).toEqual([])
    expect(store.total).toBe(0)
    expect(store.error?.status).toBe(500)
    expect(store.isLoading).toBe(false)
  })
})
