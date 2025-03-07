import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendChatMessage = async (countryId: number | undefined, cityId: number | undefined, message: string) => {
    try {
        const response = await apiClient.post('/chat', { message } );

        if (response.data && response.status === 200) {
            await apiClient.post('/products', { countryId, cityId, products: response.data })
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

export const getProducts = async (countryId: number, cityId: number | undefined, message: string) => {
    const url = `/products?countryId=${countryId}${cityId ? `&cityId=${cityId}` : ''}`
    try {
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        // @ts-ignore
        if (error.response.status === 404) {
            return await sendChatMessage(countryId, cityId, message)
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
