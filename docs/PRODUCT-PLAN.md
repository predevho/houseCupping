# houseCupping — 서비스 기획안

| 항목 | 내용 |
|------|------|
| 문서 버전 | v2.0 |
| 작성일 | 2026-05-14 |
| 작성 기준 | FOUNDATION-SETUP.md, ARCHITECTURE-CONSTITUTION.md, DOMAIN-\*.md |
| 서비스명 | houseCupping |

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [MVP 범위](#2-mvp-범위)
3. [주요 도메인](#3-주요-도메인)
4. [보안 정책](#4-보안-정책)
5. [기술 스택](#5-기술-스택)
6. [화면 구성](#6-화면-구성)
7. [아키텍처 원칙](#7-아키텍처-원칙)
8. [작업 우선순위](#8-작업-우선순위)

---

## 1. 서비스 개요

houseCupping은 커피 커핑 경험을 기록하고 공유하는 웹 서비스다.

사용자는 카페에서 접한 원두를 등록하고, 해당 원두에 대한 커핑 노트를 작성한다.
다른 사용자의 커핑 노트를 자유롭게 열람할 수 있으며, 좋아요와 댓글로 반응할 수 있다.

---

## 2. MVP 범위

### 포함 기능

| 도메인 | 기능 | 비고 |
|--------|------|------|
| Auth | 회원가입 / 로그인 / 로그아웃 | username 기반 인증 |
| Member | 프로필 조회 / 수정 | 내 정보, 타인 프로필 |
| Bean | 원두 등록 / 목록 / 상세 | 카페명·원두명 필수, 나머지 선택 |
| Cupping | 커핑 노트 작성 / 목록 / 상세 | 커핑 기록 + 원두 평점 |
| Social | 좋아요 / 댓글 | 커핑 노트 중심 |

### 제외 항목 (현재 스코프 외)

- 팔로우 / 팔로워
- 대댓글 (flat 단일 댓글 구조만 지원)
- 원두 검색 고도화 (기본 목록/필터만)
- 관리자 페이지
- 알림 기능
- 소셜 로그인 (이메일+패스워드만 지원)

---

## 3. 주요 도메인

### 3-1. Auth (인증)

**개요**

인증 전반은 Supabase Auth에 위임한다. 직접 구현하는 영역은 UI 레이어와 Server Action뿐이다.

**인증 방식**

- 로그인: username 기반 → `profiles.email` 역조회 → `signInWithPassword`
- 회원가입: username 중복 체크 → `auth.signUp` → `profiles` 자동 생성 (DB 트리거)
- 세션: 서버사이드 SSR 쿠키 (`@supabase/ssr`)

**인증 흐름**

```
회원가입  username 중복 체크 → signUp(email, password, {username, display_name}) → / 리다이렉트
로그인    username → profiles.email 역조회 → signInWithPassword → / 리다이렉트
로그아웃  signOut() → /auth 리다이렉트
세션 갱신 모든 요청에서 middleware.ts가 getUser() 호출
```

**UI 구조** (`FE/src/app/auth/`)

| 파일 | 역할 |
|------|------|
| `page.tsx` | Server Component. 로그인 상태면 `/` 리다이렉트 |
| `AuthTabs.tsx` | Client Component. 로그인/회원가입 탭 전환 |
| `LoginForm.tsx` | Client Component. `useActionState` + `loginAction` |
| `SignupForm.tsx` | Client Component. `useActionState` + `signupAction` |
| `actions.ts` | Server Actions. `loginAction`, `signupAction` |

**구현 상태**: 완료 (테스트 16/16 PASS)

---

### 3-2. Member (회원)

**개요**

회원의 공개 정체성을 관리하는 도메인. 인증 자체는 Auth 도메인에 위임한다.

**핵심 원칙**

- `profiles` 레코드는 회원가입 시 DB 트리거로 자동 생성된다 (FE에서 별도 생성 금지)
- `email`은 username 기반 로그인 역조회 목적으로만 `profiles`에 복사한다
- 그 외 민감 정보는 `auth.users`에만 저장한다

**DB 스키마**

```sql
profiles (
  id            UUID  REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT  UNIQUE NOT NULL,   -- 4~16자, ^[a-zA-Z0-9_-]+$
  display_name  TEXT  NOT NULL,          -- 4~12자
  email         TEXT,                    -- username 로그인 역조회용 (수정 불가)
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

**유효성 규칙**

| 필드 | 허용 문자 | 길이 | DB 제약 |
|------|-----------|------|---------|
| username | 영문, 숫자, `_`, `-` | 4~16자 | `CHECK (username ~ '^[a-zA-Z0-9_-]{4,16}$')` |
| display_name | 모든 문자 | 4~12자 | `CHECK (char_length(display_name) BETWEEN 4 AND 12)` |

**수정 가능 컬럼**: `username`, `display_name`만 허용 (`id`, `email`, `created_at` 변경 불가)

**프로필 페이지 구성**

| 페이지 | 경로 | 표시 항목 | 수정 가능 |
|--------|------|-----------|-----------|
| 내 프로필 | `/profile` | username, display_name, 가입일, 내가 작성한 커핑 노트 목록, 내가 등록한 원두 목록 | username, display_name |
| 타인 프로필 | `/profile/[username]` | username, display_name, 가입일, 해당 사용자의 커핑 노트 목록 | 불가 |

- 내 프로필에서만 수정 폼이 노출된다
- 타인 프로필은 공개 정보만 표시하며 수정 UI를 제공하지 않는다
- 커핑 노트 목록은 최신순으로 표시한다

**회원 탈퇴 처리**

| 대상 | 처리 방식 |
|------|-----------|
| `profiles` | CASCADE 삭제 |
| `cupping_notes`, `bean_ratings`, `likes`, `comments` | CASCADE 삭제 |
| `beans` | `user_id` → NULL 보존 (공유 자산) |

---

### 3-3. Bean (원두)

**개요**

사용자가 직접 등록하는 원두 정보 도메인. 카페 단위로 관리된다.

**핵심 원칙**

- `cafe_name`, `bean_name`은 필수 입력
- 산지, 품종, 프로세스 등 세부 정보는 선택 입력 (스페셜티 업체마다 제공 수준이 다름)
- 동일한 원두라도 카페가 다르면 별개의 레코드로 관리한다
- 원두 삭제는 admin만 가능 (다른 사용자의 커핑 노트 보호 목적)
- admin이 원두를 삭제하면 연결된 커핑 노트도 CASCADE 삭제된다 (의도된 동작)
- 회원 탈퇴 시 `user_id`는 NULL 처리되고 원두 레코드는 보존된다

**DB 스키마**

```sql
beans (
  id                UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID     REFERENCES public.profiles(id) ON DELETE SET NULL,  -- nullable
  cafe_name         TEXT     NOT NULL,
  bean_name         TEXT     NOT NULL,
  origin            TEXT,                     -- 원산지
  variety           TEXT,                     -- 품종 (예: Gesha, Bourbon)
  process           TEXT,                     -- 가공 방식 (예: Washed, Natural)
  roast_level       TEXT,                     -- 로스팅 정도 (예: Light, Medium, Dark)
  altitude          INTEGER,                  -- 재배 고도 (미터)
  farm_name         TEXT,                     -- 농장명
  harvest_year      INTEGER,                  -- 수확 연도
  flavor_descriptors TEXT[],                  -- 커핑 설명 태그 배열
  roastery_memo     TEXT,                     -- 로스터리 메모
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

---

### 3-4. Cupping (커핑)

**개요**

원두에 대한 커핑 노트와 평점을 관리하는 도메인.
커핑 노트는 커핑 항목별 기록(`aroma`, `acidity`, `body`)과 원두 종합 평점(`bean_ratings`)으로 분리 저장된다.

**핵심 원칙**

- 커핑 노트는 원두(bean)에 연결된 커핑 경험 기록이다
- **한 유저가 동일한 원두에 여러 개의 커핑 노트를 작성할 수 있다** (로스팅 일자·시음 시점이 다를 수 있으므로 제한하지 않는다)
- 커핑 노트 생성 시 원두 등록을 함께 진행한다
- 동일한 원두라도 로스팅 일자(`roast_date`)가 다르면 다른 경험이므로 함께 기록한다
- 향(aroma), 산미(acidity), 바디(body)를 각각 0.5~5.0 (0.5 단위)으로 평가하고, 자유 메모를 남길 수 있다
- 원두 종합 평점(`bean_ratings`)과 커핑 노트는 별도 테이블로 분리 저장한다
- 종합 평점은 원두당 유저별 1개만 허용된다 (UNIQUE 제약, upsert로 처리)
- 모든 커핑 데이터는 공개 (비인증 사용자도 열람 가능)
- 작성자 본인만 삭제 가능하며, 삭제 시 `likes`와 `comments`가 CASCADE 삭제된다

**DB 스키마**

```sql
cupping_notes (
  id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bean_id    UUID     NOT NULL REFERENCES public.beans(id) ON DELETE CASCADE,
  roast_date DATE,
  aroma      NUMERIC(2,1) NOT NULL CHECK (aroma >= 0.5 AND aroma <= 5.0 AND aroma % 0.5 = 0),
  acidity    NUMERIC(2,1) NOT NULL CHECK (acidity >= 0.5 AND acidity <= 5.0 AND acidity % 0.5 = 0),
  body       NUMERIC(2,1) NOT NULL CHECK (body >= 0.5 AND body <= 5.0 AND body % 0.5 = 0),
  memo       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)

bean_ratings (
  id         UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID       NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bean_id    UUID       NOT NULL REFERENCES public.beans(id) ON DELETE CASCADE,
  score      NUMERIC(2,1) NOT NULL CHECK (score >= 0.5 AND score <= 5.0 AND score % 0.5 = 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, bean_id)   -- 원두당 유저별 1개
)
```

**점수 유효성**

| 필드 | 타입 | 범위 | 단위 |
|------|------|------|------|
| aroma | NUMERIC(2,1) | 0.5~5.0 | 0.5 단위 |
| acidity | NUMERIC(2,1) | 0.5~5.0 | 0.5 단위 |
| body | NUMERIC(2,1) | 0.5~5.0 | 0.5 단위 |
| score (bean_ratings) | NUMERIC(2,1) | 0.5~5.0 | 0.5 단위 |

---

### 3-5. Social (소셜)

**개요**

커핑 노트를 중심으로 한 사용자 간 반응 도메인.

**핵심 원칙**

- 소셜 기능(좋아요, 댓글)은 커핑 노트에만 연결된다
- 좋아요는 노트당 유저별 1회만 가능하다 (중복 불가)
- 댓글은 순수 텍스트 기반이며 대댓글을 지원하지 않는다 (flat 구조)
- 좋아요·댓글은 작성자 본인만 삭제할 수 있다

**DB 스키마**

```sql
likes (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID  NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_id    UUID  NOT NULL REFERENCES public.cupping_notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, note_id)   -- 노트당 유저별 1개
)

comments (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID  NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_id    UUID  NOT NULL REFERENCES public.cupping_notes(id) ON DELETE CASCADE,
  content    TEXT  NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

---

## 4. 보안 정책

### 4-1. 접근 제어

| 구분 | 대상 기능 | 적용 레이어 |
|------|-----------|-------------|
| 공개 (비인증 가능) | 원두 목록/상세, 커핑 노트 목록/상세, 좋아요 수, 댓글 조회 | RLS SELECT |
| 로그인 필요 | 원두 등록, 커핑 노트 작성, 좋아요, 댓글 작성, 프로필 수정 | 미들웨어 + RLS |
| admin 전용 | 원두 삭제 | RLS DELETE |

**미들웨어 세션 보안**

- 모든 요청에서 `middleware.ts`가 `getUser()`를 호출해 세션을 갱신한다
- 보호 라우트 진입 시 비로그인이면 `/auth`로 리다이렉트
- `/auth` 진입 시 로그인 상태면 `/`로 리다이렉트
- 라우트 보호는 미들웨어와 Server Action 양쪽에서 이중 검증한다 (미들웨어 단독 의존 금지)
- **자동 로그아웃**: 마지막 활동으로부터 30분 이내 요청이 없으면 세션을 만료하고 자동 로그아웃 처리한다. 로그아웃 후 `/auth`로 리다이렉트한다

---

### 4-2. RLS (Row Level Security) 정책

모든 테이블에 RLS를 활성화하여 DB 레벨에서 접근을 통제한다.

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| profiles | 누구나 | 본인 (`auth.uid() = id`) | 본인 | — |
| beans | 누구나 | 로그인 사용자 | 본인 | admin만 |
| cupping_notes | 누구나 | 로그인 사용자 | 본인 | 본인 |
| bean_ratings | 누구나 | 로그인 사용자 | 본인 | 본인 |
| likes | 누구나 | 로그인 사용자 | — | 본인 |
| comments | 누구나 | 로그인 사용자 | 본인 | 본인 |

> 정책 명명 규칙: `{테이블명}_{action}_{범위}` (예: `beans_delete_admin`, `comments_update_own`)

---

### 4-3. 권한 레벨

| 권한 | 설명 | 구현 방식 |
|------|------|-----------|
| 비인증 | 공개 데이터 조회만 가능 | RLS SELECT USING (true) |
| 일반 사용자 | 로그인 후 본인 리소스 CRUD | `auth.uid()` 비교 |
| admin | 원두 삭제 가능 | JWT `app_metadata.role = 'admin'` |

- admin 권한은 Supabase `app_metadata`에 서버 측에서만 부여한다
- 클라이언트에서 admin 권한을 직접 부여하거나 판단하지 않는다

---

### 4-4. Supabase 키 관리

| 키 | 사용 위치 | 클라이언트 노출 |
|----|-----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저 / 서버 | 허용 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 브라우저 클라이언트 | 허용 (RLS로 보호) |
| `service_role key` | 서버 사이드 전용 | **절대 금지** |

- `createBrowserClient`에는 anon key만 사용한다
- service_role key가 필요한 경우 Edge Function 또는 Server Action 내부에서만 사용한다

---

### 4-5. 삭제 정책

| 대상 | 삭제 주체 | 연쇄 처리 |
|------|-----------|-----------|
| beans | admin만 | cupping_notes CASCADE 삭제 (의도된 동작) |
| cupping_notes | 작성자 본인 | likes, comments CASCADE 삭제 |
| likes | 작성자 본인 | — |
| comments | 작성자 본인 | — |
| 회원 탈퇴 | — | beans: user_id SET NULL 보존 / 나머지 전체: CASCADE 삭제 |

---

### 4-6. 데이터 유효성 정책

| 필드 | 규칙 | 적용 위치 |
|------|------|-----------|
| username | 4~16자, 영문/숫자/`_`/`-` 허용 | DB CHECK + Server Action |
| display_name | 4~12자 | DB CHECK + Server Action |
| profiles 수정 가능 컬럼 | `username`, `display_name`만 허용 | 컬럼 레벨 권한 + Server Action |
| bean_ratings.score | 0.5~5.0, 0.5 단위 (NUMERIC) | DB CHECK |
| cupping_notes.aroma / acidity / body | 0.5~5.0, 0.5 단위 (NUMERIC) | DB CHECK |
| comments.content | 빈 문자열 불가 | DB NOT NULL + Server Action |
| 원두 평점 중복 | 유저별 1개 | DB UNIQUE(user_id, bean_id) |
| 좋아요 중복 | 유저별 1개 | DB UNIQUE(user_id, note_id) |

---

### 4-7. 에러 처리 정책

- Supabase 내부 에러 메시지를 클라이언트에 그대로 노출하지 않는다
- 사용자에게 표시하는 에러 메시지는 한국어로 작성한다
- Server Action은 `{ data, error }` 구조로 반환하고, error가 존재하면 반드시 처리한다
- null / undefined 데이터를 그대로 렌더링하지 않는다

---

## 5. 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | Server / Client Component 분리 |
| 언어 | TypeScript | 엄격 모드 |
| 스타일 | Tailwind CSS v4 | |
| UI 컴포넌트 | ShadCN/ui, DaisyUI | 직접 스타일 최소화 |
| 백엔드 | Supabase (PostgreSQL + RLS) | |
| 인증 | Supabase Auth + SSR 쿠키 | `@supabase/ssr` |
| 테스트 | Jest + Testing Library | TDD 기본 접근 |

---

## 6. 화면 구성

| 경로 | 화면명 | 주요 기능 | 인증 |
|------|--------|-----------|------|
| `/` | 홈 | 커핑 노트 피드 | 불필요 |
| `/auth` | 인증 | 로그인 / 회원가입 탭 전환 | 비로그인만 |
| `/beans` | 원두 목록 | 목록 조회, 검색/필터 | 불필요 |
| `/beans/new` | 원두 등록 | 원두 등록 폼 | **필요** |
| `/beans/[id]` | 원두 상세 | 원두 정보, 커핑 노트 목록, 평점 | 불필요 |
| `/notes/new` | 커핑 노트 작성 | 커핑 노트 작성 폼 | **필요** |
| `/notes/[id]` | 커핑 노트 상세 | 커핑 내용, 좋아요, 댓글 | 불필요 |
| `/profile` | 내 프로필 | 내 정보 조회/수정 | **필요** |
| `/profile/[username]` | 타인 프로필 | 타인 정보 조회 | 불필요 |

---

## 7. 아키텍처 원칙

| 원칙 | 내용 |
|------|------|
| 도메인 중심 설계 | 도메인 문서 없이 해당 도메인 코드 작성 금지. 신규 도메인은 CONSTITUTION + STATUTE 먼저 작성 |
| 서버/클라이언트 경계 | 데이터 패칭은 Server Component, 인터랙션은 Client Component에서만 처리 |
| Supabase 클라이언트 | Server → `createServerClient`, Browser → `createBrowserClient` |
| 보안 우선 | 모든 테이블 RLS 활성화. 클라이언트에는 anon key만 사용 |
| UI 원칙 | ShadCN/DaisyUI 우선 활용. 직접 스타일 작성 최소화 |
| TDD | 비즈니스 로직은 UI와 분리하여 단위 테스트 작성. 모든 테스트/린트 통과 후 작업 완료 |

---

## 8. 작업 우선순위

### Phase 1 — Auth 도메인 (완료)

| # | 작업 | 상태 |
|---|------|------|
| 1 | 프로젝트 기초 세팅 (Next.js, Supabase, 미들웨어) | 완료 |
| 2 | DB 마이그레이션 전체 작성 (13개) | 완료 |
| 3 | 인증 UI 구현 (`/auth` — 로그인/회원가입 탭 전환) | 완료 |

### Phase 2 — Member 도메인

| # | 작업 | 상태 |
|---|------|------|
| 4 | 공통 레이아웃 및 내비게이션 UI | 대기 |
| 5 | 로그아웃 버튼 (네비게이션) | 대기 |
| 6 | 내 프로필 페이지 (`/profile`) | 대기 |
| 7 | 타인 프로필 페이지 (`/profile/[username]`) | 대기 |

### Phase 3 — Bean 도메인

| # | 작업 | 상태 |
|---|------|------|
| 8 | 원두 등록 폼 UI (`/beans/new`) | 대기 |
| 9 | 원두 목록 페이지 (`/beans`) | 대기 |
| 10 | 원두 상세 페이지 (`/beans/[id]`) | 대기 |

### Phase 4 — Cupping 도메인

| # | 작업 | 상태 |
|---|------|------|
| 11 | 커핑 노트 작성 폼 UI (`/notes/new`) | 대기 |
| 12 | 홈 피드 — 커핑 노트 목록 (`/`) | 대기 |
| 13 | 커핑 노트 상세 페이지 (`/notes/[id]`) | 대기 |
| 14 | 원두 평점 (bean_ratings) | 대기 |

### Phase 5 — Social 도메인

| # | 작업 | 상태 |
|---|------|------|
| 15 | 좋아요 기능 | 대기 |
| 16 | 댓글 기능 | 대기 |
