# AI-ACTION-LOGS

## 최근 작업 로그 (최대 100개 유지)

---

### 2026-05-17

**[18]** 공통 컴포넌트 추출 리팩터링
- `FE/src/components/ui/FieldError.tsx`: 인라인 에러 공통 컴포넌트 신규 (3 tests)
- `FE/src/components/ui/FormSubmitButton.tsx`: 브랜드 컬러 submit 버튼 공통화 (2 tests)
- `FE/src/components/ui/DeleteActionButton.tsx`: useTransition delete 버튼 공통화 (3 tests)
- Delete 버튼 3개 (DeleteBeanButton, DeleteButton, DeleteCommentButton) 얇은 래퍼로 교체
- BeanForm, CuppingForm, EditForm, LoginForm, SignupForm에 공통 컴포넌트 적용
- 브랜드 컬러 #8B2635 단일 위치 관리, 전체 176 tests PASS

### 2026-05-16

**[17]** 커핑 노트 수정/삭제 기능 구현 완료
- `CuppingForm.tsx`: `action` / `initialValues?` / `submitLabel` / `noteId?` props 추가 — create/edit 겸용 컴포넌트로 리팩토링
- `actions.ts`: `updateCuppingAction` 추가 (zero-row guard, bean_ratings upsert, redirect '/cupping/[id]')
- `src/app/(app)/cupping/[id]/edit/page.tsx` 신규 생성 (auth + note 병렬 fetch → 소유권 확인 후 secondary query)
- `src/app/(app)/cupping/[id]/page.tsx`: isOwner 조건부 수정 링크 + DeleteButton flex 배치
- 74 tests PASS (14 suites)

**[16]** 커핑 노트 상세 페이지 구현 완료
- `src/app/(app)/cupping/[id]/page.tsx` 신규 생성 (Server Component)
- `DeleteButton.tsx` 신규 생성 (Client Component, useTransition)
- `deleteCuppingAction` 추가 (`actions.ts`)
- 원두명 링크, 작성자 종합 평점, 로스팅일, 메모, 작성자 프로필 링크 표시
- isOwner 조건부 DeleteButton 렌더링
- 66 tests PASS (13 suites)

### 2026-05-15

**[15]** 문서 최신화 및 전체 테스트 확인
- 전체 테스트 59개 PASS (13 suites)
- `docs/features/CUPPING-IMPLEMENTATION.md` 신규 작성
- `docs/features/BEAN-IMPLEMENTATION.md` — 커핑 노트 섹션 추가 내용 반영
- `TODO-DONE.md` — 커핑 관련 완료 항목 9개 추가
- `TODO-READY.md` / `TODO-BACKLOG.md` 정리

**[14]** seed.sql GoTrue 인증 수정
- `auth.identities` INSERT 추가 (provider_id, identity_data, provider='email')
- `auth.users`에 `aud='authenticated'`, `role='authenticated'` 필드 추가
- `supabase db reset`으로 테스트 계정 로그인 정상화

**[13]** 커핑 노트 기능 구현 완료
- `FE/src/features/cupping/actions.ts`: createCuppingAction, isValidScore (Number.isInteger(v*2))
- `FE/src/features/cupping/CuppingForm.tsx`: SCORE_OPTIONS 0.5~5.0, 3 required selects + 선택 필드
- `FE/src/app/(app)/cupping/new/page.tsx`: searchParams await, beanId/bean 검증, 404 처리
- `FE/src/app/(app)/beans/[id]/page.tsx`: 커핑 노트 목록 추가, "+ 노트 작성" 링크
- `FE/middleware.ts`: `/cupping/new` PROTECTED_ROUTES 추가
- 13 tests PASS (actions 8 + CuppingForm 5)

**[12]** 점수 체계 0.5~5.0 전면 통일
- `20260513000014_bean_ratings_score_max_5.sql`: score <= 5.0 constraint, UPDATE 보정 추가
- `20260513000015_cupping_notes_score_0_5_to_5.sql`: aroma/acidity/body NUMERIC(3,1) 0.5~5.0 변환
- `supabase/seed.sql`: cupping_notes 값 수정 (9,8→4.5,4.0), bean_ratings 수정 (9.0,9.5→4.5,5.0)
- 도메인 문서 전면 수정: DOMAIN-CUPPING-CONSTITUTION, DOMAIN-CUPPING-STATUTE
- superpowers 문서 수정: specs/2026-05-15-cupping-note-design.md, plans/2026-05-15-cupping-note.md

### 2026-05-13

**[10]** 인증 UI 후속 수정 및 문서화
- 탭 전환 시 카드 크기 변동 수정: `h-[640px]` 고정 + `overflow-y-auto`
- 문서 최신화: DOMAIN-MEMBER-STATUTE, DOMAIN-MEMBER-CONSTITUTION, ARCHITECTURE-STATUTE, TODO-READY

**[09]** 인증 UI Task 8 — Auth 페이지 조립 완료
- `FE/src/app/auth/page.tsx`: Server Component, getUser() 인증 체크, 브랜딩 패널 + AuthTabs
- Supabase 타입 추론 오류 수정 (profileResult.data 명시적 타입 단언)
- jest.Mock 캐스팅 `as unknown as jest.Mock`으로 수정
- tsc --noEmit 에러 0개, 전체 16 tests PASS

**[08]** 인증 UI Task 7 — SignupForm 컴포넌트 구현
- `FE/src/app/auth/SignupForm.tsx`: 5개 필드, useActionState, 비밀번호 확인, 서버 에러 표시
- `FE/src/app/auth/__tests__/SignupForm.test.tsx`: 4 tests PASS
- React 19 + JSDOM 이슈로 onClick 기반 비밀번호 검증 유지

**[07]** 인증 UI Task 6 — LoginForm 컴포넌트 구현
- `FE/src/app/auth/LoginForm.tsx`: useActionState, pending/error 처리, fieldClass 모듈화, role=alert
- `FE/src/app/auth/__tests__/LoginForm.test.tsx`: 3 tests PASS

**[06]** 인증 UI Task 5 — AuthTabs 탭 전환 컴포넌트 구현
- `FE/src/app/auth/AuthTabs.tsx`: useState 탭 전환, LoginForm/SignupForm 조건부 렌더링
- `FE/src/app/auth/__tests__/AuthTabs.test.tsx`: 3 tests PASS

**[05]** 인증 UI Task 4 — Server Actions 구현
- `FE/src/app/auth/actions.ts`: loginAction(username→email 역조회), signupAction(username 중복 체크)
- `FE/src/app/auth/__tests__/actions.test.ts`: 6 tests PASS
- `FE/jest.config.ts`: @/* moduleNameMapper 추가
- formData null 안전성 가드 추가 (follow-up fix)

**[04]** 인증 UI Task 1·2·3 — 마이그레이션, 타입, 미들웨어 업데이트 완료

**[03]** DaisyUI, ShadCN/ui 설치 및 보안 이슈 처리

**[02]** Supabase 클라이언트, 미들웨어, DB 마이그레이션 구현

**[01]** 프로젝트 문서화 초기 작성
- CONTEXT.md, TODO-*.md, ARCHITECTURE-*.md, DOMAIN-*.md, AI-*.md 전체 생성
- 프로젝트 구조 파악: FE(Next.js 15) + BE(Supabase), 커피 커핑 앱
- 식별된 도메인: Member, Bean, Cupping, Social
