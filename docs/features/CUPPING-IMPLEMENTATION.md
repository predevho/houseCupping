# Cupping — 구현 문서

## 개요

커핑 노트 작성, 상세 조회, 삭제 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/cupping/actions.ts` | createCuppingAction, deleteCuppingAction Server Action |
| `src/features/cupping/CuppingForm.tsx` | 커핑 노트 작성 폼 Client Component |
| `src/features/cupping/DeleteButton.tsx` | 삭제 버튼 Client Component |
| `src/app/(app)/cupping/new/page.tsx` | 커핑 노트 작성 페이지 |
| `src/app/(app)/cupping/[id]/page.tsx` | 커핑 노트 상세 페이지 |

## 동작

- `/cupping/new?beanId={id}`: 원두 선택 후 aroma/acidity/body/roast_date/memo/score 입력
- 등록 성공 시 `/beans/{beanId}`로 redirect
- `/cupping/[id]`: 커핑 노트 상세 표시
  - 원두명 → `/beans/[id]` 링크
  - 향미/산미/바디, 종합 평점(있으면), 로스팅일(있으면), 메모(있으면)
  - 작성자 → `/profile/[username]` 링크, 작성일
  - 본인 작성 노트: 삭제 버튼 표시 → 삭제 후 `/beans/[beanId]`로 redirect

## 범위 외 (추후 추가)

- 커핑 노트 수정
- 커핑 노트 목록 페이지
- 원두 상세 평균 평점 집계
