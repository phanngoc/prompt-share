import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface SellerInfoProps {
  seller: {
    name: string
    avatar: string
    isTopSeller: boolean
    totalSales: string
  }
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="relative w-8 h-8 rounded-full overflow-hidden">
        <Image
          src={seller.avatar}
          alt={seller.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{seller.name}</span>
        {seller.isTopSeller && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Top Seller
          </Badge>
        )}
        <span className="text-sm text-gray-500">{seller.totalSales} sales</span>
      </div>
    </div>
  )
} 