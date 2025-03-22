import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import type { Product } from '@/types/products'
import { getProducts } from '../services/productService.ts'
import type { CostOfLivingCategoryNames } from '../constants/categories.ts'
import { useNotificationsStore } from '@/stores/notificationsStore.ts'
import { parseDateAsOrdinalsWithMonths } from '@/utils/dateHelpers.ts'

export interface LastDataset {
  country: ICountry | null
  city: ICity | null
  date: string | null
}

export const useProductsStore = defineStore('productsStore', () => {
  const products = ref<Product[]>([])
  const loading = ref<boolean>(false)

  const lastDataset = ref<LastDataset>({} as LastDataset)

  const loadProducts = async (
    country: ICountry | null,
    city: ICity | null,
    selectedCategories?: CostOfLivingCategoryNames[],
    userId?: string,
  ) => {
    if (!country) return

    loading.value = true
    try {
      const data = await getProducts(country, city, selectedCategories, userId)

      products.value = data
      lastDataset.value = {
        country,
        city: city || null,
        date: data[0]?.created_at
          ? parseDateAsOrdinalsWithMonths(new Date(data[0].created_at))
          : parseDateAsOrdinalsWithMonths(new Date()),
      }
    } catch (err) {
      if (products.value.length) {
        products.value = []
      }

      useNotificationsStore().showNotification({
        message: 'Please, try again. The server is busy.',
        type: 'error',
        duration: 3000,
      })

      console.error(err)

      lastDataset.value = {
        country: null,
        city: null,
        date: null,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    lastDataset,
    loadProducts,
  }
})
