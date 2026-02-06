-- Create site_settings table for hero images and other settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default hero image settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
    ('hero_home', ''),
    ('hero_hubplate', ''),
    ('hero_hangroom', ''),
    ('hero_baybolt', ''),
    ('hero_hugloom', ''),
    ('hero_daylabor', ''),
    ('hero_raidmemegen', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Create RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can read site_settings" ON site_settings
    FOR SELECT USING (true);

-- Only authenticated users can update settings
CREATE POLICY "Authenticated users can update site_settings" ON site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert site_settings" ON site_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
