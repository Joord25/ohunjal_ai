## 러닝 장기 프로그램 — 구조 + 편집 주의사항

**해당 파일:** [functions/src/runningProgram.ts](functions/src/runningProgram.ts), [functions/src/plan/runningProgramApi.ts](functions/src/plan/runningProgramApi.ts), [src/components/dashboard/RunningProgramSheet.tsx](src/components/dashboard/RunningProgramSheet.tsx), [src/utils/programSessionLabels.ts](src/utils/programSessionLabels.ts)

### 프로그램 카탈로그

4종 고정: `vo2_boost` / `10k_sub_50` / `half_sub_2` / `full_sub_3`

| 프로그램 | 기간 | 챕터 구조 |
|---|---|---|
| vo2_boost | 8주 | Base(1-4) → Peak+Taper(5-8, tt_5k 종료) |
| 10k_sub_50 | 10주 | Base(1-4) → Build(5-8) → Peak+Taper(9-10) |
| half_sub_2 | 12주 | Base(1-4) → Build(5-8) → Peak+Taper(9-12) |
| full_sub_3 | 12주 | Base(1-4) → Build(5-8) → Peak+Taper(9-12) |

### 동일 slotType 중복 편성 지점 (혼동 주의)

SPEC 상 의도적으로 **같은 slotType이 서로 다른 훈련 맥락에 재편성**됨. UI/라벨에서 반드시 구분.

| slotType | 등장 위치 | 맥락 라벨 (src/utils/programSessionLabels.ts) |
|---|---|---|
| `tt_2k` | Week 1 Day 1 (초기 기준점) | "Base 진입 · 현재 2K 기준점" |
| `tt_2k` | Week 4 마지막 (Chapter 1 boundary) | "Base 완료 · 4주 성장 재측정" |
| `tt_5k` | Week 8 마지막 (Chapter 2 boundary, VO2 제외) | "Threshold 해방 · 5K 재측정" |
| `tt_5k` | Week 8 race week (vo2_boost 전용) | "VO2 완료 · 5K 최종 측정" |
| `dress_rehearsal` | Week 9(10K) / Week 10(Half·Full) | "Peak 점검 · 레이스 시뮬레이션" |

**⚠ 신규 slotType 추가 시:** 동일 slotType이 여러 위치 편성되면 `programSessionLabels.ts`에 맥락 매핑 추가 필수.

### 데이터 구조

`SavedPlan` 에 러닝 프로그램 전용 필드 (회의 64-C):
- `programCategory: "running" | "strength"`
- `programGoal: RunningProgramId` (예: `"10k_sub_50"`)
- `limiterAtStart: "build_aerobic" | "break_ceiling"`
- `weekIndex: 1..totalWeeks`
- `chapterIndex: 1 | 2 | 3`
- `dayOfWeek: 1-7 (ISO)`
- `targetPaceSec: number | null` (초/km)
- `slotType: string` (예: `"tt_2k"`, `"threshold_2x15"`, `"dress_rehearsal"`)

### 완료 추적

- 클라이언트: `markSessionCompleted(planId)` — `plan.id` 기준 로컬 `completedAt` 저장
- ⚠ **서버 미저장 이슈 (미해결)**: Cloud Function `listSavedPlans`가 `completedAt: null` 리턴. `syncSavedPlansFromServer` 가 로컬 완료 상태 덮어쓸 잠재 리스크. 회의 64-ζ-β 이월.

### 페이스 매트릭스

- `PACE_MATRIX`: 3 프로그램 × 5 pace type (10k/half/full)
- `calcVo2PaceFrom5K(user5kPaceSec)`: vo2_boost 는 유저 5K 기록 상대 오프셋 계산
- 유저 5K 기록은 `RunningProgramSheet` settings 단계에서 수집 (VO2 전용 필수)

### Full sub-3 게이트

`/api/checkFullSub3Gate` — 주간 평균 km(8주)/Half 기록/부상 3지표 판정. 8주 평균은 GPS 히스토리 자동 계산 (회의 64-E Phase 4.1, 거짓 답변 우회 불가).

회의 64-F에서 **선택 단계 게이트는 해제** (누구나 탐색 가능) — 저장 시점에 프리미엄 검증만.

### 회의 레퍼런스

- SPEC: [.planning/RUNNING_PROGRAM_SPEC.md](../../.planning/RUNNING_PROGRAM_SPEC.md)
- 회의 64-C: 룰엔진 SavedPlan 필드 확정
- 회의 64-E/F/G/H: 게이트·한도·생성 로직 정비
- 회의 64-XYZ: `markSessionCompleted` 호출 누락 수정 (Issue 1)
- 회의 64-ζ (2026-04-21): 동일 slotType 맥락 라벨 시스템 도입
