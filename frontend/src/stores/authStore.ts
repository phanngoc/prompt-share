import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchFromApi } from '@/utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  wallet_address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, fullName: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  updateWalletAddress: (walletAddress: string) => Promise<boolean>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetchFromApi<{ access_token: string; user: User }>('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (response.access_token && response.user) {
            set({
              token: response.access_token,
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem('token', response.access_token);
            return true;
          }
          
          set({ isLoading: false, error: 'Invalid response from server' });
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (username: string, email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetchFromApi<{ access_token: string; user: User }>('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, full_name: fullName }),
          });

          if (response.access_token && response.user) {
            set({
              token: response.access_token,
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem('token', response.access_token);
            return true;
          }
          
          set({ isLoading: false, error: 'Invalid response from server' });
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          return false;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const user = get().user;
          
          if (!user) {
            set({ isLoading: false, error: 'Not authenticated' });
            return false;
          }
          
          const response = await fetchFromApi<User>('/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (response) {
            set({
              user: { ...response },
              isLoading: false,
            });
            return true;
          }
          
          set({ isLoading: false, error: 'Failed to update user' });
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          return false;
        }
      },
      
      updateWalletAddress: async (walletAddress: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetchFromApi<{ wallet_address: string }>('/users/wallet', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address: walletAddress }),
          });

          if (response) {
            set(state => ({
              user: state.user ? { ...state.user, wallet_address: walletAddress } : null,
              isLoading: false,
            }));
            return true;
          }
          
          set({ isLoading: false, error: 'Failed to update wallet address' });
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
