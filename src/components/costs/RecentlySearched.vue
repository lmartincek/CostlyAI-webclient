<script setup lang="ts">
import { useGeneralStore } from '@/stores/generalStore.ts'
import RecentSearchesList from '@/components/costs/RecentSearchesList.vue'
import { computed, onMounted } from 'vue'
import type { IPlace } from '@/types/general'
import type { LoadProductsArgs } from '@/composables/productsProvider.ts'

const props = defineProps<{
  loadProducts: (args: LoadProductsArgs) => Promise<void>
}>()

const generalStore = useGeneralStore()
const places = computed<IPlace[]>(() => generalStore.recentlySearchedPlaces)

onMounted(async () => {
  if (!places.value.length) {
    await generalStore.loadRecentlySearchedPlaces()
  }
})

const handleItemClick = (place: IPlace) => {
  props.loadProducts({ country: place.country, city: place.city })
}
</script>

<template>
  <RecentSearchesList
    :items="places"
    :loadItems="generalStore.loadRecentlySearchedPlaces"
    :itemClickHandler="handleItemClick"
  />
</template>
