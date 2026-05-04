import { getSupabase } from '../supabase'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  skin_type: string[]
  rating: number
  review_count: number
  in_stock: boolean
  image?: string
  badge?: string
  brand: string
  size: string
  ingredients: string
  benefits: string[]
  how_to_use: string
}

export async function getProducts() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching products:', error)
    return []
  }
  
  return data as Product[]
}

export async function getProductById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[v0] Error fetching product:', error)
    return null
  }
  
  return data as Product
}

export async function getProductReviews(productId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      profiles:user_id (name, avatar)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching reviews:', error)
    return []
  }
  
  return data
}
