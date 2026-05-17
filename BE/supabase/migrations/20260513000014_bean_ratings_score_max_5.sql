-- bean_ratings score 범위를 0.5~5.0으로 변경
-- 기존 데이터 중 범위 초과 행을 5.0으로 보정
UPDATE public.bean_ratings SET score = 5.0 WHERE score > 5.0;

ALTER TABLE public.bean_ratings
  DROP CONSTRAINT IF EXISTS bean_ratings_score_check;

ALTER TABLE public.bean_ratings
  ADD CONSTRAINT bean_ratings_score_check
    CHECK (score >= 0.5 AND score <= 5.0 AND score % 0.5 = 0);
