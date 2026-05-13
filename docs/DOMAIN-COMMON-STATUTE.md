# DOMAIN-COMMON-STATUTE

## 공통 도메인 구현 규칙

### DB 공통 규칙

- 모든 테이블은 `public` 스키마에 생성한다.
- 모든 테이블은 마이그레이션 파일에서 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` 를 반드시 실행한다.
- RLS 정책 명명 규칙: `{테이블명}_{action}_{범위}` (예: `beans_select_all`, `beans_update_own`)

### TypeScript 타입 규칙

- DB 타입은 `FE/src/types/database.ts` 의 `Database` 타입에서 파생한다.
- 개별 테이블 Row 타입: `Database['public']['Tables']['테이블명']['Row']`
- Insert/Update 타입도 `Database` 에서 파생한다.
- 임의로 인터페이스를 새로 정의하지 않고, DB 타입을 기준으로 한다.

### Supabase 쿼리 공통 규칙

- 쿼리 결과 `error`가 null이 아닌 경우 throw 또는 return으로 즉시 처리한다.
- 목록 쿼리는 항상 `order`를 지정하여 정렬 순서를 보장한다.
- 페이지네이션이 필요한 경우 `range(from, to)` 를 사용한다.

### 컴포넌트 공통 규칙

- 로딩 상태와 에러 상태는 항상 처리한다.
- Server Component에서 에러 발생 시 `error.tsx` 또는 `notFound()`를 활용한다.
