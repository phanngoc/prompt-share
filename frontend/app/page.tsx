import { HeroSection } from '@/components/HeroSection'
import { CategoryNav } from '@/components/CategoryNav'
import { PromptGrid } from '@/components/PromptGrid'
import { SearchBar } from '@/components/SearchBar'

export default function Home() {
  // TODO: Fetch categories and prompts from API
  const categories = [
    { id: 1, name: 'Models', icon: 'cube' },
    { id: 2, name: 'Art', icon: 'paint-brush' },
    { id: 3, name: 'Logos', icon: 'badge' },
    { id: 4, name: 'Graphics', icon: 'image' },
    { id: 5, name: 'Productivity', icon: 'sparkles' },
    { id: 6, name: 'Marketing', icon: 'chart-bar' },
    { id: 7, name: 'Photography', icon: 'camera' },
    { id: 8, name: 'Games', icon: 'puzzle-piece' },
  ]

  const prompts = [
    {
      id: 1,
      title: "Folk Monster Icons",
      price: 3.99,
      image: "/prompts/folk-monsters.jpg",
      rating: 4.8,
      reviewCount: 156,
      seller: {
        name: "artmaster",
        isTopSeller: true
      }
    },
    {
      id: 2,
      title: "Bold Color Ink Icons",
      price: 2.99,
      image: "/prompts/ink-icons.jpg",
      rating: 5.0,
      reviewCount: 89,
      seller: {
        name: "inkmaster",
        isTopSeller: true
      }
    },
    // Add more prompts...
  ]

  return (
    <main>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Search and Categories */}
          <div className="flex flex-col gap-6">
            <SearchBar />
            <CategoryNav categories={categories} />
          </div>

          {/* Featured Prompts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Prompts</h2>
            <PromptGrid prompts={prompts} />
          </section>

          {/* Latest Prompts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Prompts</h2>
            <PromptGrid prompts={prompts} />
          </section>
        </div>
      </div>
    </main>
  )
} 