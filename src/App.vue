<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import TableDisplay from "./components/TableDisplay.vue";

import {useProductsStore} from './stores/productsStore.ts';
import type { LastDataset } from "./stores/productsStore.ts";
import {computed, onMounted, ref, watch} from "vue";
import {useGeneralStore} from "./stores/generalStore.ts";
import {groupProductsByCategory} from "./utils/objectHelpers.ts";
import type {ICountry} from "./types/countries";
import type {ICity} from "./types/cities";

// import StreamDisplay from "./components/StreamDisplay.vue";
import InfoPopup from "./components/InfoPopup.vue";
import Nav from "./components/Nav.vue";
import Layout from "./components/Layout.vue";
import Footer from "./components/Footer.vue";
import Signup from "./components/Signup.vue";
import Spinner from "./components/Spinner.vue";
import {useModalStore} from "./stores/modalsStore.ts";
import RecentlySearched from "./components/RecentlySearched.vue";
import Icon from "./components/Icon.vue";

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

//todo - add pagination, search query with debounce, loader in select input
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
    <Signup/>

    <Nav/>

    <Layout>
        <template v-slot:headline>
            <h1>CostlyAI</h1>
            <p>Discover living costs worldwide, compare prices and plan your travel budget with real-time data from cities around the globe</p>
        </template>

        <template v-slot:content>
            <div class="wrapper-control">
                <div class="wrapper-control__inputs">
                    <SelectInput
                        default-option-label="Select Country"
                        :options="generalStore.countries"
                        v-model="selectedCountry"
                    >
                        <template v-slot:input-icon><Icon name="country" alt="" /></template>
                    </SelectInput>

    <!--                TODO - disabled click - error label that needs to select country first-->
                    <SelectInput
                        default-option-label="Select City"
                        :options="generalStore.cities"
                        v-model="selectedCity"
                        :disabled="!selectedCountry"
                    >
                        <template v-slot:input-icon><Icon name="city" width="20" height="20" alt="" /></template>
                    </SelectInput>
                </div>
                <div class="wrapper-control__button">
                    <ButtonBasic :disabled="!selectedCountry || productsStore.loading"
                                 @click="productsStore.loadProducts(selectedCountryObj, selectedCityObj)">Search Costs</ButtonBasic>
                </div>
            </div>

            <RecentlySearched/>

            <!--        <StreamDisplay/>-->

            <div class="wrapper-data" v-show="productsStore.loading || productsStore.products">
                <template v-if="productsStore.loading">
                    <div class="loader">
                        <Spinner/>
                    </div>
                    <span>Fetching latest prices... This might take a few moments, <b>please wait...</b></span>
                </template>
                <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
                <template v-if="productsStore.products">
                    <p v-if="lastDataset.country">
                        Current avg. prices in
                        <b>{{lastDataset.city
                        ? `${lastDataset.city.name}, ${lastDataset.country.name}`
                        : lastDataset.country.name}}
                        </b>.
                    </p>
                    <div v-if="lastDataset.date && lastDataset.country" class="wrapper-data__info">
                        <p>Data updated on: <b>{{lastDataset.date}}</b></p>
                        <p @click="useModalStore().openModal"><Icon alt="" name="star" width="18" height="18" />
                            Sign up to create your own costs w/ fresh data
                        </p>
                    </div>

                    <div class="wrapper-data__table">
                        <template v-for="(products, category) in productsByCategory">
                            <TableDisplay :data="products" :category="category"/>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </Layout>

    <Footer/>
</template>

<style lang="scss">
@import '/src/assets/styles/main.scss';

.error {
    color: red;
}

.loader {
    margin: 4rem 0 1rem;
}

.wrapper-data {
    margin: 4rem 0;

    &__table {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }

    &__info {
        display: flex;
        text-align: left;
        flex-direction: column;

        @include respond-md {
            flex-direction: row;
            justify-content: space-between;
        }

        p:nth-last-child(1) {
            color: $primary-color;
            cursor: pointer;
            display: flex;
            align-items: center;

            img {
                margin-right: .25rem;
            }

            &:hover{
                text-decoration: underline;
            }
        }
    }
}

.wrapper-control {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: $white-color;
    padding: 2rem 1rem 1.5rem;
    margin: 3rem auto 1rem;
    max-width: 650px;
    border-radius: 1rem;
    box-shadow: 0 10px 15px rgba(0,0,0,10%);

    &__inputs {
        display: flex;
        justify-content: space-between;
        width: 100%;
        flex-direction: column;

        @include respond-md() {
            flex-direction: row;
        }
    }

    &__button {
        margin: 0.75rem 0 0;
        width: 100%;

        :nth-child(1) {
            width: 100%;
        }

        @include respond-md() {
            margin: 1.5rem auto 0;
        }
    }
}
</style>
