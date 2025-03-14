import {apiClient} from "./apiClient.ts";
import type {Credentials, Providers} from "../types/auth";

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/register', { email, password } as Credentials );
        return response.data;
    } catch (error) {
        console.error('Error registering in:', error);
        throw error;
    }
};

export const loginUserWithCredentials = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/loginWithCredentials', { email, password } as Credentials , { withCredentials: true});
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

export const refreshToken = async () => {
    try {
        const response = await apiClient.get('/refresh-token', { withCredentials: true });
        // todo - check hydration when user is not logged in and never been
        console.log(response)
        return response.data
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}