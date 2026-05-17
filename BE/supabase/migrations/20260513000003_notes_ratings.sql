CREATE TABLE public.cupping_notes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bean_id BIGINT REFERENCES public.beans(id) ON DELETE CASCADE NOT NULL,
  aroma INTEGER NOT NULL CHECK (aroma BETWEEN 1 AND 10),
  acidity INTEGER NOT NULL CHECK (acidity BETWEEN 1 AND 10),
  body INTEGER NOT NULL CHECK (body BETWEEN 1 AND 10),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.cupping_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_all"
  ON public.cupping_notes FOR SELECT USING (true);

CREATE POLICY "notes_insert_authenticated"
  ON public.cupping_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update_own"
  ON public.cupping_notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes_delete_own"
  ON public.cupping_notes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_notes_bean_id ON public.cupping_notes (bean_id);
CREATE INDEX idx_notes_user_id ON public.cupping_notes (user_id);
CREATE INDEX idx_notes_created_at ON public.cupping_notes (created_at DESC);

-- bean_ratings
CREATE TABLE public.bean_ratings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bean_id BIGINT REFERENCES public.beans(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC(3,1) NOT NULL CHECK (score >= 0.5 AND score <= 10.0 AND score % 0.5 = 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, bean_id)
);

ALTER TABLE public.bean_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings_select_all"
  ON public.bean_ratings FOR SELECT USING (true);

CREATE POLICY "ratings_insert_authenticated"
  ON public.bean_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_update_own"
  ON public.bean_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ratings_delete_own"
  ON public.bean_ratings FOR DELETE USING (auth.uid() = user_id);
