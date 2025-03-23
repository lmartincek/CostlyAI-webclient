import { computed, reactive, ref } from 'vue'
import type { ComputedRef, Ref, Reactive } from 'vue'
import type { ICountry } from '@/types/countries'
import type { ICity } from '@/types/cities'
import type { CostOfLivingCategoryNames } from '@/constants/categories'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { parseDateAsOrdinalsWithMonths } from '@/utils/dateHelpers'
import { useChat } from '@/composables/chatHandler.ts'
import type { Product, ProductGroups } from '@/types/products'
import { getProducts, getUserProducts } from '@/services/productService'
import { groupProductsByCategory } from '@/utils/objectHelpers.ts'

export interface LastDataset {
  country: ICountry | null
  city: ICity | null
  date: string | null
}

export type LoadProductsArgs = {
  country: ICountry | null
  city: ICity | null
  selectedCategories?: CostOfLivingCategoryNames[]
  userId?: string | null
}

interface UseProductsReturn {
  products: Ref<Product[]>
  productsByCategory: ComputedRef<ProductGroups | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  lastDataset: Reactive<LastDataset>
  loadProducts: (args: LoadProductsArgs) => Promise<void>
  loadProductsBySearchId: (userId: string | null, searchId: number) => Promise<void>
}

export function useProducts(): UseProductsReturn {
  const products = ref<Product[]>([])
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const lastDataset = reactive<LastDataset>({} as LastDataset)

  function updateLastDataset(
    products: Product[] | null,
    country: ICountry | null,
    city: ICity | null,
  ) {
    if (!products || !country) {
      lastDataset.country = null
      lastDataset.city = null
      lastDataset.date = null
    } else {
      lastDataset.country = country
      lastDataset.city = city
      lastDataset.date = products[0]?.created_at
        ? parseDateAsOrdinalsWithMonths(new Date(products[0].created_at))
        : parseDateAsOrdinalsWithMonths(new Date())
    }
  }

  const { sendChatMessage } = useChat()

  const productsByCategory = computed<ProductGroups | null>(() => {
    if (products.value.length) return groupProductsByCategory(products.value)
    return null
  })

  async function loadProducts({ country, city, selectedCategories, userId }: LoadProductsArgs) {
    if (!country) {
      throw new Error('country is required')
    }

    loading.value = true
    error.value = null

    try {
      if (selectedCategories?.length) {
        products.value = await sendChatMessage(country, city, selectedCategories, userId)
      } else {
        products.value = await getProducts(country, city)
      }

      updateLastDataset(products.value, country, city)
    } catch (err) {
      if (err.response?.status === 404) {
        products.value = await sendChatMessage(country, city)

        updateLastDataset(products.value, country, city)
      } else {
        error.value = err
        console.error('Error fetching products:', err)

        useNotificationsStore().showNotification({
          message: 'Please, try again. The server is busy.',
          type: 'error',
          duration: 3000,
        })

        products.value = []
        updateLastDataset(null, null, null)

        throw err
      }
    } finally {
      loading.value = false
    }
  }

  async function loadProductsBySearchId(userId: string | null, searchId: number) {
    if (!userId || !searchId) {
      throw new Error('both userId and searchId is required')
    }

    try {
      loading.value = true
      products.value = await getUserProducts(userId, searchId)
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    productsByCategory,
    loading,
    error,
    lastDataset,
    loadProducts,
    loadProductsBySearchId,
  }
}
