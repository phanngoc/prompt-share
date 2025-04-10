"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// For Solana payments
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

interface PromptDetails {
  id: number;
  title: string;
  price: number;
  payment_type?: string; // "fiat" or "sol"
  sol_price?: number;
  seller_id: number; // Added this field
  seller: {
    id: number;
    username: string;
  };
}

export default function PurchasePromptButton({ prompt }: { prompt: PromptDetails }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  
  // Solana wallet connection
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  console.log('PurchasePromptButton:publicKey', publicKey);

  // Update wallet address on server when connected
  useEffect(() => {
    const updateWalletAddress = async () => {
      if (publicKey) {
        try {
          const user = localStorage.getItem('user');
          if (!user) return;
          const userId = JSON.parse(user).id;
          const token = localStorage.getItem("token");
          // Update user's wallet address
          const walletAddress = publicKey.toString();
          const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/${userId}/wallet`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              wallet_address: walletAddress
            }),
          });

          if (walletResponse.ok) {
            console.log("Wallet address updated successfully");
          } else {
            console.error("Failed to update wallet address");
          }
        } catch (error) {
          console.error("Error updating wallet address:", error);
        }
      }
    };
  
    if (publicKey) {
      updateWalletAddress();
    }
  }, [publicKey]);
  const handlePurchaseClick = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        router.push(`/login?redirect=/prompts/${prompt.id}`);
        return;
      }
      
      // Open the modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error starting purchase flow:", error);
      setError("An error occurred while initiating the purchase.");
    }
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      setError("");
      
      const token = localStorage.getItem("token");
      
      // Create order via API
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt_id: prompt.id,
          amount: prompt.price,
          payment_type: prompt.payment_type || "fiat",
          sol_amount: prompt.sol_price || 0,
        }),
      });

      console.log('orderResponse', orderResponse)

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.detail || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      console.log('orderData', orderData)
      setOrderId(orderData.id);
      console.log('prompt.payment_type', prompt.payment_type)
      console.log('publicKey', publicKey)
      // If it's a SOL payment and we have wallet connected, proceed with SOL payment
      if (prompt.payment_type === "sol" && publicKey) {
        await processSOLPayment(orderData.id);
      }
      
      return orderData;
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error instanceof Error ? error.message : "Failed to create order");
      setIsProcessing(false);
      return null;
    }
  };

  const processSOLPayment = async (orderId: number) => {
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
      console.log('processSOLPayment:prompt', prompt)
      // Check if seller ID exists - try both seller_id and seller.id
      const sellerId = prompt?.seller_id || prompt?.seller?.id;
      if (!sellerId) {
        console.error("Seller ID is undefined", prompt);
        throw new Error("Seller information is missing");
      }

      // Get seller's wallet address
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      console.log(`Attempting to fetch seller wallet from: ${baseUrl}/users/${sellerId}/wallet`);
      
      const sellerResponse = await fetch(
        `${baseUrl}/users/${sellerId}/wallet`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Seller wallet API response:", sellerResponse);

      // Handle 401 Unauthorized - redirect to login
      if (sellerResponse.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        throw new Error('Authentication required. Please login again.');
      }
      
      if (!sellerResponse.ok) {
        throw new Error(`Failed to fetch seller's wallet address: ${sellerResponse.status}`);
      }

      const { wallet_address } = await sellerResponse.json();
      if (!wallet_address) {
        throw new Error("Seller has not set up a wallet address");
      }

      // Create a transaction
      const sellerPublicKey = new PublicKey(wallet_address);
      const solAmount = prompt.sol_price || 0;
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: sellerPublicKey,
          lamports: solAmount * LAMPORTS_PER_SOL,
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'processed');

      // Record the payment
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/orders/${orderId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: "sol",
          wallet_address: publicKey.toString(),
          blockchain_tx_id: signature,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to record payment");
      }

      // Navigate to success page
      router.push(`/orders/${orderId}/success`);
    } catch (error) {
      console.error("SOL payment error:", error);
      setError(error instanceof Error ? error.message : "SOL payment failed");
      setIsProcessing(false);
    }
  };

  const processFiatPayment = async () => {
    try {
      if (!orderId) {
        const order = await createOrder();
        if (!order) return;
      }
      
      // Xử lý cho phương thức thanh toán SOL được chọn từ giao diện
      if (paymentMethod === "sol") {
        if (!publicKey) {
          throw new Error("Vui lòng kết nối ví Solana trước khi thanh toán");
        }
        await processSOLPayment(orderId as number);
        return;
      }
      
      // For traditional payment methods
      const token = localStorage.getItem("token");
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/orders/${orderId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: paymentMethod,
          payment_details: JSON.stringify({
            // Include any additional payment details here
            timestamp: new Date().toISOString(),
          }),
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.detail || "Failed to process payment");
      }

      // Navigate to success page
      router.push(`/orders/${orderId}/success`);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.payment_type === "sol") {
      // For SOL payments, we need to create the order first and then process the payment
      await createOrder();
    } else {
      // For traditional payments
      await processFiatPayment();
    }
  };

  return (
    <>
      <button 
        onClick={handlePurchaseClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors"
      >
        Purchase Prompt
      </button>
      
      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Purchase Prompt
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">You are about to purchase:</p>
              <p className="font-medium text-gray-900 dark:text-white">{prompt.title}</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {prompt.payment_type === "sol" ? 
                  `${prompt.sol_price} SOL` : 
                  `$${prompt.price.toFixed(2)}`
                }
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-700 dark:text-red-400 text-sm mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handlePaymentSubmit}>
              {prompt.payment_type === "sol" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Connect your Solana wallet to pay
                  </label>
                  <div className="flex justify-center">
                    <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
                  </div>
                  {publicKey && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="credit_card"
                          name="payment_method"
                          value="credit_card"
                          checked={paymentMethod === "credit_card"}
                          onChange={() => setPaymentMethod("credit_card")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="credit_card" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Credit/Debit Card
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="momo"
                          name="payment_method"
                          value="momo"
                          checked={paymentMethod === "momo"}
                          onChange={() => setPaymentMethod("momo")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="momo" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          MoMo
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="zalopay"
                          name="payment_method"
                          value="zalopay"
                          checked={paymentMethod === "zalopay"}
                          onChange={() => setPaymentMethod("zalopay")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="zalopay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          ZaloPay
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="vnpay"
                          name="payment_method"
                          value="vnpay"
                          checked={paymentMethod === "vnpay"}
                          onChange={() => setPaymentMethod("vnpay")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="vnpay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          VNPay
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="sol"
                          name="payment_method"
                          value="sol"
                          checked={paymentMethod === "sol"}
                          onChange={() => setPaymentMethod("sol")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="sol" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          SOL Wallet
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* For demo purposes, we'll just simulate the payment */}
                  {/* In a real app, you'd integrate with a payment processor */}
                  
                  {/* Hiển thị nút kết nối ví SOL khi chọn phương thức thanh toán SOL */}
                  {paymentMethod === "sol" && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kết nối ví Solana để thanh toán
                      </label>
                      <div className="flex justify-center">
                        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
                      </div>
                      {publicKey && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                          Đã kết nối: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || (prompt.payment_type === "sol" && !publicKey) || (paymentMethod === "sol" && !publicKey)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}