import axios from 'axios';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Credentials, Providers} from "../types/auth";

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

export const loginUserWithCredentials = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/loginWithCredentials', { email, password } as Credentials );
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error logging in with credentials:', error);
        throw error;
    }
};

export const loginUserWithProvider = async (provider: Providers) => {
    console.log({provider})
    try {
        const response = await apiClient.post('/loginWithProvider', { provider } );
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error logging in with provider:', error);
        throw error;
    }
};

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/loginWithProvider', { email, password } as Credentials );
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error registering in:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/logout');
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};