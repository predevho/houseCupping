# AI-MAJOR-EVENT

## 주요 사건 및 의사결정

---

### 2026-05-13 — 프로젝트 초기화 완료 및 문서화 시작

**상황**: Next.js 15 FE, Supabase BE 초기화와 DB 마이그레이션 4개가 완료된 상태. UI/기능 구현은 미시작.

**도메인 결정**: 커핑 앱의 도메인을 4개로 구분함
- Member: 회원/인증
- Bean: 원두 관리
- Cupping: 커핑 노트 및 평점
- Social: 좋아요 및 댓글

**아키텍처 결정**: CLAUDE.md에 명시된 도메인 문서 선행 원칙에 따라 Bean, Cupping, Social 도메인 문서도 추가 생성 (CLAUDE.md에는 Member만 명시되어 있었으나, 이미 DB에 존재하는 도메인이므로 문서화가 필요하다고 판단)
