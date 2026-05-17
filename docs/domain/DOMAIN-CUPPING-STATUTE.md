# DOMAIN-CUPPING-STATUTE

## 커핑(Cupping) 도메인 구현 규칙

### DB 스키마

```sql
cupping_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bean_id UUID REFERENCES public.beans(id) ON DELETE CASCADE NOT NULL,
  roast_date DATE,
  aroma NUMERIC(3,1) NOT NULL CHECK (aroma >= 0.5 AND aroma <= 5.0 AND aroma % 0.5 = 0),
  acidity NUMERIC(3,1) NOT NULL CHECK (acidity >= 0.5 AND acidity <= 5.0 AND acidity % 0.5 = 0),
  body NUMERIC(3,1) NOT NULL CHECK (body >= 0.5 AND body <= 5.0 AND body % 0.5 = 0),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)

bean_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bean_id UUID REFERENCES public.beans(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC(3,1) NOT NULL CHECK (score >= 0.5 AND score <= 5.0 AND score % 0.5 = 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, bean_id)
)
```

### 점수 유효성 규칙

- `aroma`, `acidity`, `body`: 0.5 단위, 0.5 이상 5.0 이하 (0.5, 1.0, 1.5, ..., 5.0)
- `score`: 0.5 단위, 0.5 이상 5.0 이하 (0.5, 1.0, 1.5, ..., 5.0)

### 인덱스

- `idx_notes_bean_id` : 원두별 커핑 노트 조회
- `idx_notes_user_id` : 사용자별 커핑 노트 조회
- `idx_notes_created_at` : 최신순 정렬

### RLS 정책 (cupping_notes, bean_ratings 공통)

| 정책 | 대상 | 조건 |
|---|---|---|
| `*_select_all` | SELECT | 누구나 |
| `*_insert_authenticated` | INSERT | `auth.uid() = user_id` |
| `*_update_own` | UPDATE | `auth.uid() = user_id` |
| `*_delete_own` | DELETE | `auth.uid() = user_id` |

### 타입

```ts
type CuppingNote = Database['public']['Tables']['cupping_notes']['Row']
type BeanRating = Database['public']['Tables']['bean_ratings']['Row']
```

### 주요 쿼리 패턴

```ts
// 원두의 커핑 노트 목록
supabase.from('cupping_notes')
  .select('*, profiles(username, display_name)')
  .eq('bean_id', beanId)
  .order('created_at', { ascending: false })

// 원두 평점 upsert (있으면 수정, 없으면 생성)
supabase.from('bean_ratings')
  .upsert({ user_id, bean_id, score }, { onConflict: 'user_id,bean_id' })
```
