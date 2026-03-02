import { API_ENDPOINTS } from '@/client/config'
import type { ApiResult } from '@/types/api'
import type { CreateUserPayload, UpdateUserPayload, User, UsersQuery } from '@/types/user'

import { BaseClient } from './base.client'

class UserClient extends BaseClient {
  getUsers(query?: UsersQuery): Promise<ApiResult<User[]>> {
    return this.get<User[]>(API_ENDPOINTS.USERS, { params: query })
  }

  getUserById(id: string | number): Promise<ApiResult<User>> {
    return this.get<User>(`${API_ENDPOINTS.USERS}/${id}`)
  }

  createUser(payload: CreateUserPayload): Promise<ApiResult<User>> {
    return this.post<User, CreateUserPayload>(API_ENDPOINTS.USERS, payload)
  }

  updateUser(id: string | number, payload: UpdateUserPayload): Promise<ApiResult<User>> {
    return this.patch<User, UpdateUserPayload>(`${API_ENDPOINTS.USERS}/${id}`, payload)
  }
}

export const userClient = new UserClient()
