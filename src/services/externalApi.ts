import axios from 'axios';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendChatMessage = async (country: ICountry, city: ICity | null) => {
    try {
        const response = await apiClient.post('/chat', { countryName: country.name, cityName: country.name  } );

        if (response.data && response.status === 200) {
            await apiClient.post('/products', { countryId: country.id, cityId: city?.id, products: response.data })
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

export const getProducts = async (country: ICountry, city: ICity | null) => {
    const url = `/products?countryId=${country.id}${city?.id ? `&cityId=${city.id}` : ''}`
    try {
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        // @ts-ignore
        if (error.response.status === 404) {
            return await sendChatMessage(country, city)
        }

        console.error('Error fetching products from DB:', error);
        throw error;
    }
};

export const getCountries = async () => {
    try {
        const response = await apiClient.get('/countries' );
        console.log(response, 'countries from DB')
        return response.data;
    } catch (error) {
        console.error('Error fetching countries from DB:', error);
        throw error;
    }
};

export const getCities = async (countryId: number) => {
    try {
        const response = await apiClient.get(`/cities?countryId=${countryId}` );
        console.log(response, 'cities from DB')
        return response.data;
    } catch (error) {
        console.error('Error fetching cities from DB:', error);
        throw error;
    }
};
