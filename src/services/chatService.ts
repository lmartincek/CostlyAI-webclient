import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import { apiClient } from './apiClient.ts'
import type { CostOfLivingCategoryNames } from '../constants/categories.ts'
import { postProducts, postUserProducts } from '@/services/productService.ts'
import { postUserSearchedPlaces } from '@/services/generalService.ts'

// TODO - add return types to all services
export const sendChatMessage = async (
  country: ICountry,
  city: ICity | null,
  selectedCategories?: CostOfLivingCategoryNames[],
  userId?: string,
) => {
  try {
    const chatResponse = await apiClient.post('/chat', {
      countryName: country.name,
      cityName: country.name,
      selectedCategories,
    })

    // TODO - cleanup the mess in services , move fetch business logic outside of services
    if (!selectedCategories) {
      if (chatResponse.data && chatResponse.status === 200) {
        await postProducts(chatResponse.data, country, city)
      }
    } else if (selectedCategories && userId) {
      if (chatResponse.data && chatResponse.status === 200) {
        await postUserSearchedPlaces(userId, selectedCategories, country, city).then(
          async (userSearchResponse) => {
            const userSearchData = userSearchResponse?.data
            if (!userSearchData || userSearchData.length === 0 || !userSearchData[0].id) {
              console.error('Error: userSearchId is missing!', userSearchData)
              return
            }

            const userSearchId = userSearchData[0].id
            await postUserProducts(userId, userSearchId, chatResponse.data)
          },
        )
      }
    }

    return chatResponse.data
  } catch (error) {
    console.error('Error fetching data from openAI API:', error)
    throw error
  }
}
