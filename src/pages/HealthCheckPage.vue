<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { healthClient } from '@/client/clients'

const healthStatus = ref('checking')
const errorMessage = ref('')

const loadHealth = async () => {
  const result = await healthClient.getHealth()

  if (result.data) {
    healthStatus.value = result.data.status
    errorMessage.value = ''
    return
  }

  healthStatus.value = 'error'
  errorMessage.value = result.error?.message || 'Mock backend is unavailable'
}

onMounted(loadHealth)
</script>

<template>
  <section class="health-check">
    <p class="health-check__label">Mock health status</p>
    <p class="health-check__status">{{ healthStatus }}</p>
    <p v-if="errorMessage" class="health-check__error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped lang="scss">
.health-check {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 16px;
  max-width: 480px;
}

.health-check__label {
  margin: 0;
  color: #57606a;
}

.health-check__status {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
}

.health-check__error {
  margin: 8px 0 0;
  color: #c62828;
}
</style>
