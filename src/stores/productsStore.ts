import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProducts } from '../services/externalApi.ts';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Product} from "../types/products";

export const useProductsStore = defineStore('productsStore', () => {
    const products = ref<Product[] | null>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const lastCountry = ref<string | null>(null);
    const lastCity = ref<string | null>(null);

    const loadProducts = async (country: ICountry | null, city: ICity | null)  => {
        if (!country) return;

        loading.value = true;
        try {
            products.value = await getProducts(country, city);
            lastCountry.value = country.name;
            lastCity.value = city?.name || null;
        } catch (err) {
            error.value = 'Failed to fetch products';

            if (lastCountry.value) {
                lastCountry.value = null;
            }

            if (lastCity.value) {
                lastCity.value = null;
            }
        } finally {
            loading.value = false;
        }
    };

    return { products, error, loading, lastCountry, lastCity, loadProducts };
});
