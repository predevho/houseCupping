# houseCupping — 기초 세팅 현황

## 프로젝트 구조

```
agent-coding/
├── FE/                          # Next.js 15 프론트엔드
├── BE/                          # Supabase 백엔드
├── docs/                        # 내부 문서 (gitignore)
│   ├── CONTEXT.md
│   ├── setup/        → 세팅 문서
│   ├── features/     → 기능별 구현 문서
│   ├── domain/       → 도메인 원칙·규칙
│   ├── architecture/ → 아키텍처 원칙·규칙
│   ├── todo/         → 작업 상태
│   └── logs/         → AI 작업 기록
└── CLAUDE.md                    # AI 작업 규칙 (gitignore)
```

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | ShadCN/ui, DaisyUI |
| 백엔드 | Supabase (PostgreSQL, Auth, RLS) |
| 인증 | Supabase Auth + SSR 쿠키 세션 (`@supabase/ssr`) |
| 테스트 | Jest + Testing Library |

---

## BE — Supabase 마이그레이션 (13개)

| 파일 | 내용 |
|---|---|
| 001 | profiles 테이블, RLS, 자동 생성 트리거 |
| 002 | beans 테이블, RLS, 인덱스 |
| 003 | cupping_notes, bean_ratings 테이블, RLS |
| 004 | likes, comments 테이블, RLS |
| 005 | beans.origin nullable 전환 |
| 006 | beans 삭제 권한 → admin 전용 |
| 007 | cupping_notes에 roast_date 컬럼 추가 |
| 008 | handle_new_user 함수 search_path 보안 설정 |
| 009 | username CHECK 제약 (`^[a-zA-Z0-9_-]{3,30}$`) |
| 010 | profiles UPDATE 컬럼 제한 (username, display_name만) |
| 011 | beans.user_id → ON DELETE SET NULL (탈퇴 시 원두 보존) |
| 012 | username 자동 생성 시 허용 외 문자 `_`로 치환 |
| 013 | profiles.email 컬럼 추가, username 4~16자, display_name NOT NULL 4~12자, 트리거 수정 |

---

## DB 테이블 요약

| 테이블 | 도메인 | 주요 특징 |
|---|---|---|
| profiles | Member | auth.users 연동, 자동 생성 트리거, email 복사 (역조회용) |
| beans | Bean | user_id nullable (탈퇴 시 SET NULL), admin만 삭제 |
| cupping_notes | Cupping | roast_date 포함, 작성자 삭제 가능 |
| bean_ratings | Cupping | 원두당 유저별 1개 (UNIQUE) |
| likes | Social | 노트당 유저별 1개 (UNIQUE) |
| comments | Social | 순수 텍스트, 대댓글 없음 |

---

## FE — 주요 파일

| 파일 | 역할 |
|---|---|
| `src/lib/supabase/client.ts` | 브라우저용 Supabase 클라이언트 |
| `src/lib/supabase/server.ts` | 서버용 Supabase 클라이언트 |
| `src/types/database.ts` | DB 타입 전체 정의 |
| `middleware.ts` | 세션 갱신 + 라우트 보호 (PUBLIC_ROUTES: `['/auth']`) |
| `src/app/(app)/layout.tsx` | 인증된 페이지 공통 레이아웃 (Header 포함) |
| `src/app/(app)/_actions/logout.ts` | 로그아웃 Server Action |
| `src/components/layout/Header.tsx` | 공통 헤더 Server Component |
| `src/components/layout/LogoutButton.tsx` | 로그아웃 버튼 Client Component |
| `src/components/ui/` | ShadCN 컴포넌트 |
| `src/lib/utils.ts` | ShadCN 유틸 (cn 함수) |
| `src/app/globals.css` | Tailwind v4 + ShadCN 테마 + DaisyUI |
| `src/features/member/EditForm.tsx` | 프로필 수정 폼 Client Component |
| `src/features/member/actions.ts` | 프로필 수정 Server Action |
| `src/features/bean/BeanForm.tsx` | 원두 등록 폼 Client Component |
| `src/features/bean/actions.ts` | 원두 등록 Server Action |

---

## 인증 흐름

```
요청 → middleware.ts
  ├─ 세션 갱신 (getUser)
  ├─ 비로그인 + 보호 라우트 → /auth
  └─ 로그인 + 인증 페이지 (/auth) → /
```

| 구분 | 라우트 |
|---|---|
| 보호 라우트 (로그인 필요) | `/beans/new`, `/notes/new`, `/profile` |
| 인증 전용 (로그인 시 차단) | `/auth` |

> 새 보호 라우트 추가 시 `middleware.ts`의 `PROTECTED_ROUTES` 배열에 추가

---

## 도메인별 삭제 정책

| 도메인 | 삭제 주체 | 비고 |
|---|---|---|
| beans | admin만 가능 | 다른 사용자의 커핑 노트 보호 |
| cupping_notes | 작성자 본인 | 삭제 시 likes, comments CASCADE |
| likes / comments | 작성자 본인 | |
| 회원 탈퇴 | — | beans 보존 (SET NULL), 나머지 CASCADE |

---

## UI 원칙

- ShadCN/ui — 인터랙티브 컴포넌트 (버튼, 인풋, 다이얼로그 등)
- DaisyUI — 레이아웃, 뱃지, 카드 등 유틸리티 스타일
- 커스텀 CSS 최소화
- 디자인에 과도한 시간 투자 금지

---

## 구현 완료 기능

| 기능 | 문서 |
|---|---|
| 인증 UI (`/auth` — 로그인·회원가입 탭) | `docs/features/AUTH-IMPLEMENTATION.md` |
| 공통 레이아웃 및 헤더 (`Header`, `LogoutButton`, `logoutAction`) | `docs/features/LAYOUT-IMPLEMENTATION.md` |
| 내 프로필 조회·수정 (`/profile`) | `docs/features/MEMBER-IMPLEMENTATION.md` |
| 타인 프로필 조회 (`/profile/[username]`) | `docs/features/MEMBER-IMPLEMENTATION.md` |
| 원두 등록 (`/beans/new`) | `docs/features/BEAN-IMPLEMENTATION.md` |
| 원두 상세 조회 (`/beans/[id]`) | `docs/features/BEAN-IMPLEMENTATION.md` |

---

## 다음 작업

- [ ] 원두 등록 폼 UI
- [ ] 커핑 노트 작성 폼 UI
