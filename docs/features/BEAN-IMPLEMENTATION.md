# Bean — 구현 문서

## 개요

원두 등록 및 상세 조회 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/bean/actions.ts` | createBeanAction Server Action |
| `src/features/bean/BeanForm.tsx` | 원두 등록 폼 Client Component |
| `src/app/(app)/beans/new/page.tsx` | 원두 등록 페이지 |
| `src/app/(app)/beans/[id]/page.tsx` | 원두 상세 페이지 |

## 동작

- `/beans/new`: 카페명/원두명(필수) + 원산지/가공방식/로스팅(선택) 입력 후 등록
- 등록 성공 시 `/beans/[id]`로 redirect
- `/beans/[id]`: 원두 상세 정보 표시, 탈퇴 회원의 원두는 등록자 '알 수 없음' 표시
- 가공방식 선택: Washed / Natural / Honey / Anaerobic
- 로스팅 선택: Light / Medium / Dark / Extra Dark

## 업데이트 내역

### 2026-05-15 — 커핑 노트 섹션 추가
- `/beans/[id]`: 커핑 노트 목록 표시 (aroma/acidity/body, 로스팅일, 메모, 작성자, 날짜)
- "+ 노트 작성" 링크 → `/cupping/new?beanId={id}`
- 커핑 노트 없을 때 빈 상태 메시지 "아직 커핑 노트가 없어요" 표시

## 범위 외 (추후 추가)

- 원두 목록 페이지 (`/beans`)
- 원두 수정
- 원두 삭제 (admin 전용)
- 이미지 업로드 (Supabase Storage + image_url 컬럼 마이그레이션 필요)
