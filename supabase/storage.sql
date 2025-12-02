-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Policy: Anyone can view blog images (public bucket)
CREATE POLICY "Public blog images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Policy: Authenticated users can upload blog images
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can update their uploaded images
CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can delete blog images
CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );
