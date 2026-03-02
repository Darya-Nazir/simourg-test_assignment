import type { LocationQuery } from 'vue-router'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { userClient } from '@/client/clients'
import type { AppError } from '@/types/api'
import type { User, UsersQuery } from '@/types/user'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 5

const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const parseSearch = (value: unknown): string => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const page = ref(DEFAULT_PAGE)
  const limit = ref(DEFAULT_LIMIT)
  const total = ref(0)
  const search = ref('')

  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const query = computed<UsersQuery>(() => ({
    page: page.value,
    limit: limit.value,
    ...(search.value ? { search: search.value } : {}),
  }))

  const applyRouteQuery = (routeQuery: LocationQuery): void => {
    page.value = parsePositiveInt(routeQuery.page, DEFAULT_PAGE)
    limit.value = parsePositiveInt(routeQuery.limit, DEFAULT_LIMIT)
    search.value = parseSearch(routeQuery.search)
  }

  const setPage = (nextPage: number): void => {
    page.value = parsePositiveInt(nextPage, DEFAULT_PAGE)
  }

  const setLimit = (nextLimit: number): void => {
    limit.value = parsePositiveInt(nextLimit, DEFAULT_LIMIT)
    page.value = DEFAULT_PAGE
  }

  const setSearch = (value: string): void => {
    search.value = parseSearch(value)
    page.value = DEFAULT_PAGE
  }

  const fetchUsers = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    const result = await userClient.getUsers(query.value)

    if (result.error) {
      items.value = []
      total.value = 0
      error.value = result.error
      isLoading.value = false
      return
    }

    items.value = result.data?.data ?? []
    total.value = result.data?.items ?? 0
    isLoading.value = false
  }

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    search,
    isLoading,
    error,
    query,
    applyRouteQuery,
    setPage,
    setLimit,
    setSearch,
    fetchUsers,
  }
})
