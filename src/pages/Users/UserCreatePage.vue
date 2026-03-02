<script setup lang="ts">
import { useRouter } from 'vue-router'

import UserForm from '@/components/Users/UserForm.vue'
import { ROUTE_NAMES } from '@/router/routes'

const router = useRouter()

const onSubmitted = async (): Promise<void> => {
  await router.push({ name: ROUTE_NAMES.USERS_LIST })
}
</script>

<template>
  <UserForm mode="create" @submitted="onSubmitted" />
</template>
