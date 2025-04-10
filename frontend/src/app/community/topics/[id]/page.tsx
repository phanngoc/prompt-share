"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  avatar?: string;
  joinDate: string;
  postCount: number;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  isTopicStarter: boolean;
  likes: number;
  hasLiked: boolean;
}

interface Topic {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  tags: string[];
  viewsCount: number;
  posts: Post[];
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    }

    // Mock data for demonstration
    // In production, you would fetch this from your API using the topicId
    const mockTopic: Topic = {
      id: topicId,
      title: topicId === '101' 
        ? 'Welcome to the PromptShare Community!' 
        : 'How to create effective prompts for ChatGPT?',
      categoryId: '1',
      categoryName: 'General Discussion',
      createdAt: '2025-04-08T10:00:00Z',
      tags: topicId === '101' ? ['announcement', 'welcome'] : ['guide', 'chatgpt'],
      viewsCount: topicId === '101' ? 153 : 98,
      posts: [
        {
          id: 'p1',
          content: topicId === '101' 
            ? `# Welcome to our community forum!\n\nThis is a place to discuss anything related to AI prompts, ask questions, share your creations, and connect with fellow enthusiasts.\n\n## Forum Guidelines:\n\n1. Be respectful and constructive\n2. Don't spam or self-promote excessively\n3. Use appropriate categories for your posts\n4. Have fun and learn from each other!`
            : `# Tips for Creating Effective ChatGPT Prompts\n\nAfter experimenting with hundreds of prompts, I've found these patterns to be most effective:\n\n## 1. Be specific about the role\nExample: "As an experienced data scientist with expertise in anomaly detection..."\n\n## 2. Provide context and constraints\nExample: "I'm working with a dataset of 10,000 customer transactions and need to identify unusual patterns..."\n\n## 3. Format your desired output\nExample: "Present your analysis in bullet points, followed by actionable recommendations."\n\nWhat techniques have worked well for you?`,
          createdAt: topicId === '101' ? '2025-04-08T10:00:00Z' : '2025-04-07T14:25:00Z',
          author: {
            id: topicId === '101' ? 'admin1' : 'user123',
            username: topicId === '101' ? 'admin' : 'promptmaster',
            avatar: topicId === '101' ? '/avatars/admin.png' : undefined,
            joinDate: '2024-01-15',
            postCount: topicId === '101' ? 342 : 87,
          },
          isTopicStarter: true,
          likes: 15,
          hasLiked: false,
        },
        {
          id: 'p2',
          content: topicId === '101'
            ? "Thanks for creating this community! I'm new to prompt engineering and looking forward to learning from everyone here."
            : "Great tips! I'd add that iterative refinement is key - my first prompts are rarely perfect, but they get better with each revision. Also, studying the model's responses helps me understand how to better phrase future prompts.",
          createdAt: topicId === '101' ? '2025-04-08T14:32:00Z' : '2025-04-07T16:45:00Z',
          author: {
            id: 'user456',
            username: 'newbie_prompter',
            joinDate: '2025-03-20',
            postCount: 12,
          },
          isTopicStarter: false,
          likes: 8,
          hasLiked: false,
        },
        {
          id: 'p3',
          content: topicId === '101'
            ? "Hello everyone! I've been using AI prompts for my design work and excited to share some techniques."
            : "I find that using examples in my prompts dramatically improves results. For instance, instead of asking for 'a marketing email', I'd say 'Write a marketing email similar to this example: [example]'. This gives the model a clear reference point.",
          createdAt: topicId === '101' ? '2025-04-09T09:17:00Z' : '2025-04-08T10:30:00Z',
          author: {
            id: 'user789',
            username: 'designAI',
            joinDate: '2024-11-05',
            postCount: 64,
          },
          isTopicStarter: false,
          likes: 5,
          hasLiked: false,
        },
      ],
    };

    setTopic(mockTopic);
    setLoading(false);
  }, [topicId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!replyContent.trim()) {
      return;
    }
    
    setSubmitting(true);
    
    // In production, you would submit this to your API
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      if (topic) {
        const newPost: Post = {
          id: `p${topic.posts.length + 1}`,
          content: replyContent,
          createdAt: new Date().toISOString(),
          author: {
            id: user?.id || 'current-user',
            username: user?.username || 'current-user',
            joinDate: '2025-01-01', // This would be the actual user's join date
            postCount: 1, // This would be the actual user's post count
          },
          isTopicStarter: false,
          likes: 0,
          hasLiked: false,
        };
        
        setTopic({
          ...topic,
          posts: [...topic.posts, newPost],
        });
        
        setReplyContent('');
        setSubmitting(false);
      }
    }, 1000);
  };

  const handleLikePost = (postId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (topic) {
      const updatedPosts = topic.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      });
      
      setTopic({
        ...topic,
        posts: updatedPosts,
      });
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

  if (!topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Topic not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The topic you're looking for doesn't exist or has been removed.
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
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <Link href={`/community/categories/${topic.categoryId}`} className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 md:ml-2">
                {topic.categoryName}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2 truncate max-w-xs">
                {topic.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Topic Header */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{topic.title}</h1>
          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-4">Category: {topic.categoryName}</span>
            <span className="mr-4">Created: {formatDate(topic.createdAt)}</span>
            <span className="mr-4">Views: {topic.viewsCount}</span>
            <span className="mr-4">Replies: {topic.posts.length - 1}</span>
            <div className="mt-2 md:mt-0">
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
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {topic.posts.map((post, index) => (
          <div 
            key={post.id} 
            id={`post-${post.id}`}
            className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt={post.author.username} className="h-10 w-10 rounded-full" />
                  ) : (
                    post.author.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author.username}
                    {post.isTopicStarter && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                        Topic Starter
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span>Member since {post.author.joinDate.split('T')[0]}</span>
                    <span className="mx-1">•</span>
                    <span>Posts: {post.author.postCount}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="prose dark:prose-invert max-w-none">
                {post.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 sm:px-6 flex justify-between items-center">
              <div>
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`inline-flex items-center text-sm ${
                    post.hasLiked
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill={post.hasLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    ></path>
                  </svg>
                  <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
                    setReplyContent(`@${post.author.username} `);
                  }}
                  className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    ></path>
                  </svg>
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="mt-8" id="reply-form">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Post a Reply</h2>
          </div>
          {isLoggedIn ? (
            <form onSubmit={handleReplySubmit} className="px-4 py-5 sm:p-6">
              <div>
                <textarea
                  id="reply-content"
                  name="reply-content"
                  rows={6}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Write your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    'Post Reply'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  You need to be logged in to reply to this topic.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Log in
                  </Link>
                  <Link href="/register" className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-indigo-200 dark:bg-indigo-800/50 dark:hover:bg-indigo-800">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
