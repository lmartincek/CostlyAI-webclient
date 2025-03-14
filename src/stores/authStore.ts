import { defineStore } from 'pinia';
import {ref} from "vue";
import type {Providers} from "../types/auth";
import {
    loginUserWithCredentials,
    loginUserWithProvider,
    logoutUser,
    refreshToken,
    registerUser
} from "../services/authService.ts";

export const useAuthStore = defineStore('authStore', () =>{
    const user = ref(null)
    const accessToken = ref<string | null>(null);
    const isAuthenticated = ref<boolean>(false);

    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    function setUser (data: any) {
        user.value = data.user
        accessToken.value = data.accessToken
        isAuthenticated.value = true
    }

    function clearUser () {
        user.value = null
        accessToken.value = null
        isAuthenticated.value = false
    }

    const rehydrate = async () => {
        try {
            const data = await refreshToken();
            if (data) {
                setUser(data)
            } else {
                clearUser()
            }
        } catch (error) {
            console.error('Error rehydrating token:', error);
        }
    };

    if (!accessToken.value) {
        rehydrate().then()
    }

    const register = async (email: string, password: string) => {
        loading.value = true;

        try {
            const data = await registerUser(email, password)
            setUser(data)
        } catch (e) {
            error.value = 'Failed to register user'
        } finally {
            loading.value = false;
        }
    }

    const login = async (email: string | null, password: string | null, provider: Providers | null) => {
        loading.value = true;

        try {
            if (email && password) {
                const data = await loginUserWithCredentials(email, password)
                setUser(data)
                return
            }

            if (provider) {
                // @ts-ignore
                user.value = await loginUserWithProvider(provider)
                return
            }

        } catch (e) {
            error.value = `Failed to login w/ ${provider ? provider : 'credentials'}`
        } finally {
            loading.value = false;
        }
    }

    const logout = async () => {
        loading.value = true;

        try {
            await logoutUser()
            clearUser()
        } catch (e) {
            error.value = 'Failed to logout'
        } finally {
            loading.value = false;
        }
    }

    return {user, isAuthenticated, accessToken, register, login, logout, rehydrate}
})
