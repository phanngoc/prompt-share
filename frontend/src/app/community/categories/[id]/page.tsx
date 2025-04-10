"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ForumTopic {
  id: string;
  title: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  lastActivity: string;
  repliesCount: number;
  viewsCount: number;
  tags: string[];
  isPinned: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  postsCount: number;
  topics: ForumTopic[];
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Mock data for demonstration
    // In production, you would fetch this from your API using the categoryId
    let mockCategory: Category;
    
    if (categoryId === '1') {
      mockCategory = {
        id: '1',
        name: 'General Discussion',
        description: 'Talk about anything related to AI prompts',
        topicsCount: 25,
        postsCount: 143,
        topics: [
          {
            id: '101',
            title: 'Welcome to the PromptShare Community!',
            author: {
              id: 'admin1',
              username: 'admin',
              avatar: '/avatars/admin.png',
            },
            createdAt: '2025-04-08T10:00:00Z',
            lastActivity: '2025-04-09T15:30:00Z',
            repliesCount: 24,
            viewsCount: 152,
            tags: ['announcement', 'welcome'],
            isPinned: true,
          },
          {
            id: '102',
            title: 'How to create effective prompts for ChatGPT?',
            author: {
              id: 'user123',
              username: 'promptmaster',
            },
            createdAt: '2025-04-07T14:25:00Z',
            lastActivity: '2025-04-09T11:15:00Z',
            repliesCount: 18,
            viewsCount: 97,
            tags: ['guide', 'chatgpt'],
            isPinned: false,
          },
          {
            id: '103',
            title: 'What features would you like to see in PromptShare?',
            author: {
              id: 'user456',
              username: 'innovator',
            },
            createdAt: '2025-04-05T16:45:00Z',
            lastActivity: '2025-04-09T14:20:00Z',
            repliesCount: 12,
            viewsCount: 68,
            tags: ['feedback', 'features'],
            isPinned: false,
          },
          {
            id: '104',
            title: 'Introducing myself - New to prompt engineering',
            author: {
              id: 'user789',
              username: 'newbie',
            },
            createdAt: '2025-04-06T11:30:00Z',
            lastActivity: '2025-04-08T09:15:00Z',
            repliesCount: 8,
            viewsCount: 45,
            tags: ['introduction', 'newbie'],
            isPinned: false,
          },
          {
            id: '105',
            title: 'Best practices for prompt version control',
            author: {
              id: 'user234',
              username: 'promptdev',
            },
            createdAt: '2025-04-04T13:20:00Z',
            lastActivity: '2025-04-07T18:40:00Z',
            repliesCount: 15,
            viewsCount: 82,
            tags: ['best-practices', 'version-control'],
            isPinned: false,
          },
        ],
      };
    } else if (categoryId === '2') {
      mockCategory = {
        id: '2',
        name: 'Prompt Showcase',
        description: 'Share and discuss your favorite prompts',
        topicsCount: 18,
        postsCount: 97,
        topics: [
          {
            id: '201',
            title: 'My DALL-E prompt collection for landscapes',
            author: {
              id: 'user456',
              username: 'artlover',
            },
            createdAt: '2025-04-06T09:12:00Z',
            lastActivity: '2025-04-09T08:45:00Z',
            repliesCount: 11,
            viewsCount: 78,
            tags: ['dalle', 'art', 'landscape'],
            isPinned: false,
          },
          {
            id: '202',
            title: 'Code generation prompts that actually work',
            author: {
              id: 'user345',
              username: 'codemaster',
            },
            createdAt: '2025-04-07T10:30:00Z',
            lastActivity: '2025-04-09T13:15:00Z',
            repliesCount: 9,
            viewsCount: 62,
            tags: ['code', 'programming', 'development'],
            isPinned: false,
          },
          {
            id: '203',
            title: 'Marketing copy prompts - A/B tested results',
            author: {
              id: 'user567',
              username: 'marketingpro',
            },
            createdAt: '2025-04-05T14:20:00Z',
            lastActivity: '2025-04-08T16:45:00Z',
            repliesCount: 14,
            viewsCount: 86,
            tags: ['marketing', 'copywriting', 'ab-testing'],
            isPinned: false,
          },
        ],
      };
    } else if (categoryId === '3') {
      mockCategory = {
        id: '3',
        name: 'Technical Support',
        description: 'Get help with the PromptShare platform',
        topicsCount: 12,
        postsCount: 67,
        topics: [
          {
            id: '301',
            title: 'Issue with Solana wallet connection',
            author: {
              id: 'user789',
              username: 'cryptofan',
            },
            createdAt: '2025-04-08T16:40:00Z',
            lastActivity: '2025-04-09T14:20:00Z',
            repliesCount: 7,
            viewsCount: 42,
            tags: ['wallet', 'issue', 'solana'],
            isPinned: false,
          },
          {
            id: '302',
            title: 'How to reset password?',
            author: {
              id: 'user678',
              username: 'newuser',
            },
            createdAt: '2025-04-07T09:15:00Z',
            lastActivity: '2025-04-07T11:30:00Z',
            repliesCount: 2,
            viewsCount: 24,
            tags: ['account', 'password'],
            isPinned: false,
          },
          {
            id: '303',
            title: 'Error when purchasing prompt: Payment failed',
            author: {
              id: 'user901',
              username: 'promptbuyer',
            },
            createdAt: '2025-04-06T15:20:00Z',
            lastActivity: '2025-04-08T13:10:00Z',
            repliesCount: 8,
            viewsCount: 51,
            tags: ['payment', 'error', 'purchase'],
            isPinned: false,
          },
        ],
      };
    } else {
      // Default fallback for other category IDs
      mockCategory = {
        id: categoryId,
        name: `Category ${categoryId}`,
        description: 'Category description',
        topicsCount: 0,
        postsCount: 0,
        topics: [],
      };
    }

    setCategory(mockCategory);
    setLoading(false);
  }, [categoryId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The category you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link href="/community" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              Back to Community
            </Link>
          </div>
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
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                {category.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Category Info */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {category.description}
          </p>
          <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{category.topicsCount} {category.topicsCount === 1 ? 'Topic' : 'Topics'}</span>
            <span>{category.postsCount} {category.postsCount === 1 ? 'Post' : 'Posts'}</span>
          </div>
        </div>
      </div>

      {/* Create Topic Button */}
      <div className="flex justify-end mb-6">
        {isLoggedIn ? (
          <button
            onClick={() => router.push('/community/new-topic')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Topic
          </button>
        ) : (
          <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Log in to Create Topic
          </Link>
        )}
      </div>

      {/* Topics List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Topics</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <select
              className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue="latest-activity"
            >
              <option value="latest-activity">Latest Activity</option>
              <option value="newest">Newest</option>
              <option value="most-replies">Most Replies</option>
              <option value="most-views">Most Views</option>
            </select>
          </div>
        </div>

        {category.topics.length === 0 ? (
          <div className="px-4 py-12 sm:px-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No topics in this category yet.</p>
            {isLoggedIn && (
              <div className="mt-4">
                <button
                  onClick={() => router.push('/community/new-topic')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create the First Topic
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {category.topics.map((topic) => (
              <div
                key={topic.id}
                className={`px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ${
                  topic.isPinned ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <Link href={`/community/topics/${topic.id}`} className="block">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {topic.isPinned && (
                          <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                            Pinned
                          </span>
                        )}
                        {topic.title}
                      </p>
                      <div className="mt-1 flex text-xs text-gray-500 dark:text-gray-400">
                        <span>By {topic.author.username}</span>
                        <span className="mx-1">•</span>
                        <span>Created {formatDate(topic.createdAt)}</span>
                      </div>
                    </Link>
                    <div className="mt-2">
                      {topic.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-0 ml-5 flex-shrink-0 flex flex-col items-end text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-gray-200">{topic.repliesCount}</span> replies
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-medium text-gray-900 dark:text-gray-200">{topic.viewsCount}</span> views
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last activity {formatDate(topic.lastActivity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {category.topics.length > 0 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{category.topics.length}</span> of{' '}
                  <span className="font-medium">{category.topicsCount}</span> topics
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-indigo-50 dark:bg-indigo-900/20 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
