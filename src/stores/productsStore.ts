import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Product} from "../types/products";
import {daysAsOrdinals, months} from "../constants/date.ts";
import {getProducts} from "../services/generalService.ts";

export interface LastDataset {
    country: ICountry | null,
    city: ICity | null,
    date: string | null,
}

function parseDate (date: Date): string | null {
    const day = daysAsOrdinals[date.getDate()] ?? `${date.getDate()}th`;
    const month = months[date.getMonth() + 1];

    if (day && month) return `${day} of ${month}, ${date.getFullYear()}`
    return null
}

export const useProductsStore = defineStore('productsStore', () => {
    const products = ref<Product[] | null>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const lastDataset = ref<LastDataset>({} as LastDataset)

    const recentlySearchedProducts = ref<Product[] | null>(null)

    const loadProducts = async (country: ICountry | null, city: ICity | null) => {
        if (!country) return;

        loading.value = true;
        try {
            const data = await getProducts(country, city);

            products.value = data;
            lastDataset.value = {
                country,
                city: city || null,
                date: data[0]?.created_at ? parseDate(new Date(data[0].created_at)) : parseDate(new Date()),
            };
        } catch (err) {
            error.value = 'Failed to fetch products';

            lastDataset.value = {
                country: null,
                city: null,
                date: null,
            };
        } finally {
            loading.value = false;
        }
    };

    //TODO - handle multiple errors
    const loadRecentlySearchedProducts = async (limit: number) => {
        try {
            recentlySearchedProducts.value = await getProducts(null, null, limit);
        } catch (err) {
            console.error(`Failed to fetch recently searched products: ${err}`)
        }
    }

    return { products, error, loading, lastDataset, recentlySearchedProducts, loadProducts, loadRecentlySearchedProducts };
});
