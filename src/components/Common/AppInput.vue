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
  gap: 6px;
}

.app-input__label {
  font-size: 14px;
  color: #1f2328;
}

.app-input__control {
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid #ccd3da;
  border-radius: 8px;
  background: #fff;
  font: inherit;
}

.app-input__control:focus {
  outline: none;
  border-color: #0f4c81;
  box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.12);
}

.app-input__control--error {
  border-color: #b4232a;
}

.app-input__error {
  font-size: 13px;
  color: #b4232a;
}
</style>
