import { getSupabase } from '../supabase'

export interface TreatmentRecord {
  id: string
  user_id: string
  treatment_type: string
  treatment_name: string
  date: string
  doctor_name: string
  doctor_specialty: string
  clinic_name: string
  cost: number
  notes?: string
  before_photo?: string
  after_photo?: string
  satisfaction_rating?: number
}

export async function getTreatmentRecords(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('treatment_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching treatment records:', error)
    return []
  }
  
  return data as TreatmentRecord[]
}

export async function createTreatmentRecord(record: Omit<TreatmentRecord, 'id' | 'created_at'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('treatment_records')
    .insert([record])
    .select()
    .single()
  
  if (error) {
    console.error('[v0] Error creating treatment record:', error)
    return null
  }
  
  return data
}
