-- profiles에 email 컬럼 추가 (username 로그인 시 역조회용)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- username 제약: 3~30자 → 4~16자
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS username_format,
  ADD CONSTRAINT username_format
    CHECK (username ~ '^[a-zA-Z0-9_-]{4,16}$');

-- display_name NOT NULL 설정 전 NULL 값 백필
UPDATE public.profiles SET display_name = username WHERE display_name IS NULL OR display_name = '';

-- display_name NOT NULL 설정
ALTER TABLE public.profiles
  ALTER COLUMN display_name SET NOT NULL;

-- display_name 길이 제약: 4~12자
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS display_name_length,
  ADD CONSTRAINT display_name_length
    CHECK (char_length(display_name) BETWEEN 4 AND 12);

-- handle_new_user 트리거 업데이트
-- email 저장 + 새 제약(4~16, 4~12)에 맞게 sanitize 로직 업데이트
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_username    TEXT;
  safe_username   TEXT;
  raw_display     TEXT;
  safe_display    TEXT;
BEGIN
  raw_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  safe_username := regexp_replace(raw_username, '[^a-zA-Z0-9_-]', '_', 'g');

  WHILE length(safe_username) < 4 LOOP
    safe_username := safe_username || '_';
  END LOOP;

  safe_username := left(safe_username, 16);

  raw_display := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1)
  );

  WHILE length(raw_display) < 4 LOOP
    raw_display := raw_display || '_';
  END LOOP;

  safe_display := left(raw_display, 12);

  INSERT INTO public.profiles (id, username, display_name, email)
  VALUES (NEW.id, safe_username, safe_display, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
