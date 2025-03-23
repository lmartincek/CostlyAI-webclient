<script setup lang="ts" generic="T extends IPlace | IUserSearch">
import { computed } from 'vue'
import CardBox from '@/components/costs/CardBox.vue'
import SpinnerCostly from '@/components/common/SpinnerCostly.vue'
import type {IPlace, IUserSearch} from "@/types/general";
import {parseDateStandard} from "@/utils/dateHelpers.ts";

const props = defineProps<{
  items: T[]
  loadItems: () => Promise<void>
  itemClickHandler: (item: T) => void
}>()

const isLoading = computed(() => !props.items.length)

const isUserSearch = (item: IPlace | IUserSearch): item is IUserSearch => {
  return 'created_at' in item
}
</script>

<template>
  <div class="recent-searches">
    <span>Recently Searched</span>
    <div class="recent-searches__cards" v-if="!isLoading">
      <template v-for="(item, i) in items" :key="'recentlySearchedItem' + i">
        <div class="recent-searches__card-wrapper">
          <CardBox
            :img-left="item.country.code"
            :text="item.city ? item.city.name : ''"
            @click="itemClickHandler(item)"
          >
            <template #floating-label v-if="isUserSearch(item)">{{ parseDateStandard(item.created_at) }}</template>
            <template #headline>{{ item.country.name }}</template>
          </CardBox>
        </div>
      </template>
    </div>
    <SpinnerCostly v-else />
  </div>
</template>

<style scoped lang="scss">
.recent-searches {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem 1rem;
  margin: 3rem auto 5rem;
  max-width: 650px;
  border-radius: 1rem;
  text-align: left;

  &__card-wrapper {
    text-align: center;

    @include respond-md {
      text-align: left;
    }
  }

  .date {
    margin-left: 0.25rem;
  }

  &__cards {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    gap: 1rem;

    @include respond-md {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }

    .card {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
