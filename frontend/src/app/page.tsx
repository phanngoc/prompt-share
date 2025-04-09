import Image from "next/image";
import Link from "next/link";

async function getFeaturedPrompts() {
  // Server component - can fetch data without useEffect
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/prompts/?is_featured=true&page_size=4`, {
      cache: 'no-store' // Don't cache this data
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch featured prompts');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching featured prompts:', error);
    return { 
      items: [], 
      total: 0, 
      page: 1, 
      page_size: 4, 
      total_pages: 0 
    };
  }
}

async function getCategories() {
  try {
    // Add debug information to see what URL is being used
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/categories`;
    console.log('Fetching categories from:', apiUrl);
    
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      // Add a timeout to prevent hanging requests
      next: { revalidate: 3600 }, // Revalidate every hour at most
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      // Log more detailed error information
      console.error('Categories API error:', {
        status: res.status,
        statusText: res.statusText
      });
      
      // Return empty array instead of throwing to prevent the page from crashing
      return [];
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return fallback data for development/demo purposes
    return [
      { id: 1, name: "Creative Writing", prompt_count: 12 },
      { id: 2, name: "Programming", prompt_count: 8 },
      { id: 3, name: "Marketing", prompt_count: 15 },
      { id: 4, name: "Education", prompt_count: 10 },
      { id: 5, name: "Business", prompt_count: 7 },
      { id: 6, name: "Personal Growth", prompt_count: 9 }
    ];
  }
}

// Emoji mapping for categories
const categoryEmojis: Record<string, string> = {
  "Creative Writing": "✍️",
  "Programming": "💻",
  "Marketing": "📈",
  "Education": "📚",
  "Business": "💼",
  "Personal Growth": "🌱",
  "Art": "🎨",
  "Science": "🧪",
  "Technology": "⚙️",
  "Health": "🩺",
  "Lifestyle": "🌿",
  "Other": "🔍"
};

export default async function Home() {
  // Fetch data in parallel
  const [featuredPromptsData, categoriesData] = await Promise.all([
    getFeaturedPrompts(),
    getCategories()
  ]);

  const featuredPrompts = featuredPromptsData?.items || [];
  const categories = categoriesData || [];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover & Share AI Prompts</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Unlock the full potential of AI with our curated collection of powerful prompts. 
            Find the perfect prompt or share your own with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore" 
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
            >
              Explore Prompts
            </Link>
            <Link 
              href="/create" 
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium text-lg transition-colors"
            >
              Create Prompt
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for prompts, categories, or creators..." 
              className="w-full py-4 px-6 rounded-full shadow-md text-lg border-0 focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Prompts</h2>
            <Link href="/explore" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {featuredPrompts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No featured prompts available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPrompts.map(prompt => (
                <div key={prompt.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 dark:bg-gray-600 relative">
                    {prompt.image_url ? (
                      <Image 
                        src={prompt.image_url}
                        alt={prompt.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      {prompt.category ? prompt.category.name : "Uncategorized"}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{prompt.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {prompt.description ? (
                        prompt.description.length > 100 
                          ? `${prompt.description.substring(0, 100)}...` 
                          : prompt.description
                      ) : "No description available"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-yellow-400 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1">{prompt.average_rating || "N/A"}</span>
                        </div>
                        <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{prompt.usage_count || 0} uses</span>
                      </div>
                      <Link href={`/prompts/${prompt.id}`} className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Browse by Category</h2>
          
          {categories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => (
                <Link 
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-2">
                    {categoryEmojis[category.name] || "🔍"}
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.prompt_count || 0} prompts
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Community */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Connect with prompt engineers, share your creations, and discover new ways to use AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/learn-more" 
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">PromptShare</h3>
              <p className="text-gray-400 mb-4">
                Discover, create, and share powerful AI prompts with our global community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press Kit</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 PromptShare. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <select className="bg-gray-800 text-gray-400 py-1 px-3 rounded-md">
                <option>English</option>
                <option>Tiếng Việt</option>
                <option>中文</option>
                <option>日本語</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
