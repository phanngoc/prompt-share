"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topics: ForumTopic[];
}

export default function CommunityPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Mock data for demonstration
    // In production, you would fetch this from your API
    const mockCategories: ForumCategory[] = [
      {
        id: '1',
        name: 'General Discussion',
        description: 'Talk about anything related to AI prompts',
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
        ],
      },
      {
        id: '2',
        name: 'Prompt Showcase',
        description: 'Share and discuss your favorite prompts',
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
        ],
      },
      {
        id: '3',
        name: 'Technical Support',
        description: 'Get help with the PromptShare platform',
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
        ],
      },
    ];

    setCategories(mockCategories);
    setLoading(false);
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Forum</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join the conversation with fellow prompt enthusiasts
          </p>
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={() => router.push('/community/new-topic')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Topic
            </button>
          ) : (
            <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log in to Participate
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {category.description}
              </p>
            </div>
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
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-right sm:px-6">
              <Link href={`/community/categories/${category.id}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                View all topics in this category →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
