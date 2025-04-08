import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

// Type definitions
interface Prompt {
  id: number;
  title: string;
  description: string;
  price: number;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  sales_count: number;
  rating: number;
  seller: {
    username: string;
    full_name: string;
  };
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  prompts_count: number | null;
}

interface PromptsResponse {
  items: Prompt[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Helper function to fetch categories
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/categories`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Helper function to fetch prompts with filters
async function getPrompts(
  page = 1,
  category_id?: string,
  search?: string,
  sort_by = 'created_at',
  sort_order = 'desc',
  min_price?: string,
  max_price?: string
): Promise<PromptsResponse> {
  try {
    // Construct URL with query parameters
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/prompts/`);
    
    // Add query parameters
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', '12'); // Show 12 prompts per page
    
    if (category_id) url.searchParams.append('category_id', category_id);
    if (search) url.searchParams.append('search', search);
    if (sort_by) url.searchParams.append('sort_by', sort_by);
    if (sort_order) url.searchParams.append('sort_order', sort_order);
    if (min_price) url.searchParams.append('min_price', min_price);
    if (max_price) url.searchParams.append('max_price', max_price);
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch prompts');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 12,
      total_pages: 0
    };
  }
}

// Loading component
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// PromptCard component for displaying a single prompt
function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/prompts/${prompt.id}`}>
        <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative flex items-center justify-center text-white">
          <div className="text-center p-4">
            <h3 className="text-xl font-medium truncate">{prompt.title}</h3>
            <p className="text-sm opacity-80">By {prompt.seller.full_name}</p>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-gray-500 dark:text-gray-300 line-clamp-2 h-12 mb-3">{prompt.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">{prompt.rating.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{prompt.views_count}</span>
              </div>
            </div>
            
            <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
              ${prompt.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Filter component
function FilterBar({ 
  categories,
  selectedCategory,
  searchQuery,
  sortOption,
  minPrice,
  maxPrice
}: { 
  categories: Category[],
  selectedCategory: string,
  searchQuery: string,
  sortOption: string,
  minPrice: string,
  maxPrice: string
}) {
  // Get the current URL to maintain query params
  const baseUrl = '/explore';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
      <form className="space-y-4">
        {/* Search input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Prompts
          </label>
          <div className="relative">
            <input
              type="text"
              name="search"
              id="search"
              defaultValue={searchQuery}
              placeholder="Search by title or description..."
              className="block w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category_id"
              defaultValue={selectedCategory}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort by filter */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sortOption}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="rating:desc">Highest Rated</option>
              <option value="views_count:desc">Most Viewed</option>
              <option value="sales_count:desc">Best Selling</option>
            </select>
          </div>
          
          {/* Price range */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="min_price"
                  id="min_price"
                  defaultValue={minPrice}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="block w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="max_price"
                  id="max_price"
                  defaultValue={maxPrice}
                  min="0"
                  step="0.01"
                  placeholder="∞"
                  className="block w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}

// Pagination component
function Pagination({ 
  currentPage,
  totalPages,
  baseUrl
}: { 
  currentPage: number,
  totalPages: number,
  baseUrl: string
}) {
  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always include first page
    pageNumbers.push(1);
    
    // Add middle pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Add ellipses
    return pageNumbers.reduce((result: (number | string)[], page, index, array) => {
      result.push(page);
      
      if (index < array.length - 1 && array[index + 1] - page > 1) {
        result.push('...');
      }
      
      return result;
    }, []);
  };
  
  const pageNumbers = getPageNumbers();
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center py-8">
      <nav className="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
        {/* Previous page button */}
        <Link
          href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => 
          typeof page === 'number' ? (
            <Link
              key={index}
              href={`${baseUrl}?page=${page}`}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium ${
                page === currentPage
                  ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-200'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          ) : (
            <span
              key={index}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400"
            >
              {page}
            </span>
          )
        )}
        
        {/* Next page button */}
        <Link
          href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}
          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}

// NoResults component
function NoResults() {
  return (
    <div className="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No prompts found</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
    </div>
  );
}

// Main Explore page component
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    category_id?: string; 
    search?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
  };
}) {
  // Extract query parameters
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const categoryId = searchParams.category_id || '';
  const searchQuery = searchParams.search || '';
  const sortOption = searchParams.sort || 'created_at:desc';
  const minPrice = searchParams.min_price || '';
  const maxPrice = searchParams.max_price || '';
  
  // Parse sort option
  const [sortBy, sortOrder] = sortOption.split(':');
  
  // Fetch data
  const categoriesPromise = getCategories();
  const promptsPromise = getPrompts(
    page, 
    categoryId, 
    searchQuery, 
    sortBy, 
    sortOrder, 
    minPrice, 
    maxPrice
  );
  
  // Wait for both promises to resolve
  const [categories, prompts] = await Promise.all([categoriesPromise, promptsPromise]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore AI Prompts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover prompts from our creators to enhance your AI interactions. 
            Find the perfect prompt for your needs or get inspired to create your own.
          </p>
        </div>
        
        {/* Filter and search options */}
        <FilterBar 
          categories={categories}
          selectedCategory={categoryId}
          searchQuery={searchQuery}
          sortOption={sortOption}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        
        {/* Results */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 dark:text-gray-400">
              {prompts.total} {prompts.total === 1 ? 'prompt' : 'prompts'} found
            </p>
          </div>
          
          <Suspense fallback={<LoadingGrid />}>
            {/* Display prompts or no results */}
            {prompts.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts.items.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <NoResults />
            )}
          </Suspense>
        </div>
        
        {/* Pagination */}
        <Pagination 
          currentPage={prompts.page} 
          totalPages={prompts.total_pages} 
          baseUrl="/explore" 
        />
      </div>
    </div>
  );
}