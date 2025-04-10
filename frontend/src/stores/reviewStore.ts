import { create } from 'zustand';
import { fetchFromApi } from '@/utils/api';

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user_id: number;
  prompt_id: number;
  created_at: string;
  user_username?: string;
  user_full_name?: string;
}

interface ReviewState {
  promptReviews: Record<number, Review[]>;
  userReview: Review | null;
  isLoading: boolean;
  hasReviewPermission: boolean;
  error: string | null;
  
  // Actions
  fetchPromptReviews: (promptId: number) => Promise<Review[]>;
  fetchUserReview: (promptId: number) => Promise<Review | null>;
  createReview: (promptId: number, rating: number, comment: string) => Promise<Review | null>;
  updateReview: (reviewId: number, rating: number, comment: string) => Promise<Review | null>;
  deleteReview: (reviewId: number) => Promise<boolean>;
  checkPurchaseStatus: (promptId: number) => Promise<boolean>;
  clearError: () => void;
}

const useReviewStore = create<ReviewState>((set, get) => ({
  promptReviews: {},
  userReview: null,
  isLoading: false,
  hasReviewPermission: false,
  error: null,

  fetchPromptReviews: async (promptId: number) => {
    try {
      set({ isLoading: true, error: null });
      const reviews = await fetchFromApi<Review[]>(`/reviews/prompt/${promptId}`);
      
      set(state => ({
        promptReviews: {
          ...state.promptReviews,
          [promptId]: reviews
        },
        isLoading: false
      }));
      
      return reviews;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return [];
    }
  },

  fetchUserReview: async (promptId: number) => {
    try {
      set({ isLoading: true, error: null });
      const review = await fetchFromApi<Review>(`/reviews/user/me/prompt/${promptId}`)
        .catch(() => null);
      
      set({ 
        userReview: review,
        isLoading: false 
      });
      
      return review;
    } catch (error) {
      set({ 
        isLoading: false,
        userReview: null
      });
      return null;
    }
  },

  createReview: async (promptId: number, rating: number, comment: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const reviewData = {
        prompt_id: promptId,
        rating,
        comment
      };
      
      const newReview = await fetchFromApi<Review>('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      // Update state
      set(state => {
        const currentPromptReviews = state.promptReviews[promptId] || [];
        return {
          promptReviews: {
            ...state.promptReviews,
            [promptId]: [...currentPromptReviews, newReview]
          },
          userReview: newReview,
          isLoading: false
        };
      });
      
      return newReview;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  updateReview: async (reviewId: number, rating: number, comment: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const reviewData = {
        rating,
        comment
      };
      
      const updatedReview = await fetchFromApi<Review>(`/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      // Update state
      set(state => {
        const promptId = updatedReview.prompt_id;
        const currentPromptReviews = state.promptReviews[promptId] || [];
        
        return {
          promptReviews: {
            ...state.promptReviews,
            [promptId]: currentPromptReviews.map(review => 
              review.id === reviewId ? updatedReview : review
            )
          },
          userReview: state.userReview?.id === reviewId ? updatedReview : state.userReview,
          isLoading: false
        };
      });
      
      return updatedReview;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  },

  deleteReview: async (reviewId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      await fetchFromApi(`/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      
      // Update state if the user review was deleted
      const userReview = get().userReview;
      if (userReview && userReview.id === reviewId) {
        set({ userReview: null });
      }
      
      // Remove review from promptReviews
      set(state => {
        const newPromptReviews = { ...state.promptReviews };
        
        // Find which prompt the review belongs to
        for (const [promptId, reviews] of Object.entries(newPromptReviews)) {
          const filteredReviews = reviews.filter(review => review.id !== reviewId);
          if (filteredReviews.length !== reviews.length) {
            newPromptReviews[Number(promptId)] = filteredReviews;
            break;
          }
        }
        
        return {
          promptReviews: newPromptReviews,
          isLoading: false
        };
      });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return false;
    }
  },

  checkPurchaseStatus: async (promptId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const hasPurchased = await fetchFromApi<boolean>(`/reviews/check-purchase/${promptId}`)
        .catch(() => false);
      
      set({ 
        hasReviewPermission: hasPurchased,
        isLoading: false 
      });
      
      return hasPurchased;
    } catch (error) {
      set({ 
        isLoading: false,
        hasReviewPermission: false
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));

export default useReviewStore;
