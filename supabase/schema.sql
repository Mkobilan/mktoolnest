-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('baybolt', 'hugloom', 'daylabor', 'raidmemegen', 'hubplate')),
  published BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX idx_posts_slug ON posts(slug);

-- Create index on topic for filtering
CREATE INDEX idx_posts_topic ON posts(topic);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  TO anon
  USING (published = true);

-- Policy: Authenticated users can do everything
CREATE POLICY "Authenticated users can manage posts"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
