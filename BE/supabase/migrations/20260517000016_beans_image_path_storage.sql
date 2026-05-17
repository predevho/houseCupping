ALTER TABLE public.beans
ADD COLUMN image_path TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'beans',
  'beans',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "beans_images_insert_own_folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'beans'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "beans_images_delete_own_or_admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'beans'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid()::text)
      OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  );
