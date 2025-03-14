<script setup lang="ts">
import ButtonBasic from "./ButtonBasic.vue";
import Icon from "./Icon.vue";
import SelectInput from "./SelectInput.vue";
import {computed, onMounted, ref, watch} from "vue";
import type {ICity} from "../types/cities";
import type {ICountry} from "../types/countries";
import {useGeneralStore} from "../stores/generalStore.ts";
import {useProductsStore} from "../stores/productsStore.ts";
import Tag from "./Tag.vue";
import {COST_OF_LIVING_CATEGORIES} from "../constants/categories.ts";
import type { CostOfLivingCategory } from "../constants/categories.ts"
import {useAuthStore} from "../stores/authStore.ts";

const generalStore = useGeneralStore();
const productsStore = useProductsStore();
const authStore = useAuthStore()

const selectedCountry = ref<string>('');
const selectedCity = ref<string>('');

const selectedCountryObj = computed<ICountry | null>(() => {
    return generalStore.countries.find(country => country.name === selectedCountry.value) || null
})
const selectedCityObj = computed<ICity | null>(() => {
    return generalStore.cities.find(country => country.name === selectedCity.value) || null
})

onMounted(async () => await generalStore.loadCountries())

//todo - add pagination, search query with debounce, loader in select input
//todo watcher on new product load scroll to its section
watch( () => selectedCountry.value, async () => {
    if (selectedCountryObj.value !== null) {
        if ("id" in selectedCountryObj.value) {
            await generalStore.loadCities([selectedCountryObj.value.id])
        }
    }
    if (selectedCity.value) {
        selectedCity.value = ''
    }
})

const selectedTags = ref<string[]>([])
const isMaximumCount = computed<boolean>(() => selectedTags.value.length >= 5)
function handleTagClick(event: boolean, tag: CostOfLivingCategory) {
    if (event) {
        selectedTags.value = [...selectedTags.value, tag.name]
    } else {
        selectedTags.value = selectedTags.value.filter(selectedTag => tag.name !== selectedTag)
    }
}
</script>

<template>
    <div class="wrapper-control">
        <div class="wrapper-control__inputs">
            <SelectInput
                    default-option-label="Select Country"
                    :options="generalStore.countries"
                    v-model="selectedCountry"
            >
                <template v-slot:input-icon><Icon name="country" alt="" /></template>
            </SelectInput>

            <SelectInput
                    default-option-label="Select City"
                    :options="generalStore.cities"
                    v-model="selectedCity"
                    :disabled="!selectedCountry"
            >
                <template v-slot:input-icon><Icon name="city" width="20" height="20" alt="" /></template>
            </SelectInput>
        </div>
        <div class="wrapper-control__auth-section" v-if="authStore.isAuthenticated">
            <span>Click and select what are you interested in <b>(max: 5 categories)</b>:</span>
            <div class="tags">
                <Tag v-for="tag in COST_OF_LIVING_CATEGORIES"
                     :icon="tag.name"
                     :disabled="isMaximumCount && !selectedTags.includes(tag.name)"
                     @update:is-selected="handleTagClick($event, tag)">
                    <template v-slot:icon><font-awesome-icon :icon="tag.icon" style="margin-right: 10px;" /></template>
                    {{ tag.name }}</Tag>
            </div>
        </div>
        <div class="wrapper-control__button">
            <ButtonBasic :disabled="!selectedCountry || productsStore.loading"
                         @click="productsStore.loadProducts(selectedCountryObj, selectedCityObj, selectedTags)">Search Costs</ButtonBasic>
        </div>
    </div>

</template>

<style scoped lang="scss">
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

    @include respond-md{
      flex-direction: row;
    }
  }

    &__auth-section {
        text-align: left;
        margin: 1rem 0;

        span {
            font-size: .9rem;
            margin: 0 .25rem;
        }

       .tags {
           display: flex;
           flex-wrap: wrap;
           gap: 1rem;
           margin-top: 1rem;

           :deep(.tag) {
               flex: 1 1 auto;
               min-width: 150px;
               max-width: 200px;
               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
           }
       }
    }

  &__button {
    margin: 0.75rem 0 0;
    width: 100%;

    :nth-child(1) {
      width: 100%;
    }

    @include respond-md{
      margin: 1.5rem auto 0;
      padding: 0 .25rem;
    }
  }
}
</style>