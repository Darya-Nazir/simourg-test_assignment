<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import UserForm from '@/components/Users/UserForm.vue'
import { ROUTE_NAMES } from '@/router/routes'

const route = useRoute()
const router = useRouter()

const userId = computed(() => String(route.params.id ?? ''))

const onSubmitted = async (): Promise<void> => {
  await router.push({ name: ROUTE_NAMES.USERS_LIST })
}
</script>

<template>
  <UserForm mode="edit" :user-id="userId" @submitted="onSubmitted" />
</template>
