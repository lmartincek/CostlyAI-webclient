import { defineStore } from 'pinia';
import { ref } from 'vue';
import {getCities, getCountries} from '../services/externalApi.ts';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";

export const useGeneralStore = defineStore('generalStore', () => {
    const countries = ref<ICountry[]>([]);
    const cities = ref<ICity[]>([]);

    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const loadCountries = async () => {
        loading.value = true;
        try {
            countries.value = await getCountries();
        } catch (err) {
            error.value = 'Failed to fetch countries';
        } finally {
            loading.value = false;
        }
    };

    const loadCities = async (countryId: number) => {
        loading.value = true;
        try {
            cities.value = await getCities(countryId);
        } catch (err) {
            error.value = 'Failed to fetch cities';
        } finally {
            loading.value = false;
        }
    };

    return { countries, cities, error, loading, loadCountries, loadCities };
});
