<template>
  <div
    :class="['tag', { 'tag-add': isAddTag, selected: isSelected, disabled: isDisabled }]"
    @click="handleClick"
    role="button"
    :aria-pressed="isSelected"
  >
    <span v-if="$slots.icon" class="icon">
      <slot name="icon" />
    </span>
    <span class="tag-content">
      <slot />
    </span>
    <span v-if="isAddTag" class="tag-add-icon">+</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  isAddTag: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isSelected'])

const isSelected = ref<boolean>(false)
const isDisabled = computed(() => props.disabled && !isSelected.value)

function handleClick() {
  if (isDisabled.value) {
    return
  }
  isSelected.value = !isSelected.value
  emit('update:isSelected', isSelected.value)
}
</script>

<style scoped lang="scss">
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: $white-darker-5p;
  color: $text-color;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: $primary-color-light;
  }

  &.selected {
    background-color: $primary-color;
    color: $white-color;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.tag-add {
    background-color: $placeholder-color;
    color: white;
  }

  &.tag-add:hover {
    background-color: $white-darker-20p;
  }

  .tag-content {
    margin-right: 4px;
  }

  .tag-add-icon {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
