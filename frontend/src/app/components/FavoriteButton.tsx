'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromApi, postToApi, deleteFromApi, getAuthToken } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  promptId: number;
  initialFavorited?: boolean;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  promptId, 
  initialFavorited = false,
  className = ''
}) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(initialFavorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Assume not logged in by default
  const router = useRouter();

  // Check auth status and initial favorite status
  useEffect(() => {
    // Use a separate function to handle async operations
    const checkAuthAndFavoriteStatus = async () => {
      // Check if token exists in localStorage
      const token = getAuthToken();
      
      if (token) {
        try {
          // Try to fetch current user info
          await fetchFromApi('/auth/me');
          setIsAuthenticated(true);
          
          // If authenticated, check if this prompt is favorited
          try {
            const data = await fetchFromApi<{ is_favorited: boolean }>(`/favorites/check/${promptId}`);
            setIsFavorited(data.is_favorited);
          } catch (favError) {
            console.error('Error checking favorite status:', favError);
            // Don't set error on UI for better user experience
          }
        } catch (authError: any) {
          console.log('Authentication error, token might be expired:', authError);
          setIsAuthenticated(false);
          
          // If 401 Unauthorized, redirect to login page
          if (authError?.message?.includes('401')) {
            // Remove invalid token
            localStorage.removeItem('token');
            // Redirect to login with return URL
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          }
        }
      } else {
        // No token available
        setIsAuthenticated(false);
      }
    };
    
    checkAuthAndFavoriteStatus();
  }, [promptId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isFavorited) {
        // Remove from favorites
        await deleteFromApi(`/favorites/${promptId}`);
        setIsFavorited(false);
      } else {
        // Add to favorites
        await postToApi(`/favorites/${promptId}`, {});
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-full p-2 transition-colors ${
        isFavorited 
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isFavorited ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth={isFavorited ? '0' : '2'} 
        className="w-6 h-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
        />
      </svg>
      {error && <span className="sr-only">{error}</span>}
    </button>
  );
};

export default FavoriteButton;
