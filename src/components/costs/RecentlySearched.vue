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

const emit = defineEmits(['update:recentlySearchedClicked'])
const handleItemClick = async (place: IPlace) => {
  await props.loadProducts({ country: place.country, city: place.city })
  emit('update:recentlySearchedClicked')
}
</script>

<template>
  <RecentSearchesList
    wrapper-text="People recently searched"
    :items="places"
    :loadItems="generalStore.loadRecentlySearchedPlaces"
    :itemClickHandler="handleItemClick"
  />
</template>
