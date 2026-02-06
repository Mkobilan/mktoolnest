-- Add category column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'GENERAL';

-- Update existing posts to have some variety if possible (optional, but good for demo)
UPDATE posts SET category = 'STRATEGIES' WHERE excerpt ILIKE '%strategy%' OR title ILIKE '%strategy%';
UPDATE posts SET category = 'TIPS' WHERE excerpt ILIKE '%tips%' OR title ILIKE '%tips%';
UPDATE posts SET category = 'GUIDE' WHERE excerpt ILIKE '%guide%' OR title ILIKE '%guide%';
