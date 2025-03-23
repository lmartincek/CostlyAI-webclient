import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import { apiClient } from '@/services/apiClient.ts'
import type { ProductAIResponse } from '@/types/products'

export const getProducts = async (country: ICountry | null, city: ICity | null) => {
  const queryParams = []
  if (country) {
    queryParams.push(`countryId=${country.id}`)
  }
  if (city?.id) {
    queryParams.push(`cityId=${city.id}`)
  }
  const url = `/products${queryParams.length ? `?${queryParams.join('&')}` : ''}`

  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching products from DB:', error)
    throw error
  }
}

export const postProducts = async (
  products: ProductAIResponse[],
  country: ICountry,
  city: ICity | null,
) => {
  try {
    const response = await apiClient.post('/products', {
      countryId: country.id,
      cityId: city?.id,
      products,
    })

    return response.data
  } catch (error) {
    console.error('Error adding products to DB:', error)
    throw error
  }
}

export const getUserProducts = async (userId: string, searchId: number) => {
  try {
    const response = await apiClient.get(`/products/user?userId=${userId}&searchId=${searchId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user products from DB:', error)
    throw error
  }
}

export const postUserProducts = async (
  userId: string,
  userSearchId: number,
  products: ProductAIResponse[],
) => {
  try {
    const response = await apiClient.post('/products/user', {
      userId,
      userSearchId,
      products,
    })

    return response.data
  } catch (error) {
    console.error('Error adding user products to DB:', error)
    throw error
  }
}
