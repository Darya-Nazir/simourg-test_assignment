<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/Common/AppButton.vue'
import AppEmptyState from '@/components/Common/AppEmptyState.vue'
import AppInput from '@/components/Common/AppInput.vue'
import AppLoader from '@/components/Common/AppLoader.vue'
import AppSelect from '@/components/Common/AppSelect.vue'
import type { AppSelectOption } from '@/components/Common/AppSelect.vue'
import { useUsersStore } from '@/stores/users'

const LIMIT_OPTIONS: AppSelectOption[] = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '15', label: '15' },
]

const MOCK_OPTIONS: AppSelectOption[] = [
  { value: '', label: 'normal' },
  { value: 'empty', label: 'empty' },
  { value: 'slow', label: 'slow' },
  { value: 'error', label: 'error' },
  { value: 'network', label: 'network' },
]

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()

const { items, page, limit, total, totalPages, search, mock, isLoading, error } = storeToRefs(usersStore)
const searchInput = ref('')
const limitInput = ref('5')
const mockInput = ref('')

const normalizedRouteQuery = computed(() => ({
  page: String(route.query.page ?? ''),
  limit: String(route.query.limit ?? ''),
  search: String(route.query.search ?? ''),
  mock: String(route.query.mock ?? ''),
}))

const normalizedStoreQuery = computed(() => ({
  page: String(page.value),
  limit: String(limit.value),
  search: search.value,
  mock: String(mock.value ?? ''),
}))

const syncRouteWithStore = async (): Promise<void> => {
  if (
    normalizedRouteQuery.value.page === normalizedStoreQuery.value.page &&
    normalizedRouteQuery.value.limit === normalizedStoreQuery.value.limit &&
    normalizedRouteQuery.value.search === normalizedStoreQuery.value.search &&
    normalizedRouteQuery.value.mock === normalizedStoreQuery.value.mock
  ) {
    return
  }

  await router.push({
    query: {
      page: String(page.value),
      limit: String(limit.value),
      ...(search.value ? { search: search.value } : {}),
      ...(mock.value ? { mock: mock.value } : {}),
    },
  })
}

const goToPreviousPage = async (): Promise<void> => {
  if (page.value <= 1 || isLoading.value) {
    return
  }

  usersStore.setPage(page.value - 1)
  await syncRouteWithStore()
}

const goToNextPage = async (): Promise<void> => {
  if (page.value >= totalPages.value || isLoading.value) {
    return
  }

  usersStore.setPage(page.value + 1)
  await syncRouteWithStore()
}

const onSubmitSearch = async (): Promise<void> => {
  if (isLoading.value) {
    return
  }

  usersStore.setSearch(searchInput.value)
  await syncRouteWithStore()
}

const onLimitChange = async (value: string): Promise<void> => {
  usersStore.setLimit(Number(value))
  await syncRouteWithStore()
}

const onMockChange = async (value: string): Promise<void> => {
  usersStore.setMockScenario(value)
  await syncRouteWithStore()
}

const resetFilters = async (): Promise<void> => {
  usersStore.setSearch('')
  usersStore.setMockScenario(undefined)
  searchInput.value = ''
  mockInput.value = ''
  await syncRouteWithStore()
}

const retryFetch = async (): Promise<void> => {
  await usersStore.fetchUsers()
}

const statusClass = (value: string | undefined): string => {
  return value === 'active' ? 'users-list-page__status users-list-page__status--active' : 'users-list-page__status'
}

watch(
  () => route.query,
  async (query) => {
    usersStore.applyRouteQuery(query)
    searchInput.value = search.value
    limitInput.value = String(limit.value)
    mockInput.value = mock.value ?? ''
    await usersStore.fetchUsers()
  },
  { immediate: true },
)
</script>

<template>
  <section class="users-list-page">
    <header class="users-list-page__header">
      <h2 class="users-list-page__title">Users List</h2>
      <p class="users-list-page__description">Server-side search and pagination</p>
    </header>

    <form class="users-list-page__filters" @submit.prevent="onSubmitSearch">
      <AppInput
        v-model="searchInput"
        class="users-list-page__filter-item users-list-page__filter-item--search"
        type="search"
        placeholder="Search by name or email"
        :disabled="isLoading"
      />

      <AppSelect
        v-model="limitInput"
        class="users-list-page__filter-item"
        label="Rows per page"
        :options="LIMIT_OPTIONS"
        :disabled="isLoading"
        @update:modelValue="onLimitChange"
      />

      <AppSelect
        v-model="mockInput"
        class="users-list-page__filter-item"
        label="Mock scenario"
        :options="MOCK_OPTIONS"
        :disabled="isLoading"
        @update:modelValue="onMockChange"
      />

      <div class="users-list-page__filter-actions">
        <AppButton type="submit" :disabled="isLoading">Search</AppButton>
        <AppButton type="button" variant="secondary" :disabled="isLoading" @click="resetFilters">
          Reset
        </AppButton>
      </div>
    </form>

    <AppLoader v-if="isLoading" label="Loading users..." />

    <section v-else-if="error" class="users-list-page__feedback users-list-page__feedback--error">
      <h3 class="users-list-page__feedback-title">Request failed</h3>
      <p class="users-list-page__feedback-text">{{ error.message }}</p>
      <div class="users-list-page__feedback-actions">
        <AppButton type="button" variant="secondary" @click="retryFetch">Retry</AppButton>
      </div>
    </section>

    <div v-else class="users-list-page__content">
      <AppEmptyState
        v-if="!items.length"
        title="No users found"
        description="Try changing search parameters or reset the filters."
      >
        <AppButton type="button" variant="secondary" @click="resetFilters">Reset filters</AppButton>
      </AppEmptyState>

      <template v-else>
        <table class="users-list-page__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in items" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>
                <span :class="statusClass(user.status)">
                  {{ user.status || '-' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <footer class="users-list-page__pagination">
          <AppButton
            type="button"
            variant="secondary"
            :disabled="page <= 1 || isLoading"
            @click="goToPreviousPage"
          >
            Previous
          </AppButton>

          <span class="users-list-page__page-indicator">Page {{ page }} / {{ totalPages }} · Total {{ total }}</span>

          <AppButton
            type="button"
            variant="secondary"
            :disabled="page >= totalPages || isLoading"
            @click="goToNextPage"
          >
            Next
          </AppButton>
        </footer>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.users-list-page {
  display: grid;
  gap: 18px;
}

.users-list-page__header {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(216, 222, 230, 0.9);
}

.users-list-page__title {
  margin: 0;
  font-size: clamp(22px, 2.3vw, 30px);
  letter-spacing: -0.02em;
}

.users-list-page__description {
  margin: 0;
  color: var(--slate);
}

.users-list-page__filters {
  display: grid;
  grid-template-columns: 1.2fr repeat(2, minmax(160px, 220px)) auto;
  gap: 14px;
  align-items: end;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(216, 222, 230, 0.95);
  box-shadow: var(--shadow-card);
}

.users-list-page__filter-item--search {
  min-width: 240px;
}

.users-list-page__filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.users-list-page__feedback {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.87);
}

.users-list-page__feedback--error {
  border-color: #efc6c8;
  background: #fff4f5;
}

.users-list-page__feedback-title,
.users-list-page__feedback-text {
  margin: 0;
}

.users-list-page__feedback-text {
  color: var(--slate);
}

.users-list-page__feedback-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.users-list-page__content {
  display: grid;
  gap: 16px;
}

.users-list-page__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-card);
}

.users-list-page__table th,
.users-list-page__table td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid #e7ebf0;
}

.users-list-page__table thead th {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slate);
  background: #f7f8fa;
}

.users-list-page__table tr:last-child td {
  border-bottom: 0;
}

.users-list-page__table tbody tr:hover {
  background: #fff9f6;
}

.users-list-page__pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding: 6px 2px;
}

.users-list-page__page-indicator {
  color: var(--slate);
  font-weight: 600;
}

.users-list-page__status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #677689;
  background: #edf1f5;
}

.users-list-page__status--active {
  color: #0e7a49;
  background: #d8f1e4;
}

@media (max-width: 920px) {
  .users-list-page__filters {
    grid-template-columns: 1fr;
    padding: 14px;
  }
}
</style>
