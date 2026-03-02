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
  color: #3d444d;
}

.app-loader__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccd3da;
  border-top-color: #0f4c81;
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
