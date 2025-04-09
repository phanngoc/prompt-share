/**
 * Utility functions for API interaction
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Check if the API is available
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('API connection error:', error);
    return false;
  }
}

/**
 * Helper to log API requests in development 
 */
export function logAPICall(endpoint: string, method: string = 'GET'): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[API] ${method} ${API_URL}${endpoint}`);
  }
}

/**
 * Generic function to fetch data from API
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Make sure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Log the API call
    logAPICall(normalizedEndpoint, options.method || 'GET');
    
    const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}) for ${normalizedEndpoint}:`, errorText);
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Helper for posting data to API
 */
export async function postToApi<T, R>(
  endpoint: string,
  data: T,
  options: RequestInit = {}
): Promise<R> {
  return fetchFromApi<R>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Helper for updating data via API
 */
export async function putToApi<T, R>(
  endpoint: string,
  data: T,
  options: RequestInit = {}
): Promise<R> {
  return fetchFromApi<R>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Helper for deleting data via API
 */
export async function deleteFromApi<R>(
  endpoint: string,
  options: RequestInit = {}
): Promise<R> {
  return fetchFromApi<R>(endpoint, {
    ...options,
    method: 'DELETE',
  });
} 