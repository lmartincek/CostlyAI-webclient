import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import type { CostOfLivingCategoryNames } from '@/constants/categories'
import { apiClient } from '@/services/apiClient.ts'

export const postChat = async (
  country: ICountry,
  city: ICity | null,
  selectedCategories?: CostOfLivingCategoryNames[],
) => {
  try {
    const chatResponse = await apiClient.post('/chat', {
      countryName: country.name,
      cityName: city?.name,
      selectedCategories,
    })

    return chatResponse.data
  } catch (error) {
    console.error('Error fetching data from openAI API:', error)
    throw error
  }
}
