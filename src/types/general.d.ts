import type { ICity } from '@/types/cities'
import type { ICountry } from '@/types/countries'
import type { CostOfLivingCategoryNames } from '@/constants/categories.ts'

export interface IPlace {
  country: ICountry
  city: ICity | null
}

export interface IUserSearch extends IPlace {
  id: number
  categories: CostOfLivingCategoryNames[]
  created_at: string
}
