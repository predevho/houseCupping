# Social — 구현 문서

## 개요

커핑 노트 상세 페이지(`/cupping/[id]`)에 좋아요 토글 및 댓글 작성·삭제 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/social/actions.ts` | toggleLikeAction, createCommentAction, deleteCommentAction Server Action |
| `src/features/social/LikeButton.tsx` | 좋아요 토글 Client Component (Optimistic UI) |
| `src/features/social/CommentForm.tsx` | 댓글 작성 폼 Client Component (useActionState) |
| `src/features/social/DeleteCommentButton.tsx` | 댓글 삭제 버튼 Client Component (useTransition) |
| `src/app/(app)/cupping/[id]/page.tsx` | 커핑 노트 상세 페이지 — likes/comments 쿼리 + Social JSX 섹션 추가 |

## 테스트

| 파일 | 테스트 수 | 주요 케이스 |
|------|-----------|------------|
| `src/features/social/__tests__/actions.test.ts` | 14 | 좋아요 추가/제거, 댓글 작성 유효성 검사, 댓글 삭제, 에러 처리, 비로그인 차단 |
| `src/features/social/__tests__/LikeButton.test.tsx` | 6 | 렌더, 클릭, 카운트 업데이트, 비로그인 시 비활성화 |
| `src/features/social/__tests__/CommentForm.test.tsx` | 4 | userId null 시 로그인 안내, 폼 렌더, 에러 상태, pending 상태 |
| `src/features/social/__tests__/DeleteCommentButton.test.tsx` | 3 | 렌더, 클릭 시 액션 호출, pending 상태 |

## 동작

- `/cupping/[id]`: 커핑 노트 상세 하단에 좋아요 + 댓글 섹션 표시
  - 좋아요: 로그인 유저는 토글 가능, 비로그인 시 버튼 비활성화
  - 댓글: 로그인 유저는 폼 표시, 비로그인 시 로그인 안내 표시
  - 댓글 삭제: 본인 댓글에만 삭제 버튼 표시 (서버 사이드 소유권 확인)

## 주요 패턴

### Optimistic UI (LikeButton)
- `useState`로 `liked` / `count` 로컬 상태 관리
- 서버 액션 호출 전 상태를 즉시 업데이트 (no await)
- 서버 오류 시 롤백 없음 (단순 토글이므로 재시도로 해결)

### useActionState (CommentForm)
- 폼 제출 상태(pending, error, success)를 `useActionState`로 관리
- 성공 시 폼 초기화

### useTransition (DeleteCommentButton)
- `useTransition`으로 삭제 중 UI 블로킹 없이 pending 상태 표시

### 뮤테이션 공통
- 모든 Server Action은 성공 시 `revalidatePath('/cupping/[id]')` 호출
- DB 에러는 `revalidatePath` 호출 전에 early return

## 유효성 검사 (createCommentAction)

- `content` 빈값 불가
- `content` 최대 500자
- `noteId` 존재 여부 확인
- 비로그인 시 에러 반환

## 서버 사이드 소유권 확인

```ts
// /cupping/[id]/page.tsx
comment.user_id === authData.user?.id
// → 본인 댓글에만 DeleteCommentButton 렌더
```

## 향후 계획

- 좋아요 수 실시간 표시 (Supabase Realtime)
- 댓글 대댓글 지원
- 댓글 수정 기능
