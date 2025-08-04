import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const saveComplaint = async (complaint: any) => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([complaint])
    .select()
  
  if (error) {
    console.error('Error saving complaint:', error)
    // Fallback to localStorage
    const complaints = JSON.parse(localStorage.getItem('vce-complaints') || '[]')
    complaints.unshift(complaint)
    localStorage.setItem('vce-complaints', JSON.stringify(complaints))
    return complaint
  }
  
  return data[0]
}

export const getComplaints = async () => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching complaints:', error)
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('vce-complaints') || '[]')
  }
  
  return data || []
}

export const saveFeedback = async (feedback: any) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([feedback])
    .select()
  
  if (error) {
    console.error('Error saving feedback:', error)
    // Fallback to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
    feedbacks.unshift(feedback)
    localStorage.setItem('vce-feedbacks', JSON.stringify(feedbacks))
    return feedback
  }
  
  return data[0]
}

export const getFeedbacks = async () => {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching feedbacks:', error)
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
  }
  
  return data || []
}