"use client";

import { SolanaWalletProvider } from "./SolanaWalletProvider";
import PurchasePromptButton from "./PurchasePromptButton";

interface PromptDetails {
  id: number;
  title: string;
  price: number;
  payment_type?: string;
  sol_price?: number;
  views_count: number;
  sales_count: number;
  seller: {
    id: number;
    username: string;
  };
}

export default function PurchasePromptSection({ prompt }: { prompt: PromptDetails }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {prompt.payment_type === "sol" ? 
              `${prompt.sol_price} SOL` : 
              `$${prompt.price.toFixed(2)}`
            }
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {prompt.views_count}
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {prompt.sales_count}
            </span>
          </div>
        </div>
        
        <SolanaWalletProvider>
          <PurchasePromptButton prompt={prompt} />
        </SolanaWalletProvider>
      </div>
    </div>
  );
}