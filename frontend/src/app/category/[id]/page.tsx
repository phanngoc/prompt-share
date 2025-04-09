// Fetch prompt data for a category
async function getPromptsByCategory(categoryId: string, page = 1): Promise<PromptsResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(
      `${apiUrl}/prompts?category_id=${categoryId}&page=${page}&page_size=12`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch prompts for category');
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching prompts for category #${categoryId}:`, error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 12,
      total_pages: 0
    };
  }
}

// Fetch single category data
async function getCategory(categoryId: string): Promise<Category | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/categories/${categoryId}`, { cache: 'no-store' });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch category');
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching category #${categoryId}:`, error);
    return null;
  }
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams: { page?: string }
}) {
  const categoryId = params.id;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  if (!categoryId) {
    notFound();
  }
  
  const [category, promptsData] = await Promise.all([
    getCategory(categoryId),
    getPromptsByCategory(categoryId, page)
  ]);
  
  if (!category) {
    notFound();
  }
} 