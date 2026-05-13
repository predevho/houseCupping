# DOMAIN-COMMON-CONSTITUTION

## 공통 도메인 핵심 원칙

### 1. 식별자
- 모든 레코드의 기본키는 UUID를 사용한다 (`gen_random_uuid()`).
- 외부에 노출되는 ID는 UUID 형식을 유지한다.

### 2. 타임스탬프
- 모든 테이블은 `created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL` 컬럼을 가진다.
- 수정 이력이 필요한 경우 `updated_at` 컬럼을 추가한다.

### 3. 소유권
- 사용자가 생성하는 모든 레코드는 `user_id UUID REFERENCES public.profiles(id)` 를 가진다.
- 소유자만 수정/삭제할 수 있다 (RLS로 강제).

### 4. 공개 읽기
- 현재 모든 데이터는 인증 없이 조회 가능하다 (`USING (true)` SELECT 정책).
- 비공개 데이터가 필요한 경우 도메인 문서에 명시하고 RLS 정책을 별도로 정의한다.

### 5. 연쇄 삭제
- 부모 레코드 삭제 시 자식 레코드는 기본적으로 `ON DELETE CASCADE`로 자동 삭제된다.
- 단, 공유 자산으로 보존이 필요한 경우 `ON DELETE SET NULL`을 사용할 수 있다. (예: `beans.user_id` — 탈퇴 후에도 원두 데이터 유지)
