"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    } else {
      // Redirect to login if not logged in
      router.push('/login?redirect=/community/new-topic');
      return;
    }

    // Mock data for categories
    // In production, you would fetch this from your API
    const mockCategories: Category[] = [
      { id: '1', name: 'General Discussion' },
      { id: '2', name: 'Prompt Showcase' },
      { id: '3', name: 'Technical Support' },
      { id: '4', name: 'Announcements' },
      { id: '5', name: 'Prompt Techniques' },
    ];

    setCategories(mockCategories);
    setCategory(mockCategories[0].id); // Default to first category
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill out all required fields');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // Process tags
    const processedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    // In production, you would submit this to your API
    // For now, we'll just simulate a successful submission
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the community page on success
      router.push('/community');
    } catch (err) {
      setError('An error occurred while creating the topic. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/community" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              Community
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Create New Topic</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Topic</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start a new discussion in the community forum
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topic Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter a descriptive title for your topic"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Write the content of your topic here. You can use Markdown formatting."
                ></textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Markdown formatting is supported. Use # for headings, **bold**, *italic*, lists, etc.
              </p>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. chatgpt, guide, tutorial"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Add up to 5 tags to help others find your topic
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end space-x-3">
            <Link
              href="/community"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Topic'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
