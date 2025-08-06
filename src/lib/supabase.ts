import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const saveComplaint = async (complaint: any) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
    
    if (error) {
      console.warn('Supabase complaints table not available, using localStorage:', error.message)
      // Fallback to localStorage
      const complaints = JSON.parse(localStorage.getItem('vce-complaints') || '[]')
      complaints.unshift(complaint)
      localStorage.setItem('vce-complaints', JSON.stringify(complaints))
      return complaint
    }
    
    return data[0]
  } catch (error) {
    console.warn('Supabase connection failed, using localStorage:', error)
    const complaints = JSON.parse(localStorage.getItem('vce-complaints') || '[]')
    complaints.unshift(complaint)
    localStorage.setItem('vce-complaints', JSON.stringify(complaints))
    return complaint
  }
}

export const getComplaints = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Supabase complaints table not available, using localStorage:', error.message)
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('vce-complaints') || '[]')
    }
    
    return data || []
  } catch (error) {
    console.warn('Supabase connection failed, using localStorage:', error)
    return JSON.parse(localStorage.getItem('vce-complaints') || '[]')
  }
}

export const saveFeedback = async (feedback: any) => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([feedback])
      .select()
    
    if (error) {
      console.warn('Supabase feedbacks table not available, using localStorage:', error.message)
      // Fallback to localStorage
      const feedbacks = JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
      feedbacks.unshift(feedback)
      localStorage.setItem('vce-feedbacks', JSON.stringify(feedbacks))
      return feedback
    }
    
    return data[0]
  } catch (error) {
    console.warn('Supabase connection failed, using localStorage:', error)
    const feedbacks = JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
    feedbacks.unshift(feedback)
    localStorage.setItem('vce-feedbacks', JSON.stringify(feedbacks))
    return feedback
  }
}

export const getFeedbacks = async () => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Supabase feedbacks table not available, using localStorage:', error.message)
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
    }
    
    return data || []
  } catch (error) {
    console.warn('Supabase connection failed, using localStorage:', error)
    return JSON.parse(localStorage.getItem('vce-feedbacks') || '[]')
  }
}