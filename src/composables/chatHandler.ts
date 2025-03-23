import { ref } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import type { CostOfLivingCategoryNames } from '@/constants/categories'
import { postChat } from '@/services/chatService'
import { postProducts, postUserProducts } from '@/services/productService'
import { postUserSearchedPlaces } from '@/services/generalService'

export function useChat() {
  const loading = ref(false)
  const error = ref(null)

  async function sendChatMessage(
    country: ICountry,
    city: ICity | null,
    selectedCategories?: CostOfLivingCategoryNames[],
    userId?: string | null,
  ) {
    loading.value = true
    error.value = null

    try {
      const data = await postChat(country, city, selectedCategories)

      if (!selectedCategories) {
        await postProducts(data, country, city)
      } else if (selectedCategories && userId) {
        const userSearchResponse = await postUserSearchedPlaces(
          userId,
          selectedCategories,
          country,
          city,
        )
        const userSearchData = userSearchResponse?.data

        if (!userSearchData || userSearchData.length === 0 || !userSearchData[0].id) {
          console.error('Error: userSearchId is missing!', userSearchData)
          return
        }

        const userSearchId = userSearchData[0].id
        await postUserProducts(userId, userSearchId, data)
      }

      return data
    } catch (err) {
      error.value = err
      console.error('Error processing chat response:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    sendChatMessage,
  }
}
