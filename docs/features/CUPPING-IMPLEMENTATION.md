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
  - 각 카드에서 원두 정보, 원형 점수, 로스팅일, 메모 일부, 작성자/작성일 표시
- `/cupping/new?beanId={id}`: 원두 선택 후 aroma/acidity/body/score/roast_date/memo 입력
  - 향미/산미/바디/종합 평점은 `5개 원형 + 0.5점 단위` 입력 UI 사용
  - 클릭과 드래그(마우스/터치 이동) 모두 지원
  - 종합 평점은 바디 바로 아래에 같은 원형 UI로 배치
  - `roast_date`는 `type="date"` + 오늘 날짜 `max` 제약 사용
  - 서버에서 `YYYY-MM-DD` 형식 및 실제 존재하는 날짜인지 검증
  - 등록 성공 시 `/beans/{beanId}`로 redirect
- `/cupping/[id]`: 커핑 노트 상세 표시
  - 원두명 → `/beans/[id]` 링크
  - 향미/산미/바디는 원형 점수 UI로 표시
  - 작성자 종합 평점(있으면), 로스팅일(있으면), 메모(있으면)
  - 작성자 → `/profile/[username]` 링크, 작성일
  - 본인 작성 노트: 버튼형 `수정 / 삭제` 액션 표시
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

### 2026-05-17 — 날짜 입력 검증 및 상호작용 상태 보강
- `CuppingForm`의 `roast_date` 입력에 오늘 날짜 `max` 제약 추가
- `createCuppingAction`, `updateCuppingAction`에 잘못된 날짜 검증 추가
  - 연도 4자리 초과 입력 차단
  - `2025-04-31`, `2025-02-31` 같은 비정상 날짜 차단
- `CuppingFeedList`, `/cupping`, `/cupping/[id]`의 링크/카드/버튼에 hover, active, focus-visible 상태 통일
- 다크모드에서 커핑 목록/상세 텍스트 대비 강화

### 2026-05-17 — 원형 점수 입력 UI 및 상세 액션 버튼 개선
- `CuppingForm`의 향미/산미/바디 입력을 `select`에서 `원형 5개 + 0.5점 단위` UI로 전환
- 종합 평점도 같은 원형 UI로 통일하고 바디 아래로 이동
- 원 클릭과 드래그 모두 지원하는 하이브리드 입력 방식 추가
- `CuppingFeedList`, `/cupping/[id]`, `/beans/[id]`의 점수 표시를 원형 점수 UI로 통일
- `/cupping/[id]`, `/beans/[id]`의 `수정 / 삭제`를 더 큰 버튼형 액션으로 정리

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
