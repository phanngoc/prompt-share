import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { UserInfo } from '@/types'

// Token expiration times in seconds
const ACCESS_TOKEN_EXPIRE = parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRE_MINUTES || '30') * 60
const REFRESH_TOKEN_EXPIRE = parseInt(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_DAYS || '7') * 24 * 60 * 60

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: UserInfo, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  refreshAccessToken: () => Promise<void>
  restoreAuth: () => void
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) => {
        // Set tokens in cookies
        document.cookie = `access_token=${accessToken}; path=/; max-age=${ACCESS_TOKEN_EXPIRE}` 
        document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${REFRESH_TOKEN_EXPIRE}`
        
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },
      
      clearAuth: () => {
        // Clear cookies
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
      
      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return
        
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, null, {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })
          
          const { access_token, refresh_token } = response.data
          document.cookie = `access_token=${access_token}; path=/; max-age=${ACCESS_TOKEN_EXPIRE}`
          document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${REFRESH_TOKEN_EXPIRE}`
          
          set({ accessToken: access_token, refreshToken: refresh_token })
        } catch (error) {
          get().clearAuth()
        }
      },

      restoreAuth: () => {
        // Get tokens from cookies
        const accessToken = getCookie('access_token')
        const refreshToken = getCookie('refresh_token')
        
        // Get user from localStorage
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage)
            if (state.user && accessToken && refreshToken) {
              set({
                user: state.user,
                accessToken,
                refreshToken,
                isAuthenticated: true
              })
            }
          } catch (error) {
            console.error('Error restoring auth state:', error)
            get().clearAuth()
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 