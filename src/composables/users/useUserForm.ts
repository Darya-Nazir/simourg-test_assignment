import { reactive, ref } from 'vue'

import { userClient } from '@/client/clients'
import { useValidate } from '@/composables/common/useValidate'
import type { AppError } from '@/types/api'
import type { CreateUserPayload, UpdateUserPayload, User, UsersQuery } from '@/types/user'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type UserFormMode = 'create' | 'edit'

type UserStatus = 'active' | 'inactive'

export interface UserFormValues {
  name: string
  email: string
  status: UserStatus
}

interface UseUserFormOptions {
  mode: UserFormMode
  userId?: string
  mockScenario?: UsersQuery['mock']
}

const normalizeText = (value: string): string => value.trim()

const toUpdatePayload = (form: UserFormValues): UpdateUserPayload => ({
  name: normalizeText(form.name),
  email: normalizeText(form.email),
  status: form.status,
})

const toCreatePayload = (form: UserFormValues): CreateUserPayload => ({
  name: normalizeText(form.name),
  email: normalizeText(form.email),
  status: form.status,
  createdAt: new Date().toISOString(),
})

export const useUserForm = ({ mode, userId, mockScenario }: UseUserFormOptions) => {
  const form = reactive<UserFormValues>({
    name: '',
    email: '',
    status: 'active',
  })

  const isLoadingUser = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref<AppError | null>(null)
  const submitError = ref<AppError | null>(null)

  const { errors, validate, validateField, resetValidation } = useValidate<UserFormValues>({
    name: [
      (value) => (normalizeText(value).length === 0 ? 'Full name is required.' : null),
    ],
    email: [
      (value) => (normalizeText(value).length === 0 ? 'Email is required.' : null),
      (value) =>
        EMAIL_REGEX.test(normalizeText(value)) ? null : 'Email must have a valid format (example: user@example.com).',
    ],
    status: [
      (value) => (value === 'active' || value === 'inactive' ? null : 'Status is required.'),
    ],
  })

  const setFromUser = (user: User): void => {
    form.name = user.name ?? ''
    form.email = user.email ?? ''
    form.status = user.status === 'inactive' ? 'inactive' : 'active'
  }

  const loadUser = async (): Promise<boolean> => {
    if (mode !== 'edit') {
      return true
    }

    if (!userId) {
      loadError.value = {
        code: 'UNKNOWN_ERROR',
        message: 'User id is required for edit mode.',
        status: null,
      }
      return false
    }

    isLoadingUser.value = true
    loadError.value = null

    const result = await userClient.getUserById(userId, {
      mock: mockScenario,
    })

    isLoadingUser.value = false

    if (result.error || !result.data) {
      loadError.value =
        result.error ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to load user.',
          status: null,
        }
      return false
    }

    setFromUser(result.data)
    return true
  }

  const onBlur = (field: keyof UserFormValues): void => {
    validateField(field, form[field], form)
  }

  const submit = async (): Promise<User | null> => {
    submitError.value = null

    if (!validate(form)) {
      return null
    }

    isSubmitting.value = true

    const result =
      mode === 'create'
        ? await userClient.createUser(toCreatePayload(form), {
            mock: mockScenario,
          })
        : await userClient.updateUser(userId ?? '', toUpdatePayload(form), {
            mock: mockScenario,
          })

    isSubmitting.value = false

    if (result.error || !result.data) {
      submitError.value =
        result.error ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to save user.',
          status: null,
        }
      return null
    }

    return result.data
  }

  const resetForm = (): void => {
    form.name = ''
    form.email = ''
    form.status = 'active'
    submitError.value = null
    loadError.value = null
    resetValidation()
  }

  return {
    form,
    errors,
    isLoadingUser,
    isSubmitting,
    loadError,
    submitError,
    loadUser,
    onBlur,
    submit,
    resetForm,
  }
}
