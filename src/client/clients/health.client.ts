import { API_ENDPOINTS } from '@/client/config'
import type { ApiResult } from '@/types/api'
import type { HealthStatus } from '@/types/user'

import { BaseClient } from './base.client'

class HealthClient extends BaseClient {
  getHealth(): Promise<ApiResult<HealthStatus>> {
    return this.get<HealthStatus>(API_ENDPOINTS.HEALTH)
  }
}

export const healthClient = new HealthClient()
