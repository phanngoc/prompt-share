import { create } from 'zustand';
import { fetchFromApi } from '@/utils/api';
import useAuthStore from './authStore';

interface WalletState {
  walletAddress: string | null;
  balance: number | null;
  isConnecting: boolean;
  error: string | null;
  
  // Actions
  connectWallet: (address: string) => Promise<boolean>;
  disconnectWallet: () => void;
  updateWalletAddress: (address: string) => Promise<boolean>;
  fetchBalance: () => Promise<number | null>;
  clearError: () => void;
}

const useWalletStore = create<WalletState>((set, get) => ({
  walletAddress: null,
  balance: null,
  isConnecting: false,
  error: null,

  connectWallet: async (address: string) => {
    try {
      set({ isConnecting: true, error: null });
      
      // Update the user's wallet address in the backend
      const success = await useAuthStore.getState().updateWalletAddress(address);
      
      if (success) {
        set({ 
          walletAddress: address,
          isConnecting: false,
        });
        
        // Fetch the wallet balance after connecting
        get().fetchBalance();
        return true;
      }
      
      set({ 
        isConnecting: false,
        error: 'Failed to connect wallet' 
      });
      return false;
    } catch (error) {
      set({ 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return false;
    }
  },

  disconnectWallet: () => {
    set({
      walletAddress: null,
      balance: null,
    });
  },

  updateWalletAddress: async (address: string) => {
    try {
      set({ isConnecting: true, error: null });
      
      // Update wallet address in backend
      const success = await useAuthStore.getState().updateWalletAddress(address);
      
      if (success) {
        set({ 
          walletAddress: address,
          isConnecting: false,
        });
        return true;
      }
      
      set({ 
        isConnecting: false,
        error: 'Failed to update wallet address' 
      });
      return false;
    } catch (error) {
      set({ 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return false;
    }
  },

  fetchBalance: async () => {
    try {
      const address = get().walletAddress;
      
      if (!address) {
        set({ error: 'No wallet connected' });
        return null;
      }
      
      // Fetch balance from backend
      const response = await fetchFromApi<{ balance: number }>(`/wallet/balance?address=${address}`);
      
      if (response && 'balance' in response) {
        set({ balance: response.balance });
        return response.balance;
      }
      
      return null;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useWalletStore;
