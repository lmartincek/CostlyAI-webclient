import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import { getCities, getCountries } from '../services/generalService.ts'

export const useGeneralStore = defineStore('generalStore', () => {
  const countries = ref<ICountry[]>([])
  const cities = ref<ICity[]>([])

  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const loadCountries = async () => {
    loading.value = true
    try {
      countries.value = await getCountries()
    } catch (err) {
      error.value = `Failed to fetch countries: ${err}`
    } finally {
      loading.value = false
    }
  }

  const loadCities = async (countryIds: number[]) => {
    loading.value = true
    try {
      cities.value = await getCities(countryIds)
    } catch (err) {
      error.value = `Failed to fetch cities ${err}`
    } finally {
      loading.value = false
    }
  }

  return { countries, cities, error, loading, loadCountries, loadCities }
})
