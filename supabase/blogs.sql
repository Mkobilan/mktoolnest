-- blogs table for MK Tool Nest Blog Directory
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT DEFAULT 'Admin',
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    external_link TEXT,  -- Link to original blog post on external site
    source_app TEXT,     -- Which app the blog is from (e.g., 'BayBolt', 'Hangroom')
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Public can read published blogs"
    ON public.blogs
    FOR SELECT
    USING (status = 'published');

-- Policy: Authenticated users can manage all blogs (for admin)
CREATE POLICY "Authenticated users can manage blogs"
    ON public.blogs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Index for faster slug lookups
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON public.blogs(slug);

-- Index for faster category filtering
CREATE INDEX IF NOT EXISTS blogs_category_idx ON public.blogs(category);

-- Trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_updated_at_trigger
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blogs_updated_at();
