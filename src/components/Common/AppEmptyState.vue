<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)
</script>

<template>
  <section class="app-empty-state">
    <h3 class="app-empty-state__title">{{ title }}</h3>
    <p v-if="description" class="app-empty-state__description">{{ description }}</p>
    <div class="app-empty-state__actions">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.app-empty-state {
  display: grid;
  gap: 10px;
  padding: 22px;
  border: 1px dashed var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.86);
}

.app-empty-state__title {
  margin: 0;
  font-size: 18px;
  color: var(--ink);
}

.app-empty-state__description {
  margin: 0;
  color: var(--slate);
}

.app-empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
