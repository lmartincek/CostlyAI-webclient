<script setup lang="ts">
import Card from "./Card.vue";
import {useProductsStore} from "../stores/productsStore.ts";
import {computed, onMounted} from "vue";
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Product} from "../types/products";
import {useGeneralStore} from "../stores/generalStore.ts";

const productStore = useProductsStore()

const generalStore = useGeneralStore()
const allCountries = computed<ICountry[]>(() => generalStore.countries)
const allCities = computed<ICity[]>(() => generalStore.cities)

//@ts-ignore
const recentlySearchedPlaces = computed<{country: ICountry, city: ICountry | null}[]>(() => {
    const products = productStore.recentlySearchedProducts as Product[]

    if (!products) return

    const uniqueCombinations = [...new Set(products.map(product =>
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

        return {country, city}
        // return {
        //     country: {
        //         id: country.id,
        //         name: country.name,
        //         code: country.code,
        //     },
        //     city: city ? {
        //         id: city.id,
        //         name: city.name,
        //         country_id: country.id
        //     } : null,
        // };
    })
})


onMounted(async () => {
    await productStore.loadRecentlySearchedProducts(80)
})
</script>

<template>
    <div class="recently-searched__wrapper">
        <span>Recently Searched</span>

        <div class="cards">
            <template v-for="place in recentlySearchedPlaces">
              <Card :img-left="`/src/assets/icons/flags/${place.country.code}.svg`"
                    class="card"
                    :text="place.city ? place.city.name : ''"
                    @click="productStore.loadProducts(place.country, null)">
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
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;

    .card {
      width: 100%;
      height: 100%;
    }
  }
}
</style>