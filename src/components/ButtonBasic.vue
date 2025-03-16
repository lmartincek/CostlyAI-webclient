<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  buttonClass: {
    type: String as PropType<'btn-primary' | 'btn-white'>,
    default: 'btn-primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
})

const emit = defineEmits(['click'])
const handleClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
button {
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: 0.3s ease;
  border: 2px solid transparent;

  &.btn-white {
    background: $white-color;
    color: $text-color;
    border-color: $placeholder-color;

    &:hover {
      background: $text-color;
      color: $white-color;
      border-color: $border-color;
    }
  }

  &.btn-primary {
    background: $primary-gradient;
    color: $white-color;

    &:hover {
      border-color: $primary-color-light;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
