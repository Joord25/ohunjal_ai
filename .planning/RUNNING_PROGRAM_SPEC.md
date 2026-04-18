# 러닝 프로그램 룰엔진 SPEC (v1)

**작성일**: 2026-04-18
**최종 수정**: 2026-04-18 (v1 — 자문단 Seiler/Esteve-Lanao/Bakken 3인 통합 답변 반영)
**작성자**: Claude (대표 임주용 지시, 회의 합의 기반)
**상태**: v1 — 대표 최종 컨펌 대기. 컨펌 후 Phase 1 착수.
**원천**: "How to Improve Your VO2 Max (5 Levels)" 영상 + 대표 지시 + 자문단 답변
**관련 자문단**: [.planning/advisors/running.md](advisors/running.md)

## 버전 히스토리

| 버전 | 날짜 | 변경 |
|---|---|---|
| v0 | 2026-04-18 | 초안 |
| v0.1 | 2026-04-18 | 대표 Q1-Q5 컨펌 반영: 12종→4종, 주차 차등(8/10/12/12), VO2 max 측정 외부 위임, limiter 2분기, **4주 청킹 리텐션 섹션 신규** |
| **v1** | **2026-04-18** | **자문단 답변 통합**: 20칸 페이스 테이블 확정, **Full sub-3 진입 게이트 룰 신규**, 챕터별 훈련 구조·템플릿 구체화, current fitness TT / dress rehearsal 세션 추가 |

---

## 1. 목적

**ChatGPT/Runna/Nike Run Club이 못 주는 정량화된 개인 맞춤 러닝 프로그램 룰엔진**을 구축한다. 사용자 목표(VO2 max 80, 10K sub-50, Half sub-1:30, Full sub-3 등)를 선택하면 주차별 자동 스케줄이 생성되고, 완주 기록을 기반으로 다음 주차 페이스가 자동 조정된다.

## 2. 배경 (영상 핵심 학습)

- 러닝 성능은 **3가지 limiter** 중 하나에 의해 결정됨 — aerobic power / anaerobic battery / speed ceiling (processing power)
- 랩 테스트 없는 아마추어는 **2-way 단순화**로 충분 (대표 지시 2026-04-18)
- VO2 max는 "마라톤이 키운다"는 직관과 반대로 **800m 반복**이 가장 효과적
- 80/20 법칙은 엘리트 관찰에서 나왔으나 Esteve-Lanao RCT (PMID 23752040)로 **아마추어에게도 유효** 검증됨
- 영상이 떠먹여준 주간 템플릿은 NN Running Team Kaptagat 캠프 패턴(Tue 인터벌/Thu 템포/Sat 롱런)과 일치 → 현장 이미 검증된 구조

## 3. 범위

### In-Scope (v1)
- **프로그램 4종 고정** (대표 Q1 컨펌): VO2 max 향상, 10K sub-50, Half sub-2, Full sub-3
- **주차 수**: VO2 max 8주 / 10K 10주 / Half 12주 / Full 12주 — **전원 12주 상한, 3개월 이상 금지** (대표 Q2 컨펌, 메모리 `feedback_user_attention_span.md`)
- **4주 청킹**: 모든 프로그램 내부를 **4주 = 1 챕터**로 분할 + 챕터 경계 재후킹 (§11 신규)
- **2-way limiter 판정** → 주간 분포 자동 전환 (Q4 컨펌)
- **세션 타입 11종** (기존 6 + 신규 5)
- **페이스 테이블 20칸** (4 프로그램 × 5 페이스 타입) — 자문단 검증 대기 (Q5)
- **savedPlans.ts 확장** (programId/sessionNumber 재활용)
- **GA 이벤트 분리** (program_session_*)
- **교육형 챗 통합** (parseIntent 키워드 감지 + "왜 이 훈련인지" 설명 레이어)

### Out-of-Scope (v1)
- **VO2 max 앱 내 측정** (대표 Q3 컨펌, 메모리 `feedback_product_scope_focus.md`) — 측정은 유저가 외부(애플워치/가민/병원)에서, 앱은 **훈련만** 제공
- 심박계 연동 (heart rate zone 기반 처방) — v2 검토
- 랩 테스트 기반 정밀 limiter 3-way 판정
- 음성 코칭 (러닝 중 실시간 TTS)
- 레이스 당일 pacing 전략
- 크로스트레이닝 (사이클/로잉 대체 세션)
- **v2 확장 프로그램** (대표 Q1 컨펌으로 v2 계획 자체 삭제. 5K, sub-60/45, sub-4/3:30 등 전부 v1 제외)

---

## 4. 프로그램 카탈로그 (v1 — 4종 고정)

### 4.1 프로그램 매트릭스

| ID | 프로그램명 | 목표 | 주차 | 청크 | 목표 페이스 기준 | 전제조건 |
|---|---|---|---|---|---|---|
| `vo2_boost` | VO2 max 향상 | VO2 max 상승 (유저가 외부 측정) | **8주** | 2챕터 | 5K 기록 기반 상대 페이스 | 없음 (입문 가능) |
| `10k_sub_50` | 10K sub-50 | 10K 50분 이내 PR | **10주** | 2.5챕터 | M = 5:00/km | 30분 연속 러닝 경험 1회+ |
| `half_sub_2` | Half sub-2 | 하프마라톤 2시간 이내 | **12주** | 3챕터 | M = 5:41/km | 최근 4주 내 10K ≤ 55:00 OR 60분 연속 러닝 |
| `full_sub_3` | Full sub-3 | 풀마라톤 3시간 이내 | **12주** | 3챕터 | M = 4:16/km | **§4.3 진입 게이트 룰 필수 충족** |

**차등 원칙** (대표 Q2 컨펌): 난이도 낮을수록 짧게 (입문 유도), 난이도 높을수록 12주 꽉 채움 (준비 필요량).

### 4.3 Full sub-3 진입 게이트 룰 (자문단 필수 요구)

자문 답변(Bakken + Canova 방법론): **주 50km 베이스 + Half 1:30 이하** 없이 12주 Full sub-3 시도는 부상·미완주 위험. 엄격한 게이트 필수.

```ts
function canEnterFullSub3(user: UserProfile, history: WorkoutHistory[]): GateResult {
  const recent8wkAvgKm = calcWeeklyAvgKm(history, 8);
  const recentHalfTime = findRecentRaceTime(history, "half", 12); // 최근 12주 내
  const recent30kRun = history.find(h =>
    h.sessionData.title.includes("러닝") &&
    (h.stats.totalDurationSec ?? 0) >= 10800 && // 3시간+
    withinLast(h.date, 4) // 최근 4주 내
  );
  const hasInjury = user.recentInjury; // 온보딩 플래그

  const volumeOk = recent8wkAvgKm >= 50;
  const benchmarkOk = (recentHalfTime && recentHalfTime <= 5400) || !!recent30kRun; // 1:30:00 = 5400s
  const healthOk = !hasInjury;

  if (volumeOk && benchmarkOk && healthOk) return { ok: true };

  const reasons: string[] = [];
  if (!volumeOk) reasons.push(`최근 8주 평균 주간 거리 ${recent8wkAvgKm}km (필요: 50km+)`);
  if (!benchmarkOk) reasons.push("최근 12주 내 Half 1:30 이하 기록 없음 또는 30K 연속 러닝 기록 없음");
  if (!healthOk) reasons.push("최근 부상 회복 중");

  return {
    ok: false,
    reasons,
    redirect: "half_sub_2" // Half 먼저 권장
  };
}
```

**UI 처리**: 게이트 실패 시 Full sub-3 카드를 **"잠김" 상태로 표시** + "Half sub-2 먼저 완주 후 다시 도전하기" CTA. 메모리 `feedback_product_positioning.md` 준수 — "당신은 아직 부족함" 같은 부정 카피 금지, **"베이스가 쌓이면 도전 가능"** 긍정 카피로 우회.

### 4.2 프로그램 선택 UI

- **진입점**: 챗 intent ("마라톤 sub3", "10km 50분") OR MyPlans 탭 "프로그램 추가" CTA
- **선택 플로우**:
  1. 목표 선택 (4종 중 택1)
  2. **전제조건 자가 체크** (Full sub-3의 경우 "주 60km 베이스 있어요?" 가드)
  3. 시작일 지정
  4. 주 훈련 가능 횟수 (3/4/5일)
  5. **미리보기 = 챕터별 요약** ("챕터 1: base 4주 → 챕터 2: build 4주 → 챕터 3: peak+taper 4주") — 12주 통짜로 보여주지 않음 (메모리 `feedback_user_attention_span.md`)
  6. 컨펌 → 저장

---

## 5. 2-way Limiter 판정

### 5.1 판정 룰 (v0.1 — 2분기 단순화, 대표 Q4 컨펌)

**입력 2개 → 판정 자동**:

| 입력 | 소스 |
|---|---|
| 러닝 경력 6개월+ | 유저 1문항 ("6개월 이상 러닝하셨나요?" Yes/No) |
| 30분 연속 러닝 기록 존재 | GPS 히스토리 자동 스캔 (`runningStats.totalDurationSec ≥ 1800`) |

**판정 로직**:
```ts
type Limiter = "build_aerobic" | "break_ceiling";

function judgeLimiter(user: UserProfile, history: WorkoutHistory[]): Limiter {
  const isVeteran = user.runningExp6moPlus === true;
  const has30min = history.some(h =>
    h.sessionData.title.includes("러닝") &&
    (h.stats.totalDurationSec ?? 0) >= 1800
  );
  // 둘 다 만족해야 "천장 뚫기", 아니면 "유산소 엔진 키우기"
  return (isVeteran && has30min) ? "break_ceiling" : "build_aerobic";
}
```

### 5.2 Limiter별 주간 분포

| Limiter | Easy (Zone 1-2) | Threshold/Tempo (Zone 3) | VO2/Speed (Zone 4-5) |
|---|---|---|---|
| `build_aerobic` | **80%** | 20% | (거의 없음) |
| `break_ceiling` | 60% | 10% | **30%** (800m·인터벌·스프린트 혼합) |

**3-way → 2-way 단순화 이유** (대표 지시 2026-04-18):
- 영상의 anaerobic battery(60/30/10)와 speed ceiling(75/15/10)은 10%p 차이 → 의미 손실 최소
- 아마추어 대부분은 둘 중 하나 또는 혼합 → 묶어서 "800m + 스프린트 혼합" 단일 처방
- 랩 테스트 없이 3-way 판정은 불가능, 억지로 하면 오판

---

## 6. 주간 템플릿 (훈련 가능 일수별)

### 6.1 3일 주간 (초급, build_aerobic)

| 요일 | 세션 |
|---|---|
| Day 1 | Easy Run 30-40분 |
| Day 3 | Easy Run 30-40분 (+ 짝수 주차: strides 6개) |
| Day 6 | Long Run 45-60분 (주차 홀짝으로 easy ↔ 지속주 교대) |

### 6.2 5일 주간 (중급, build_aerobic — 80/20)

| 요일 | 세션 |
|---|---|
| Day 1 | Easy 40-50분 + Strides 6-8 |
| Day 3 | Tempo 20-30분 OR Interval (격주 교대) |
| Day 5 | Interval 로테이션 (주차별 400m×5 / 800m×3 / 1mi×2 순환) |
| Day 6 | Long Run 60-90분 (easy ↔ hard 격주) |
| Day 7 | Rest |

### 6.3 5-6일 주간 (고급, break_ceiling — 60/30/10)

| 요일 | 세션 |
|---|---|
| Day 1 | Easy 60분 + Strides 10 |
| Day 2 | **800m × 8 또는 400m × 10** (Anaerobic) |
| Day 3 | Easy Recovery 45분 |
| Day 4 | Threshold Run 30-40분 OR Mile Repeats |
| Day 5 | Easy 45분 + Sprints 6×30초 |
| Day 6 | Long Run (격주: easy LSD ↔ Marathon Pace tempo) |
| Day 7 | Rest |

**TBD**: Esteve-Lanao + Bakken + Canova 소환해서 6.2/6.3 최종 검증.

---

## 7. 세션 타입 (11종)

### 7.1 기존 6종 (workoutEngine.ts 현재)
- `easy` — Conversational pace, 30-40분
- `long` — LSD, 60-90분
- `interval_walkrun` — 120초 걷기 / 60초 달리기 × 8
- `interval_tempo` — 5분 조깅 + 20분 템포 + 5분 조깅
- `interval_fartlek` — 120초 전력 / 180초 보통 × 5
- `interval_sprint` — 30초 전력 / 120초 회복 × 6

### 7.2 신규 세션 타입 (추가 필요)

| ID | 명칭 | 스펙 | 자문 출처 |
|---|---|---|---|
| `strides` | 스트라이드 | 20초 전력 / 30초 걷기 × 6-8 (세션 꼬리 부착) | Seiler, 영상 Level 3 |
| `threshold` | Threshold Run | 1시간 지속 가능 페이스로 20-40분 (락테이트 2.5-3.5 mmol/L) | Bakken Norwegian method |
| `threshold_2x15` | Threshold 2 × 15분 | 15분 sub-T / 3분 회복 / 15분 sub-T | Bakken (챕터 2 핵심 세션) |
| `intervals_400` | 400m × 5 | 400m 전력 / 2분 조깅 회복 × 5 (anaerobic battery) | 영상 Level 3 |
| `intervals_800` | 800m × 3 | 800m 전력 / 3분 조깅 회복 × 3 (VO2 max 최적) | 영상 Level 3+5 |
| `intervals_1000` | 1000m × 5-8 | VO2 페이스, 챕터 2-3 핵심 | Seiler VO2 session |
| `intervals_mile` | 1mi × 2 | 1600m 전력 / 4분 조깅 회복 × 2 | 영상 Level 3 |
| `norwegian_4x4` | Norwegian 4×4 | 4분 하드 / 4분 회복 × 4 | 영상, Bakken |
| `pure_sprints` | Pure Sprints | 20-30초 100% / 2분 완전 회복 × 6 | 영상 Level 3 |
| `long_with_mp` | Long with MP block | 90-110분 Z1 + 마지막 20-30분 Marathon Pace (챕터 2 Sun) | Canova specific endurance |
| `race_pace_interval` | Race-pace Interval | 10K: 2000m×4 / Half: 3000m×3 / Full: 5K×4 @ goal | Canova peak phase |
| `specific_long` | Specific Long Run | Full: 32K (70% MP → 마지막 8K MP) / Half: 20K MP / 10K: 15K easy | Canova specific |
| **`tt_2k`** | **2K Time Trial** | 2km all-out + 10분 warm-up + 10분 cool-down (챕터 1 시작·종료) | Bakken 4-week block TT |
| **`tt_5k`** | **5K Time Trial** | 5km all-out + 15분 warm-up + 10분 cool-down (챕터 2 끝) | Seiler adaptation window TT |
| **`dress_rehearsal`** | **Dress Rehearsal** | 목표 페이스로 50-70% race 거리 (Full 21K / Half 15K / 10K 8K) @ goal pace | Canova + Seiler taper |

### 7.3 엔진 확장 포인트

[functions/src/workoutEngine.ts:1070-1174](functions/src/workoutEngine.ts#L1070-L1174) `generateRunningWorkout()`:
- 현재: `RunType = "interval" | "easy" | "long"` + 내부 가중 랜덤
- 확장: `RunType`을 위 11종으로 세분화 + 프로그램 모드일 때 가중 랜덤 우회

---

## 8. 페이스 테이블 (목표 선택 → 자동 역산)

### 8.1 20칸 매트릭스 (자문단 확정, v1)

**자문 출처**: Seiler / Esteve-Lanao / Bakken 통합 답변 (2026-04-18 회의 64 참조).

**용어 매핑** (3인 합의):

| 엔진 용어 | 3인 공통 용어 | 락테이트 (추정) |
|---|---|---|
| Easy | Seiler Z1 | ≤ 2.0 mmol/L |
| Marathon Pace | Seiler Z2 하단 = Bakken sub-T 하단 | 2.0–2.5 |
| Threshold | Bakken sub-T = Seiler Z2 상단 | 2.5–3.5 |
| VO2/800m | Seiler Z3 | 6.0–8.0 |
| Sprint | Neuromuscular | 8.0+ |

#### 행 1. VO2 max 향상 (5K 기록 페이스 대비 상대 오프셋)

| 페이스 | 공식 | 근거 |
|---|---|---|
| Easy | **5K pace + 90–120s/km** | Esteve-Lanao PMID 17685689 / Seiler PMID 20861519 |
| Marathon | **5K pace + 50–60s/km** | Seiler PMID 20861519 Fig 1 |
| Threshold | **5K pace + 25–35s/km** | Bakken sub-T protocol |
| VO2/800m | **5K pace − 10~15s/km** | Seiler Z3 (Billat vVO2max 방법론) |
| Sprint | **5K pace − 40~60s/km** | 주 1회 미만 |

**핵심 주석** (Esteve-Lanao PMID 23752040): VO2 향상이 목적이면 **주당 Z3 세션 2회 > Threshold 2회**. VO2 프로그램은 threshold보다 VO2 세션 자체를 늘리는 게 증거 기반.

#### 행 2. 10K sub-50 (M = 5:00/km)

| 페이스 | 속도 | 근거 |
|---|---|---|
| Easy | **5:55–6:20/km** | Esteve-Lanao PMID 17685689 recreational Z1 = race +55~80s |
| Marathon | **5:20/km** | Seiler: 10K pace + 20s = MP 근사 |
| Threshold | **5:00–5:05/km** | Bakken: 10K pace = VT2, sub-T는 +5s |
| VO2/800m | **4:35–4:45/km** (1000m 반복) | Seiler: 10K − 15~25s |
| Sprint | **4:15–4:25/km** (400m) | Esteve-Lanao 2013: Z3의 30-40%만 이 zone |

#### 행 3. Half sub-2 (M = 5:41/km)

| 페이스 | 속도 | 근거 |
|---|---|---|
| Easy | **6:35–7:00/km** | Esteve-Lanao PMID 23752040 아마추어 Z1 |
| Marathon | **5:55–6:00/km** | Canova: MP = HM + 15~20s |
| Threshold | **5:25–5:35/km** | Bakken sub-T: HM − 5~10s |
| VO2/800m | **4:55–5:05/km** (1000m × 5–8) | Seiler: HM − 35~45s |
| Sprint | **4:35–4:45/km** (400m) | 주 1회 미만, 전체 훈련의 5% |

#### 행 4. Full sub-3 (M = 4:16/km)

| 페이스 | 속도 | 근거 |
|---|---|---|
| Easy | **5:30–5:40/km** | 한국 아마추어 보수적 조정 — 엘리트 하한(5:10) 금지, 사내 러닝코치 최종 검증 필요 `[추정]` |
| Marathon | **4:16/km** | 정의상 race pace. Canova specific 25–32K MP |
| Threshold | **4:05–4:10/km** | Bakken: MP − 6~11s. **아마추어는 threshold 세션 주 1회 제한** |
| VO2/800m | **3:40–3:50/km** (1000m × 6–10) | Seiler: MP − 30~40s |
| Sprint | **3:20–3:30/km** (400m) | Canova general phase에서만, specific phase에서 제거 |

### 8.2 주차별 적응 (progression rule) — 잠정

- **완주 + easy 피드백 ≥ 2회 연속** → 다음 주차 목표 5초/km 단축
- **fail 피드백 ≥ 2회 연속** → 다음 주차 목표 10초/km 완화 (퇴행)
- **최대 조정 폭**: 30초/km (과도한 jump 방지)
- **자문 확정 후 미세 조정**: 챕터 경계에서만 조정 vs 주차마다 조정

### 8.3 성별 차이

v1에선 단일 공식. 성별 분기는 v2에서 Sims 자문 후 추가 검토. `user.gender === "female"`면 fat loss 목표 유저와 동일하게 rep adjust 하는 기존 엔진 룰([functions/src/workoutEngine.ts](../functions/src/workoutEngine.ts))과 일관 유지.

---

## 9. 데이터 모델

### 9.1 SavedPlan 확장 (기존 재활용)

[src/utils/savedPlans.ts:3-16](src/utils/savedPlans.ts#L3-L16) `SavedPlan` 인터페이스 그대로. 추가 필드만:

```ts
export interface SavedPlan {
  // ... 기존 필드
  programId?: string;          // 기존 있음
  sessionNumber?: number;      // 기존 있음
  totalSessions?: number;      // 기존 있음
  programName?: string;        // 기존 있음
  completedAt?: number | null; // 기존 있음

  // ⭐ 신규 (러닝 프로그램용)
  programCategory?: "running" | "strength";  // 구분
  programGoal?: string;         // "10k_sub_50", "full_sub_3" 등
  limiterAtStart?: "build_aerobic" | "break_ceiling"; // 프로그램 시작 시점 판정
  weekIndex?: number;           // 1부터 시작
  dayOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  targetPaceSec?: number;       // 이 세션의 타겟 페이스 (초/km)
}
```

### 9.2 프로그램 생성 흐름

1. 유저가 목표 선택 → `programGoal` 확정 → 페이스 테이블에서 타겟 페이스 도출
2. 유저 입력 + GPS 히스토리 → `limiterAtStart` 판정
3. 주 훈련 가능 일수 → 주간 템플릿 선택 (6.1/6.2/6.3)
4. 주차 × 세션/주 = 전체 세션 목록 생성 (예: 12주 × 5 = 60 SavedPlan)
5. `saveProgramSessions()` 일괄 저장 ([src/utils/savedPlans.ts:193](src/utils/savedPlans.ts#L193))

---

## 10. GA 이벤트 (회의 63-A 패턴 확장)

### 10.1 신규 이벤트

| 이벤트 | 속성 | 목적 |
|---|---|---|
| `program_created` | goal, weeks, limiter | 프로그램 생성 퍼널 (획득) |
| `program_session_start` | programGoal, weekIndex, sessionType | 리텐션 (프로그램 중 세션 시작) |
| `program_session_complete` | programGoal, weekIndex, targetPace, actualPace | 완주율 + 페이스 적응 원천 |
| `program_week_complete` | programGoal, weekIndex, sessionsCompleted | 주차 완주율 |
| `program_abandoned` | programGoal, weekIndex, reason | 이탈 분석 |

### 10.2 기존 이벤트와 분리 유지

`session_start` 등 기존 이벤트는 **프로그램 외 단발 세션만** 카운트. 프로그램 세션은 `program_*` 이벤트만 발화. 이중 카운트 방지.

---

## 11. 4주 청킹 리텐션 설계 ⭐ (신규 v0.1)

### 11.1 배경

대표 지시 (2026-04-18, 메모리 `feedback_user_attention_span.md`): **"유저는 1개월 이상 집중 못 함. 3개월은 상한, 길면 떨어진다."**

프로그램 12주는 "물리적 상한"이고, 유저 경험상 **4주**가 인지 한계. 따라서 프로그램을 4주 × N 챕터로 쪼개고, 각 챕터 경계에서 **재후킹 트리거**를 박아 "다음 챕터까지 버티게" 만들어야 함.

### 11.2 챕터 구조 (자문단 확정, v1)

**피리어다이제이션 근거**: Bakken 4-week block (mariusbakken.com) + Seiler 8주 adaptation window (PMID 20861519) — 자연스럽게 정합.

| 프로그램 | 챕터 1 (1-4주) | 챕터 2 (5-8주) | 챕터 3 (9-12주) |
|---|---|---|---|
| VO2 max 8주 | Base (1-4주) | Peak (5-8주) | — |
| 10K sub-50 10주 | Base (1-4주) | Build (5-8주) | Peak+Taper (9-10주, 축소 챕터) |
| Half sub-2 12주 | Base (1-4주) | Build (5-8주) | Peak+Taper (9-12주) |
| Full sub-3 12주 | Base (1-4주) | Build (5-8주) | Peak+Taper (9-12주) |

### 11.3 챕터 1 — Base (Aerobic Foundation)

**목표**: Z1 볼륨 구축, 주간 거리 10%/주 증가 (Davis 부상 룰), Z3은 짧은 VO2 반복만.

**주간 템플릿 (주 4회)**:

| 요일 | 세션 | 강도 |
|---|---|---|
| Tue | Easy 40분 | Z1 |
| Thu | **VO2 short** 400m × 6–8 @ VO2 페이스 (회복 90s jog) | Z3 |
| Sat | Easy 50분 | Z1 |
| Sun | **Long run** 70–90분 (Z1 95%, 마지막 10분 Z2) | Z1-Z2 |

**Bakken 핵심 원칙**: 챕터 1에 **threshold 세션 금지**. "threshold는 베이스 형성 후".

**챕터 1 진입 시**: **1주차 Day 1에 2K all-out TT 자동 편성** → 초기 페이스 설정. 이 TT 기록 → 20칸 페이스 테이블 각 행 상대 오프셋 계산의 기준값.

### 11.4 챕터 2 — Build (Specific Endurance)

**목표**: Z2/sub-threshold 도입, Z3 인터벌 길이 확장, 주 5회로 증설.

**주간 템플릿**:

| 요일 | 세션 |
|---|---|
| Tue | **Threshold** 2 × 15분 @ sub-T (회복 3분) — Bakken 핵심 |
| Thu | **VO2 long** 1000m × 5 @ vVO2max |
| Sat | Easy 50분 |
| Sun | **Long with MP block** 90–110분, 마지막 20–30분 MP (Canova specific endurance 시작) |
| Wed/Fri 중 1회 | Easy recovery 30분 (선택) |

### 11.5 챕터 3 — Peak + Taper (Race Specific)

**주간 9-10주차 (Peak)**:

| 요일 | 세션 (프로그램별) |
|---|---|
| Tue | **Race-pace interval**: 10K → 2000m × 4 @ goal / Half → 3000m × 3 / Full → 5K × 4 @ MP |
| Thu | Threshold 2 × 12분 (강도 유지, 양 감소) |
| Sat | Easy 40분 |
| Sun | **Specific long**: Full 32K (70% MP → 마지막 8K MP) / Half 20K MP-effort / 10K 15K easy |

**주간 11-12주차 (Taper — Seiler 원칙 PMID 20861519)**:
- **Volume −40~60%**, intensity 유지
- Race week: volume −70%
- Tue: race pace 1000m × 3 (sharpening)
- Thu: easy 30분 + strides
- Sat: 20분 + 4 × 100m strides
- Sun = **race day** 또는 **dress rehearsal**

### 11.6 챕터 경계 재후킹 신호 (자문단 확정)

**Hook Model × Periodization 정합**: 각 경계의 **TT (Time Trial)** 자체가 과학적 진단 + 심리적 Variable Reward 이중 기능.

| 경계 | 주차 | 트리거 세션 | 유저 경험 | 근거 |
|---|---|---|---|---|
| 1주차 시작 | Day 1 | **current fitness 2K TT** | "오늘 당신의 현재 Z1 페이스를 측정합니다" | Bakken 4-week block 원칙 |
| Ch1→Ch2 | 4주차 끝 | **2K TT 재측정** | "Z1 페이스 XXs 개선" 알림 + **"Base Complete" 배지** | mariusbakken.com Table |
| Ch2→Ch3 | 8주차 끝 | **5K TT** | "Threshold 해방" 배지 + **예상 레이스 시간 업데이트** | Seiler PMID 20861519 Fig 3 (8주 adaptation window) |
| Ch3→Race | 10주차 끝 | **Dress Rehearsal** (목표 페이스 검증 세션) | **"Sub-X Ready"** 또는 **"추가 대비 필요"** 판정 + taper 가이드 시작 | Canova specific phase + Seiler taper protocol |
| Race | 12주차 | **실제 레이스 (또는 Virtual TT)** | 최종 보상 — 전체 훅의 종점 | — |

### 11.7 이탈 방지 트리거

- **3주 연속 미완주** 감지 → 챗 자동 개입 ("괜찮아요, 여기서 멈출지 이어갈지 선택")
- **14일 이상 비활성** → 재진입 시 같은 주차부터 OR 한 챕터 retrain 선택
- **챕터 1 이탈률** GA 이벤트 `program_chapter_abandoned`
- **중간 선택권 (챕터 경계)**: "계속 / 1주 쉬었다 가기 / 목표 하향 조정" 3택 (이탈 vs 조정 선택)

### 11.4 이탈 방지 트리거

- **3주 연속 미완주** 감지 → 챗 자동 개입 ("괜찮아요, 여기서 멈출지 이어갈지 선택")
- **14일 이상 비활성** → 재진입 시 같은 주차부터 OR 한 챕터 retrain 선택
- **챕터 1 이탈률** 추적 → GA 이벤트 `program_chapter_abandoned` (프로덕트 개선 피드백)

### 11.5 UI 카피 원칙

- **"12주 프로그램"이라고 직접 표기하지 않음**
- 대신 **"3개 챕터"** 또는 **"3단계 여정"**으로 표기 (심리적 길이 단축)
- 진행률도 "주차 7/12"가 아닌 **"챕터 2 진행 중 · 다음 챕터 3주 남음"** 식 표기

---

## 12. 챗 통합 (교육형 컨텐츠)

### 12.1 parseIntent 확장

[functions/src/ai/](functions/src/ai/) 에서 다음 키워드 감지 → 프로그램 제안 CTA 반환:

- "마라톤 sub3", "서브3", "sub-3" → `full_sub_3` 제안
- "하프 1:30", "half sub-1:30" → `half_sub_1_30` 제안
- "10km 50분", "10k sub-50" → `10k_sub_50` 제안
- "VO2 max 80" → `vo2_80` 제안

### 12.2 세션 시작 시 교육형 메시지

매일 아침 프로그램 세션 진입 시 챗이 3-bubble 설명:
1. **오늘 뭐 하는지**: "오늘은 800m × 3 인터벌이에요"
2. **왜 오늘 이걸**: "VO2 max 최적 자극은 800m 반복이에요. 마라톤 준비 = 유산소만이라고 생각하지만, 실제로는 anaerobic 시스템이 VO2 천장을 올려요. (출처: Vinton 영상)"
3. **어떻게 뛰어야 하는지**: "목표 페이스 4:30/km. 3회 반복 사이 3분 조깅 회복. 너무 빠르게 첫 세트 시작하지 마세요 — Canova 코치 원칙."

**프롬프트 시드**: 자문단에서 Lieberman(서사), Canova(세션 원칙), Sang(지속가능성) 3명 소환해서 Bubble 2 카피 시드 받음.

### 11.3 ㅎㅎ 제약 준수

메모리 `feedback_no_emoji.md` + 기존 코치 프롬프트 룰 그대로 — 3 bubble 중 ㅎㅎ 1회 이하, 이모지 0, 영어 단어 0.

---

## 13. 오픈 이슈 (남은 자문 필요)

| 이슈 | 소환 대상 | 결정 시점 |
|---|---|---|
| ~~페이스 테이블 20칸 숫자~~ | ~~Seiler + Esteve-Lanao + Bakken~~ | ✅ **v1에서 확정** |
| ~~주간 템플릿 검증~~ | ~~Canova + Sang~~ | ✅ **v1에서 Canova 방법론 통합** (Sang 추가 검증은 v1.1 단계에서 한국 변환용) |
| Full sub-3 Easy zone 한국 아마추어 조정 | 사내 러닝코치 + Sang | Phase 1 구현 전 |
| 주차별 볼륨 구체 수치 (km/주) | Canova + 사내 러닝코치 | Phase 2 구현 전 |
| 부상 경고 룰 (cadence/mileage) | Davis + Ferber | v2 (웨어러블 연동 시) |
| 여성 생리 주기 분기 | Sims | v2 |
| 레이스 영양 in-session 룰 | Jeukendrup | v2 |
| GA 이벤트 스키마 최종 | 황보현우 + Sarah Friar | Phase 1 구현 전 |

---

## 14. 구현 순서 (Phase)

### Phase 1 — 엔진 기반 (1주)
- 세션 타입 **15종** 추가 (기존 6 + 신규 8 세션 + TT 3종: tt_2k, tt_5k, dress_rehearsal) — [functions/src/workoutEngine.ts](../functions/src/workoutEngine.ts)
- **페이스 테이블 20칸 상수화** (PACE_MATRIX 상수)
- limiter 판정 유틸 함수 (2분기)
- **Full sub-3 게이트 룰** 함수 (`canEnterFullSub3`)

### Phase 2 — 프로그램 생성기 (1주)
- `generateRunningProgram(goal, limiter, weeksPerTraining)` 함수
- **챕터 분할 로직** (4주 단위, 챕터별 주간 템플릿 다름)
- SavedPlan 확장 필드 (`programCategory`, `programGoal`, `chapterIndex`, `targetPaceSec` 등)
- 프로그램 선택 UI (4개 프로그램 카드 + Full sub-3 게이트 UI)

### Phase 3 — 적응형 피드백 + TT 연동 (5일)
- **TT 세션 결과 → 페이스 테이블 개인화** (2K TT 기록 → 20칸 개인 매트릭스 산출)
- 주차 완주 시 다음 주차 페이스 자동 조정
- 챕터 경계 자동 감지 → 배지/PR 카드 발동
- GA program_* 이벤트 (7개: created / session_start / session_complete / chapter_start / chapter_complete / chapter_abandoned / completed)

### Phase 4 — 교육형 챗 통합 (5일)
- parseIntent 키워드 확장 ("sub3", "마라톤", "10km", "하프" 등)
- 세션 시작 시 3-bubble 카피 (Canova/Sang/Lieberman 시드 50+ 프리셋)
- 챕터 경계 챗 개입 ("Base Complete → Threshold Unlocked" 등 교육형)

**총 예상**: 3주. 자문단 페이스/청킹 확정됐으므로 추가 자문 대기 없이 착수 가능.

---

## 15. 차별성 (비경쟁 우위)

| 항목 | Runna | Nike Run Club | ChatGPT | **오훈잘** |
|---|---|---|---|---|
| 프로그램 생성 | ✅ | ✅ (고정) | ⚠️ 텍스트만 | ✅ 룰엔진 |
| Limiter 자동 판정 | ❌ | ❌ | ❌ | ✅ 2-way |
| 페이스 적응 | ⚠️ (유료) | ❌ | ❌ | ✅ |
| "왜 이 훈련인지" 설명 | ❌ | ⚠️ | ✅ (즉석) | ✅ 프로그램 내재 |
| 실명 자문 근거 | ❌ | ⚠️ | ❌ | ✅ 10+ 자문단 |
| GA·퍼널 분석 | ❌ | ❌ | ❌ | ✅ |

**핵심**: "이 앱은 내가 왜 오늘 800m를 뛰어야 하는지 알려준다"가 독점 포지션. 대표 메모리 `project_milestone_2026_04_18.md` 선언한 "Manus 수준 답변" 러닝 버전.
