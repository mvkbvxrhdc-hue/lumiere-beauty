import { getSupabase } from '../supabase'

export interface CommunityPost {
  id: string
  author_id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  likes: number
  comments_count: number
  views: number
  created_at: string
  profiles?: {
    name: string
    avatar: string
    is_professional: boolean
    professional_title?: string
  }
}

export async function getCommunityPosts() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profiles:author_id (name, avatar, is_professional, professional_title)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching community posts:', error)
    return []
  }
  
  return data as CommunityPost[]
}

export async function getPostById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profiles:author_id (name, avatar, is_professional, professional_title)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[v0] Error fetching post:', error)
    return null
  }
  
  return data
}

export async function getPostComments(postId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      profiles:user_id (name, avatar)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching comments:', error)
    return []
  }
  
  return data
}

export async function createPost(post: {
  author_id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_posts')
    .insert([post])
    .select()
    .single()
  
  if (error) {
    console.error('[v0] Error creating post:', error)
    return null
  }
  
  return data
}
