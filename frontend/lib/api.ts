import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Categories
export const getCategories = () => api.get('/categories')

// Prompts
export const getPrompts = (params?: {
  category_id?: number
  min_price?: number
  max_price?: number
  is_featured?: boolean
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  page_size?: number
}) => api.get('/prompts', { params })

export const getPromptById = (id: number) => api.get(`/prompts/${id}`)

export default api 