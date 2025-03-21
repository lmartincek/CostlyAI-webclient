<script setup lang="ts">
import { computed, ref } from 'vue'
import { COST_OF_LIVING_CATEGORIES } from '@/constants/categories.ts'
import type { CostOfLivingCategory } from '@/constants/categories.ts'
import Tag from '@/components/TagCostly.vue'

const selectedTags = ref<string[]>([])
const isMaximumCount = computed<boolean>(() => selectedTags.value.length >= 5)

const emit = defineEmits(['update:selectedTags'])
function handleTagClick(event: boolean, tag: CostOfLivingCategory) {
  if (event) {
    selectedTags.value = [...selectedTags.value, tag.name]
  } else {
    selectedTags.value = selectedTags.value.filter((selectedTag) => tag.name !== selectedTag)
  }

  emit('update:selectedTags', selectedTags.value)
}
</script>

<template>
  <div class="tags">
    <Tag
      v-for="tag in COST_OF_LIVING_CATEGORIES"
      :icon="tag.name"
      :key="tag.name"
      :disabled="isMaximumCount && !selectedTags.includes(tag.name)"
      @update:is-selected="handleTagClick($event, tag)"
    >
      <template v-slot:icon
        ><font-awesome-icon :icon="tag.icon" style="margin-right: 10px"
      /></template>
      {{ tag.name }}
    </Tag>
  </div>
</template>

<style scoped lang="scss">
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;

  :deep(.tag) {
    flex: 1 1 auto;
    min-width: 100px;
    max-width: 190px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @include respond-md() {
      min-width: 150px;
      max-width: 200px;
    }
  }
}
</style>
