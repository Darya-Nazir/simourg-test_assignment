<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <section class="user-edit-page">
    <h2 class="user-edit-page__title">Edit User</h2>
    <p class="user-edit-page__description">Editing user with id: {{ userId }}</p>
  </section>
</template>

<style scoped lang="scss">
.user-edit-page__title {
  margin: 0;
}

.user-edit-page__description {
  margin: 12px 0 0;
  color: #57606a;
}
</style>
