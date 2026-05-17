# 인증 UI 구현 현황

- **구현일**: 2026-05-13
- **관련 도메인**: Member
- **라우트**: `/auth`, `/auth/verify-email`

---

## 개요

`/auth` 페이지 하나에서 로그인과 회원가입을 탭 전환으로 처리한다.
로그인은 **아이디(username) 기반**으로 `profiles` 테이블에서 email을 역조회한 뒤 Supabase `signInWithPassword`를 호출한다.
`next` query string이 있으면 로그인/회원가입 성공 후 원래 보던 페이지로 복귀한다.
이메일 인증이 활성화된 환경에서 회원가입 직후 세션이 없으면 `/auth/verify-email`로 이동해 메일 확인을 안내한다.

---

## 아키텍처

```
/auth (page.tsx — Server Component)
  └─ 인증 체크: supabase.auth.getUser()
       ├─ 로그인 상태 → redirect('/')
       └─ 미인증 → <AuthTabs next={searchParams.next} /> 렌더링

AuthTabs (Client Component)
  ├─ tab === 'login'  → <LoginForm next={next} />
  └─ tab === 'signup' → <SignupForm next={next} />

LoginForm / SignupForm (Client Component)
  └─ useActionState(loginAction | signupAction, null)
       └─ actions.ts ('use server')
            ├─ loginAction  → profiles 역조회 → signInWithPassword → redirect(next || '/')
            └─ signupAction → username 중복 체크 → signUp
                ├─ session 있음  → redirect(next || '/')
                └─ session 없음 → redirect('/auth/verify-email')
```

---

## 구현 파일

| 파일 | 역할 |
|------|------|
| `FE/src/app/auth/page.tsx` | Server Component. 인증 체크 후 미인증 시 폼 레이아웃 렌더링 |
| `FE/src/app/auth/AuthTabs.tsx` | 탭 상태 관리 (`useState<'login' \| 'signup'>`) |
| `FE/src/app/auth/LoginForm.tsx` | 아이디·비밀번호 입력 폼, `useActionState` + `loginAction` |
| `FE/src/app/auth/SignupForm.tsx` | 5개 필드 회원가입 폼, `useActionState` + `signupAction` |
| `FE/src/app/auth/verify-email/page.tsx` | 이메일 인증 대기 안내 페이지 |
| `FE/src/app/auth/actions.ts` | `'use server'` — `loginAction`, `signupAction` |
| `FE/src/app/auth/__tests__/actions.test.ts` | Server Actions 단위 테스트 (11개) |
| `FE/src/app/auth/verify-email/__tests__/page.test.tsx` | 이메일 인증 안내 페이지 테스트 |
| `FE/src/app/auth/__tests__/AuthTabs.test.tsx` | 탭 전환 동작 테스트 (3개) |
| `FE/src/app/auth/__tests__/LoginForm.test.tsx` | 렌더링·에러·pending 테스트 (3개) |
| `FE/src/app/auth/__tests__/SignupForm.test.tsx` | 렌더링·에러·비밀번호 확인 테스트 (4개) |

---

## DB 변경사항 (Migration 13)

**파일**: `BE/supabase/migrations/20260513000013_auth_login_by_username.sql`

| 변경 내용 | 상세 |
|-----------|------|
| `profiles.email` 컬럼 추가 | `TEXT` — username 로그인 역조회용 |
| `username` 길이 제약 변경 | `3~30자` → `4~16자` |
| `display_name` NOT NULL 설정 | 기존 nullable → NOT NULL |
| `display_name` 길이 제약 추가 | `4~12자` |
| `handle_new_user` 트리거 업데이트 | email 저장, 새 제약에 맞춰 sanitize 로직 수정 |

---

## Server Actions (`actions.ts`)

### `loginAction`

```
FormData(username, password, next?)
  → 빈 값 체크 → 에러 반환
  → supabase.from('profiles').select('email').eq('username', username).single()
      → profile 없음 → 에러 반환 ('아이디 또는 비밀번호가 올바르지 않습니다')
  → supabase.auth.signInWithPassword({ email: profile.email, password })
      → 실패 → 에러 반환 (동일 메시지 — username 열거 방지)
      → 성공 → sanitizeNextPath(next)
          → '/...' 형태의 앱 내부 경로면 그대로 사용
          → '//' 또는 외부 URL/상대경로면 '/' fallback
      → redirect(next 또는 '/')
```

### `signupAction`

```
FormData(username, display_name, email, password, next?)
  → 빈 값 체크 → 에러 반환
  → supabase.from('profiles').select('id').eq('username', username).single()
      → 중복 → { errors: { username: '이미 사용 중인 아이디입니다' } }
  → supabase.auth.signUp({ email, password, options: { data: { username, display_name } } })
      → 'already registered' → { errors: { email: '이미 가입된 이메일입니다' } }
      → 기타 에러 → { errors: { general: '잠시 후 다시 시도해주세요' } }
      → 성공 → sanitizeNextPath(next)
      → data.session 없음 → `/auth/verify-email` (next가 있으면 query 유지)
      → data.session 있음 → redirect(next 또는 '/')
```

### 상태 타입

```ts
type LoginState  = { error?: string } | null
type SignupState = { errors?: { username?: string; email?: string; general?: string } } | null
```

---

## 폼 필드 스펙

### LoginForm

| 필드 | name | type | 검증 |
|------|------|------|------|
| 아이디 | `username` | text | required |
| 비밀번호 | `password` | password | required |

### SignupForm

| 필드 | name | type | 검증 |
|------|------|------|------|
| 아이디 | `username` | text | required, 4~16자, `^[a-zA-Z0-9_-]+$` (DB 제약) |
| 닉네임 | `display_name` | text | required, 4~12자 (DB 제약) |
| 이메일 | `email` | email | required |
| 비밀번호 | `password` | password | required |
| 비밀번호 확인 | `passwordConfirm` | password | 클라이언트 일치 검증 |

---

## 미들웨어 변경

```ts
// 변경 전
const PUBLIC_ROUTES = ['/login', '/signup']
url.pathname = '/login'

// 변경 후
const PUBLIC_ROUTES = ['/auth']
url.pathname = '/auth'
```

---

## 테스트 현황

| 파일 | 테스트 수 | 커버리지 |
|------|-----------|----------|
| `actions.test.ts` | 11 | loginAction 5케이스, signupAction 6케이스 |
| `verify-email/page.test.tsx` | 1 | 안내 문구, 로그인 링크 |
| `AuthTabs.test.tsx` | 5 | 초기 상태, 탭 전환, `next` 전달 |
| `LoginForm.test.tsx` | 4 | 렌더링, 에러 표시, pending, hidden `next` |
| `SignupForm.test.tsx` | 5 | 필드 렌더링, username 에러, 비밀번호 불일치, pending, hidden `next` |
| **합계** | **26** | **전체 PASS** |

---

## 알려진 제약 / 이슈

| 항목 | 내용 |
|------|------|
| 이메일 인증 설정 | 로컬 기본값은 `BE/supabase/config.toml`의 `auth.email.enable_confirmations = false` 유지. 배포에서 활성화해도 프론트는 `session` 유무 기준으로 대응 가능 |
| 비밀번호 확인 | React 19 + JSDOM에서 `fireEvent.click`이 `onSubmit`을 트리거하지 않는 이슈로, 버튼 `onClick`에 별도 검증 로직 존재 (`handleButtonClick`) |
| Supabase 타입 추론 | `.single()` 반환 타입이 `never`로 추론되는 이슈로 수동 타입 단언 사용: `as { email: string \| null } \| null` |

---

## UI 구조

```
┌─────────────────────────────────────────────────┐  h-[640px]
│  ☕ 브랜딩 패널 (45%)  │  AuthTabs (55%)         │
│  gradient             │  [로그인] [회원가입]      │
│  HOUSE CUPPING        │  ─────────────────────── │
│  TASTE·RECORD·SHARE   │  LoginForm / SignupForm  │
└─────────────────────────────────────────────────┘
```

- 카드 고정 높이 `h-[640px]` — 탭 전환 시 크기 변동 없음
- `overflow-y-auto` — 폼 내용 초과 시 스크롤

---
