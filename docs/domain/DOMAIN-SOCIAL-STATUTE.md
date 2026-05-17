# DOMAIN-SOCIAL-STATUTE

## 소셜(Social) 도메인 구현 규칙

### DB 스키마

```sql
likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  note_id BIGINT REFERENCES public.cupping_notes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, note_id)
)

comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  note_id BIGINT REFERENCES public.cupping_notes(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)
```

### 인덱스

- `idx_likes_note_id` : 노트별 좋아요 수 집계
- `idx_comments_note_id` : 노트별 댓글 조회

### RLS 정책

| 정책명 | 테이블 | 대상 | 조건 |
|---|---|---|---|
| likes_select_all | likes | SELECT | 누구나 |
| likes_insert_own | likes | INSERT | `auth.uid() = user_id` |
| likes_delete_own | likes | DELETE | `auth.uid() = user_id` |
| comments_select_all | comments | SELECT | 누구나 |
| comments_insert_authenticated | comments | INSERT | `auth.uid() = user_id` |
| comments_update_own | comments | UPDATE | `auth.uid() = user_id` |
| comments_delete_own | comments | DELETE | `auth.uid() = user_id` |

### 타입

```ts
type Like = Database['public']['Tables']['likes']['Row']
type Comment = Database['public']['Tables']['comments']['Row']
```

### 주요 쿼리 패턴

```ts
// 커핑 노트의 좋아요 수 + 현재 유저의 좋아요 여부
supabase.from('likes').select('id, user_id').eq('note_id', noteId)

// 좋아요 추가
supabase.from('likes').insert({ user_id, note_id })

// 좋아요 취소
supabase.from('likes').delete().match({ user_id, note_id })

// 댓글 목록 (작성자 정보 포함)
supabase.from('comments')
  .select('*, profiles(username, display_name)')
  .eq('note_id', noteId)
  .order('created_at', { ascending: true })
```
