import { defineStore } from 'pinia';
import {ref} from "vue";
import type {Providers} from "../types/auth";
import {
    deleteUser,
    loginUserWithCredentials,
    loginUserWithProvider,
    logoutUser,
    refreshToken,
    registerUser
} from "../services/authService.ts";

export const useAuthStore = defineStore('authStore', () =>{
    //todo add auth types
    const user = ref<any>(null)
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
            error.value = 'Failed to log out'
        } finally {
            loading.value = false;
        }
    }

    const deleteAccount = async (userId: string) => {
        loading.value = true;

        try {
            await deleteUser(userId)
            clearUser()
        } catch (e) {
            error.value = 'Failed to delete account'
        } finally {
            loading.value = false;
        }
    }

    return {error, user, isAuthenticated, accessToken, register, login, logout, rehydrate, deleteAccount}
})
