<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
    block: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const onClick = (event: MouseEvent): void => {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    class="app-button"
    :class="[
      `app-button--${variant}`,
      { 'app-button--loading': loading, 'app-button--block': block },
    ]"
    :type="type"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true"></span>
    <span class="app-button__label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.app-button--primary {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #fff;
}

.app-button--primary:hover:not(:disabled) {
  background: #0c406d;
  border-color: #0c406d;
}

.app-button--secondary {
  background: #fff;
  border-color: #ccd3da;
  color: #1f2328;
}

.app-button--secondary:hover:not(:disabled) {
  background: #f3f5f7;
}

.app-button--danger {
  background: #b4232a;
  border-color: #b4232a;
  color: #fff;
}

.app-button--danger:hover:not(:disabled) {
  background: #991b21;
  border-color: #991b21;
}

.app-button--block {
  width: 100%;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-top-color: #fff;
  border-radius: 50%;
  animation: app-button-spin 0.8s linear infinite;
}

.app-button--secondary .app-button__spinner {
  border-color: rgba(31, 35, 40, 0.25);
  border-top-color: #1f2328;
}

.app-button__label {
  line-height: 1;
}

@keyframes app-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
