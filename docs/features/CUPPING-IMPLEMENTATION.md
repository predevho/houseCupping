# Cupping — 구현 문서

## 개요

커핑 노트 작성, 상세 조회, 수정, 삭제 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/cupping/actions.ts` | createCuppingAction, updateCuppingAction, deleteCuppingAction Server Action |
| `src/features/cupping/CuppingForm.tsx` | 커핑 노트 작성·수정 폼 Client Component (create/edit 겸용) |
| `src/features/cupping/DeleteButton.tsx` | 삭제 버튼 Client Component |
| `src/app/(app)/cupping/new/page.tsx` | 커핑 노트 작성 페이지 |
| `src/app/(app)/cupping/[id]/page.tsx` | 커핑 노트 상세 페이지 |
| `src/app/(app)/cupping/[id]/edit/page.tsx` | 커핑 노트 수정 페이지 |

## 동작

- `/cupping/new?beanId={id}`: 원두 선택 후 aroma/acidity/body/roast_date/memo/score 입력
  - 등록 성공 시 `/beans/{beanId}`로 redirect
- `/cupping/[id]`: 커핑 노트 상세 표시
  - 원두명 → `/beans/[id]` 링크
  - 향미/산미/바디, 작성자 종합 평점(있으면), 로스팅일(있으면), 메모(있으면)
  - 작성자 → `/profile/[username]` 링크, 작성일
  - 본인 작성 노트: 수정 링크 + 삭제 버튼 표시
- `/cupping/[id]/edit`: 기존 값 pre-fill된 수정 폼
  - 본인 아닌 경우 `/cupping/[id]`로 redirect
  - 수정 완료 시 `/cupping/[id]`로 redirect
  - 삭제 시 `/beans/[beanId]`로 redirect

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
- 커핑 노트 목록 페이지
- 원두 상세 평균 평점 집계
