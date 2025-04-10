'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/stores';

// Define TypeScript interfaces for our data
interface Order {
  id: number;
  created_at: string;
  status: string;
  total_amount: number;
  prompt_id: number;
  prompt_title?: string;
  payment_status?: string;
}

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    // Function to handle orders fetching
    async function loadOrders() {
      try {
        const result = await fetchOrders();
        
        // If no orders returned and there was an auth error, redirect to login
        if (result.length === 0 && error?.includes('401')) {
          router.push('/login?redirect=/orders');
        }
      } catch (err) {
        console.error('Error in orders page:', err);
      }
    }

    loadOrders();
  }, [fetchOrders, router, error]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format status with appropriate color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, text: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'Processing' },
    };

    const statusLower = status.toLowerCase();
    const statusInfo = statusMap[statusLower] || { color: 'bg-gray-100 text-gray-800', text: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Order History</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <p>{error}</p>
            <button 
              onClick={() => fetchOrders()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't purchased any prompts yet.</p>
            <Link 
              href="/explore" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Explore Prompts
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-700 shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Prompt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {order.prompt_title ? (
                          <Link href={`/prompts/${order.prompt_id}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {order.prompt_title}
                          </Link>
                        ) : (
                          <span>Prompt #{order.prompt_id}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
