DROP POLICY IF EXISTS "beans_delete_own" ON public.beans;

CREATE POLICY "beans_delete_admin"
  ON public.beans FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
