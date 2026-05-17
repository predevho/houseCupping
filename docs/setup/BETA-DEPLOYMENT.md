# Beta Deployment Guide

## 목적

`houseCupping`을 베타 서비스로 배포할 때 필요한 최소 절차와 체크리스트를 정리한다.

권장 구성:

- FE: Vercel
- BE: Supabase hosted project

---

## 1. 사전 조건

- FE 기준 품질 검증 통과
  - `npm run build`
  - `npm run lint`
  - `npm test -- --runInBand`
- Supabase 마이그레이션 최신 상태 반영
- 운영용 Supabase 프로젝트 생성 완료
- 운영 도메인 또는 베타 도메인 확정

---

## 2. 환경 변수

프론트에 필요한 환경 변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

로컬에서는 `FE/.env.local`, 배포 환경에서는 Vercel 프로젝트 환경 변수에 등록한다.

---

## 3. Supabase 운영 전환 체크

### Auth

- `site_url`을 실제 프론트 도메인으로 맞춘다.
- redirect URL에 실제 서비스 URL을 추가한다.
- 현재 로컬 기준 `auth.email.enable_confirmations = false` 상태다.

권장 운영 전략:

1. 베타 초반:
   - 이메일 인증 비활성화 유지 가능
   - 가입 전환율 확인에 유리
2. 운영 안정화 후:
   - 이메일 인증 활성화
   - 메일 템플릿과 redirect URL 점검

프론트는 이미 `signUp` 결과에 `session`이 없을 때 `/auth/verify-email`로 대응 가능하다.

### Database / Storage

- 최신 migration 반영
- `beans` public bucket 생성 여부 확인
- 이미지 업로드/삭제 정책 확인
- seed 데이터는 운영 환경에 그대로 넣지 않는다

---

## 4. 프론트 배포 체크

### Vercel 권장 설정

- Root Directory: `FE`
- Build Command: `npm run build`
- Output: Next.js 기본값 사용
- 외부 Google Fonts fetch 없이 빌드되도록 시스템 폰트 스택 사용

### 배포 전 확인

- 공개 홈(`/`) 동작 확인
- `/auth` 로그인/회원가입 확인
- `/beans` 목록/상세 확인
- `/cupping` 목록/상세 확인
- 이미지 업로드 확인
- 다크모드 가독성 확인
- 모바일 화면에서 커핑 점수 드래그 입력 확인

---

## 5. 베타 오픈 전 스모크 테스트

- 비회원 공개 피드 열람 가능
- 회원가입 가능
- 로그인/로그아웃 가능
- 원두 등록 가능
- 커핑 노트 작성 가능
- 좋아요/댓글 가능
- 원두 이미지 표시 가능
- 상세 페이지 수정/삭제 버튼 노출 조건 정상

---

## 6. 롤백 기준

다음 중 하나라도 발견되면 베타 오픈을 보류하거나 이전 배포로 롤백한다.

- 인증 불가
- 커핑 노트 저장 실패
- 원두 이미지 업로드 실패
- 상세 페이지 진입 오류 다발
- 다크모드 가독성 치명적 이슈

---

## 7. 베타 이후 우선 과제

- 이메일 인증 운영 전환 여부 최종 결정
- 실제 사용자 피드백 기반 UX 수정
- 검색/필터 개선
- 관리자성 운영 기능 검토
- 성능 및 이미지 최적화
