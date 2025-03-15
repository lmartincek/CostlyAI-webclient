import {apiClient} from "./apiClient.ts";
import type {Credentials, Providers} from "../types/auth";
import {handleApiError} from "../utils/handleApiError.ts";

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/register', { email, password } as Credentials, { withCredentials: true} );
        return response.data;
    } catch (error) {
        console.error(`Failed to register user: ${error}`)
        throw new Error(handleApiError(error))
    }
};

export const loginUserWithCredentials = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/login-with-credentials', { email, password } as Credentials , { withCredentials: true});
        return response.data;
    } catch (error) {
        console.error(`Failed to login with credentials: ${error}`)
        throw new Error(handleApiError(error))
    }
};

// TODO remember me
export const loginUserWithProvider = async (provider: Providers) => {
    try {
        const response = await apiClient.post('/login-with-provider', { provider });

        if (response.data.url) {
            window.location.href = response.data.url;
        }
    } catch (error) {
        console.error(`Error logging in with ${provider}: ${error}`);
        throw new Error(handleApiError(error))
    }
};

export const logoutUser = async () => {
    try {
        await apiClient.post('/logout', {}, { withCredentials: true });
    } catch (error) {
        console.error(`Error logging out: ${error}`);
        throw new Error(handleApiError(error))
    }
};

export const refreshToken = async () => {
    try {
        const response = await apiClient.get('/refresh-token', { withCredentials: true });
        return response.data
    } catch (error) {
        console.error(`Error refreshing token: ${error}`);
        throw new Error(handleApiError(error))
    }
}