# Layout & Navigation — 구현 문서

## 개요

Route Group으로 인증/앱 레이아웃을 분리하고, 모던 상단 nav와 데스크톱용 좌측 카테고리 nav를 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `app/(auth)/auth/` | 헤더 없는 인증 페이지 그룹 |
| `app/(app)/layout.tsx` | 상단 nav + 좌측 SideNav 포함 공통 레이아웃 |
| `app/(app)/_actions/logout.ts` | 로그아웃 Server Action |
| `components/layout/Header.tsx` | 헤더 Server Component |
| `components/layout/SideNav.tsx` | 데스크톱 카테고리 nav Client Component |
| `components/layout/LogoutButton.tsx` | 로그아웃 버튼 Client Component |

## 동작

- 모든 앱 페이지(`/`, `/profile`, `/bean` 등)에 Header 자동 적용
- 데스크톱에서는 `홈 / 원두 / 커핑 노트 / 프로필` 좌측 SideNav 표시
- 모바일에서는 SideNav를 숨기고 상단 nav만 유지
- `/auth` 페이지는 헤더 없이 독립 레이아웃 유지
- 로그아웃 클릭 → `supabase.auth.signOut()` → `/auth` redirect
- Header에 로그인 사용자 username 표시 (없으면 '프로필' fallback)
- signOut이 throw해도 `/auth`로 redirect 보장 (try/catch)
