import {ProductCategory} from "../constants/products.ts";

type ProductCategoryType = ProductCategory.GROCERIES | ProductCategory.SERVICES | ProductCategory.OTHERS
interface ProductAIResponse {
    name: string,
    price: number,
    category: ProductCategoryType,
}

export interface Product extends ProductAIResponse {
    id: number,
    country_id: number,
    city_id: number | null,
    created_at: string,
}

export type ProductGroups = Record<ProductCategoryType, Product[]>;