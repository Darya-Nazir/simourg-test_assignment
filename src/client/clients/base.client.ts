import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { apiAxios } from '@/client/axios'
import { normalizeError } from '@/client/helpers/normalizeError'
import type { ApiResult } from '@/types/api'

export class BaseClient {
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>(() => apiAxios.get<T>(url, config))
  }

  protected async post<T, P>(url: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>(() => apiAxios.post<T, AxiosResponse<T>, P>(url, payload, config))
  }

  protected async patch<T, P>(url: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>(() => apiAxios.patch<T, AxiosResponse<T>, P>(url, payload, config))
  }

  private async request<T>(executor: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
    try {
      const response = await executor()
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: normalizeError(error) }
    }
  }
}
