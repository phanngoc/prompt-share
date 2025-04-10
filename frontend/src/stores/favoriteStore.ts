import { create } from 'zustand';
import { fetchFromApi } from '@/utils/api';

interface Prompt {
  id: number;
  title: string;
  description: string;
  price: number;
  is_favorited: boolean;
  // Other prompt properties as needed
}

interface FavoriteState {
  favorites: Prompt[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (promptId: number) => Promise<boolean>;
  isFavorited: (promptId: number) => boolean;
  clearError: () => void;
}

const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchFromApi<{ items: Prompt[] }>('/favorites');
      
      if (response.items) {
        set({ favorites: response.items, isLoading: false });
      } else {
        set({ isLoading: false, error: 'Invalid response format' });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },

  toggleFavorite: async (promptId: number) => {
    try {
      const isFavorited = get().isFavorited(promptId);
      
      if (isFavorited) {
        // Remove from favorites
        await fetchFromApi(`/favorites/${promptId}`, {
          method: 'DELETE',
        });
        
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== promptId)
        }));
        
        return false; // Now unfavorited
      } else {
        // Add to favorites
        await fetchFromApi(`/favorites/${promptId}`, {
          method: 'POST',
        });
        
        // Fetch updated favorites to get the proper prompt object
        await get().fetchFavorites();
        
        return true; // Now favorited
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return get().isFavorited(promptId); // Return current state if error
    }
  },

  isFavorited: (promptId: number) => {
    return get().favorites.some(fav => fav.id === promptId);
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useFavoriteStore;
