<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <h1 class="app-shell__title">Simourg</h1>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  padding: 24px;
}

.app-shell__title {
  margin: 0 0 16px;
  font-size: 28px;
}
</style>
