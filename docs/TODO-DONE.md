# TODO-DONE

## 완료된 작업

- [x] Next.js 15 프로젝트 초기화 (TypeScript, Tailwind CSS v4, Jest, Testing Library)
- [x] Supabase CLI 프로젝트 초기화 (`BE/supabase/`)
- [x] DB 마이그레이션 작성
  - `20260513000001_profiles.sql` : profiles 테이블, RLS, 신규 유저 자동 프로필 생성 트리거
  - `20260513000002_beans.sql` : beans 테이블, RLS, 인덱스
  - `20260513000003_notes_ratings.sql` : cupping_notes, bean_ratings 테이블, RLS, 인덱스
  - `20260513000004_likes_comments.sql` : likes, comments 테이블, RLS, 인덱스
- [x] Supabase seed.sql 작성
- [x] TypeScript DB 타입 정의 (`FE/src/types/database.ts`)
- [x] Supabase 클라이언트 설정 및 auth redirect URL 수정
- [x] 인증 미들웨어 구현 (`FE/middleware.ts` — SSR 쿠키 세션 갱신)
- [x] 프로젝트 문서화 초기 작성 (CLAUDE.md 기준 전체 docs 구성)
- [x] Supabase 클라이언트 유틸 분리 (`FE/src/lib/supabase/client.ts`, `server.ts`)
- [x] 보안 이슈 처리
  - `handle_new_user` SECURITY DEFINER search_path 설정 (migration 008)
  - username CHECK 제약 추가 (migration 009)
  - profiles UPDATE 컬럼 제한 (migration 010)
  - beans 탈퇴 시 SET NULL 전환 (migration 011)
- [x] 미들웨어 인증 보호 라우트 처리 (PUBLIC_ROUTES / PROTECTED_ROUTES)
- [x] DaisyUI, ShadCN/ui 설치 및 설정 완료
