<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Card from '@/components/CardBox.vue'
import { useProductsStore } from '@/stores/productsStore.ts'
import type { ICountry } from '@/types/countries'
import type { Product } from '@/types/products'
import type { ICity } from '@/types/cities'
import { useGeneralStore } from '@/stores/generalStore.ts'
import { getCities } from '@/services/generalService.ts'
import SpinnerCostly from './SpinnerCostly.vue'

const productStore = useProductsStore()
const generalStore = useGeneralStore()

const allCountries = computed<ICountry[]>(() => generalStore.countries)
const allCities = ref<Map<number, ICity>>(new Map())

const fetchCitiesForCountries = async (countryIds: number[]): Promise<void> => {
  const cities = await getCities(countryIds)

  if (Array.isArray(cities)) {
    cities.forEach((city) => allCities.value.set(city.id, city))
  } else {
    console.error('Failed to fetch cities for countries:', countryIds)
  }
}

const products = computed(() => productStore.recentlySearchedProducts as Product[])

const extractUniqueCountryIds = (products: Product[]): Set<number> => {
  return new Set(products.filter((p) => p.city_id).map((p) => p.country_id))
}

watch(products, async (newProducts) => {
  if (!newProducts) return

  const uniqueCountryIds = extractUniqueCountryIds(newProducts)
  const missingCountryIds = [...uniqueCountryIds].filter(
    (id) => !Array.from(allCities.value.values()).some((city) => city.country_id === id),
  )

  if (missingCountryIds.length > 0) {
    await fetchCitiesForCountries(missingCountryIds)
  }

  if (allCities.value.size === 0) return

  const uniqueCombinations = new Set(newProducts.map((p) => `${p.country_id}-${p.city_id}`))

  const uniqueSets = Array.from(uniqueCombinations, (combo) => {
    const [country_id, city_id] = combo.split('-')
    return {
      countryId: parseInt(country_id),
      cityId: city_id === 'null' ? null : parseInt(city_id),
    }
  })

  const countryMap = new Map(allCountries.value.map((c) => [c.id, c]))

  const recentlySearchedPlaces = uniqueSets.map(({ countryId, cityId }) => ({
    country: countryMap.get(countryId) as ICountry,
    city: cityId ? allCities.value.get(cityId) || null : null,
  }))

  if (recentlySearchedPlaces.length) {
    generalStore.recentlySearchedPlaces = recentlySearchedPlaces
  }
})

//todo - update recently searched when new request is made
//todo - scroll down to section after click

watch(allCountries, async (newValue) => {
  if (newValue && !generalStore.recentlySearchedPlaces.length) {
    await productStore.loadRecentlySearchedProducts(80)
  }
})
</script>

<template>
  <div class="recently-searched__wrapper">
    <span>Recently people searched</span>
    <!--        TODO - loader placeholder cards-->
    <div class="cards" v-if="generalStore.recentlySearchedPlaces.length">
      <template
        v-for="(place, i) in generalStore.recentlySearchedPlaces"
        :key="'recentlySearchedPlace' + i"
      >
        <Card
          :img-left="place.country.code"
          class="card"
          :text="place.city ? place.city.name : ''"
          @click="productStore.loadProducts(place.country, place.city)"
        >
          <template v-slot:headline>{{ place.country.name }}</template>
        </Card>
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
