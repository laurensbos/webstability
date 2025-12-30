-- Migration: Add language preference to users and projects
-- Run this in Supabase SQL Editor to add language support

-- Add preferred_language to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'nl' 
CHECK (preferred_language IN ('nl', 'en'));

-- Add preferred_language to projects table  
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'nl' 
CHECK (preferred_language IN ('nl', 'en'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_preferred_language ON users(preferred_language);
CREATE INDEX IF NOT EXISTS idx_projects_preferred_language ON projects(preferred_language);

-- Update existing records to have Dutch as default
UPDATE users SET preferred_language = 'nl' WHERE preferred_language IS NULL;
UPDATE projects SET preferred_language = 'nl' WHERE preferred_language IS NULL;
