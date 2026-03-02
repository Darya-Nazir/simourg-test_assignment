import type { AxiosError, AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiAxios } from '@/client/axios'
import { userClient } from '@/client/clients'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'

describe('userClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads users list via GET /users', async () => {
    const responseData: User[] = [{ id: 1, name: 'Alice' }]
    const getSpy = vi
      .spyOn(apiAxios, 'get')
      .mockResolvedValue({ data: responseData } as AxiosResponse<User[]>)

    const result = await userClient.getUsers({ page: 1, limit: 10, search: 'ali' })

    expect(getSpy).toHaveBeenCalledWith('/users', { params: { page: 1, limit: 10, search: 'ali' } })
    expect(result).toEqual({ data: responseData, error: null })
  })

  it('loads user by id via GET /users/:id', async () => {
    const responseData: User = { id: 7, name: 'Bob' }
    const getSpy = vi.spyOn(apiAxios, 'get').mockResolvedValue({ data: responseData } as AxiosResponse<User>)

    const result = await userClient.getUserById(7)

    expect(getSpy).toHaveBeenCalledWith('/users/7', undefined)
    expect(result).toEqual({ data: responseData, error: null })
  })

  it('creates user via POST /users', async () => {
    const payload: CreateUserPayload = { name: 'Kate', email: 'kate@example.com' }
    const responseData: User = { id: 12, ...payload }
    const postSpy = vi.spyOn(apiAxios, 'post').mockResolvedValue({ data: responseData } as AxiosResponse<User>)

    const result = await userClient.createUser(payload)

    expect(postSpy).toHaveBeenCalledWith('/users', payload, undefined)
    expect(result).toEqual({ data: responseData, error: null })
  })

  it('updates user via PATCH /users/:id', async () => {
    const payload: UpdateUserPayload = { name: 'Kate Updated' }
    const responseData: User = { id: 12, name: 'Kate Updated' }
    const patchSpy = vi.spyOn(apiAxios, 'patch').mockResolvedValue({ data: responseData } as AxiosResponse<User>)

    const result = await userClient.updateUser(12, payload)

    expect(patchSpy).toHaveBeenCalledWith('/users/12', payload, undefined)
    expect(result).toEqual({ data: responseData, error: null })
  })

  it('normalizes HTTP errors to ApiResult', async () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Request failed with status code 400',
      response: {
        status: 400,
        data: { message: 'Validation failed' },
      },
    } as AxiosError<{ message: string }>

    vi.spyOn(apiAxios, 'get').mockRejectedValue(axiosError)

    const result = await userClient.getUsers()

    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      code: 'HTTP_ERROR',
      message: 'Validation failed',
      status: 400,
      details: { message: 'Validation failed' },
    })
  })
})
