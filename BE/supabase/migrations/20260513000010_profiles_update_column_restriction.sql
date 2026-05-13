-- authenticated 역할의 profiles 전체 UPDATE 권한을 제거하고
-- username, display_name 컬럼만 허용한다
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (username, display_name) ON public.profiles TO authenticated;
