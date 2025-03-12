import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";
import type {Credentials, Providers} from "../types/auth";
import {apiClient} from "./apiClient.ts";

// TODO - separate into files
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

export const getProducts = async (
    country: ICountry | null,
    city: ICity | null,
    limit?: number,
) => {
    if (!country && !limit) {
        throw new Error('Either country or limit is required');
    }

    const queryParams = [];
    if (country) {
        queryParams.push(`countryId=${country.id}`);
    }
    if (city?.id) {
        queryParams.push(`cityId=${city.id}`);
    }
    if (limit) {
        queryParams.push(`limit=${limit}`);
    }
    const url = `/products${queryParams.length ? `?${queryParams.join('&')}` : ''}`;

    try {
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        // @ts-ignore
        if (error.response?.status === 404) {
            if (country) return await sendChatMessage(country, city);
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
    try {
        const response = await apiClient.post('/loginWithProvider', { provider });

        if (response.data.url) {
            window.location.href = response.data.url;
        }
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