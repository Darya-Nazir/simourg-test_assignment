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
  gap: 6px;
}

.app-select__label {
  font-size: 14px;
  color: #1f2328;
}

.app-select__control {
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid #ccd3da;
  border-radius: 8px;
  background: #fff;
  font: inherit;
}

.app-select__control:focus {
  outline: none;
  border-color: #0f4c81;
  box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.12);
}

.app-select__control--error {
  border-color: #b4232a;
}

.app-select__error {
  font-size: 13px;
  color: #b4232a;
}
</style>
