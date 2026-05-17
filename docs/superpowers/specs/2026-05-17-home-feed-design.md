# 홈 공개 피드 Design Spec

**Date:** 2026-05-17
**Status:** Approved

---

## Goal

루트 `/`를 로그인 여부와 관계없이 볼 수 있는 공개 홈 피드로 전환한다.
홈에는 최신 커핑 노트를 SNS 피드처럼 날짜순으로 나열하고, 조회는 누구나 가능하게 유지한다.
반면 좋아요, 댓글 작성, 원두 등록, 커핑 노트 작성처럼 사용자 권한이나 DB 쓰기가 필요한 액션은 비회원일 때 즉시 `/auth`로 보낸다.

## Architecture

### 라우팅 전략

- `/`: 공개 홈 피드
- `/cupping`: 필터/정렬이 가능한 확장 목록 페이지
- `/beans`, `/beans/[id]`, `/cupping`, `/cupping/[id]`: 비회원도 조회 가능
- `/beans/new`, `/cupping/new`, `/profile`: 로그인 필요 유지
- `/auth`: 로그인/회원가입 페이지 유지

핵심 변화는 루트 `/`가 더 이상 빈 플레이스홀더가 아니라, 공개형 커핑 피드의 진입점이 된다는 점이다.

### 피드 구조

홈과 `/cupping`이 같은 도메인 데이터를 보여주므로, 목록 카드 렌더링은 공용 컴포넌트로 분리한다.

```text
/(app)/page.tsx                    (Server Component)
  └── CuppingFeedList.tsx          (Server-safe presentational component)
      └── 카드 목록

/(app)/cupping/page.tsx            (Server Component)
  └── CuppingFilters.tsx           (Client Component)
  └── CuppingFeedList.tsx          (same feed renderer)
```

- `page.tsx`: 최신 커핑 노트를 조회하고 홈용 헤더/CTA와 함께 렌더
- `cupping/page.tsx`: 기존 필터/정렬 기능 유지, 같은 피드 렌더러 재사용
- `CuppingFeedList.tsx`: 카드 목록과 빈 상태를 담당하는 공용 컴포넌트

### 인증 경계

비회원이 쓰기 액션을 누르면 안내 메시지보다 즉시 `/auth?next=...`로 이동시킨다.

- 좋아요 버튼 클릭 → `/auth?next=/cupping/{id}`
- 댓글 작성 CTA 클릭 → `/auth?next=/cupping/{id}`
- 원두 등록 버튼 클릭 → 기존 미들웨어로 `/auth?next=/beans/new`
- 커핑 노트 작성 버튼 클릭 → 기존 미들웨어로 `/auth?next=/cupping/new?...`

로그인 후에는 `next` 값을 우선 사용해 원래 보던 페이지로 돌아오게 한다.

## Data Flow

### 홈 피드

```text
GET /
  → page.tsx (Server)
  → supabase.from('cupping_notes')
      .select('id, bean_id, aroma, acidity, body, roast_date, memo, created_at, profiles(username, display_name), beans(id, bean_name, cafe_name)')
      .order('created_at', { ascending: false })
  → CuppingFeedList로 전달
  → 카드 렌더
```

### 비회원 액션

```text
비회원이 좋아요 클릭
  → 클라이언트에서 userId null 확인
  → router.push('/auth?next=/cupping/12')

비회원이 댓글 작성 CTA 클릭
  → router.push('/auth?next=/cupping/12')
```

### 로그인 후 복귀

```text
/auth?next=/cupping/12
  → loginAction / signupAction 성공
  → next가 있으면 해당 경로로 redirect
  → 없으면 기본 '/' redirect
```

## UI Specification

### 홈 `/`

- 상단에 서비스 제목과 짧은 설명 문구 배치
- 비회원:
  - `로그인` / `회원가입` 링크 노출
  - 피드 자체는 그대로 열람 가능
- 로그인 사용자:
  - 기존 헤더 네비게이션 유지
- 본문:
  - 최신 커핑 노트 카드 목록
  - 각 카드에서 원두명, 카페명, 작성자, 날짜, 향미/산미/바디, 메모 일부 표시
  - 카드 전체 클릭 시 `/cupping/[id]`로 이동

### `/cupping`

- 현재 필터/정렬 UX 유지
- 목록 부분만 공용 피드 컴포넌트로 교체

### `/cupping/[id]`

- 비회원도 상세 조회 가능
- 좋아요 버튼:
  - 로그인 상태면 현재 동작 유지
  - 비회원이면 disabled 대신 클릭 가능한 인증 이동 버튼으로 동작
- 댓글 영역:
  - 로그인 상태면 현재 폼 유지
  - 비회원이면 `로그인하고 댓글 쓰기` 버튼 표시

### Header

- 로그인 상태:
  - 현재처럼 프로필 링크 + 로그아웃 버튼
- 비회원 상태:
  - `로그인`, `회원가입` 링크 표시
  - 비회원에게 `/profile` 링크나 로그아웃 버튼은 노출하지 않음

## Error Handling

- 홈 피드 조회 실패 시 한국어 에러 메시지로 throw
- `/cupping` 목록 조회 실패 시 기존 한국어 에러 처리 유지
- `next` 파라미터가 없거나 비정상이면 기본 `/`로 fallback

## Test Plan

### 새 테스트

- 홈 `/`가 커핑 피드를 렌더링한다
- 비회원 Header가 `로그인` / `회원가입` 링크를 보여준다
- 비회원 LikeButton 클릭 시 `/auth?next=/cupping/{id}`로 이동한다
- 비회원 CommentForm이 폼 대신 인증 이동 CTA를 렌더링한다
- auth action이 `next`를 우선 redirect 대상으로 사용한다

### 기존 테스트 영향

- LikeButton 테스트는 비회원 동작이 기존 `disabled`에서 `인증 이동`으로 바뀌므로 수정 필요
- Header 관련 테스트가 있으면 비회원 분기를 추가

## File Plan

| 파일 | 변경 | 역할 |
|---|---|---|
| `FE/src/app/(app)/page.tsx` | 수정 | 공개 홈 피드 페이지 |
| `FE/src/app/(app)/cupping/page.tsx` | 수정 | 공용 피드 렌더러 사용 |
| `FE/src/components/layout/Header.tsx` | 수정 | 비회원/로그인 상태 분기 |
| `FE/src/features/cupping/CuppingFeedList.tsx` | 신규 | 공용 피드 목록 렌더러 |
| `FE/src/features/social/LikeButton.tsx` | 수정 | 비회원 클릭 시 `/auth` 이동 |
| `FE/src/features/social/CommentForm.tsx` | 수정 | 비회원 CTA 표시 |
| `FE/src/app/(auth)/auth/actions.ts` | 수정 | `next` 파라미터 우선 redirect |

## Scope Exclusions

- 무한 스크롤
- 페이지네이션
- 좋아요 수 / 댓글 수를 홈 카드에 추가 집계
- 팔로우 기반 개인화
- 실시간 피드 갱신
