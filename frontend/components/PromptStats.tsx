import { StarRating } from './StarRating'

interface PromptStatsProps {
  rating: number
  reviewCount: number
  favoriteCount: number
  viewCount: number
}

export function PromptStats({
  rating,
  reviewCount,
  favoriteCount,
  viewCount,
}: PromptStatsProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <StarRating rating={rating} />
          <span className="ml-2 text-sm font-medium">{rating}</span>
        </div>
        <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
      </div>
      <div className="flex items-center gap-2">
        <HeartIcon className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">{favoriteCount} Favorites</span>
      </div>
      <div className="flex items-center gap-2">
        <EyeIcon className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">{viewCount} Views</span>
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

const EyeIcon = ({ className }: { className?: string }) => (
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
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
) 