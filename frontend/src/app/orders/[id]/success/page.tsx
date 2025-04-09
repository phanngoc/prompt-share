import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Types
interface Order {
  id: number;
  order_number: string;
  amount: number;
  status: string;
  created_at: string;
  payment_type: string;
  sol_amount?: number;
  prompt: {
    id: number;
    title: string;
    content: string;
  };
}

// Fetch order data by ID
async function getOrderById(id: string): Promise<Order | null> {
  try {
    // In server components, we can use the server-side API directly
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/orders/${id}`, {
      headers: {
        // We would need a server-side auth approach here in a real app
        // This is a simplified version
        Cookie: 'session_token=...'
      },
      cache: 'no-store' // Don't cache this data
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch order');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching order #${id}:`, error);
    return null;
  }
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const orderId = params?.id;
  
  if (!orderId) {
    notFound();
  }
  
  // In a real app, we would fetch the order details here
  // For this demo, we'll simulate a successful order
  
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              You can now access the full prompt content. It's also been added to your library.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/orders"
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              View Orders
            </Link>
            <Link 
              href="/prompts" 
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              My Prompts Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}