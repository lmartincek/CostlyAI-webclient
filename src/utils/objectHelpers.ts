import type { Product, ProductGroups } from '@/types/products'

export const groupProductsByCategory = (products: Product[]): ProductGroups => {
  return products.reduce((acc: ProductGroups, product: Product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as ProductGroups)
}
