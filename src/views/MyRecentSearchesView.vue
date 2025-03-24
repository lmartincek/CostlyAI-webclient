<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>CostlyAI</h1>
      <p>Look for your recent searches and compare them</p>
    </template>

    <template v-slot:content>
      <RecentSearchesList
        wrapper-text="My recent searches"
        :items="searches"
        :loadItems="() => generalStore.loadUserSearchedPlaces(authStore.userId)"
        :itemClickHandler="handleItemClick"
      />

      <div class="no-places-found" v-if="!generalStore.loading && !searches.length">
        <hr />
        Seems like you haven't looked for prices anywhere yet. Click
        <router-link to="/">here</router-link> and select location you're interested in.
      </div>

      <div class="wrapper-data__table" v-if="productsByCategory !== null">
        <template v-for="(products, category) in productsByCategory" :key="category">
          <TableDisplay :data="products" :category="category" />
        </template>
      </div>
    </template>
  </LayoutCostly>
</template>

<script setup lang="ts">
import { useGeneralStore } from '@/stores/generalStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import RecentSearchesList from '@/components/costs/RecentSearchesList.vue'
import { computed, onMounted } from 'vue'
import type { IUserSearch } from '@/types/general'
import { useProducts } from '@/composables/productsProvider.ts'
import TableDisplay from '@/components/costs/TableDisplay.vue'
import LayoutCostly from '@/components/layout/LayoutCostly.vue'

const generalStore = useGeneralStore()
const authStore = useAuthStore()
const searches = computed<IUserSearch[]>(() => generalStore.mySearchedPlaces)

const { loadProductsBySearchId, productsByCategory } = useProducts()

onMounted(async () => {
  if (generalStore.mySearchedPlaces.length) return
  await generalStore.loadUserSearchedPlaces(authStore.userId)
})

const handleItemClick = (search: IUserSearch) => {
  loadProductsBySearchId(authStore.userId, search.id)
}
</script>
