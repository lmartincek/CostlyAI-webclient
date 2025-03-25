<script setup lang="ts">
import ButtonBasic from '@/components/common/ButtonBasic.vue'
import Icon from '@/components/common/IconCostly.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import type { ICity } from '@/types/cities'
import type { ICountry } from '@/types/countries'
import { useGeneralStore } from '@/stores/generalStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import type { CostOfLivingCategoryNames } from '@/constants/categories.ts'
import type { LoadProductsArgs } from '@/composables/productsProvider.ts'
const CostCategories = defineAsyncComponent(() => import('@/components/costs/CostCategories.vue'))

defineProps<{
  productsLoading: boolean
  loadProducts: (args: LoadProductsArgs) => Promise<void>
}>()

const generalStore = useGeneralStore()
const authStore = useAuthStore()

const selectedCountry = ref<string>('')
const selectedCity = ref<string>('')

const selectedCountryObj = computed<ICountry | null>(() => {
  return generalStore.countries.find((country) => country.name === selectedCountry.value) || null
})
const selectedCityObj = computed<ICity | null>(() => {
  return generalStore.cities.find((country) => country.name === selectedCity.value) || null
})

if (!generalStore.countries.length) {
  onMounted(async () => await generalStore.loadCountries())
}

//TODO - add pagination, search query with debounce, loader in select input
watch(
  () => selectedCountry.value,
  async () => {
    if (selectedCountryObj.value !== null) {
      if ('id' in selectedCountryObj.value) {
        await generalStore.loadCities([selectedCountryObj.value.id])
      }
    }
    if (selectedCity.value) {
      selectedCity.value = ''
    }
  },
)

const selectedCategories = ref<CostOfLivingCategoryNames[]>([])
</script>

<template>
  <div class="wrapper-control">
    <div class="wrapper-control__inputs">
      <SelectInput
        default-option-label="Vietnam"
        :options="generalStore.countries"
        v-model="selectedCountry"
      >
        <template v-slot:input-icon><Icon name="country" alt="" /></template>
      </SelectInput>

      <SelectInput
        default-option-label="Hanoi"
        :options="generalStore.cities"
        v-model="selectedCity"
        :disabled="!selectedCountry"
      >
        <template v-slot:input-icon><Icon name="city" width="20" height="20" alt="" /></template>
      </SelectInput>
    </div>
    <div class="wrapper-control__auth-section" v-if="authStore.isAuthenticated">
      <span>Click and select what are you interested in <b>(max: 5 categories)</b>:</span>
      <CostCategories @update:selected-tags="selectedCategories = $event" />
    </div>
    <div class="wrapper-control__button">
      <ButtonBasic
        :disabled="!selectedCountry || productsLoading"
        @click="
          loadProducts({
            country: selectedCountryObj,
            city: selectedCityObj,
            selectedCategories,
            userId: authStore.userId,
          })
        "
        >Search Costs</ButtonBasic
      >
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
  box-shadow: 0 10px 15px rgba(0, 0, 0, 10%);

  &__inputs {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: column;

    @include respond-md {
      flex-direction: row;
    }
  }

  &__auth-section {
    text-align: left;
    margin: 1rem 0;

    span {
      font-size: 0.9rem;
      margin: 0 0.25rem;
    }
  }

  &__button {
    margin: 0.75rem 0 0;
    width: 100%;

    :nth-child(1) {
      width: 100%;
    }

    @include respond-md {
      margin: 1.5rem auto 0;
      padding: 0 0.25rem;
    }
  }
}
</style>
