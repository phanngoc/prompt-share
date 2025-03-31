import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface Seller {
  name: string
  isTopSeller: boolean
}

interface Prompt {
  id: number
  title: string
  price: number
  image: string
  rating: number
  reviewCount: number
  seller: Seller
}

interface PromptGridProps {
  prompts: Prompt[]
}

export function PromptGrid({ prompts }: PromptGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
          {/* Image */}
          <div className="relative aspect-[4/3]">
            <Image
              src={prompt.image}
              alt={prompt.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium line-clamp-2">{prompt.title}</h3>
              <span className="font-bold whitespace-nowrap">
                ${prompt.price.toFixed(2)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span>{prompt.rating.toFixed(1)}</span>
              <span>({prompt.reviewCount})</span>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="p-4 pt-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{prompt.seller.name}</span>
              {prompt.seller.isTopSeller && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <VerifiedIcon className="w-3 h-3" />
                  Top Seller
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
)

const VerifiedIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
) 