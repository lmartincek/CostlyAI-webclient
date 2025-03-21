import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import { apiClient } from './apiClient.ts'
import { sendChatMessage } from './chatService.ts'
import type { CostOfLivingCategoryNames } from '../constants/categories.ts'

export const getProducts = async (
  country: ICountry | null,
  city: ICity | null,
  selectedCategories?: CostOfLivingCategoryNames[],
  limit?: number,
) => {
  if (!country && !limit) {
    throw new Error('Either country or limit is required')
  }

  if (selectedCategories?.length && country) {
    try {
      return await sendChatMessage(country, city, selectedCategories)
    } catch (e) {
      throw e
    }
  }

  const queryParams = []
  if (country) {
    queryParams.push(`countryId=${country.id}`)
  }
  if (city?.id) {
    queryParams.push(`cityId=${city.id}`)
  }
  if (limit) {
    queryParams.push(`limit=${limit}`)
  }
  const url = `/products${queryParams.length ? `?${queryParams.join('&')}` : ''}`

  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    if (error.response?.status === 404 && country) {
      return await sendChatMessage(country, city)
    }

    console.error('Error fetching products from DB:', error)
    throw error
  }
}

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
