-- 탈퇴한 사용자의 원두 데이터를 보존하기 위해
-- CASCADE → SET NULL으로 변경하고 user_id를 nullable로 전환한다
ALTER TABLE public.beans DROP CONSTRAINT beans_user_id_fkey;
ALTER TABLE public.beans ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.beans
  ADD CONSTRAINT beans_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
