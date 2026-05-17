# DOMAIN-BEAN-STATUTE

## 원두(Bean) 도메인 구현 규칙

### DB 스키마

```sql
beans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  cafe_name TEXT NOT NULL,
  bean_name TEXT NOT NULL,
  image_path TEXT,
  origin TEXT,
  variety TEXT,               -- 품종 (예: Gesha, Bourbon)
  process TEXT,               -- 가공 방식 (예: Washed, Natural)
  roast_level TEXT,           -- 로스팅 정도 (예: Light, Medium, Dark)
  altitude INTEGER,           -- 재배 고도 (미터)
  farm_name TEXT,             -- 농장명
  harvest_year INTEGER,       -- 수확 연도
  flavor_descriptors TEXT[],  -- 향미 설명 태그 배열
  roastery_memo TEXT,         -- 로스터리 메모
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

### 인덱스

- `idx_beans_cafe_name` : `cafe_name` — 카페별 원두 조회
- `idx_beans_user_id` : `user_id` — 사용자별 원두 조회

### RLS 정책

| 정책명 | 대상 | 조건 |
|---|---|---|
| beans_select_all | SELECT | 누구나 |
| beans_insert_authenticated | INSERT | `auth.uid() = user_id` |
| beans_update_own | UPDATE | `auth.uid() = user_id` |
| beans_delete_admin | DELETE | `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` |

### Storage

- 버킷: `beans` (public)
- 저장 값: `beans.image_path`
- 업로드 경로 규칙: `{user_id}/{timestamp}-{sanitizedFileName}`
- 허용 형식: `image/jpeg`, `image/png`, `image/webp`
- 파일 크기 제한: 5MB

### 타입

```ts
type Bean = Database['public']['Tables']['beans']['Row']
type BeanInsert = Database['public']['Tables']['beans']['Insert']
```

### 주요 쿼리 패턴

```ts
// 전체 목록 (최신순)
supabase.from('beans').select('*').order('created_at', { ascending: false })

// 카페별 필터
supabase.from('beans').select('*').eq('cafe_name', cafeName)

// 사용자별 목록
supabase.from('beans').select('*').eq('user_id', userId)

// 상세 (커핑 노트 포함)
supabase.from('beans').select('*, cupping_notes(*)').eq('id', beanId).single()
```
