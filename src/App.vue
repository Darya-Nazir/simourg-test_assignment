<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <h1 class="app-shell__title">Simourg</h1>
    <nav class="app-shell__nav">
      <RouterLink class="app-shell__link" to="/users">Users</RouterLink>
      <RouterLink class="app-shell__link" to="/users/new">Create user</RouterLink>
      <RouterLink class="app-shell__link" to="/users/1/edit">Edit user #1</RouterLink>
    </nav>
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

.app-shell__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 20px;
}

.app-shell__link {
  color: #0969da;
  text-decoration: none;
  font-weight: 600;
}

.app-shell__link.router-link-active {
  color: #1f2328;
  text-decoration: underline;
}
</style>
