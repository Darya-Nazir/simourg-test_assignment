<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import UserForm from '@/components/Users/UserForm.vue'
import { ROUTE_NAMES } from '@/router/routes'
import type { UsersQuery } from '@/types/user'

const route = useRoute()
const router = useRouter()

const userId = computed(() => String(route.params.id ?? ''))

const mockScenario = computed<UsersQuery['mock']>(() => {
  const value = route.query.mock
  if (value === 'empty' || value === 'slow' || value === 'error' || value === 'network') {
    return value
  }

  return undefined
})

const onSubmitted = async (): Promise<void> => {
  await router.push({ name: ROUTE_NAMES.USERS_LIST })
}
</script>

<template>
  <UserForm mode="edit" :user-id="userId" :mock-scenario="mockScenario" @submitted="onSubmitted" />
</template>
