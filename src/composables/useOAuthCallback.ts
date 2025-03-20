import { useAuthStore } from '@/stores/authStore'
import { setUserSession } from '@/services/authService'

export async function useOAuthCallback() {
  const { setUser } = useAuthStore()

  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)

  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')

  if (accessToken) {
    try {
      const { user } = await setUserSession(accessToken, refreshToken)

      setUser({ user, accessToken })
      localStorage.setItem('costly-remember-me', 'true')
    } catch (e) {
      throw e
    }
  }
}
