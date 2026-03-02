export interface User {
  id: number
  name: string
  email?: string
  status?: 'active' | 'inactive'
  createdAt?: string
}

export interface UsersQuery {
  page: number
  limit: number
  search?: string
  mock?: 'empty' | 'slow' | 'error' | 'network'
}

export interface PaginatedResponse<T> {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: T[]
}

export type CreateUserPayload = Pick<User, 'name'> &
  Partial<Pick<User, 'email' | 'status' | 'createdAt'>>

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'createdAt'>>

export interface HealthStatus {
  status: string
}
