# Database Setup Instructions

## Supabase Configuration

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and Anon Key

### 2. Add Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Tables

Run the SQL file in your Supabase SQL Editor:

**Option 1:** Copy and paste from `supabase/schema.sql`

**Option 2:** Run this SQL directly:

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
  USING (published = true);

-- Policy: Authenticated users can do everything
CREATE POLICY "Authenticated users can manage posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated');

### 4. Create Admin User

In Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User"
3. Email: `matthew.kobilan@gmail.com`
4. Password: `Think400Big!`
5. Click "Create User"

Alternatively, run this SQL:
```sql
-- This creates the user in auth.users
-- You'll need to confirm the email or disable email confirmation in Supabase settings
```

### 5. Disable Public Signups

In Supabase Dashboard:
1. Go to Authentication > Settings
2. Under "Auth Providers", disable "Email" signup (keep login enabled)
3. Or set "Enable email confirmations" to prevent unauthorized signups

## Testing

1. Start the dev server: `npm run dev`
2. Navigate to `/admin/login`
3. Login with the admin credentials
4. Create a test blog post
5. View it on the public site
