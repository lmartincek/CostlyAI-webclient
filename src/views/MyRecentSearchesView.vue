<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>CostlyAI</h1>
      <p>Look for your recent searches and compare them</p>
    </template>

    <template v-slot:content>
      <div class="recent-searches" v-if="searches.length">
        <template v-for="search in searches" :key="'my-searched-place' + search.id">
          <div class="recent-searches__card-wrapper">
            <!--            TODO - make it reusable with RecentlySearched.vue-->
            <span
              ><b>{{ parseDateStandard(search.created_at) }}</b></span
            >
            <CardBox
              :img-left="search.country.code"
              :text="search.city ? search.city.name : ''"
              @click="loadProductsBySearchId(authStore.userId, search.id)"
            >
              <template #headline>{{ search.country.name }}</template>
            </CardBox>
          </div>
        </template>
      </div>
      <SpinnerCostly v-else-if="generalStore.loading" />

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
import LayoutCostly from '@/components/layout/LayoutCostly.vue'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import CardBox from '@/components/costs/CardBox.vue'
import type { IUserSearch } from '@/types/general'
import SpinnerCostly from '@/components/common/SpinnerCostly.vue'
import { parseDateStandard } from '@/utils/dateHelpers.ts'
import TableDisplay from '@/components/costs/TableDisplay.vue'
import { useGeneralStore } from '@/stores/generalStore.ts'
import { useProducts } from '@/composables/productsProvider.ts'

const generalStore = useGeneralStore()
const searches = computed<IUserSearch[]>(() => generalStore.mySearchedPlaces)

const authStore = useAuthStore()

const { productsByCategory, loadProductsBySearchId } = useProducts()

onMounted(async () => {
  // TODO - if searched on a homepage i want to fetch it again
  if (generalStore.mySearchedPlaces.length) return
  if (!!authStore.userId) {
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
