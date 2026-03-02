import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userClient } from '@/client/clients'
import { useUserForm } from '@/composables/users/useUserForm'

describe('useUserForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('does not submit create form when validation fails', async () => {
    const createSpy = vi.spyOn(userClient, 'createUser')
    const formApi = useUserForm({ mode: 'create' })

    formApi.form.name = ''
    formApi.form.email = 'not-an-email'
    formApi.form.status = 'active'

    const result = await formApi.submit()

    expect(result).toBeNull()
    expect(createSpy).not.toHaveBeenCalled()
    expect(formApi.errors.value.name).toBe('Full name is required.')
    expect(formApi.errors.value.email).toBe('Email must have a valid format (example: user@example.com).')
  })

  it('submits create form with normalized payload', async () => {
    const createSpy = vi.spyOn(userClient, 'createUser').mockResolvedValue({
      data: {
        id: 101,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        status: 'active',
      },
      error: null,
    })

    const formApi = useUserForm({ mode: 'create' })
    formApi.form.name = '  Ada Lovelace '
    formApi.form.email = ' ada@example.com '
    formApi.form.status = 'active'

    const result = await formApi.submit()

    expect(result?.name).toBe('Ada Lovelace')
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        status: 'active',
      }),
      {
        mock: undefined,
      },
    )
  })

  it('loads user in edit mode and submits patch', async () => {
    vi.spyOn(userClient, 'getUserById').mockResolvedValue({
      data: {
        id: 7,
        name: 'Grace Hopper',
        email: 'grace@example.com',
        status: 'active',
      },
      error: null,
    })
    const updateSpy = vi.spyOn(userClient, 'updateUser').mockResolvedValue({
      data: {
        id: 7,
        name: 'Grace Hopper Updated',
        email: 'grace@example.com',
        status: 'inactive',
      },
      error: null,
    })

    const formApi = useUserForm({ mode: 'edit', userId: '7' })

    const loaded = await formApi.loadUser()

    expect(loaded).toBe(true)
    expect(formApi.form.name).toBe('Grace Hopper')

    formApi.form.name = 'Grace Hopper Updated'
    formApi.form.status = 'inactive'

    const result = await formApi.submit()

    expect(result?.status).toBe('inactive')
    expect(updateSpy).toHaveBeenCalledWith('7', {
      name: 'Grace Hopper Updated',
      email: 'grace@example.com',
      status: 'inactive',
    }, {
      mock: undefined,
    })
  })
})
