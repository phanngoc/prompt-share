import { create } from 'zustand';
import { fetchFromApi } from '@/utils/api';

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_amount: number;
  prompt_id: number;
  prompt_title?: string;
  payment_status?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<Order[]>;
  fetchOrderById: (id: number | string) => Promise<Order | null>;
  createOrder: (promptId: number, paymentMethod: string) => Promise<Order | null>;
  clearError: () => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchFromApi<{ items: Order[] }>('/orders');
      
      const orders = response.items || [];
      set({ orders, isLoading: false });
      return orders;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return [];
    }
  },

  fetchOrderById: async (id: number | string) => {
    try {
      set({ isLoading: true, error: null });
      const order = await fetchFromApi<Order>(`/orders/${id}`);
      
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  createOrder: async (promptId: number, paymentMethod: string) => {
    try {
      set({ isLoading: true, error: null });
      const order = await fetchFromApi<Order>('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId, payment_method: paymentMethod }),
      });
      
      set(state => ({ 
        orders: [order, ...state.orders],
        currentOrder: order,
        isLoading: false
      }));
      return order;
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

export default useOrderStore;
