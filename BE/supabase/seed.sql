-- Test users (inserted directly into Supabase Auth)
-- instance_id: GoTrue filters by this value
-- token columns: must be '' not NULL (GoTrue scans VARCHAR columns as string, not *string)
-- created_at / updated_at: must be non-NULL (GoTrue scans as time.Time, not *time.Time)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_user_meta_data
)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001',
   'authenticated', 'authenticated', 'tester1@example.com',
   crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '', '', '', '',
   '{"username": "tester1", "display_name": "테스터1"}'),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002',
   'authenticated', 'authenticated', 'tester2@example.com',
   crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '', '', '', '',
   '{"username": "tester2", "display_name": "테스터2"}');

-- Required for GoTrue email authentication
INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'tester1@example.com', 'email',
   '{"sub": "00000000-0000-0000-0000-000000000001", "email": "tester1@example.com"}',
   NOW(), NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'tester2@example.com', 'email',
   '{"sub": "00000000-0000-0000-0000-000000000002", "email": "tester2@example.com"}',
   NOW(), NOW(), NOW());

-- Sample beans (OVERRIDING SYSTEM VALUE: explicit IDs 1, 2 for predictable URLs)
INSERT INTO public.beans (id, user_id, cafe_name, bean_name, origin, variety, process, roast_level, altitude, farm_name, harvest_year, flavor_descriptors)
OVERRIDING SYSTEM VALUE
VALUES
  (1, '00000000-0000-0000-0000-000000000001',
   '모모스커피', '예가체프 G1', '에티오피아', 'Heirloom', 'Washed', 'Light',
   2200, 'Kochere Washing Station', 2024,
   ARRAY['블루베리', '자스민', '레몬그라스']),
  (2, '00000000-0000-0000-0000-000000000002',
   '커피리브레', '게이샤 내추럴', '파나마', 'Gesha', 'Natural', 'Light',
   1650, 'Hacienda La Esmeralda', 2024,
   ARRAY['복숭아', '망고', '로즈']);
SELECT setval(pg_get_serial_sequence('public.beans', 'id'), 2);

-- Sample cupping notes
INSERT INTO public.cupping_notes (user_id, bean_id, aroma, acidity, body, memo)
VALUES
  ('00000000-0000-0000-0000-000000000002', 1,
   4.5, 4.0, 3.0, '블루베리 향이 강하게 올라오고 산미가 밝다. 여운이 길게 남는다.'),
  ('00000000-0000-0000-0000-000000000001', 2,
   5.0, 3.5, 2.5, '게이샤 특유의 꽃향기가 인상적. 망고 계열의 달콤함.');

-- Sample ratings
INSERT INTO public.bean_ratings (user_id, bean_id, score)
VALUES
  ('00000000-0000-0000-0000-000000000002', 1, 4.5),
  ('00000000-0000-0000-0000-000000000001', 2, 5.0);
