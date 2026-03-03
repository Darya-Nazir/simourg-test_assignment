<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AppButton from '@/components/Common/AppButton.vue'
import AppInput from '@/components/Common/AppInput.vue'
import AppLoader from '@/components/Common/AppLoader.vue'
import AppSelect from '@/components/Common/AppSelect.vue'
import { useUserForm } from '@/composables/users/useUserForm'
import type { User, UsersQuery } from '@/types/user'

const props = defineProps<{
  mode: 'create' | 'edit'
  userId?: string
  mockScenario?: UsersQuery['mock']
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
} = useUserForm({ mode: props.mode, userId: props.userId, mockScenario: props.mockScenario })

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'blocked', label: 'Заблокирован' },
]

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

const retryLoad = async (): Promise<void> => {
  await loadUser()
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

    <AppLoader v-if="isLoadingUser" label="Loading user data..." />

    <section v-else-if="loadError" class="user-form__feedback user-form__feedback--error">
      <p class="user-form__feedback-title">Failed to load user</p>
      <p class="user-form__feedback-text">{{ loadError.message }}</p>
      <AppButton type="button" variant="secondary" @click="retryLoad">Retry</AppButton>
    </section>

    <form v-else class="user-form__fields" @submit.prevent="onSubmit">
      <AppInput
        v-model="form.name"
        label="Full name *"
        autocomplete="name"
        :disabled="isSubmitting"
        :error="errors.name"
        @blur="onBlur('name')"
      />

      <AppInput
        v-model="form.email"
        label="Email *"
        type="email"
        autocomplete="email"
        :disabled="isSubmitting"
        :error="errors.email"
        @blur="onBlur('email')"
      />

      <AppSelect
        v-model="form.status"
        label="Status *"
        :options="statusOptions"
        :disabled="isSubmitting"
        :error="errors.status"
        @blur="onBlur('status')"
      />

      <p v-if="submitError" class="user-form__status user-form__status--error">{{ submitError.message }}</p>

      <div class="user-form__actions">
        <AppButton type="submit" :loading="isSubmitting">{{ submitLabel }}</AppButton>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.user-form {
  display: grid;
  gap: 18px;
}

.user-form__header {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(216, 222, 230, 0.92);
}

.user-form__title {
  margin: 0;
  font-size: clamp(22px, 2.3vw, 30px);
  letter-spacing: -0.02em;
}

.user-form__description {
  margin: 0;
  color: var(--slate);
}

.user-form__feedback {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.87);
}

.user-form__feedback--error {
  border-color: #efc6c8;
  background: #fff4f5;
}

.user-form__feedback-title {
  margin: 0;
  font-weight: 600;
}

.user-form__feedback-text {
  margin: 0;
  color: var(--slate);
}

.user-form__fields {
  display: grid;
  gap: 14px;
  max-width: 600px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(216, 222, 230, 0.95);
  box-shadow: var(--shadow-card);
}

.user-form__status {
  margin: 0;
  font-weight: 600;
}

.user-form__status--error {
  color: var(--danger);
}

.user-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 680px) {
  .user-form__header,
  .user-form__fields,
  .user-form__feedback {
    padding: 14px;
  }
}
</style>
