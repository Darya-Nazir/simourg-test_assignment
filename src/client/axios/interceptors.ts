import type { AxiosInstance } from 'axios'

import { normalizeError } from '@/client/helpers/normalizeError'

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use((config) => {
    config.headers = config.headers ?? {}
    config.headers.Accept = 'application/json'
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeError(error)),
  )
}
