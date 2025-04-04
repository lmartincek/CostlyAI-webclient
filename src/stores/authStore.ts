import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Providers, User } from '@/types/auth'
import {
  getUser,
  loginUserWithCredentials,
  loginUserWithProvider,
  logoutUser,
  refreshUserToken,
  registerUser,
} from '@/services/authService.ts'
import router from '@/router/index.ts'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const isAuthenticated = ref<boolean>(false)
  const userId = computed<string | null>(() => user.value?.id || null)

  const loading = ref<boolean>(false)

  function setUser(data: { user: User; accessToken: string }) {
    user.value = data.user
    accessToken.value = data.accessToken
    isAuthenticated.value = true
  }

  function clearUser() {
    user.value = null
    accessToken.value = null
    isAuthenticated.value = false
  }

  const rehydrate = async () => {
    try {
      const data = await getUser()
      setUser(data)
    } catch (error) {
      await refreshToken()
      console.error('Session expired, trying to refresh:', error)
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      const data = await refreshUserToken()
      setUser(data)
    } catch (error) {
      await logout()
      console.error(`Refresh token expired, logging out: ${error}`)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    loading.value = true

    try {
      await registerUser(email, password)
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  const login = async (
    email: string | null,
    password: string | null,
    provider: Providers | null,
    remember: boolean = false,
  ) => {
    loading.value = true

    try {
      if (email && password) {
        const data = await loginUserWithCredentials(email, password)
        setUser(data)
        if (remember) {
          localStorage.setItem('costly-remember-me', 'true')
        }
      }

      if (provider) {
        await loginUserWithProvider(provider)
      }
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      await logoutUser()
      clearUser()
      if (localStorage.getItem('costly-remember-me')) {
        localStorage.removeItem('costly-remember-me')
      }
      await router.replace('/')
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  return { user, userId, isAuthenticated, accessToken, register, login, logout, rehydrate, setUser }
})
