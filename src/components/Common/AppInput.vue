<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    label?: string
    type?: string
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
    error?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
    disabled: false,
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>

<template>
  <label class="app-input">
    <span v-if="label" class="app-input__label">{{ label }}</span>
    <input
      :id="id"
      class="app-input__control"
      :class="{ 'app-input__control--error': error }"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <span v-if="error" class="app-input__error">{{ error }}</span>
  </label>
</template>

<style scoped lang="scss">
.app-input {
  display: grid;
  gap: 7px;
}

.app-input__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--slate);
}

.app-input__control {
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  font: inherit;
  color: var(--ink);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.app-input__control::placeholder {
  color: #7a8697;
}

.app-input__control:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(255, 107, 61, 0.18);
}

.app-input__control--error {
  border-color: var(--danger);
}

.app-input__error {
  font-size: 13px;
  color: var(--danger);
}
</style>
