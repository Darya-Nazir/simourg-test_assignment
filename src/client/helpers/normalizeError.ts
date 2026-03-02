import axios from 'axios'

import { type AppError, isAppError } from '@/types/api'

const extractMessage = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.trim().length > 0
  ) {
    return value.message
  }

  return fallback
}

export const normalizeError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null

    return {
      code: status === null ? 'NETWORK_ERROR' : 'HTTP_ERROR',
      message: extractMessage(error.response?.data, error.message || 'Request failed'),
      status,
      details: error.response?.data,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status: null,
      details: null,
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Unexpected error',
    status: null,
    details: null,
  }
}
