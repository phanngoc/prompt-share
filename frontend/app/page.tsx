'use client'

import { HeroSection } from '@/components/HeroSection'
import { CategoryNav } from '@/components/CategoryNav'
import { PromptGrid } from '@/components/PromptGrid'
import { SearchBar } from '@/components/SearchBar'
import useSWR from 'swr'
import { getCategories, getPrompts } from '@/lib/api'
import { useState } from 'react'

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    page_size: 12
  })

  const { data: categoriesData } = useSWR('/categories', () => 
    getCategories().then(res => res.data)
  )

  const { data: promptsData } = useSWR(
    ['/prompts', searchParams],
    () => getPrompts(searchParams).then(res => res.data)
  )

  const { data: featuredPromptsData } = useSWR(
    '/prompts/featured',
    () => getPrompts({ is_featured: true, page_size: 6 }).then(res => res.data)
  )

  const { data: latestPromptsData } = useSWR(
    '/prompts/latest',
    () => getPrompts({ sort_by: 'created_at', sort_order: 'desc', page_size: 6 }).then(res => res.data)
  )

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({ ...prev, search, page: 1 }))
  }

  const handleCategoryClick = (categoryId: number) => {
    setSearchParams(prev => ({ 
      ...prev, 
      category_id: prev.category_id === categoryId ? undefined : categoryId,
      page: 1 
    }))
  }

  return (
    <main>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Search and Categories */}
          <div className="flex flex-col gap-6">
            <SearchBar onSearch={handleSearch} />
            <CategoryNav 
              categories={categoriesData?.items || []} 
              selectedId={searchParams.category_id}
              onSelect={handleCategoryClick}
            />
          </div>

          {/* Featured Prompts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Prompts</h2>
            <PromptGrid prompts={featuredPromptsData?.items || []} />
          </section>

          {/* Latest Prompts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Prompts</h2>
            <PromptGrid prompts={latestPromptsData?.items || []} />
          </section>
        </div>
      </div>
    </main>
  )
} 