<script setup lang="ts">
import type { PropType } from 'vue'

const value = defineModel()

defineProps({
  type: {
    type: String as PropType<'password' | 'text'>,
    required: false,
    default: 'text',
  },
  placeholder: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
    required: false,
  },
  autofocus: {
    type: Boolean,
    required: false,
  },
})
</script>

<template>
  <div class="text-input">
    <label :for="name">{{ label }}</label>
    <input
      :type="type"
      v-model="value"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
    />
  </div>
</template>

<style scoped lang="scss">
.text-input {
  display: flex;
  flex-direction: column;

  input {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 5px;
    background: $white-color;
    color: $text-color;
    width: inherit;
    border: 1px solid $border-color;

    &:focus {
      border-color: $primary-color;
    }
  }
}
</style>
