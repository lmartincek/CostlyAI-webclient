import type { ICountry } from '../types/countries'
import type { ICity } from '../types/cities'
import { apiClient } from './apiClient.ts'
import type { CostOfLivingCategoryNames } from '../constants/categories.ts'

// TODO add return types to all services
export const sendChatMessage = async (
  country: ICountry,
  city: ICity | null,
  selectedCategories?: CostOfLivingCategoryNames[],
) => {
  try {
    const response = await apiClient.post('/chat', {
      countryName: country.name,
      cityName: country.name,
      selectedCategories,
    })

    if (!selectedCategories) {
      if (response.data && response.status === 200) {
        await apiClient.post('/products', {
          countryId: country.id,
          cityId: city?.id,
          products: response.data,
        })
      }
    }

    return response.data
  } catch (error) {
    console.error('Error fetching data from API:', error)
    throw error
  }
}
