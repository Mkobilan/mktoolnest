-- Add external_link column for blog directory functionality
-- This stores the URL to the original blog post on the app's website

ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Update the topic constraint to include 'hangroom'
-- First drop the existing constraint, then add the new one

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_topic_check;

ALTER TABLE posts ADD CONSTRAINT posts_topic_check 
  CHECK (topic IN ('baybolt', 'hugloom', 'daylabor', 'raidmemegen', 'hubplate', 'hangroom'));
