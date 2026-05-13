# ARCHITECTURE-CONSTITUTION

## 아키텍처 핵심 원칙

### 1. 모노레포 분리 원칙
- FE(프론트엔드)와 BE(백엔드)는 `FE/`, `BE/` 디렉토리로 명확히 분리한다.
- FE는 Supabase REST API / Realtime만 통해 DB에 접근하며, 직접 DB 연결을 하지 않는다.

### 2. 도메인 중심 설계
- 기능은 도메인 단위로 구성한다 (Member, Bean, Cupping, Social).
- 새 도메인을 추가할 때는 반드시 DOMAIN-XXX-CONSTITUTION.md 와 DOMAIN-XXX-STATUTE.md 를 먼저 작성한다.
- 도메인 문서 없이 해당 도메인의 코드를 작성하지 않는다.

### 3. 서버/클라이언트 경계 명확화
- Next.js App Router의 Server Component / Client Component 경계를 명확히 구분한다.
- 데이터 패칭은 Server Component에서 수행하는 것을 기본으로 한다.
- 인터랙션(이벤트 핸들러, 상태)이 필요한 경우에만 Client Component를 사용한다.

### 4. 보안 우선
- 모든 DB 테이블에 RLS(Row Level Security)를 활성화한다.
- 클라이언트에서는 anon key만 사용하고, service_role key는 서버 사이드(Edge Function 등)에서만 사용한다.

### 5. 테스트 가능한 구조
- 비즈니스 로직은 UI와 분리하여 단위 테스트가 가능하도록 작성한다.
- TDD를 기본 접근 방식으로 사용한다.

### 6. UI 구현 원칙
- 디자인에 과도한 시간을 투자하지 않는다.
- UI는 기존 디자인 시스템(ShadCN, DaisyUI)을 우선 활용하고, 직접 스타일을 작성하는 것을 최소화한다.
