# Cupping — 구현 문서

## 개요

커핑 노트 목록, 작성, 상세 조회, 수정, 삭제 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/cupping/CuppingFeedList.tsx` | 홈(`/`)과 `/cupping`에서 공유하는 커핑 피드 렌더러 |
| `src/features/cupping/actions.ts` | createCuppingAction, updateCuppingAction, deleteCuppingAction Server Action |
| `src/features/cupping/CuppingForm.tsx` | 커핑 노트 작성·수정 폼 Client Component (create/edit 겸용) |
| `src/features/cupping/CuppingFilters.tsx` | 커핑 노트 목록 필터·정렬 폼 Client Component |
| `src/features/cupping/DeleteButton.tsx` | 삭제 버튼 Client Component |
| `src/app/(app)/page.tsx` | 공개 홈 피드 페이지 |
| `src/app/(app)/cupping/page.tsx` | 커핑 노트 목록 페이지 |
| `src/app/(app)/cupping/new/page.tsx` | 커핑 노트 작성 페이지 |
| `src/app/(app)/cupping/[id]/page.tsx` | 커핑 노트 상세 페이지 |
| `src/app/(app)/cupping/[id]/edit/page.tsx` | 커핑 노트 수정 페이지 |

## 동작

- `/`: 최신 커핑 노트 공개 홈 피드
  - 로그인 여부와 관계없이 열람 가능
  - `CuppingFeedList` 공용 렌더러 사용
- `/cupping`: 커핑 노트 목록 표시
  - `beanId`로 원두별 필터
  - `sort=latest|oldest`로 최신순/오래된순 정렬
  - `CuppingFeedList` 공용 렌더러 사용
  - 각 카드에서 원두 정보, 점수, 로스팅일, 메모 일부, 작성자/작성일 표시
- `/cupping/new?beanId={id}`: 원두 선택 후 aroma/acidity/body/roast_date/memo/score 입력
  - 등록 성공 시 `/beans/{beanId}`로 redirect
- `/cupping/[id]`: 커핑 노트 상세 표시
  - 원두명 → `/beans/[id]` 링크
  - 향미/산미/바디, 작성자 종합 평점(있으면), 로스팅일(있으면), 메모(있으면)
  - 작성자 → `/profile/[username]` 링크, 작성일
  - 본인 작성 노트: 수정 링크 + 삭제 버튼 표시
  - 비회원은 좋아요 클릭/댓글 작성 시 `/auth?next=/cupping/[id]`로 이동
- `/cupping/[id]/edit`: 기존 값 pre-fill된 수정 폼
  - 본인 아닌 경우 `/cupping/[id]`로 redirect
  - 수정 완료 시 `/cupping/[id]`로 redirect
  - 삭제 시 `/beans/[beanId]`로 redirect

## 업데이트 내역

### 2026-05-17 — 공개 홈 피드 전환
- 루트 `/`를 최신 커핑 노트 공개 피드로 전환
- `CuppingFeedList` 공용 렌더러 추가
- `/cupping` 목록 페이지가 공용 렌더러를 재사용하도록 정리
- 비회원은 `/cupping/[id]`에서 좋아요/댓글 작성 시 즉시 `/auth?next=...`로 이동

## CuppingForm Props

```ts
interface Props {
  beanId?: string          // create 모드
  noteId?: string          // edit 모드
  beanLabel: string
  initialValues?: {        // edit 모드: pre-fill
    aroma: number
    acidity: number
    body: number
    roast_date: string | null
    memo: string | null
    score: number | null
  }
  action: (state: CuppingFormState, formData: FormData) => Promise<CuppingFormState>
  submitLabel: string
}
```

## 향후 계획

- 메모(memo) 필드 마크다운 에디터로 전환 (현재 일반 textarea)
