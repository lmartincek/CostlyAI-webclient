declare type ProductCategoryType = "groceries" | "services" | "others";

declare interface ProductAIResponse {
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