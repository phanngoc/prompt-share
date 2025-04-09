"use client";

import dynamic from 'next/dynamic';

// Import the purchase section with dynamic loading to prevent SSR issues with Solana wallet
const PurchasePromptSection = dynamic(
  () => import('./PurchasePromptSection'),
  { ssr: false }
);

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

export default function ClientPurchaseSection({ prompt }: { prompt: PromptDetails }) {
  return <PurchasePromptSection prompt={prompt} />;
}