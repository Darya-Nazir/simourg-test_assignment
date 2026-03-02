<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useUserForm } from '@/composables/users/useUserForm'
import type { User } from '@/types/user'

const props = defineProps<{
  mode: 'create' | 'edit'
  userId?: string
}>()

const emit = defineEmits<{
  submitted: [user: User]
}>()

const {
  form,
  errors,
  isLoadingUser,
  isSubmitting,
  loadError,
  submitError,
  loadUser,
  onBlur,
  submit,
} = useUserForm({ mode: props.mode, userId: props.userId })

const submitLabel = computed(() => (props.mode === 'create' ? 'Create user' : 'Save changes'))

const title = computed(() => (props.mode === 'create' ? 'Create User' : 'Edit User'))

onMounted(async () => {
  if (props.mode === 'edit') {
    await loadUser()
  }
})

const onSubmit = async (): Promise<void> => {
  const user = await submit()

  if (!user) {
    return
  }

  emit('submitted', user)
}
</script>

<template>
  <section class="user-form">
    <header class="user-form__header">
      <h2 class="user-form__title">{{ title }}</h2>
      <p class="user-form__description">
        {{ mode === 'create' ? 'Fill in required user fields.' : `Editing user id: ${userId}` }}
      </p>
    </header>

    <p v-if="isLoadingUser" class="user-form__status">Loading user data...</p>
    <p v-else-if="loadError" class="user-form__status user-form__status--error">{{ loadError.message }}</p>

    <form v-else class="user-form__fields" @submit.prevent="onSubmit">
      <label class="user-form__field">
        <span class="user-form__label">Full name *</span>
        <input
          v-model="form.name"
          class="user-form__input"
          type="text"
          autocomplete="name"
          :disabled="isSubmitting"
          @blur="onBlur('name')"
        />
        <span v-if="errors.name" class="user-form__error">{{ errors.name }}</span>
      </label>

      <label class="user-form__field">
        <span class="user-form__label">Email *</span>
        <input
          v-model="form.email"
          class="user-form__input"
          type="email"
          autocomplete="email"
          :disabled="isSubmitting"
          @blur="onBlur('email')"
        />
        <span v-if="errors.email" class="user-form__error">{{ errors.email }}</span>
      </label>

      <label class="user-form__field">
        <span class="user-form__label">Status *</span>
        <select
          v-model="form.status"
          class="user-form__select"
          :disabled="isSubmitting"
          @blur="onBlur('status')"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        <span v-if="errors.status" class="user-form__error">{{ errors.status }}</span>
      </label>

      <p v-if="submitError" class="user-form__status user-form__status--error">{{ submitError.message }}</p>

      <div class="user-form__actions">
        <button class="user-form__button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitLabel }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.user-form {
  display: grid;
  gap: 16px;
}

.user-form__header {
  display: grid;
  gap: 6px;
}

.user-form__title {
  margin: 0;
}

.user-form__description {
  margin: 0;
  color: #57606a;
}

.user-form__fields {
  display: grid;
  gap: 14px;
  max-width: 520px;
}

.user-form__field {
  display: grid;
  gap: 6px;
}

.user-form__label {
  font-size: 14px;
  color: #24292f;
}

.user-form__input,
.user-form__select,
.user-form__button {
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
}

.user-form__button {
  width: fit-content;
}

.user-form__error,
.user-form__status--error {
  color: #d1242f;
}

.user-form__status {
  margin: 0;
}
</style>
