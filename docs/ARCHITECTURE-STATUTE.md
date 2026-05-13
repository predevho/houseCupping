# ARCHITECTURE-STATUTE

## 아키텍처 구현 규칙

### 디렉토리 구조 (FE)

```
FE/src/
├── app/                     # Next.js App Router 페이지
│   ├── (auth)/              # 인증 관련 라우트 그룹
│   ├── (main)/              # 메인 앱 라우트 그룹
│   └── layout.tsx
├── components/              # 공통 UI 컴포넌트
│   └── ui/                  # 기본 UI 요소 (버튼, 인풋 등)
├── features/                # 도메인별 기능 컴포넌트
│   ├── member/
│   ├── bean/
│   ├── cupping/
│   └── social/
├── lib/
│   └── supabase/
│       ├── client.ts        # 브라우저용 Supabase 클라이언트
│       └── server.ts        # 서버용 Supabase 클라이언트
└── types/
    └── database.ts          # Supabase 자동 생성 DB 타입
```

### Supabase 클라이언트 사용 규칙

- Server Component, Server Action, Route Handler: `lib/supabase/server.ts` 사용
- Client Component: `lib/supabase/client.ts` 사용
- 미들웨어: `@supabase/ssr`의 `createServerClient` 직접 사용 (현재 구현 유지)

### 데이터 패칭 규칙

- 목록/상세 조회: Server Component에서 직접 Supabase 쿼리
- 폼 제출(생성/수정/삭제): Server Action 사용
- 실시간 업데이트가 필요한 경우: Client Component + Supabase Realtime

### 에러 처리 규칙

- Supabase 쿼리 결과는 `{ data, error }` 구조로 반환됨
- error가 존재하면 반드시 처리하고, null/undefined 데이터로 렌더링하지 않는다
- 사용자에게 노출되는 에러 메시지는 한국어로 작성한다

### 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL (공개)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key (공개)
- service_role key는 절대 FE에서 사용하지 않는다

### UI 컴포넌트 규칙

- **ShadCN/ui**: 버튼, 인풋, 다이얼로그, 폼 등 인터랙티브 컴포넌트에 우선 사용
  - `components/ui/` 디렉토리에 위치
  - 필요한 컴포넌트만 선택적으로 추가 (`npx shadcn@latest add <component>`)
- **DaisyUI**: 레이아웃, 뱃지, 카드 등 유틸리티성 스타일에 활용
- 커스텀 CSS는 디자인 시스템으로 해결이 불가능한 경우에만 작성한다.

### 마이그레이션 규칙 (BE)

- 마이그레이션 파일명 형식: `YYYYMMDDHHMMSS_<설명>.sql`
- 새 테이블 생성 시 반드시 RLS를 활성화하고 정책을 정의한다
- 마이그레이션은 롤백 불가를 가정하고 신중하게 작성한다
