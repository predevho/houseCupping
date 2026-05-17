# AI-MAJOR-EVENT

## 주요 사건 및 의사결정

---

### 2026-05-17 — 공통 컴포넌트 추출 리팩터링

하드코딩된 `#8B2635` 브랜드 컬러와 중복 Delete 패턴을 `src/components/ui/` 공통 컴포넌트 3개로 통합.
- `FieldError`: 폼 인라인 에러 공통화
- `FormSubmitButton`: 브랜드 컬러 submit 버튼 단일 위치 관리
- `DeleteActionButton`: useTransition delete 패턴 단일화
- 전체 176 tests 통과 유지

---

### 2026-05-16 — 커핑 노트 상세 / 수정 / 삭제 기능 구현 완료

**구현 내용**:
- 커핑 노트 상세 페이지 (`/cupping/[id]`): 원두명 링크, 작성자 종합 평점, isOwner 조건부 수정·삭제 버튼
- `CuppingForm` create/edit 겸용 리팩토링: `action` / `initialValues?` / `submitLabel` / `noteId?` props 외부 주입
- `updateCuppingAction`: zero-row guard (`.select('id')` 체인으로 미수정 탐지), bean_ratings upsert
- `/cupping/[id]/edit` 페이지: auth + note 병렬 fetch → 소유권 확인 후 secondary query (bean_ratings)

**주요 결정**:
- `CuppingEditForm` 별도 컴포넌트 생성 거부 → `CuppingForm` 리팩토링으로 대응 (컴포넌트 증식 방지)
- 수정 후 redirect 대상: `/cupping/[id]` (원두 상세 아님)
- auth 미들웨어 수정 없이 페이지 레벨에서 소유권 체크 (공개 상세 페이지와 분리)
- 비인증 사용자가 edit 접근 시 `/cupping/[id]`로 redirect (상세 페이지가 공개이므로 허용)

**결과**: 74 tests PASS (14 suites), TypeScript clean

---

### 2026-05-15 — 커핑 노트 기능 구현 완료 + seed.sql 인증 수정

**상황**: 커핑 노트 등록 기능 구현 후 로컬 테스트 계정 로그인 불가 문제 발생.

**원인 파악**: GoTrue는 `auth.users`에 직접 INSERT된 유저를 인증하지 않음. `auth.identities` 레코드 없이는 이메일/비밀번호 로그인 불가. 또한 `aud`, `role` 필드 누락으로 세션 발급 실패.

**해결**: seed.sql에 `auth.identities` INSERT 추가, `auth.users`에 `aud='authenticated'` / `role='authenticated'` 추가. `supabase db reset`으로 재적용.

**점수 체계 결정**: 전체 점수 필드(aroma, acidity, body, bean_ratings.score)를 0.5~5.0 (0.5 단위)으로 통일. DB 마이그레이션 2개 추가(014, 015).

**부동소수점 처리**: `v % 0.5 === 0` 대신 `Number.isInteger(v * 2)` 사용. 자바스크립트 부동소수점 오차 방지.

**구현 결과**: 59 tests PASS (13 suites), 커핑 노트 등록 + 원두 상세 노트 목록 완성.

---

### 2026-05-13 — 프로젝트 초기화 완료 및 문서화 시작

**상황**: Next.js 15 FE, Supabase BE 초기화와 DB 마이그레이션 4개가 완료된 상태. UI/기능 구현은 미시작.

**도메인 결정**: 커핑 앱의 도메인을 4개로 구분함
- Member: 회원/인증
- Bean: 원두 관리
- Cupping: 커핑 노트 및 평점
- Social: 좋아요 및 댓글

**아키텍처 결정**: CLAUDE.md에 명시된 도메인 문서 선행 원칙에 따라 Bean, Cupping, Social 도메인 문서도 추가 생성 (CLAUDE.md에는 Member만 명시되어 있었으나, 이미 DB에 존재하는 도메인이므로 문서화가 필요하다고 판단)
