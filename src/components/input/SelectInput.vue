<template>
  <div class="select-container"
       ref="target"
  >
    <label class="select-label" v-if="label">{{ label }}</label>
    <div class="custom-select">
      <span class="input-icon">
        <slot name="input-icon" />
      </span>
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        :disabled="disabled"
        autocomplete="off"
        :class="['select-input-field', { disabled }]"
        :placeholder="defaultOptionLabel"
      />
      <button v-if="selectedValue" class="clear-button" @click="clearValue" type="button">
        &times;
      </button>
      <ul v-if="showSuggestions && filteredOptions.length > 0" class="suggestions-list">
        <li
          v-for="option in filteredOptions"
          :key="option.name"
          tabindex="0"
          @keydown.enter="handleSelect(option)"
          @mousedown="handleSelect(option)"
          :class="{ selected: selectedValue === option.name }"
        >
          <span class="suggestion-icon" v-if="isCountry(option)">
            <Icon folder="flags" :name="`${option.code}`" alt="" width="20" height="20" />
          </span>
          <span v-html="highlightMatch(option.name)"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core'
import {ref, computed, watch, useTemplateRef } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'

import Icon from '@/components/common/IconCostly.vue'

interface Option {
  name: string
  code?: string
}

const props = defineProps({
  label: {
    type: String,
  },
  options: {
    type: Array as () => Array<ICountry | ICity>,
    required: true,
    default: () => [],
  },
  defaultOptionLabel: {
    type: String,
    default: 'Select an option...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref<string>(props.modelValue || '')
const selectedValue = ref<string>(props.modelValue || '')
const showSuggestions = ref<boolean>(false)

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue || ''
    selectedValue.value = newValue || ''
  },
)

const filteredOptions = computed(() => {
  if (props.options) {
    return props.options.filter((option: Option) =>
      option.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return []
})

const handleInput = () => {
  showSuggestions.value = true
}

const handleSelect = (option: ICountry | ICity) => {
  selectedValue.value = option.name
  searchQuery.value = option.name
  showSuggestions.value = false
  emit('update:modelValue', selectedValue.value)
}

const target = useTemplateRef<HTMLElement>('target')
const { focused } = useFocusWithin(target)
watch(focused, (focused) => {
  if (focused) {
    showSuggestions.value = true
  } else {
    handleBlur()
  }
})
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}


const clearValue = () => {
  selectedValue.value = ''
  searchQuery.value = ''
  emit('update:modelValue', '')
}

const highlightMatch = (text: string) => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return text

  const index = text.toLowerCase().indexOf(query)
  if (index === -1) return text

  const beforeMatch = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const afterMatch = text.slice(index + query.length)

  return `${beforeMatch}<strong>${match}</strong>${afterMatch}`
}

const isCountry = (option: ICountry | ICity): option is ICountry => {
  return 'code' in option
}

</script>

<style scoped lang="scss">
.select-container {
  display: flex;
  flex-direction: column;
  margin: 0.25rem 0;
  width: 100%;

  @include respond-md {
    margin: 0 0.25rem;
  }
}

.custom-select {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.input-icon {
  display: flex;
  position: absolute;
  left: 0.75rem;
  color: $text-color;
  pointer-events: none;
}

.select-input-field {
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid $border-color;
  background: $white-color;
  color: $text-color;
  width: 100%;

  &:focus {
    border-color: $placeholder-color;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
  background: $white-color;
  border: 1px solid $border-color;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
}

.suggestions-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  color: $text-color;
}

.suggestion-icon {
  display: flex;
  margin-right: 0.5rem;
  color: $text-color;
}

.suggestions-list li:hover {
  background-color: $white-darker-5p;
}

.suggestions-list li.selected {
  background-color: $white-darker-10p;
}

.select-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: $text-color;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $white-darker-20p;
  }

  &:focus {
    border: none;
  }
}
</style>
