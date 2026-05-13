CREATE TABLE public.beans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cafe_name TEXT NOT NULL,
  bean_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT,
  process TEXT,
  roast_level TEXT,
  altitude INTEGER,
  farm_name TEXT,
  harvest_year INTEGER,
  flavor_descriptors TEXT[],
  roastery_memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.beans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "beans_select_all"
  ON public.beans FOR SELECT USING (true);

CREATE POLICY "beans_insert_authenticated"
  ON public.beans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "beans_update_own"
  ON public.beans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "beans_delete_own"
  ON public.beans FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_beans_cafe_name ON public.beans (cafe_name);
CREATE INDEX idx_beans_user_id ON public.beans (user_id);
