# DOMAIN-MEMBER-STATUTE

## 회원 도메인 구현 규칙

### DB 스키마

```sql
profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

### 자동 프로필 생성 트리거

- `on_auth_user_created` 트리거가 `auth.users` INSERT 후 자동으로 `profiles` 레코드를 생성한다.
- `username`: 회원가입 시 `raw_user_meta_data.username` → 없으면 이메일 앞부분
- `display_name`: 회원가입 시 `raw_user_meta_data.display_name` → 없으면 이메일 앞부분
- 트리거 함수는 `SECURITY DEFINER SET search_path = public, pg_temp` 로 실행한다. (search_path hijacking 방지)

### RLS 정책

| 정책명 | 대상 | 조건 |
|---|---|---|
| profiles_select_all | SELECT | 누구나 |
| profiles_insert_own | INSERT | `auth.uid() = id` |
| profiles_update_own | UPDATE | `auth.uid() = id` |

### username 유효성 규칙

- 영문(대소문자), 숫자, 밑줄(`_`), 하이픈(`-`)만 허용
- 길이: 3자 이상 30자 이하
- DB CHECK 제약으로 강제: `username ~ '^[a-zA-Z0-9_-]{3,30}$'`

### UPDATE 컬럼 제한

- `authenticated` 역할은 `username`, `display_name`만 수정 가능하다.
- `id`, `created_at`은 컬럼 레벨 권한으로 변경이 차단된다.

### 인증 흐름

1. 회원가입: `supabase.auth.signUp({ email, password, options: { data: { username, display_name } } })`
2. 로그인: `supabase.auth.signInWithPassword({ email, password })`
3. 로그아웃: `supabase.auth.signOut()`
4. 현재 유저 조회: Server Component에서 `supabase.auth.getUser()` 사용 (세션 쿠키 기반)

### 인증 보호 라우트

미들웨어(`middleware.ts`)에서 두 가지를 처리한다.

- **보호된 라우트** (`/beans/new`, `/notes/new`, `/profile`): 비로그인 시 `/login?next={pathname}` 으로 리다이렉트
- **인증 전용 라우트** (`/login`, `/signup`): 로그인 상태면 `/` 로 리다이렉트

새로운 보호 라우트 추가 시 `middleware.ts`의 `PROTECTED_ROUTES` 배열에 추가한다.

### 타입

```ts
type Profile = Database['public']['Tables']['profiles']['Row']
// { id: string, username: string, display_name: string | null, created_at: string }
```
