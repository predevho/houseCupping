# Member — 구현 문서

## 개요

회원 프로필 조회 및 수정 기능 구현.

## 구현된 파일

| 파일 | 역할 |
|------|------|
| `src/features/member/actions.ts` | updateProfileAction Server Action |
| `src/features/member/EditForm.tsx` | 프로필 수정 폼 Client Component |
| `src/app/(app)/profile/page.tsx` | 내 프로필 페이지 (조회 + 수정) |
| `src/app/(app)/profile/[username]/page.tsx` | 타인 프로필 페이지 (읽기 전용) |

## 동작

- `/profile`: 로그인한 사용자의 username/display_name/가입일 표시 + 인라인 수정 폼
- `/profile/[username]`: 해당 username 사용자의 프로필 표시 (없으면 404)
- username 수정 시 중복 확인 (자기 자신 제외, `.neq('id', user.id)`), 유효성 검사 (4~16자, 영문/숫자/_/-)
- display_name 수정 시 유효성 검사 (4~12자)
- 수정 성공 시 `revalidatePath('/profile')`로 페이지 갱신
- username 중복 확인에 `.maybeSingle()` 사용 (없으면 null 반환)

## 범위 외 (추후 추가)

- 커핑 노트 목록, 원두 목록 (Bean/Cupping 도메인 구현 후)
