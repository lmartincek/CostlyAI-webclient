import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProducts } from '../services/externalApi.ts';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Product} from "../types/products";
import {daysAsOrdinals, months} from "../constants/date.ts";

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

    const loadProducts = async (country: ICountry | null, city: ICity | null)  => {
        if (!country) return;

        loading.value = true;
        try {
            products.value = await getProducts(country, city);
            lastDataset.value.country = country;
            lastDataset.value.city = city || null;

            if (products.value !== null && products.value.length) {
                lastDataset.value.date = parseDate(new Date(products.value[0].created_at))
            }
        } catch (err) {
            error.value = 'Failed to fetch products';

            if (lastDataset.value.country) {
                lastDataset.value.country = null;
            }

            if (lastDataset.value.city) {
                lastDataset.value.city = null;
            }

            if (lastDataset.value.date) {
                lastDataset.value.date = null
            }
        } finally {
            loading.value = false;
        }
    };

    return { products, error, loading, lastDataset, loadProducts };
});
