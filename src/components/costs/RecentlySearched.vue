<script setup lang="ts">
import { useProductsStore } from '@/stores/productsStore.ts'
import { useGeneralStore } from '@/stores/generalStore.ts'
import SpinnerCostly from '@/components/common/SpinnerCostly.vue'
import { computed, onMounted } from 'vue'
import type { IPlace } from '@/types/general'
import CardBox from '@/components/costs/CardBox.vue'

const productStore = useProductsStore()
const generalStore = useGeneralStore()

const places = computed<IPlace[]>(() => generalStore.recentlySearchedPlaces)

//TODO - update recently searched when new request is made
//TODO - scroll down to section after click

//TODO - make it reusable
onMounted(async () => {
  if (!places.value.length) {
    await generalStore.loadRecentlySearchedPlaces()
  }
})
</script>

<template>
  <div class="recently-searched__wrapper">
    <span>Recently people searched</span>
    <div class="cards" v-if="places.length">
      <template v-for="(place, i) in places" :key="'recentlySearchedPlace' + i">
        <CardBox
          :img-left="place.country.code"
          class="card"
          :text="place.city ? place.city.name : ''"
          @click="productStore.loadProducts(place.country, place.city)"
        >
          <template v-slot:headline>{{ place.country.name }}</template>
        </CardBox>
      </template>
    </div>
    <SpinnerCostly v-else />
  </div>
</template>

<style scoped lang="scss">
.recently-searched__wrapper {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem 1rem;
  margin: 3rem auto 5rem;
  max-width: 650px;
  border-radius: 1rem;
  text-align: left;

  span {
    margin-left: 0.25rem;
  }

  .cards {
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
