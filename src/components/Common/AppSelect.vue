<script setup lang="ts">
export interface AppSelectOption {
  value: string
  label: string
}

withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    label?: string
    options: AppSelectOption[]
    disabled?: boolean
    error?: string
  }>(),
  {
    id: undefined,
    label: undefined,
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
  <label class="app-select">
    <span v-if="label" class="app-select__label">{{ label }}</span>
    <select
      :id="id"
      class="app-select__control"
      :class="{ 'app-select__control--error': error }"
      :value="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="emit('blur')"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <span v-if="error" class="app-select__error">{{ error }}</span>
  </label>
</template>

<style scoped lang="scss">
.app-select {
  display: grid;
  gap: 7px;
}

.app-select__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--slate);
}

.app-select__control {
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  font: inherit;
  color: var(--ink);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.app-select__control:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(255, 107, 61, 0.18);
}

.app-select__control--error {
  border-color: var(--danger);
}

.app-select__error {
  font-size: 13px;
  color: var(--danger);
}
</style>
