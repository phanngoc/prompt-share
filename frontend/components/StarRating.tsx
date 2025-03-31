interface StarRatingProps {
  rating: number
  maxStars?: number
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex">
      {[...Array(maxStars)].map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'text-yellow-400'
              : i < rating
              ? 'text-yellow-200'
              : 'text-gray-200'
          }`}
          fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

const StarIcon = ({ className, fill = 'none' }: { className?: string; fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
) 