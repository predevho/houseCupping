-- cupping_notes aroma/acidity/body를 INTEGER 1~10에서 NUMERIC 0.5~5.0으로 변경
-- 기존 데이터 보정 (1~10 → 0.5~5.0 스케일, 최솟값 0.5 보장)
UPDATE public.cupping_notes
SET
  aroma   = GREATEST(ROUND((aroma   / 2.0) * 2) / 2.0, 0.5),
  acidity = GREATEST(ROUND((acidity / 2.0) * 2) / 2.0, 0.5),
  body    = GREATEST(ROUND((body    / 2.0) * 2) / 2.0, 0.5);

ALTER TABLE public.cupping_notes
  ALTER COLUMN aroma TYPE NUMERIC(3,1) USING aroma::NUMERIC,
  ALTER COLUMN acidity TYPE NUMERIC(3,1) USING acidity::NUMERIC,
  ALTER COLUMN body TYPE NUMERIC(3,1) USING body::NUMERIC;

ALTER TABLE public.cupping_notes
  DROP CONSTRAINT IF EXISTS cupping_notes_aroma_check,
  DROP CONSTRAINT IF EXISTS cupping_notes_acidity_check,
  DROP CONSTRAINT IF EXISTS cupping_notes_body_check;

ALTER TABLE public.cupping_notes
  ADD CONSTRAINT cupping_notes_aroma_check
    CHECK (aroma >= 0.5 AND aroma <= 5.0 AND aroma % 0.5 = 0),
  ADD CONSTRAINT cupping_notes_acidity_check
    CHECK (acidity >= 0.5 AND acidity <= 5.0 AND acidity % 0.5 = 0),
  ADD CONSTRAINT cupping_notes_body_check
    CHECK (body >= 0.5 AND body <= 5.0 AND body % 0.5 = 0);
