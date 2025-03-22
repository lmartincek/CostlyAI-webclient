import { apiClient } from './apiClient.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { CostOfLivingCategoryNames } from '@/constants/categories.ts'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'

export const getCountries = async () => {
  // TODO
  //  - add pagination
  //  - add search query
  //  - add debounce
  try {
    const response = await apiClient.get('/countries')
    return response.data
  } catch (error) {
    console.error('Error fetching countries from DB:', error)
    throw error
  }
}

export const getCities = async (countryIds: number[]) => {
  try {
    const response = await apiClient.get(`/cities?countryIds=${countryIds.join(',')}`)
    return response.data
  } catch (error) {
    console.error('Error fetching cities from DB:', error)
    throw error
  }
}

export const getRecentlySearchedPlaces = async (places?: number) => {
  const url = '/recently-searched-places'
  try {
    const response = await apiClient.get(`${places ? `${url}?places=${places}` : `${url}`}`)
    return response.data
  } catch (error) {
    console.error('Error fetching cities from DB:', error)
    throw error
  }
}

export const getUserSearchedPlaces = async (userId: string, places?: number) => {
  const url = `/recently-searched-places/user?userId=${userId}${places ? `&places=${places}` : ''}`
  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error(`Error fetching user searched places: ${error}`)
    throw new Error(handleApiError(error))
  }
}

export const postUserSearchedPlaces = async (
  userId: string,
  categories: CostOfLivingCategoryNames[],
  country: ICountry,
  city: ICity | null,
) => {
  try {
    const response = await apiClient.post('/recently-searched-places/user', {
      countryId: country.id,
      cityId: city?.id,
      userId,
      categories,
    })

    return response.data
  } catch (error) {
    console.error(`Error posting new user searched places ${error}`)
    throw new Error(handleApiError(error))
  }
}
