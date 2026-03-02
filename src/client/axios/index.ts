import axios from 'axios'

import { setupInterceptors } from './interceptors'

export const apiAxios = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

setupInterceptors(apiAxios)
