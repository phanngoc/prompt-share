import { create } from 'zustand';
import { fetchFromApi } from '@/utils/api';

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  views_count: number;
  sales_count: number;
  created_at: string;
  is_favorited?: boolean;
  payment_type?: string;
  sol_price?: number;
  preview_result?: string;
  seller: {
    id: number;
    username: string;
    full_name: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface PromptFilterParams {
  search?: string;
  category_id?: number;
  sort?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
  featured?: boolean;
}

interface PromptsResponse {
  items: Prompt[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface PromptState {
  prompts: Prompt[];
  featuredPrompts: Prompt[];
  currentPrompt: Prompt | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: PromptFilterParams;
  
  // Actions
  fetchPrompts: (categoryId?: number) => Promise<Prompt[]>;
  fetchFeaturedPrompts: () => Promise<Prompt[]>;
  fetchPromptById: (id: number | string) => Promise<Prompt | null>;
  searchPrompts: (query: string) => Promise<Prompt[]>;
  getFilteredPrompts: (params: PromptFilterParams) => Promise<PromptsResponse>;
  setFilters: (filters: Partial<PromptFilterParams>) => void;
  createPrompt: (promptData: Partial<Prompt>) => Promise<Prompt | null>;
  updatePrompt: (id: number, promptData: Partial<Prompt>) => Promise<Prompt | null>;
  clearError: () => void;
}

const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  featuredPrompts: [],
  currentPrompt: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0
  },
  filters: {
    page: 1,
    page_size: 12
  },

  fetchPrompts: async (categoryId?: number) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use the getFilteredPrompts method with just the category filter
      const params: PromptFilterParams = { page: 1, page_size: 12 };
      if (categoryId) params.category_id = categoryId;
      
      const response = await get().getFilteredPrompts(params);
      
      set({ prompts: response.items, isLoading: false });
      return response.items;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return [];
    }
  },

  fetchFeaturedPrompts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchFromApi<{ items: Prompt[] }>('/prompts?featured=true');
      
      const featuredPrompts = response.items || [];
      set({ featuredPrompts, isLoading: false });
      return featuredPrompts;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return [];
    }
  },

  fetchPromptById: async (id: number | string) => {
    try {
      set({ isLoading: true, error: null });
      const prompt = await fetchFromApi<Prompt>(`/prompts/${id}`);
      
      set({ currentPrompt: prompt, isLoading: false });
      return prompt;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  searchPrompts: async (query: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use getFilteredPrompts with search parameter
      const response = await get().getFilteredPrompts({ search: query, page: 1, page_size: 12 });
      
      set({ prompts: response.items, isLoading: false });
      return response.items;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return [];
    }
  },
  
  getFilteredPrompts: async (params: PromptFilterParams) => {
    try {
      set({ isLoading: true, error: null });
      
      // Build query params
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category_id) queryParams.append('category_id', params.category_id.toString());
      if (params.sort) {
        const [sortBy, sortOrder] = params.sort.split(':');
        queryParams.append('sort_by', sortBy);
        queryParams.append('sort_order', sortOrder);
      }
      if (params.min_price) queryParams.append('min_price', params.min_price.toString());
      if (params.max_price) queryParams.append('max_price', params.max_price.toString());
      if (params.featured) queryParams.append('featured', params.featured.toString());
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('page_size', (params.page_size || 12).toString());
      
      // Fetch data from API
      const response = await fetchFromApi<PromptsResponse>(`/prompts?${queryParams.toString()}`);
      
      // Update store state with the response data
      set({
        prompts: response.items,
        pagination: {
          total: response.total,
          page: response.page,
          pageSize: response.page_size,
          totalPages: response.total_pages
        },
        filters: { ...get().filters, ...params },
        isLoading: false
      });
      
      return response;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return {
        items: [],
        total: 0,
        page: 1,
        page_size: 12,
        total_pages: 0
      };
    }
  },
  
  setFilters: (filters: Partial<PromptFilterParams>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  createPrompt: async (promptData: Partial<Prompt>) => {
    try {
      set({ isLoading: true, error: null });
      const prompt = await fetchFromApi<Prompt>('/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData),
      });
      
      set(state => ({ 
        prompts: [prompt, ...state.prompts],
        isLoading: false
      }));
      return prompt;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  updatePrompt: async (id: number, promptData: Partial<Prompt>) => {
    try {
      set({ isLoading: true, error: null });
      const prompt = await fetchFromApi<Prompt>(`/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData),
      });
      
      set(state => ({
        prompts: state.prompts.map(p => p.id === id ? prompt : p),
        currentPrompt: state.currentPrompt?.id === id ? prompt : state.currentPrompt,
        isLoading: false
      }));
      return prompt;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default usePromptStore;
