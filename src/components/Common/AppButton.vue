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
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.app-button--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 8px 18px rgba(255, 107, 61, 0.28);
}

.app-button--primary:hover:not(:disabled) {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
}

.app-button--secondary {
  background: var(--surface);
  border-color: var(--line);
  color: var(--ink);
}

.app-button--secondary:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent-dark);
}

.app-button--danger {
  background: var(--danger);
  border-color: var(--danger);
  color: #fff;
}

.app-button--danger:hover:not(:disabled) {
  filter: brightness(0.92);
}

.app-button--block {
  width: 100%;
}

.app-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.app-button:not(:disabled):active {
  transform: translateY(1px);
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
  border-color: rgba(15, 23, 32, 0.2);
  border-top-color: var(--ink);
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
