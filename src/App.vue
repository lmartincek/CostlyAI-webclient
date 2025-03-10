<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import TableDisplay from "./components/TableDisplay.vue";

import {LastDataset, useProductsStore} from './stores/productsStore.ts';
import {computed, onMounted, ref, watch} from "vue";
import {useGeneralStore} from "./stores/generalStore.ts";
import {groupProductsByCategory} from "./utils/objectHelpers.ts";
import type {ICountry} from "./types/countries";
import type {ICity} from "./types/cities";

// import StreamDisplay from "./components/StreamDisplay.vue";
import InfoPopup from "./components/InfoPopup.vue";

const productsStore = useProductsStore();
const productsByCategory = computed(() => {
    if (productsStore.products) return groupProductsByCategory(productsStore.products)
    return []
})

const generalStore = useGeneralStore();

const selectedCountry = ref<string | number | null>(null);
const selectedCity = ref<string | number | null>(null);

const selectedCountryObj = computed<ICountry | null>(() => {
    return generalStore.countries.find(country => country.name === selectedCountry.value) || null
})
const selectedCityObj = computed<ICity | null>(() => {
    return generalStore.cities.find(country => country.name === selectedCity.value) || null
})

const lastDataset = computed<LastDataset>(() => {
    return productsStore.lastDataset
})

onMounted(async () => await generalStore.loadCountries())
watch( () => selectedCountry.value, async () => {
    if (selectedCountryObj.value !== null) {
        if ("id" in selectedCountryObj.value) {
            await generalStore.loadCities(selectedCountryObj.value.id)
        }
    }
})
</script>

<template>
    <InfoPopup/>

    <div>
        <h1>Costly</h1>
        <p>Search most commonly bought groceries and its prices in your location or location you want to visit</p>

        <div class="wrapper-control">
            <div class="wrapper-control__inputs">
                <SelectInput
                        label="Select a Country"
                        :options="generalStore.countries"
                        v-model="selectedCountry"
                />
                <SelectInput
                        label="Select a City"
                        :options="generalStore.cities"
                        v-model="selectedCity"
                        :disabled="!selectedCountry"
                />
            </div>
            <div class="wrapper-control__button">
                <ButtonBasic :disabled="!selectedCountry || productsStore.loading"
                             @click="productsStore.loadProducts(selectedCountryObj, selectedCityObj)">Search</ButtonBasic>
            </div>
        </div>

<!--        <StreamDisplay/>-->

        <div class="wrapper-data" v-show="productsStore.loading || productsStore.products">
            <div v-if="productsStore.loading" class="loader">
                Data is about to be shown, <b>please wait...</b>
            </div>
            <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
            <template v-if="productsStore.products">
                <p v-if="lastDataset.country">
                    Current avg. prices in
                    <b>{{lastDataset.city
                    ? `${lastDataset.city.name}, ${lastDataset.country.name}`
                    : lastDataset.country.name}}
                    </b>.
                </p>
                <p v-if="lastDataset.date">
                    This dataset is from: {{lastDataset.date}}. If you wish fresh one, or customized one, please <button @click="login">login</button>.
                </p>

                <div class="wrapper-data__table">
                    <template v-for="(products, category) in productsByCategory">
                        <TableDisplay :data="products" :category="category"/>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '/src/assets/styles/main.scss';

.error {
    color: red;
}

.loader {
    margin-top: 2rem;
}

.wrapper-data {
    border-top: 1px solid black;
    padding-top: 1rem;

    &__table {
        margin: 1rem 0 2rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        @include respond-lg {
            flex-direction: row;
        }
    }
}

.wrapper-control {
    display: flex;
    justify-content: space-between;
    margin: 3rem auto 1rem;
    max-width: 650px;

    &__inputs {
        display: flex;

        .select-input {
            max-width: 220px;

            :deep(label) {
                position: relative;
                top: -5px;
            }
        }
    }

    &__button {
        display: flex;

        :deep(button) {
            width: 160px;
        }
    }
}
</style>
