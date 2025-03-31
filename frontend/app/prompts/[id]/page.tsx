import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StarRating } from '@/components/StarRating'
import { SellerInfo } from '@/components/SellerInfo'
import { PromptStats } from '@/components/PromptStats'
import { PromptFeatures } from '@/components/PromptFeatures'

interface PromptDetailProps {
  params: {
    id: string
  }
}

export default function PromptDetail({ params }: PromptDetailProps) {
  // TODO: Fetch prompt data using params.id
  const prompt = {
    id: 1,
    title: "Pastel Clay Emojis",
    description: "A prompt that generates pastel renders of emojis in a clay style. Perfect for icons or websites.",
    price: 2.99,
    rating: 4.7,
    reviewCount: 178,
    viewCount: 1200,
    favoriteCount: 73,
    seller: {
      name: "charismaenigma",
      avatar: "/avatars/seller.jpg",
      isTopSeller: true,
      totalSales: "2.6k"
    },
    features: [
      { label: "35 words", value: "K3" },
      { label: "Tested", icon: "check" },
      { label: "Instructions", icon: "book" },
      { label: "9 examples", icon: "image" },
      { label: "HD images", icon: "sparkles" },
      { label: "Free credits", icon: "star" },
      { label: "No artists", icon: "user" }
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/prompts/pastel-emoji.jpg"
              alt={prompt.title}
              fill
              className="object-cover"
            />
          </div>
          {/* Add image gallery/carousel here */}
        </div>

        {/* Right Column - Prompt Details */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
              <SellerInfo seller={prompt.seller} />
            </div>
            <Button variant="ghost" size="icon">
              <HeartIcon className="h-6 w-6" />
            </Button>
          </div>

          <PromptStats
            rating={prompt.rating}
            reviewCount={prompt.reviewCount}
            favoriteCount={prompt.favoriteCount}
            viewCount={prompt.viewCount}
          />

          <PromptFeatures features={prompt.features} />

          <p className="text-gray-600">{prompt.description}</p>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl font-bold">${prompt.price}</p>
            </div>
            <div className="space-x-3">
              <Button variant="outline">Message</Button>
              <Button>Get prompt</Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>After purchasing, you will gain access to the prompt file which you can use with Midjourney. Prompts can be refunded if they do not work as expected.</p>
            <p className="mt-2">By purchasing this prompt, you agree to our terms of service.</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {/* Add reviews component here */}
      </div>
    </div>
  )
}

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
) 