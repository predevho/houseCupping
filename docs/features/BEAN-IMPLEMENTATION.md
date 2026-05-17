# Bean — 구현 문서

## 개요

원두 등록, 수정, 삭제, 목록 조회, 상세 조회 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/bean/actions.ts` | createBeanAction Server Action |
| `src/features/bean/BeanForm.tsx` | 원두 등록 폼 Client Component |
| `src/features/bean/BeanSearch.tsx` | 원두 목록 검색 폼 Client Component |
| `src/features/bean/DeleteBeanButton.tsx` | 원두 삭제 버튼 Client Component |
| `src/features/bean/__tests__/BeanSearch.test.tsx` | 원두 목록 검색 폼 단위 테스트 |
| `src/app/(app)/beans/page.tsx` | 원두 목록 페이지 |
| `src/app/(app)/beans/new/page.tsx` | 원두 등록 페이지 |
| `src/app/(app)/beans/[id]/page.tsx` | 원두 상세 페이지 |
| `src/app/(app)/beans/[id]/edit/page.tsx` | 원두 수정 페이지 |

## 동작

- `/beans`: 최신순 원두 목록 표시, `q` 검색어로 원두명/카페명 검색
- `/beans`: 원두 이미지가 있으면 썸네일 표시, 없으면 플레이스홀더 표시
- `/beans/new`: 카페명/원두명(필수) + 원산지/가공방식/로스팅(선택) 입력 후 등록
- `/beans/new`: JPG/PNG/WebP 대표 이미지 1장 업로드 가능 (최대 5MB)
- 등록 성공 시 `/beans/[id]`로 redirect
- `/beans/[id]`: 원두 상세 정보와 대표 이미지 표시, 탈퇴 회원의 원두는 등록자 '알 수 없음' 표시
- `/beans/[id]`: `bean_ratings.score` 기준 평균 종합 평점과 참여 인원 수 표시
- `/beans/[id]/edit`: 등록자 본인만 수정 가능, 기존 값 pre-fill, 새 대표 이미지로 교체 가능
- 원두 상세 페이지에서 본인 원두면 버튼형 `수정` 액션 표시
- 원두 상세 페이지에서 admin이면 버튼형 `삭제` 액션 표시, 삭제 성공 시 `/beans`로 redirect
- 가공방식 선택: Washed / Natural / Honey / Anaerobic
- 로스팅 선택: Light / Medium / Dark / Extra Dark

## 업데이트 내역

### 2026-05-17 — 원두 목록 페이지 추가
- `/beans`: Server Component에서 Supabase로 원두 목록을 최신순 조회
- `BeanSearch`: `<form method="GET">` 기반 검색 폼, `q` 유지
- 검색 대상: `bean_name`, `cafe_name`
- 검색 버튼, 상단 액션 링크, 원두 카드에 hover/active/focus-visible 상태 통일
- 빈 상태 메시지 분기
  - 검색어 있음: `검색 결과가 없어요`
  - 검색어 없음: `아직 등록된 원두가 없어요`
- 보안/품질 보완
  - 검색어 길이 100자 제한
  - PostgREST 필터 문자열의 `,`, `(`, `)` 제거
  - 쿼리 실패 시 한국어 메시지로 `throw`

### 2026-05-15 — 커핑 노트 섹션 추가
- `/beans/[id]`: 커핑 노트 목록 표시 (aroma/acidity/body, 로스팅일, 메모, 작성자, 날짜)
- "+ 노트 작성" 링크 → `/cupping/new?beanId={id}`
- 커핑 노트 없을 때 빈 상태 메시지 "아직 커핑 노트가 없어요" 표시

### 2026-05-17 — 원두 상세 평균 평점 추가
- `/beans/[id]`: `bean_ratings` 조회 후 평균 종합 평점과 참여 인원 수 표시
- 평점이 없으면 빈 상태 메시지 `아직 등록된 종합 평점이 없어요` 표시

### 2026-05-17 — 원두 수정 추가
- `BeanForm`을 등록/수정 겸용으로 확장
- `updateBeanAction` Server Action 추가
- `/beans/[id]/edit`: 본인 원두만 수정 가능, 수정 완료 시 상세 페이지로 redirect

### 2026-05-17 — 원두 삭제 추가
- `deleteBeanAction` Server Action 추가
- 원두 상세 페이지에서 admin에게만 삭제 버튼 표시
- 삭제 성공 시 `/beans`로 redirect

### 2026-05-17 — 원두 이미지 업로드 추가

- `beans.image_path` 컬럼과 public `beans` Storage bucket 사용
- `BeanForm`에 multipart 업로드 input 추가
- 허용 형식: JPG / PNG / WebP
- 크기 제한: 5MB
- 업로드 성공 시 `image_path` 저장
- `/beans` 목록에 썸네일 표시, `/beans/[id]` 상세에 대표 이미지 표시
- `image_path` 컬럼이 아직 반영되지 않은 환경에서는 `/beans` 목록을 이미지 없이 fallback 조회
- `image_path` 컬럼이 아직 반영되지 않은 환경에서는 `/beans/[id]` 상세도 이미지 없이 fallback 조회
- 원두 상세 조회 자체가 실패하면 `notFound()`로 삼키지 않고 한국어 에러를 `throw`
- 다크모드에서 목록/상세 카드와 보조 텍스트 대비 강화

### 2026-05-17 — 원두 상세 액션 버튼 개선
- `/beans/[id]`의 `수정 / 삭제`를 더 큰 버튼형 액션으로 정리
- 기존 hover/active/focus-visible 상호작용 규칙을 동일하게 적용
