"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Solana imports
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface Category {
  id: number;
  name: string;
}

export default function CreatePrompt() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [promptData, setPromptData] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    is_free: true,
    price: 0,
    payment_type: "fiat", // Default to fiat currency, can be "sol" for SOL payments
    sol_price: 0.1, // Default SOL price (0.1 SOL)
  });

  // Set up Solana network
  const network = WalletAdapterNetwork.Devnet; // Use Devnet for testing, change to Mainnet for production
  
  // Setup supported wallet adapters
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  // Check authentication and fetch categories when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login page if not authenticated
        router.push("/login?redirect=/create");
        return;
      }
      
      try {
        // Verify token validity by making a request to the API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          // Token is invalid, clear it and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login?redirect=/create");
          return;
        }
        
        // Fetch categories
        await fetchCategories();
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "is_free") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setPromptData({
        ...promptData,
        is_free: isChecked,
        price: isChecked ? 0 : promptData.price,
      });
    } else if (name === "payment_type") {
      setPromptData({ ...promptData, payment_type: value });
    } else {
      setPromptData({ ...promptData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setMessage({ type: "error", text: "Please log in to create a prompt" });
        router.push("/login?redirect=/create");
        return;
      }

      // Prepare data for submission
      const submissionData = {
        ...promptData,
        price: promptData.is_free ? 0 : parseFloat(promptData.price.toString()),
        sol_price: promptData.payment_type === "sol" ? parseFloat(promptData.sol_price.toString()) : 0,
        category_id: parseInt(promptData.category_id),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/prompts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create prompt");
      }

      const data = await response.json();
      setMessage({ type: "success", text: "Prompt created successfully!" });
      
      // Redirect to the newly created prompt
      setTimeout(() => {
        router.push(`/prompts/${data.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error creating prompt:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create prompt",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={clusterApiUrl(network)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-12 px-4">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Create Your AI Prompt
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Share your expertise with the community. Create a detailed prompt that helps others leverage AI more effectively.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                {message.text && (
                  <div
                    className={`p-4 mb-6 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* General Settings Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">General Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set the basic details of your prompt</p>
                  </div>

                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prompt Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={promptData.title}
                      onChange={handleChange}
                      placeholder="E.g., SEO-Optimized Blog Post Generator"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prompt Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      value={promptData.description}
                      onChange={handleChange}
                      placeholder="Write a concise description of what your prompt does and why it's valuable..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prompt Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      value={promptData.content}
                      onChange={handleChange}
                      placeholder="Enter your detailed prompt instructions here..."
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Be descriptive. Include variables in [BRACKETS] that users can customize.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category_id"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Category *
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      required
                      value={promptData.category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Options */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Pricing Options
                    </h3>

                    {/* Free/Paid Toggle */}
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="is_free"
                        name="is_free"
                        checked={promptData.is_free}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_free"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Make this prompt free
                      </label>
                    </div>

                    {/* Payment Type Selection (shown only if not free) */}
                    {!promptData.is_free && (
                      <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Payment Method *
                        </label>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="payment_fiat"
                              name="payment_type"
                              value="fiat"
                              checked={promptData.payment_type === "fiat"}
                              onChange={handleChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label
                              htmlFor="payment_fiat"
                              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              Traditional Payment (USD)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="payment_sol"
                              name="payment_type"
                              value="sol"
                              checked={promptData.payment_type === "sol"}
                              onChange={handleChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label
                              htmlFor="payment_sol"
                              className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span className="mr-1">SOL Payment</span>
                              <Image
                                src="/solana-logo.png" 
                                alt="Solana Logo"
                                width={16}
                                height={16}
                                className="inline-block"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* USD Price Input (shown only if not free and fiat payment selected) */}
                    {!promptData.is_free && promptData.payment_type === "fiat" && (
                      <div className="mt-4">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Price (USD) *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            min="0.99"
                            step="0.01"
                            required={!promptData.is_free && promptData.payment_type === "fiat"}
                            value={promptData.price}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">USD</span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Set a fair price for your prompt. Minimum price is $0.99.
                        </p>
                      </div>
                    )}

                    {/* SOL Price Input (shown only if not free and SOL payment selected) */}
                    {!promptData.is_free && promptData.payment_type === "sol" && (
                      <div className="mt-4">
                        <label
                          htmlFor="sol_price"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Price (SOL) *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="number"
                            name="sol_price"
                            id="sol_price"
                            min="0.01"
                            step="0.01"
                            required={!promptData.is_free && promptData.payment_type === "sol"}
                            value={promptData.sol_price}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="0.1"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">SOL</span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Set a fair price in SOL. Minimum price is 0.01 SOL.
                        </p>

                        {/* Solana Wallet Connection */}
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Connect Solana Wallet
                          </label>
                          <div className="flex items-center space-x-2">
                            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Connect your wallet to receive SOL payments
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <Link
                      href="/"
                      className="inline-flex justify-center py-2 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating..." : "Create Prompt"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tips Section */}
            <div className="max-w-4xl mx-auto mt-12 px-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Tips for Creating Effective Prompts
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Be clear and specific about what the prompt should accomplish.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Include placeholder variables in [BRACKETS] for user customization.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Structure your prompt with clear sections and numbered lists when appropriate.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Specify the desired format, tone, and style in your prompt.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Test your prompt with different inputs to ensure consistent results.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}