import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://keoyzkzhkvsjxpybszah.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Client = {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  service_type: string | null
  status: 'lead' | 'active' | 'completed' | 'on-hold'
  notes: string | null
  value: number | null
  created_at: string
  updated_at: string
}

export type Employee = {
  id: string
  full_name: string
  email: string
  phone: string | null
  nationality: string | null
  job_title: string
  employment_type: 'full-time' | 'part-time' | 'contract'
  start_date: string | null
  status: 'applicant' | 'interviewing' | 'hired' | 'onboarding' | 'active' | 'terminated'
  cos_reference: string | null
  cos_status: 'not-required' | 'pending' | 'assigned' | 'used' | 'expired'
  salary: number | null
  documents: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category: string | null
  tags: string[] | null
  status: 'draft' | 'published' | 'archived'
  author: string | null
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  source: string | null
  subscribed: boolean
  created_at: string
}

export type WebsiteContent = {
  id: string
  section: string
  key: string
  value: string
  updated_at: string
}

export type StoredDocument = {
  id: string
  filename: string
  original_name: string
  file_type: string
  file_size: number
  bucket_path: string
  public_url: string | null
  entity_type: 'employee' | 'client' | 'company' | 'general'
  entity_id: string | null
  uploaded_by: string | null
  created_at: string
}
