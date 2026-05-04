import { getSupabase } from '../supabase'

export interface BeautyService {
  id: string
  name: string
  description: string
  category: string
  duration: string
  price: number
  rating: number
  review_count: number
  image?: string
  benefits: string[]
  what_to_expect: string
  aftercare: string
  suitable_for: string[]
}

export async function getBeautyServices() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('beauty_services')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching services:', error)
    return []
  }
  
  return data as BeautyService[]
}

export async function getServiceById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('beauty_services')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[v0] Error fetching service:', error)
    return null
  }
  
  return data as BeautyService
}
