---
name: weather-animal-orchestrator
description: "날씨 동물 앱 전체를 빌드하는 오케스트레이터. 3명의 서브에이전트(content-designer, app-builder, qa-inspector)를 순차 호출하여 완성된 앱을 생성한다. '날씨 동물 빌드', '날씨앱 만들어줘' 요청 시 이 스킬을 사용한다."
---

# Weather Animal Orchestrator

실행 모드: 서브 에이전트 (파이프라인)

## 에이전트 구성

| 에이전트 | 타입 | 역할 | 산출물 |
|----------|------|------|--------|
| content-designer | general-purpose | 캐릭터 30종 콘텐츠 설계 | src/data/characters.ts, src/data/types.ts |
| app-builder | general-purpose | React 앱 전체 구현 | 전체 소스 코드 |
| qa-inspector | general-purpose | 통합 품질 검증 + 빌드 수정 | _workspace/03_qa_report.md |

## 워크플로우

### Phase 1: 준비
1. `_workspace/design-doc.md` 존재 확인
2. resignation-test 프로젝트 구조 확인 (UX 패턴 참조용)

### Phase 2: 콘텐츠 설계 (content-designer)
```
Agent(
  prompt: ".claude/agents/content-designer.md를 읽고 역할을 수행하라. _workspace/design-doc.md를 읽고 캐릭터 30종을 설계하라.",
  model: "opus"
)
```
- 산출물: `src/data/characters.ts`, `src/data/types.ts`
- 검증: 파일 존재 + 캐릭터 수 확인

### Phase 3: 앱 빌드 (app-builder)
```
Agent(
  prompt: ".claude/agents/app-builder.md를 읽고 역할을 수행하라. _workspace/design-doc.md와 src/data/ 파일을 기반으로 앱 전체를 구현하라.",
  model: "opus"
)
```
- 산출물: 전체 소스 코드 (빌드 가능 상태)
- 검증: `npm run build` 성공

### Phase 4: QA 검증 (qa-inspector)
```
Agent(
  prompt: ".claude/agents/qa-inspector.md를 읽고 역할을 수행하라. 전체 코드를 검증하고 발견된 이슈를 수정하라.",
  model: "opus"
)
```
- 산출물: `_workspace/03_qa_report.md`
- 검증: 빌드 성공 + 크리티컬 이슈 0건

### Phase 5: 이미지 (수동 — 코드 완성 후)
- Recraft API 배치 생성은 별도 세션에서 수동 진행
- 개발 중에는 플레이스홀더 사용

## 데이터 전달

| Phase | 산출물 | 다음 Phase 입력 |
|-------|--------|----------------|
| 1 → 2 | design-doc.md | content-designer가 읽음 |
| 2 → 3 | characters.ts, types.ts | app-builder가 읽음 |
| 3 → 4 | 전체 소스 코드 | qa-inspector가 검증 |

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| content-designer 실패 | 부분 결과라도 저장, 빈 캐릭터는 placeholder로 채움 |
| app-builder 빌드 실패 | qa-inspector가 빌드 에러 수정 시도 (최대 3회) |
| qa-inspector 이슈 발견 | 크리티컬 이슈는 즉시 수정, 마이너 이슈는 리포트에 기록 |

## 테스트 시나리오

### 정상 흐름
1. content-designer가 30종 캐릭터 생성 → characters.ts에 30개 엔트리
2. app-builder가 앱 구현 → npm run build 성공
3. qa-inspector가 검증 → 이슈 0건 또는 수정 완료

### 에러 흐름
1. content-designer가 28종만 생성 → 오케스트레이터가 부족분 보고 + 빌드 계속
2. app-builder 빌드 실패 → qa-inspector가 타입 에러 수정 → 재빌드 성공
