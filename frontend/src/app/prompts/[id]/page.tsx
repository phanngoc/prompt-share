import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ClientPurchaseSection from "../../components/ClientPurchaseSection";
import { fetchFromApi } from "@/utils/api";

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
  payment_type?: string;
  sol_price?: number;
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
    return await fetchFromApi<Prompt>(`/prompts/${id}`);
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
  const id = params.id;
  
  if (!id) {
    notFound();
  }
  
  const prompt = await getPromptById(id);
  
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
            {/* Replace with our client component wrapper */}
            <ClientPurchaseSection prompt={prompt} />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mt-6">
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