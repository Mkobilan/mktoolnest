-- Migration to add 'raidmemegen' to the posts topic constraint

-- 1. Drop the existing constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_topic_check;

-- 2. Add the updated constraint
ALTER TABLE posts ADD CONSTRAINT posts_topic_check CHECK (topic IN ('baybolt', 'hugloom', 'daylabor', 'raidmemegen'));
