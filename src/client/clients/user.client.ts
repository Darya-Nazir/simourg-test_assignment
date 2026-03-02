import { API_ENDPOINTS } from '@/client/config'
import type { ApiResult } from '@/types/api'
import type {
  CreateUserPayload,
  PaginatedResponse,
  UpdateUserPayload,
  User,
  UsersQuery,
} from '@/types/user'

import { BaseClient } from './base.client'

class UserClient extends BaseClient {
  getUsers(query: UsersQuery): Promise<ApiResult<PaginatedResponse<User>>> {
    return this.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, { params: query })
  }

  getUserById(
    id: string | number,
    options?: { mock?: UsersQuery['mock'] },
  ): Promise<ApiResult<User>> {
    const config = options?.mock ? { params: { mock: options.mock } } : undefined
    return this.get<User>(`${API_ENDPOINTS.USERS}/${id}`, config)
  }

  createUser(
    payload: CreateUserPayload,
    options?: { mock?: UsersQuery['mock'] },
  ): Promise<ApiResult<User>> {
    const config = options?.mock ? { params: { mock: options.mock } } : undefined
    return this.post<User, CreateUserPayload>(API_ENDPOINTS.USERS, payload, config)
  }

  updateUser(
    id: string | number,
    payload: UpdateUserPayload,
    options?: { mock?: UsersQuery['mock'] },
  ): Promise<ApiResult<User>> {
    const config = options?.mock ? { params: { mock: options.mock } } : undefined
    return this.patch<User, UpdateUserPayload>(`${API_ENDPOINTS.USERS}/${id}`, payload, config)
  }
}

export const userClient = new UserClient()
