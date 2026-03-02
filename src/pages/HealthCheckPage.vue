<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

const healthStatus = ref('checking')
const errorMessage = ref('')

const loadHealth = async () => {
  try {
    const response = await axios.get<{ status: string }>('/api/health')
    healthStatus.value = response.data.status
    errorMessage.value = ''
  } catch {
    healthStatus.value = 'error'
    errorMessage.value = 'Mock backend is unavailable'
  }
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
