# houseCupping

커피 원두와 커핑 노트를 기록하고 공유하는 웹 서비스입니다.  
과제 프로젝트로 시작했지만, 제출용 결과물에 그치지 않고 베타 배포 이후에도 계속 확장할 수 있는 사이드프로젝트를 전제로 설계하고 관리했습니다.

## 프로젝트 개요

- 목적
  - 개인이 기록하던 원두 정보와 커핑 경험을 구조화해 저장하고, 다른 사용자와 공유할 수 있는 서비스를 만드는 것이 목표입니다.
- 해결하려는 문제
  - 원두 정보, 평점, 메모, 소셜 반응이 흩어져 관리되면 비교와 회고가 어렵습니다.
  - houseCupping은 원두, 커핑 노트, 좋아요, 댓글을 하나의 흐름으로 연결해 기록과 공유를 동시에 가능하게 합니다.
- 진행 배경
  - 프론트엔드 과제 프로젝트로 출발했지만, 실제 배포와 운영 가능성을 고려해 문서, 도메인 규칙, 배포 체크리스트까지 함께 정리했습니다.
- 현재 상태
  - 베타 배포 준비 단계
  - 핵심 기능 구현 완료
  - FE 기준 검증 완료

## 주요 기능

- 인증
  - username 기반 로그인
  - 회원가입
  - 이메일 인증 대기 안내 플로우 대응
- 원두 관리
  - 원두 등록 / 수정 / 삭제
  - 원두 이미지 업로드
  - 원두 목록 / 상세 조회
- 커핑 노트
  - 커핑 노트 작성 / 수정 / 삭제
  - 향미 / 산미 / 바디 / 종합 평점 기록
  - 0.5점 단위 원형 클릭·드래그 입력 UI
- 소셜
  - 좋아요 토글
  - 댓글 작성 / 삭제
- UI / 사용성
  - 다크모드 지원
  - hover / active / focus-visible 상호작용 정리

## 기술 스택

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- ShadCN/ui
- DaisyUI

### Backend

- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - RLS

### Testing

- Jest
- Testing Library

### AI Agent

- Claude Code
- AGENTS.md 기반 공통 작업 규칙
- 문서 중심 워크플로를 기준으로 다른 CLI 에이전트 환경에서도 재사용 가능한 구조

## 프로젝트 구조

```text
agent-coding/
├── FE/                     # Next.js 프론트엔드
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
├── BE/supabase/            # Supabase 설정, migration, seed
├── docs/                   # 프로젝트 문서
│   ├── setup/
│   ├── features/
│   ├── domain/
│   ├── architecture/
│   ├── todo/
│   └── logs/
└── README.md
```

## 실행 방법

### 1. 환경 변수 설정

`FE/.env.example`를 참고해 `FE/.env.local`을 준비합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 2. 설치 및 실행

```bash
cd FE
npm install
npm run dev
```

### 3. 품질 확인

```bash
cd FE
npm run build
npm run lint
npm test -- --runInBand
```

## 검증 상태

- `npm run build` 통과
- `npm run lint` 통과
- `npm test -- --runInBand` 통과
- 최신 확인 기준: `40 suites / 204 tests` 통과

## Supabase 설정

- Authentication
  - Supabase Auth와 SSR 쿠키 세션(`@supabase/ssr`)을 사용합니다.
  - 현재 로컬 기준 `auth.email.enable_confirmations = false` 상태이며, 프론트는 이메일 인증 활성화 시 `/auth/verify-email` 플로우를 이미 대응할 수 있습니다.
- 주요 테이블
  - `profiles`: 사용자 프로필, `auth.users` 연동, 자동 생성 트리거
  - `beans`: 원두 정보, 작성자 탈퇴 시 `user_id`는 `SET NULL`
  - `cupping_notes`: 커핑 노트 본문과 세부 점수
  - `bean_ratings`: 원두당 유저별 종합 평점 1개
  - `likes`, `comments`: 커핑 노트 소셜 기능
- 주요 정책(RLS)
  - `beans` 삭제는 admin만 가능
  - `cupping_notes`, `likes`, `comments`는 작성자 본인만 삭제 가능
  - 회원 탈퇴 시 원두는 보존하고 나머지 데이터는 정책에 따라 정리되도록 설계했습니다.
- Storage
  - public `beans` bucket을 사용해 원두 이미지를 업로드하고 표시합니다.
  - 업로드/삭제 정책은 배포 전 별도 확인이 필요합니다.

## AI 에이전트 활용 방식

- 사용한 방식
  - `AGENTS.md`, `CLAUDE.md`, `docs/` 문서를 기준으로 작업 규칙과 도메인 규칙을 먼저 정리한 뒤 구현을 진행했습니다.
- 어떤 작업에 활용했는지
  - 초기 문서 구조 정리
  - 기능 구현 흐름 정리
  - 리팩터링
  - 테스트 코드 작성과 회귀 확인
  - README 및 기능 문서 업데이트
- 문서 기반 작업 방식
  - `docs/setup`, `docs/domain`, `docs/architecture`, `docs/features`, `docs/todo`를 기준점으로 사용했습니다.
  - 구현 완료 후에는 기능 문서와 작업 로그를 함께 갱신하는 흐름을 유지했습니다.
- 프롬프트 전략
  - 추측보다 문서 우선
  - 작업 범위 밖 확장 금지
  - 가능한 경우 TDD 우선
  - 테스트/린트 통과 후 완료 처리
- 코드 검증 방식
  - `npm run build`
  - `npm run lint`
  - `npm test -- --runInBand`

## 트러블 슈팅

### 1. Supabase seed 계정으로 로그인되지 않던 문제

- 문제 상황
  - 로컬 seed 데이터로 만든 테스트 계정이 정상적으로 로그인되지 않았습니다.
- 원인
  - GoTrue 인증에 필요한 `auth.identities`, `aud`, `role` 관련 데이터가 충분히 구성되지 않았습니다.
- 해결 방법
  - `seed.sql`에 `auth.identities` INSERT를 추가하고 `auth.users`의 `aud='authenticated'`, `role='authenticated'`를 맞춰 로그인 흐름을 정상화했습니다.

### 2. 커핑 점수 체계 불일치 문제

- 문제 상황
  - 초기 점수 체계와 UI/DB 제약 조건이 완전히 일치하지 않아 일관성이 떨어졌습니다.
- 원인
  - 도메인 규칙, DB 제약, seed 데이터, 프론트 입력 규칙이 동시에 정렬되지 않은 상태였습니다.
- 해결 방법
  - 점수 체계를 0.5~5.0으로 전면 통일하고, DB migration, seed 데이터, 도메인 문서, 프론트 입력 검증을 함께 수정했습니다.

## 문서 맵

- [서비스 기획안](docs/PRODUCT-PLAN.md)
- [기초 세팅 현황](docs/setup/FOUNDATION-SETUP.md)
- [배포 가이드](docs/setup/BETA-DEPLOYMENT.md)
- [인증 기능 문서](docs/features/AUTH-IMPLEMENTATION.md)
- [원두 기능 문서](docs/features/BEAN-IMPLEMENTATION.md)
- [커핑 기능 문서](docs/features/CUPPING-IMPLEMENTATION.md)
- [완료된 작업](docs/todo/TODO-DONE.md)
- [백로그](docs/todo/TODO-BACKLOG.md)

## 다음 개발 방향

- 이메일 인증 운영 전환 여부 확정
- 베타 사용자 피드백 반영
- 모바일 사용성 보강
- 원두/커핑 검색과 필터 고도화
- 소셜 기능 확장

## 회고

- 단순 과제 제출 구조보다 실제 서비스처럼 문서와 규칙을 먼저 정리하는 방식이 구현 안정성에 더 도움이 됐습니다.
- 점수 체계, 인증 흐름, 삭제 정책처럼 도메인 규칙이 명확해야 프론트와 백엔드 구현이 흔들리지 않는다는 점을 확인했습니다.
- AI 에이전트를 사용할 때도 문서와 검증 절차가 없으면 품질 편차가 커지므로, 문서 기반 작업과 테스트 중심 검증이 중요했습니다.

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [DaisyUI](https://daisyui.com/)
