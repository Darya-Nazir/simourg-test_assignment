export type AppErrorCode = 'HTTP_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR'

export interface AppError {
  code: AppErrorCode
  message: string
  status: number | null
  details?: unknown
}

export interface ApiResult<T> {
  data: T | null
  error: AppError | null
}

export const isAppError = (value: unknown): value is AppError => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<AppError>
  return (
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string' &&
    (typeof candidate.status === 'number' || candidate.status === null)
  )
}
