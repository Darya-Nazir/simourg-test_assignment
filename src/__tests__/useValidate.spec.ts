import { describe, expect, it } from 'vitest'

import { useValidate } from '@/composables/common/useValidate'

interface FormValues {
  name: string
  email: string
}

describe('useValidate', () => {
  const createValidator = () =>
    useValidate<FormValues>({
      name: [(value) => (value.trim().length === 0 ? 'Name is required.' : null)],
      email: [
        (value) => (value.trim().length === 0 ? 'Email is required.' : null),
        (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email is invalid.'),
      ],
    })

  it('validates all fields and collects errors', () => {
    const validator = createValidator()

    const isValid = validator.validate({ name: '', email: 'invalid-email' })

    expect(isValid).toBe(false)
    expect(validator.errors.value).toEqual({
      name: 'Name is required.',
      email: 'Email is invalid.',
    })
  })

  it('validates a single field and clears error after fix', () => {
    const validator = createValidator()

    validator.validateField('email', 'wrong', { name: 'Ada', email: 'wrong' })
    expect(validator.errors.value.email).toBe('Email is invalid.')

    validator.validateField('email', 'ada@example.com', { name: 'Ada', email: 'ada@example.com' })
    expect(validator.errors.value.email).toBeUndefined()
  })

  it('resets validation state', () => {
    const validator = createValidator()

    validator.validate({ name: '', email: '' })
    expect(Object.keys(validator.errors.value).length).toBeGreaterThan(0)

    validator.resetValidation()
    expect(validator.errors.value).toEqual({})
  })
})
