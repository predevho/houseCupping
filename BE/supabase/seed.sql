-- Test users (inserted directly into Supabase Auth)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'tester1@example.com',
   crypt('password123', gen_salt('bf')), NOW(),
   '{"username": "tester1", "display_name": "테스터1"}'),
  ('00000000-0000-0000-0000-000000000002', 'tester2@example.com',
   crypt('password123', gen_salt('bf')), NOW(),
   '{"username": "tester2", "display_name": "테스터2"}');

-- Sample beans
INSERT INTO public.beans (id, user_id, cafe_name, bean_name, origin, variety, process, roast_level, altitude, farm_name, harvest_year, flavor_descriptors)
VALUES
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   '모모스커피', '예가체프 G1', '에티오피아', 'Heirloom', 'Washed', 'Light',
   2200, 'Kochere Washing Station', 2024,
   ARRAY['블루베리', '자스민', '레몬그라스']),
  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000002',
   '커피리브레', '게이샤 내추럴', '파나마', 'Gesha', 'Natural', 'Light',
   1650, 'Hacienda La Esmeralda', 2024,
   ARRAY['복숭아', '망고', '로즈']);

-- Sample cupping notes
INSERT INTO public.cupping_notes (user_id, bean_id, aroma, acidity, body, memo)
VALUES
  ('00000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000001',
   9, 8, 6, '블루베리 향이 강하게 올라오고 산미가 밝다. 여운이 길게 남는다.'),
  ('00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000002',
   10, 7, 5, '게이샤 특유의 꽃향기가 인상적. 망고 계열의 달콤함.');

-- Sample ratings
INSERT INTO public.bean_ratings (user_id, bean_id, score)
VALUES
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 9.0),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 9.5);
