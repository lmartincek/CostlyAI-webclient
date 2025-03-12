import { defineStore } from 'pinia';
import {ref} from "vue";
import {loginUserWithCredentials, loginUserWithProvider, registerUser} from "../services/externalApi.ts";
import type {Providers} from "../types/auth";

export const useAuthStore = defineStore('authStore', () =>{
    const user = ref(null)

    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const register = async (email: string, password: string) => {
        loading.value = true;

        try {
            user.value = await registerUser(email, password)
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
                user.value = await loginUserWithCredentials(email, password)
                return
            }

            if (provider) {
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
            user.value = null
        } catch (e) {
            error.value = 'Failed to logout'
        } finally {
            loading.value = false;
        }
    }

    return {user, register, login, logout}
})
