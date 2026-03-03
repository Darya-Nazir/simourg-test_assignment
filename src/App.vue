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
  width: min(1180px, calc(100vw - 32px));
  margin: 16px auto 28px;
  padding: 20px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(4px);
}

.app-shell__title {
  margin: 0 0 14px;
  font-size: clamp(26px, 3.4vw, 40px);
  letter-spacing: -0.03em;
}

.app-shell__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 22px;
}

.app-shell__link {
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--slate);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.app-shell__link.router-link-active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--ink);
}

.app-shell__link:hover {
  border-color: var(--accent);
  color: var(--ink);
}

@media (max-width: 680px) {
  .app-shell {
    width: calc(100vw - 20px);
    margin: 10px auto 20px;
    padding: 14px;
    border-radius: 18px;
  }
}
</style>
