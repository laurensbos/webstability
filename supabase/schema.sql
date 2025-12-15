-- Webstability Database Schema
-- Run dit in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE project_status AS ENUM (
  'pending',
  'onboarding', 
  'design',
  'review',
  'revisions',
  'live',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'awaiting_payment',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE user_role AS ENUM (
  'customer',
  'developer',
  'admin'
);

CREATE TYPE subscription_status AS ENUM (
  'pending',
  'active',
  'paused',
  'cancelled',
  'suspended'
);

CREATE TYPE subscription_interval AS ENUM (
  'monthly',
  'yearly'
);

CREATE TYPE feedback_type AS ENUM (
  'text',
  'design',
  'bug',
  'feature'
);

CREATE TYPE feedback_status AS ENUM (
  'new',
  'seen',
  'in_progress',
  'resolved'
);

CREATE TYPE file_category AS ENUM (
  'logo',
  'image',
  'document',
  'other'
);

-- ===========================================
-- TABLES
-- ===========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  metadata JSONB
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  domain TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  package TEXT NOT NULL CHECK (package IN ('starter', 'professional', 'premium')),
  status project_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'unpaid' NOT NULL,
  design_approved_at TIMESTAMPTZ,
  payment_url TEXT,
  subscription_id UUID,
  live_url TEXT,
  notes TEXT,
  metadata JSONB
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  mollie_payment_id TEXT,
  metadata JSONB
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  mollie_subscription_id TEXT UNIQUE,
  mollie_customer_id TEXT,
  status subscription_status DEFAULT 'pending' NOT NULL,
  interval subscription_interval DEFAULT 'monthly' NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  next_payment_date DATE,
  cancelled_at TIMESTAMPTZ,
  metadata JSONB
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type feedback_type DEFAULT 'text' NOT NULL,
  content TEXT NOT NULL,
  status feedback_status DEFAULT 'new' NOT NULL,
  page TEXT,
  element TEXT,
  resolved_at TIMESTAMPTZ,
  metadata JSONB
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'developer')),
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  metadata JSONB
);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  category file_category DEFAULT 'other' NOT NULL,
  metadata JSONB
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_payment_status ON projects(payment_status);
CREATE INDEX idx_projects_email ON projects(email);

CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE INDEX idx_subscriptions_project_id ON subscriptions(project_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_mollie_subscription_id ON subscriptions(mollie_subscription_id);

CREATE INDEX idx_feedback_project_id ON feedback(project_id);
CREATE INDEX idx_feedback_status ON feedback(status);

CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_files_project_id ON files(project_id);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-update updated_at on projects
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Developers/admins can view all users
CREATE POLICY "Developers can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Projects: users can view own, developers can view all
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (true); -- Anyone can create a project (no auth required initially)

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Developers can manage all projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Invoices: users can view own, developers can manage all
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Developers can manage all invoices"
  ON invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Subscriptions: same as invoices
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Developers can manage all subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Feedback: users can manage own project feedback
CREATE POLICY "Users can view own project feedback"
  ON feedback FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert feedback on own projects"
  ON feedback FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()))
  );

CREATE POLICY "Developers can manage all feedback"
  ON feedback FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Chat messages: users can view/send on own projects
CREATE POLICY "Users can view own project messages"
  ON chat_messages FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send messages on own projects"
  ON chat_messages FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()))
  );

CREATE POLICY "Developers can manage all messages"
  ON chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- Files: users can view/upload on own projects
CREATE POLICY "Users can view own project files"
  ON files FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can upload files to own projects"
  ON files FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()))
  );

CREATE POLICY "Developers can manage all files"
  ON files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- ===========================================
-- STORAGE BUCKETS
-- ===========================================

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false);

-- Storage policies
CREATE POLICY "Users can view own project files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload to own projects"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Developers can access all files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'project-files' AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('developer', 'admin')
    )
  );

-- ===========================================
-- SEED DATA (Developer account)
-- ===========================================

-- Voeg developer account toe na het aanmaken van een user via Supabase Auth
-- UPDATE users SET role = 'developer' WHERE email = 'developer@webstability.nl';

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Get project by access code (for unauthenticated access)
CREATE OR REPLACE FUNCTION get_project_by_code(access_code TEXT)
RETURNS SETOF projects AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM projects
  WHERE id::text = access_code
  OR (metadata->>'accessCode')::text = access_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread message count
CREATE OR REPLACE FUNCTION get_unread_count(p_project_id UUID, p_sender TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM chat_messages
    WHERE project_id = p_project_id
    AND sender != p_sender
    AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
