-- 이메일 앞부분을 username으로 사용할 때 CHECK 제약(^[a-zA-Z0-9_-]{3,30}$)에
-- 맞지 않는 문자(예: 점, 플러스 등)를 밑줄로 치환한다
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_username TEXT;
  safe_username TEXT;
BEGIN
  raw_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  -- CHECK 제약 허용 문자 외 모두 밑줄로 치환
  safe_username := regexp_replace(raw_username, '[^a-zA-Z0-9_-]', '_', 'g');

  -- 3자 미만이면 뒤에 밑줄 채움
  WHILE length(safe_username) < 3 LOOP
    safe_username := safe_username || '_';
  END LOOP;

  -- 30자 초과 시 자름
  safe_username := left(safe_username, 30);

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    safe_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
