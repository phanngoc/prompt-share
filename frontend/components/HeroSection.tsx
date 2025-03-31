import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="AI generated art background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            AI Prompt Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Explore 170k+ expert-crafted prompt templates for Midjourney, ChatGPT, DALL-E, FLUX & more
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Explore prompts
            </Button>
            <Button variant="outline" size="lg">
              Sell prompts
            </Button>
          </div>

          {/* Featured Brands */}
          <div className="pt-12">
            <p className="text-sm text-gray-400 mb-6">Featured in</p>
            <div className="flex justify-center items-center gap-8 grayscale opacity-70">
              <Image src="/brands/verge.svg" alt="The Verge" width={100} height={40} />
              <Image src="/brands/wired.svg" alt="Wired" width={100} height={40} />
              <Image src="/brands/forbes.svg" alt="Forbes" width={100} height={40} />
              <Image src="/brands/techcrunch.svg" alt="TechCrunch" width={100} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 