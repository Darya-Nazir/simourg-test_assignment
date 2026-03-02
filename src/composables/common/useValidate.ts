import { ref } from 'vue'

export type ValidationRule<TValues, TKey extends keyof TValues> = (
  value: TValues[TKey],
  values: TValues,
) => string | null

export type ValidationSchema<TValues extends object> = {
  [TKey in keyof TValues]?: ValidationRule<TValues, TKey>[]
}

export type ValidationErrors<TValues extends object> = Partial<
  Record<keyof TValues, string>
>

export const useValidate = <TValues extends object>(
  schema: ValidationSchema<TValues>,
) => {
  const errors = ref<ValidationErrors<TValues>>({})

  const validateField = <TKey extends keyof TValues>(
    key: TKey,
    value: TValues[TKey],
    values: TValues,
  ): string | null => {
    const rules = schema[key]

    if (!rules || rules.length === 0) {
      delete errors.value[key]
      return null
    }

    for (const rule of rules) {
      const message = rule(value, values)

      if (message) {
        errors.value[key] = message
        return message
      }
    }

    delete errors.value[key]
    return null
  }

  const validate = (values: TValues): boolean => {
    const nextErrors: ValidationErrors<TValues> = {}

    for (const key of Object.keys(schema) as (keyof TValues)[]) {
      const rules = schema[key]

      if (!rules || rules.length === 0) {
        continue
      }

      const value = values[key]
      for (const rule of rules) {
        const message = rule(value as never, values)

        if (message) {
          nextErrors[key] = message
          break
        }
      }
    }

    errors.value = nextErrors
    return Object.keys(nextErrors).length === 0
  }

  const resetValidation = (): void => {
    errors.value = {}
  }

  return {
    errors,
    validate,
    validateField,
    resetValidation,
  }
}
