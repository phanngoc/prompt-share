import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// Types
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
  seller: {
    id: number;
    username: string;
    full_name: string;
  };
  category?: {  // Make category optional to prevent errors
    id: number;
    name: string;
    slug: string;
  };
}

// Fetch prompt data by ID
async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/prompts/${id}`, {
      cache: 'no-store' // Don't cache this data
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch prompt');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching prompt #${id}:`, error);
    return null;
  }
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default async function PromptDetailsPage({ params }: { params: { id: string } }) {
  const promptId = params?.id;
  
  if (!promptId) {
    notFound();
  }
  
  const prompt = await getPromptById(promptId);
  
  if (!prompt) {
    notFound();
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/explore" className="hover:text-indigo-600">Explore</Link>
          {prompt.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${prompt.category.id}`} className="hover:text-indigo-600">
                {prompt.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-700">{prompt.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column: Prompt details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Title and category */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  {prompt.category && (
                    <Link 
                      href={`/category/${prompt.category.id}`}
                      className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium rounded-full mb-3"
                    >
                      {prompt.category.name}
                    </Link>
                  )}
                  {prompt.is_featured && (
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{prompt.title}</h1>
                <div className="flex items-center mt-2 space-x-1 text-yellow-400">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${i < Math.floor(prompt.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{prompt.rating.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">{prompt.description}</p>
              </div>
              
              {/* Prompt content preview */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Prompt Preview</h2>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md relative">
                  <div className="max-h-60 overflow-hidden relative">
                    <p className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap">
                      {/* Show only a portion of the prompt content for preview */}
                      {prompt.content.length > 300 
                        ? prompt.content.substring(0, 300) + '...' 
                        : prompt.content}
                    </p>
                    {prompt.content.length > 300 && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Purchase card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${prompt.price.toFixed(2)}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="flex items-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {prompt.views_count}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {prompt.sales_count}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors">
                  Purchase Prompt
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Seller Information</h3>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg">
                    {prompt.seller.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">{prompt.seller.full_name}</p>
                    <p className="text-sm text-gray-500">@{prompt.seller.username}</p>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">Published: {formatDate(prompt.created_at)}</p>
                </div>
                
                <Link 
                  href={`/seller/${prompt.seller.id}`} 
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View seller profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}