# DOMAIN-MEMBER-STATUTE

## 회원 도메인 구현 규칙

### DB 스키마

```sql
profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,          -- 4~16자, ^[a-zA-Z0-9_-]+$
  display_name TEXT NOT NULL,                 -- 4~12자
  email        TEXT,                          -- username 로그인 역조회용
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

### 자동 프로필 생성 트리거

- `on_auth_user_created` 트리거가 `auth.users` INSERT 후 자동으로 `profiles` 레코드를 생성한다.
- `username`: `raw_user_meta_data.username` → 없으면 이메일 앞부분, 제약에 맞게 sanitize (4~16자)
- `display_name`: `raw_user_meta_data.display_name` → 없으면 이메일 앞부분 (4~12자)
- `email`: `auth.users.email` 복사 (username 로그인 역조회용)
- 트리거 함수는 `SECURITY DEFINER SET search_path = public, pg_temp` 로 실행한다.

### RLS 정책

| 정책명 | 대상 | 조건 |
|---|---|---|
| profiles_select_all | SELECT | 누구나 |
| profiles_insert_own | INSERT | `auth.uid() = id` |
| profiles_update_own | UPDATE | `auth.uid() = id` |

### username / display_name 유효성 규칙

| 필드 | 허용 문자 | 길이 | DB 제약 |
|---|---|---|---|
| username | 영문, 숫자, `_`, `-` | 4~16자 | `CHECK (username ~ '^[a-zA-Z0-9_-]{4,16}$')` |
| display_name | 모든 문자 | 4~12자 | `CHECK (char_length(display_name) BETWEEN 4 AND 12)` |

### UPDATE 컬럼 제한

- `authenticated` 역할은 `username`, `display_name`만 수정 가능하다.
- `id`, `email`, `created_at`은 컬럼 레벨 권한으로 변경이 차단된다.

### 인증 흐름

1. **회원가입**: `signupAction` Server Action
   - username 중복 체크 (`profiles.username`)
   - `supabase.auth.signUp({ email, password, options: { data: { username, display_name } } })`
   - 성공 시 `/` 리다이렉트
2. **로그인**: `loginAction` Server Action (username 기반)
   - `profiles.email` 역조회 (username → email)
   - `supabase.auth.signInWithPassword({ email, password })`
   - 성공 시 `/` 리다이렉트
3. **로그아웃**: `supabase.auth.signOut()`
4. **현재 유저 조회**: Server Component에서 `supabase.auth.getUser()` 사용

### 인증 보호 라우트

미들웨어(`middleware.ts`)에서 두 가지를 처리한다.

- **보호된 라우트** (`/beans/new`, `/notes/new`, `/profile`): 비로그인 시 `/auth` 로 리다이렉트
- **인증 전용 라우트** (`/auth`): 로그인 상태면 `/` 로 리다이렉트

새로운 보호 라우트 추가 시 `middleware.ts`의 `PROTECTED_ROUTES` 배열에 추가한다.

### 인증 UI 구조 (`FE/src/app/auth/`)

| 파일 | 역할 |
|---|---|
| `page.tsx` | Server Component. `getUser()` 인증 체크 → 로그인 상태면 `/` redirect |
| `AuthTabs.tsx` | Client Component. 로그인/회원가입 탭 전환 (`useState`) |
| `LoginForm.tsx` | Client Component. `useActionState` + `loginAction` |
| `SignupForm.tsx` | Client Component. `useActionState` + `signupAction`, 비밀번호 확인 포함 |
| `actions.ts` | `'use server'` — `loginAction`, `signupAction` |

### 타입

```ts
type Profile = Database['public']['Tables']['profiles']['Row']
// { id: string, username: string, display_name: string, email: string | null, created_at: string }

// Server Action 상태 타입 (actions.ts)
type LoginState = { error?: string } | null
type SignupState = { errors?: { username?: string; email?: string; general?: string } } | null
```
