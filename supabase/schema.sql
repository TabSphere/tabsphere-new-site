-- TabSphere Admin Dashboard - Supabase Schema
-- Run this in your Supabase SQL Editor: https://keoyzkzhkvsjxpybszah.supabase.co/project/sql

-- Enable RLS
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;

-- CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'completed', 'on-hold')),
  notes TEXT,
  value NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMPLOYEES TABLE (COS Requirements)
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  job_title TEXT NOT NULL,
  employment_type TEXT NOT NULL DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract')),
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'applicant' CHECK (status IN ('applicant', 'interviewing', 'hired', 'onboarding', 'active', 'terminated')),
  cos_reference TEXT,
  cos_status TEXT NOT NULL DEFAULT 'not-required' CHECK (cos_status IN ('not-required', 'pending', 'assigned', 'used', 'expired')),
  salary NUMERIC(12,2),
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author TEXT,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT SUBMISSIONS
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WEBSITE CONTENT (for CMS)
CREATE TABLE IF NOT EXISTS website_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  bucket_path TEXT NOT NULL,
  public_url TEXT,
  entity_type TEXT NOT NULL DEFAULT 'general' CHECK (entity_type IN ('employee', 'client', 'company', 'general')),
  entity_id UUID,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY POLICIES (authenticated users only)
DO $$
BEGIN
  -- Clients
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'allow_anon_read') THEN
    CREATE POLICY "allow_anon_read" ON clients FOR SELECT TO anon USING (false);
  END IF;

  -- Employees
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Blog Posts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'allow_anon_read_published') THEN
    CREATE POLICY "allow_anon_read_published" ON blog_posts FOR SELECT TO anon USING (status = 'published');
  END IF;

  -- Contact Submissions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'allow_anon_insert') THEN
    CREATE POLICY "allow_anon_insert" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
  END IF;

  -- Newsletter Subscribers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON newsletter_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'allow_anon_insert') THEN
    CREATE POLICY "allow_anon_insert" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
  END IF;

  -- Website Content
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'website_content' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON website_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'website_content' AND policyname = 'allow_anon_read') THEN
    CREATE POLICY "allow_anon_read" ON website_content FOR SELECT TO anon USING (true);
  END IF;

  -- Documents
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'allow_authenticated') THEN
    CREATE POLICY "allow_authenticated" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for authenticated uploads
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'documents_authenticated_upload') THEN
    CREATE POLICY "documents_authenticated_upload" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

-- Insert default website content
INSERT INTO website_content (section, key, value) VALUES
  ('hero', 'headline', 'We Build Digital Experiences'),
  ('hero', 'subtext', 'A registered UK digital studio \u2014 websites, apps and brands built remotely, delivered fast.'),
  ('hero', 'cta_primary', 'View Our Services'),
  ('hero', 'cta_secondary', 'Start a Project'),
  ('hero', 'badge', 'Stirling, Scotland \u00b7 UK Co. 16534288'),
  ('services', 'title', 'Full Digital Stack. One Team.'),
  ('services', 'description', 'From your first website to a complete SaaS product \u2014 joined-up delivery, no handoff headaches.'),
  ('portfolio', 'title', 'Recent Projects'),
  ('pricing', 'title', 'Transparent Pricing. No Surprises.'),
  ('contact', 'title', 'Ready to Transform Your Digital Presence?'),
  ('footer', 'company_desc', 'A Stirling-based digital studio delivering websites, apps and digital strategies for businesses across Scotland and the UK.')
ON CONFLICT (key) DO NOTHING;
