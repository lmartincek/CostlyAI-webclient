<script setup lang="ts">
import {computed, ref, watch} from 'vue';

import Card from "./Card.vue";
import {useProductsStore} from "../stores/productsStore.ts";
import type {ICountry} from "../types/countries";
import type {Product} from "../types/products";
import type {ICity} from "../types/cities";
import {useGeneralStore} from "../stores/generalStore.ts";
import {getCities} from "../services/externalApi.ts";

const productStore = useProductsStore()
const generalStore = useGeneralStore()

const allCountries = computed<ICountry[]>(() => generalStore.countries);
const allCities = ref<ICity[]>([]);

const extractUniqueCountryIds = (products: Product[]): number[] => {
    return [...new Set(products.map(product => product.country_id))];
};

// Fetch cities for the given country IDs
const fetchCitiesForCountries = async (countryIds: number[]): Promise<void> => {
    const cities = await getCities(countryIds);

    if (Array.isArray(cities)) {
        allCities.value = [...allCities.value, ...cities]; // Append new cities to the existing list
    } else {
        console.error('Failed to fetch cities for countries:', countryIds);
    }
};

// Watch for changes in recently searched products
const products = computed(() => productStore.recentlySearchedProducts as Product[]);

watch(products, (newProducts) => {
    if (!newProducts) return;

    // Extract unique country IDs from the products
    const uniqueCountryIds = extractUniqueCountryIds(newProducts);

    // Fetch cities for the unique country IDs (if not already fetched)
    const missingCountryIds = uniqueCountryIds.filter(countryId =>
        !allCities.value.some(city => city.country_id === countryId)
    );

    if (missingCountryIds.length > 0) {
        fetchCitiesForCountries(missingCountryIds); // Fetch cities for missing country IDs
    }
})

// Map products to their countries and cities
const recentlySearchedPlaces = computed<{ country: ICountry, city: ICity | null }[]>(() => {
    if (!products.value) return [];

    const uniqueCombinations = [...new Set(products.value.map(product =>
        `${product.country_id}-${product.city_id}`
    ))];

    const uniqueSets = uniqueCombinations.map(combo => {
        const [country_id, city_id] = combo.split('-');
        return {
            countryId: parseInt(country_id),
            cityId: city_id === 'null' ? null : parseInt(city_id),
        };
    });

    return uniqueSets.map(set => {
        const country = allCountries.value.find(c => c.id === set.countryId);
        const city = set.cityId ? allCities.value.find(c => c.id === set.cityId) : null;

        return { country, city } as { country: ICountry, city: ICity | null };
    });
});


//todo - update recently searched when new request is made
//todo - scroll down to section after click

//Only because on the production when server spins down, it wouldn't fetch again when it restarts, otherwise onMounted
watch(allCountries, async (newValue) => {
    if (newValue && !recentlySearchedPlaces.value.length) {
      await productStore.loadRecentlySearchedProducts(80)
    }
})
</script>

<template>
    <div class="recently-searched__wrapper" v-if="allCities && recentlySearchedPlaces">
        <span>Recently Searched</span>

        <div class="cards">
            <template v-for="place in recentlySearchedPlaces">
              <Card :img-left="place.country.code"
                    class="card"
                    :text="place.city ? place.city.name : ''"
                    @click="productStore.loadProducts(place.country, place.city)">
                  <template v-slot:headline>{{place.country.name}}</template>
              </Card>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.recently-searched__wrapper {
  background: rgba(255,255,255, .5);
  padding: 1.5rem 1rem;
  margin: 3rem auto 1rem;
  max-width: 650px;
  border-radius: 1rem;
  text-align: left;

  span {
    margin-left: .25rem;
  }

  .cards {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    gap: 1rem;

    @media (min-width: $breakpoint-md) {
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