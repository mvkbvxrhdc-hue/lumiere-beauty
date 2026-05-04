import { getSupabase } from '../supabase'

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructor_title: string
  instructor_avatar?: string
  category: string
  level: string
  duration: string
  price: number
  rating: number
  student_count: number
  image?: string
  what_you_learn: string[]
  requirements: string[]
  includes: string[]
}

export async function getCourses() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching courses:', error)
    return []
  }
  
  return data as Course[]
}

export async function getCourseById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[v0] Error fetching course:', error)
    return null
  }
  
  return data
}

export async function getCourseLessons(courseId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching lessons:', error)
    return []
  }
  
  return data
}
