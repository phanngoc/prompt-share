'use client';

import { useState, useEffect } from 'react';
import { checkApiConnection, API_URL, fetchFromApi } from '@/utils/api';

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiUrl(API_URL);
    
    async function checkAPI() {
      try {
        setLoading(true);
        
        // Kiểm tra kết nối
        const isConnected = await checkApiConnection();
        setApiStatus(isConnected);
        
        // Nếu kết nối được, thử lấy categories
        if (isConnected) {
          try {
            const data = await fetchFromApi<any[]>('/categories');
            setCategories(data);
          } catch (err: any) {
            setError(`Lỗi khi lấy categories: ${err.message}`);
          }
        }
      } catch (err: any) {
        setError(`Lỗi kết nối API: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    checkAPI();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Kiểm tra kết nối API
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Thông tin kết nối</h2>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p className="mb-2">
              <span className="font-medium">API URL:</span> {apiUrl}
            </p>
            <p>
              <span className="font-medium">Trạng thái:</span>{' '}
              {loading ? (
                'Đang kiểm tra...'
              ) : apiStatus ? (
                <span className="text-green-600 dark:text-green-400">Kết nối thành công</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Kết nối thất bại</span>
              )}
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6">
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Categories</h2>
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Slug
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {category.slug}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Không tìm thấy categories
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
} 