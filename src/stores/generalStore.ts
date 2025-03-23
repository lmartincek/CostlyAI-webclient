import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import {
  getCities,
  getCountries,
  getRecentlySearchedPlaces,
  getUserSearchedPlaces,
} from '@/services/generalService.ts'
import type { IPlace, IUserSearch } from '@/types/general'

export const useGeneralStore = defineStore('generalStore', () => {
  const countries = ref<ICountry[]>([])
  const cities = ref<ICity[]>([])

  const recentlySearchedPlaces = ref<IPlace[]>([])
  const mySearchedPlaces = ref<IUserSearch[]>([])

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
      error.value = `Failed to fetch cities: ${err}`
    } finally {
      loading.value = false
    }
  }

  const loadRecentlySearchedPlaces = async (places?: number) => {
    loading.value = true
    try {
      recentlySearchedPlaces.value = await getRecentlySearchedPlaces(places)
    } catch (err) {
      error.value = `Failed to fetch recently searched places: ${err}`
    } finally {
      loading.value = false
    }
  }

  const loadUserSearchedPlaces = async (userId: string) => {
    loading.value = true
    try {
      mySearchedPlaces.value = await getUserSearchedPlaces(userId)
    } catch (err) {
      error.value = `Failed to fetch user searched places: ${err}`
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    cities,
    recentlySearchedPlaces,
    mySearchedPlaces,
    error,
    loading,
    loadCountries,
    loadCities,
    loadRecentlySearchedPlaces,
    loadUserSearchedPlaces,
  }
})
