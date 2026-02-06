-- Add 'category' column to 'posts' table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Update existing rows to have a default category if null
UPDATE posts SET category = 'General' WHERE category IS NULL;

-- Create an index for faster filtering by category
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
