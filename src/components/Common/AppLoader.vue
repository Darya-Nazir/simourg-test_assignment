<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Loading...',
  },
)
</script>

<template>
  <div class="app-loader" role="status" aria-live="polite">
    <span class="app-loader__spinner" aria-hidden="true"></span>
    <span class="app-loader__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.app-loader {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--line);
  color: var(--slate);
}

.app-loader__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(15, 23, 32, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: app-loader-spin 0.8s linear infinite;
}

.app-loader__label {
  font-size: 14px;
}

@keyframes app-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
