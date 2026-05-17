# houseCupping

커피 원두와 커핑 노트를 기록하고 공유하는 웹 서비스입니다.  
과제 프로젝트로 시작했지만, 베타 배포 이후에도 계속 확장할 사이드프로젝트를 전제로 관리하고 있습니다.

## 프로젝트 상태

- 베타 배포 준비 단계
- 핵심 기능 구현 완료
- FE 기준 검증 완료
  - `npm run build`
  - `npm run lint`
  - `npm test -- --runInBand`
- 최신 확인 기준: `40 suites / 204 tests` 통과

## 핵심 기능

- 인증
  - 아이디(username) 기반 로그인
  - 회원가입
  - 이메일 인증 대기 안내 플로우 대응
- 원두
  - 원두 등록 / 수정 / 삭제
  - 원두 이미지 업로드
  - 원두 목록 / 상세 조회
- 커핑
  - 커핑 노트 작성 / 수정 / 삭제
  - 향미 / 산미 / 바디 / 종합 평점 기록
  - 0.5점 단위 원형 클릭·드래그 입력 UI
- 소셜
  - 좋아요
  - 댓글 작성 / 삭제
- UI
  - 다크모드 지원
  - hover / active / focus-visible 상호작용 정리

## 기술 스택

- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS v4, ShadCN/ui, DaisyUI
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
- Testing: Jest, Testing Library

## 디렉터리 구조

```text
agent-coding/
├── FE/                     # Next.js 프론트엔드
├── BE/supabase/            # Supabase 마이그레이션, seed, 로컬 설정
├── docs/                   # 내부 문서
│   ├── setup/
│   ├── features/
│   ├── domain/
│   ├── architecture/
│   └── todo/
└── README.md
```

## 빠른 시작

### 1. 환경 변수

`FE/.env.example`를 참고해 `FE/.env.local`을 준비합니다.

필수 키:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 2. 프론트 실행

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

## 로컬 Supabase

Supabase 로컬 프로젝트 기준 경로는 `BE/supabase/`입니다.

주요 참고 문서:

- [기초 세팅 현황](docs/setup/FOUNDATION-SETUP.md)
- [베타 배포 가이드](docs/setup/BETA-DEPLOYMENT.md)
- [커핑 기능 문서](docs/features/CUPPING-IMPLEMENTATION.md)
- [원두 기능 문서](docs/features/BEAN-IMPLEMENTATION.md)
- [인증 기능 문서](docs/features/AUTH-IMPLEMENTATION.md)

## 베타 배포 메모

권장 배포 형태:

- FE: Vercel
- BE: Supabase hosted project

배포 전 확인 항목:

- 프론트 환경 변수 등록
- Supabase 마이그레이션 반영
- Auth `site_url`, redirect URL 반영
- 이메일 인증 활성화 여부 결정
- Storage `beans` 버킷 정책 확인

상세 절차는 [docs/setup/BETA-DEPLOYMENT.md](docs/setup/BETA-DEPLOYMENT.md)에 정리되어 있습니다.

## 문서 맵

- [서비스 기획안](docs/PRODUCT-PLAN.md)
- [기초 세팅 현황](docs/setup/FOUNDATION-SETUP.md)
- [배포 가이드](docs/setup/BETA-DEPLOYMENT.md)
- [완료된 작업](docs/todo/TODO-DONE.md)
- [백로그](docs/todo/TODO-BACKLOG.md)

## 다음 개발 방향

- 이메일 인증 운영 전환
- 베타 사용자 피드백 반영
- 모바일 사용성 보강
- 원두/커핑 검색과 필터 고도화
- 소셜 기능 확장

## 비고

이 저장소는 과제 제출용 결과물을 넘어서, 이후에도 계속 발전시키는 개인 사이드프로젝트 기준으로 문서와 구조를 유지합니다.
