# 기본 원칙

* 모든 문서를 한 번에 읽지 말고, 필요한 문서만 선택해서 읽어라
* 문서를 기준으로 작업하고, 문서 없이 추측하지 마라
* 문서가 부족하거나 충돌하면 추측하지 말고 기록하거나 보고하라
* 가능하다면 TDD를 수행해라
* 모든 테스트/린트가 통과해야 작업 완료로 판단한다
* CONTEXT.md를 로그 저장소로 사용하지 마라
* 요청된 작업 범위를 벗어난 기능을 임의로 추가하지 마라
* 에이전트가 생성한 코드도 사람이 이해할 수 있는 구조로 작성하라

---

# 문서 구조

```
docs/
├── CONTEXT.md                   # 현재 작업 캐시 (항상 최신)
├── setup/
│   └── FOUNDATION-SETUP.md      # 프로젝트 기초 세팅 현황
├── features/                    # 기능별 구현 문서 (매 로직마다 작성)
│   └── AUTH-IMPLEMENTATION.md
├── domain/                      # 도메인 원칙·규칙
│   ├── DOMAIN-COMMON-*.md
│   ├── DOMAIN-MEMBER-*.md
│   ├── DOMAIN-BEAN-*.md
│   ├── DOMAIN-CUPPING-*.md
│   └── DOMAIN-SOCIAL-*.md
├── architecture/                # 아키텍처 원칙·규칙
│   ├── ARCHITECTURE-CONSTITUTION.md
│   └── ARCHITECTURE-STATUTE.md
├── todo/                        # 작업 상태
│   ├── TODO-READY.md
│   ├── TODO-DOING.md
│   ├── TODO-BACKLOG.md
│   └── TODO-DONE.md
└── logs/                        # 작업 기록
    ├── AI-ACTION-LOGS.md
    ├── AI-MAJOR-EVENT.md
    └── AI-MAJOR-EVENT-RECAP.md
```

---

# 문서 상세

## 기본

* docs/CONTEXT.md : 현재 작업 수행에 필요한 최소한의 정보만 유지하는 캐시

CONTEXT.md 규칙

* 현재 작업에 직접 필요한 정보만 저장한다
* 항상 최신 상태로 유지한다
* 불필요한 내용은 즉시 제거한다
* 로그성 데이터나 중복 정보는 저장하지 않는다

---

## 세팅

* docs/setup/FOUNDATION-SETUP.md : 프로젝트 기초 세팅 현황 (기술 스택, DB, 주요 파일)

---

## 기능 구현 문서

* docs/features/ : 기능 로직 구현 완료 시 반드시 작성
* 파일명 형식: `{DOMAIN}-IMPLEMENTATION.md` (예: `AUTH-IMPLEMENTATION.md`)
* 양식: docs/setup/FOUNDATION-SETUP.md 참고

---

## 작업 상태

* docs/todo/TODO-READY.md : 바로 작업 가능한 작업 목록
* docs/todo/TODO-DOING.md : 현재 진행 중인 작업
* docs/todo/TODO-BACKLOG.md : 아직 시작하지 않은 예정 작업
* docs/todo/TODO-DONE.md : 완료된 작업 기록

---

## 아키텍처

* docs/architecture/ARCHITECTURE-CONSTITUTION.md : 아키텍처 핵심 원칙
* docs/architecture/ARCHITECTURE-STATUTE.md : 아키텍처 구현 규칙

---

## 도메인

* docs/domain/DOMAIN-COMMON-CONSTITUTION.md : 공통 도메인 원칙
* docs/domain/DOMAIN-COMMON-STATUTE.md : 공통 도메인 규칙
* docs/domain/DOMAIN-MEMBER-CONSTITUTION.md : 회원 도메인 원칙
* docs/domain/DOMAIN-MEMBER-STATUTE.md : 회원 도메인 규칙
* docs/domain/DOMAIN-BEAN-CONSTITUTION.md : 원두 도메인 원칙
* docs/domain/DOMAIN-BEAN-STATUTE.md : 원두 도메인 규칙
* docs/domain/DOMAIN-CUPPING-CONSTITUTION.md : 커핑 도메인 원칙
* docs/domain/DOMAIN-CUPPING-STATUTE.md : 커핑 도메인 규칙
* docs/domain/DOMAIN-SOCIAL-CONSTITUTION.md : 소셜 도메인 원칙
* docs/domain/DOMAIN-SOCIAL-STATUTE.md : 소셜 도메인 규칙

---

## 기록

* docs/logs/AI-ACTION-LOGS.md : 최근 작업 로그, 최대 100개 유지
* docs/logs/AI-MAJOR-EVENT.md : 주요 사건 및 의사결정
* docs/logs/AI-MAJOR-EVENT-RECAP.md : 사람이 빠르게 읽기 위한 주요 사건 요약

---

# 문서 규칙

## 읽기

* 작업과 직접 관련 있는 문서만 읽어라
* 긴 문서는 바로 전체 읽지 말고, 먼저 grep/search로 관련 키워드를 찾은 뒤 필요한 범위만 읽어라

---

## 업데이트

* 작업 중 발생한 사실, 결정, 규칙, 문제, 다음 작업은 관련 문서에 반영하라
* 프로젝트 상태가 바뀌면 사용자 요청 없이도 관련 문서를 업데이트하라
* 구조/원칙 변경은 임의로 확정하지 말고 기록하거나 보고하라

---

# 작업 후 반영 위치

## TODO

* 완료 → docs/todo/TODO-DONE.md
* 진행 중 → docs/todo/TODO-DOING.md
* 신규 → docs/todo/TODO-BACKLOG.md
* 즉시 가능 → docs/todo/TODO-READY.md

---

## 설계

* 구조 변경 → docs/architecture/ARCHITECTURE-STATUTE.md
* 원칙 변경 → docs/architecture/ARCHITECTURE-CONSTITUTION.md

---

## 도메인

* 공통 규칙 → docs/domain/DOMAIN-COMMON-STATUTE.md
* 특정 도메인 규칙 → docs/domain/DOMAIN-XXX-STATUTE.md
* 특정 도메인 원칙 → docs/domain/DOMAIN-XXX-CONSTITUTION.md

새로운 도메인이 생기면 반드시 다음 문서를 생성한다.

* docs/domain/DOMAIN-XXX-CONSTITUTION.md
* docs/domain/DOMAIN-XXX-STATUTE.md

도메인 문서 없이 해당 도메인의 기능을 구현하지 마라.

---

## 기능 구현 문서

* 기능 구현 완료 시 → docs/features/{DOMAIN}-IMPLEMENTATION.md

---

## 기록

* 작업 로그 → docs/logs/AI-ACTION-LOGS.md
* 중요한 결정/사건 → docs/logs/AI-MAJOR-EVENT.md
* 중요한 결정/사건 요약 → docs/logs/AI-MAJOR-EVENT-RECAP.md

---

## 상태

* 현재 작업 수행에 필요한 최소 정보 → docs/CONTEXT.md
