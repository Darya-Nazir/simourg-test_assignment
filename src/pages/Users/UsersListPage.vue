<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUsersStore } from '@/stores/users'

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()

const { items, page, limit, total, totalPages, search, isLoading, error } = storeToRefs(usersStore)
const searchInput = ref('')

const normalizedRouteQuery = computed(() => ({
  page: String(route.query.page ?? ''),
  limit: String(route.query.limit ?? ''),
  search: String(route.query.search ?? ''),
}))

const normalizedStoreQuery = computed(() => ({
  page: String(page.value),
  limit: String(limit.value),
  search: search.value,
}))

const syncRouteWithStore = async (): Promise<void> => {
  if (
    normalizedRouteQuery.value.page === normalizedStoreQuery.value.page &&
    normalizedRouteQuery.value.limit === normalizedStoreQuery.value.limit &&
    normalizedRouteQuery.value.search === normalizedStoreQuery.value.search
  ) {
    return
  }

  await router.push({
    query: {
      page: String(page.value),
      limit: String(limit.value),
      ...(search.value ? { search: search.value } : {}),
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

const onChangeLimit = async (event: Event): Promise<void> => {
  const value = Number((event.target as HTMLSelectElement).value)
  usersStore.setLimit(value)
  await syncRouteWithStore()
}

watch(
  () => route.query,
  async (query) => {
    usersStore.applyRouteQuery(query)
    searchInput.value = search.value
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
      <input
        v-model="searchInput"
        class="users-list-page__search-input"
        type="search"
        placeholder="Search by name or email"
        :disabled="isLoading"
      />
      <button class="users-list-page__button" type="submit" :disabled="isLoading">Search</button>

      <label class="users-list-page__limit-control" for="users-limit">Rows per page</label>
      <select
        id="users-limit"
        class="users-list-page__limit-select"
        :value="limit"
        :disabled="isLoading"
        @change="onChangeLimit"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
      </select>
    </form>

    <p v-if="isLoading" class="users-list-page__status">Loading users...</p>
    <p v-else-if="error" class="users-list-page__status users-list-page__status--error">
      {{ error.message }}
    </p>

    <div v-else class="users-list-page__content">
      <table v-if="items.length" class="users-list-page__table">
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
            <td>{{ user.status || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="users-list-page__status">No users found.</p>

      <footer class="users-list-page__pagination">
        <button
          class="users-list-page__button"
          type="button"
          :disabled="page <= 1 || isLoading"
          @click="goToPreviousPage"
        >
          Previous
        </button>

        <span class="users-list-page__page-indicator">Page {{ page }} / {{ totalPages }} · Total {{ total }}</span>

        <button
          class="users-list-page__button"
          type="button"
          :disabled="page >= totalPages || isLoading"
          @click="goToNextPage"
        >
          Next
        </button>
      </footer>
    </div>
  </section>
</template>

<style scoped lang="scss">
.users-list-page {
  display: grid;
  gap: 16px;
}

.users-list-page__header {
  display: grid;
  gap: 6px;
}

.users-list-page__title {
  margin: 0;
}

.users-list-page__description {
  margin: 0;
  color: #57606a;
}

.users-list-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.users-list-page__search-input {
  width: min(320px, 100%);
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}

.users-list-page__button,
.users-list-page__limit-select {
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
}

.users-list-page__limit-control {
  font-size: 14px;
  color: #57606a;
}

.users-list-page__status {
  margin: 0;
}

.users-list-page__status--error {
  color: #d1242f;
}

.users-list-page__table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d0d7de;
  background: #fff;
}

.users-list-page__table th,
.users-list-page__table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #d8dee4;
}

.users-list-page__pagination {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.users-list-page__page-indicator {
  color: #57606a;
}
</style>
