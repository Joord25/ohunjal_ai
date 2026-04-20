## 작업 워크플로 — 고위험 파일 편집 전 체크리스트

편집 실수 재발 방지 규칙. 새 세션에서도 자동 로드되므로 이 룰이 적용된다는 전제로 작업.

### 고위험 파일 (편집 전 회의록 grep 필수)

아래 파일 편집 시, 손 대기 전에 **관련 과거 결정/버그 이력**을 `.planning/MEETING_LOG.md`에서 반드시 확인.

| 파일 | 과거 이슈 빈도 | 확인 사항 |
|---|---|---|
| `src/components/report/ShareCard.tsx` | 高 | html2canvas 4대 gotcha ([share-card.md](share-card.md)) |
| `src/components/plan/PlanShareCard.tsx` | 高 | 동일 |
| `functions/src/runningProgram.ts` | 中 | 페이스 매트릭스·챕터 구조 ([running-program.md](running-program.md)) |
| `src/components/workout/FitScreen.tsx` | 中 | GPS/알람/교체 풀/인터벌 로직 ([workout-session.md](workout-session.md)) |
| `src/components/workout/WorkoutSession.tsx` | 中 | 세션 복원/피드백 로직 |
| `src/app/app/page.tsx` | 中 | 뷰 라우팅/세션 복원/activeSavedPlanId 흐름 |
| `functions/src/ai/*.ts` | 中 | 프롬프트 이력 `PROMPT_HISTORY.md` 선확인 |

**실행:**
```
Grep pattern="<파일명 또는 기능 키워드>" path=".planning/MEETING_LOG.md" output_mode="content" -C 3
```

### 편집 전 3단계 체크

1. **코드 내 주석 전수 스캔** — `// 회의 N` / `html2canvas` / `iOS` / `⚠` / `주의` 등. 기존 주석은 과거 실수의 화석 — 무시하지 말 것.
2. **관련 rules 파일 로드** — `.claude/rules/` 에 매칭되는 파일 있으면 먼저 읽기.
3. **회의록 grep** — 위 표 기준 고위험 파일이면 MEETING_LOG 키워드 검색.

### 작업 완료 후 체크

1. **빌드 검증 필수** — `npm run build` (Next.js) + functions 변경 시 `cd functions && npm run build`
2. **i18n 동시 업데이트** — UI 텍스트는 `ko.json` + `en.json` 둘 다 반영 ([feedback_i18n_always](../../../memory/feedback_i18n_always.md))
3. **회의 결정/버그 fix 기록** — `.planning/MEETING_LOG.md` 에 회의 ID + 근본 원인 + 결정 + 파일 수정 + 미해결 과제 기록

### 커밋 규칙

- **분리 커밋 우선** — 서로 다른 회의/도메인 변경을 한 커밋에 묶지 말 것
- **Co-Authored-By Claude 트레일러 금지** ([feedback_commit_attribution](../../../memory/feedback_commit_attribution.md))
- **커밋 전 `git status` 필수** — untracked 에셋 누락 / 의도치 않은 타 도메인 변경 감지
- **functions/ 수정 있으면** `firebase deploy --only functions` 수동 (hosting은 CI 자동)

### 재발 방지가 실패했을 때

동일 버그가 재발하면 **규칙이 부족한 것**. 즉시:
1. 해당 파일 전용 `.claude/rules/*.md` 신설 또는 기존 파일 보강
2. 회의록에 "재발 건" 명시 후 패턴 추출
3. 고위험 파일 목록에 추가

### 실수 케이스 (참고용)

- 2026-04-21 웨이트 공유카드 `gap: 4` 재도입 — 같은 파일 안에 html2canvas 주석 3개가 이미 있었음에도 1차 편집에서 놓침. 이 룰의 직접 계기.
