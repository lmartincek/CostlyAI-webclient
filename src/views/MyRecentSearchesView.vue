<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>CostlyAI</h1>
      <p>Look for your recent searches and compare them</p>
    </template>

    <template v-slot:content>
      <div class="recent-searches" v-if="searches.length">
        <template v-for="search in searches"
                  :key="'my-searched-place' + search.id">
          <div class="recent-searches__card-wrapper">
            <!--            TODO - make it reusable with RecentlySearched.vue-->
            <span
              ><b>{{ parseDateStandard(search.created_at) }}</b></span
            >
            <CardBox
              :img-left="search.country.code"
              :text="search.city ? search.city.name : ''"
              @click="loadProducts(search.id)"
            >
              <template #headline>{{ search.country.name }}</template>
            </CardBox>
          </div>
        </template>
      </div>
      <SpinnerCostly v-else />

      <div class="wrapper-data__table" v-if="products.length">
        <template v-for="(products, category) in productsByCategory" :key="category">
          <TableDisplay :data="products" :category="category" />
        </template>
      </div>
    </template>
  </LayoutCostly>
</template>

<script setup lang="ts">
import LayoutCostly from '@/components/LayoutCostly.vue'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import CardBox from '@/components/CardBox.vue'
import type { IUserSearch } from '@/types/general'
import SpinnerCostly from '@/components/SpinnerCostly.vue'
import { parseDateStandard } from '../utils/dateHelpers.ts'
import TableDisplay from '@/components/TableDisplay.vue'
import type { Product } from '@/types/products'
import { groupProductsByCategory } from '@/utils/objectHelpers.ts'
import { getUserProducts } from '@/services/productService.ts'
import { useGeneralStore } from '@/stores/generalStore.ts'
import { useProductsStore } from '@/stores/productsStore.ts'

const generalStore = useGeneralStore()
const searches = computed<IUserSearch[]>(() => generalStore.mySearchedPlaces)

const products = ref<Product[]>([])
const authStore = useAuthStore()
const loadProducts = async (searchId: number) => {
  if (authStore.userId) {
    products.value = await getUserProducts(authStore.userId, searchId)
    return
  }
  console.error('apparently not signed in')
}

const productsByCategory = computed(() => {
  if (products.value) return groupProductsByCategory(products.value)
  return []
})

onMounted(async () => {
  if (generalStore.mySearchedPlaces.length && !useProductsStore().products.length) return
  if (typeof authStore.userId === 'string') {
    await generalStore.loadUserSearchedPlaces(authStore.userId as string)
  }
})
</script>

<style scoped lang="scss">
.recent-searches {
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @include respond-sm() {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &__card-wrapper {
    max-width: 300px;
    width: 100%;
    margin: auto;
    text-align: left;

    @include respond-sm() {
      flex-basis: 50%;
    }

    @include respond-md() {
      flex-basis: 30%;
    }

    span {
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
    }
  }
}
</style>
