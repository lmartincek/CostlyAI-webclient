import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Providers } from '@/types/auth'
import {
  getUser,
  loginUserWithCredentials,
  loginUserWithProvider,
  logoutUser,
  refreshUserToken,
  registerUser,
} from '../services/authService.ts'

//todo add auth types
interface User {
  email: string
  id: string
}

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)

  //@ts-expect-error - will add types later
  function setUser(data) {
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

  const register = async (email: string, password: string, remember: boolean = false) => {
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
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  return { user, isAuthenticated, accessToken, register, login, logout, rehydrate, setUser }
})
