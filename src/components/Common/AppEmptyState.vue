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
  gap: 8px;
  padding: 20px;
  border: 1px dashed #ccd3da;
  border-radius: 12px;
  background: #fff;
}

.app-empty-state__title {
  margin: 0;
  font-size: 17px;
  color: #1f2328;
}

.app-empty-state__description {
  margin: 0;
  color: #5d6671;
}

.app-empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
