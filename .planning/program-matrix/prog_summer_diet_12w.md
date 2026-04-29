# prog_summer_diet_12w — 여름 다이어트 12주 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** ♂40 fat_loss 페르소나 (또는 fat_loss goal 일반)
**기간:** 12주 (4주 × 3 chapter — [memory:feedback_user_attention_span] 4주 청킹)
**주당 빈도:** 4회 weight + 2-3회 카디오 (휴식 1-2일)

---

## ⚠ 핵심 디자인 원칙 — 슬롯은 고정, 슬롯 안에서만 유사 운동 대체 (대표 지시 2026-04-30)

러닝과 본질적 차이:
- **러닝**: 매트릭스 = 정확한 페이스·거리·slotType 고정 (W1 D1 = `tt_2k`)
- **웨이트 (본 카탈로그)**: 매트릭스 = **슬롯 + 강도 패턴 고정** (W1 D1 = `Upper Push · Slot1 가슴 컴파운드 · 3×12-15 · RPE 7`)
  - **막바꾸지 X** — 월요일 = 항상 가슴 horizontal push 슬롯
  - **슬롯 안에서만 유사 운동 대체** — 같은 자극·근육·동작 패턴인 운동끼리만 교체
    - 예: 가슴 horizontal push 슬롯 = {바벨 벤치 / 인클라인 바벨 / 덤벨 벤치 / 스미스 벤치} 중 랜덤
    - 예: 스쿼트 슬롯 = {백 스쿼트 / 프론트 스쿼트 / 핵 스쿼트} 중 랜덤
  - 효과: 매번 새로움 (지루함 ↓) + 자극 일관 (같은 근육·패턴) + 강도 progression 일관

→ 카탈로그 SSOT 박을 때 **`exerciseList` 박지 말 것** (그건 교정·시니어 등 정확 운동 풀이 의미 있는 카드에만). 본 카드는 **슬롯별 유사 운동 그룹**만 정의 + 룰엔진이 그룹 안에서 랜덤.

---

## 학술 근거 (해외 전문가 한정 — 대표 지시 2026-04-30)

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Schoenfeld 2016 메타분석** ([PubMed 27433992](https://pubmed.ncbi.nlm.nih.gov/27433992/)) | "10+ sets per muscle per week = 최적 근비대" / 각 세트당 +0.37% 효과 | 주차별 볼륨 progression — Build/Peak 에서 10-16 sets/muscle 달성 |
| **Schoenfeld 빈도 메타분석** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 각 근육 그룹 = 최적 근비대" | 2분할 4일 = 각 근육 주 2회 |
| **Mike Israetel — Volume Landmarks** ([drmikeisraetel.com](https://drmikeisraetel.com/dr-mike-israetel-wikipedia/dr-mike-israetel-mv-mev-mav-mrv-explained/)) | MEV (Minimum Effective) → MAV (Maximum Adaptive) → MRV | Base = MEV 근접, Build = MEV~MAV, Peak = MAV |
| **Layne Norton ([Biolayne](https://help.biolayne.com/article/36-fat-loss-programs))** | "다이어트 시 트레이닝 = 평소와 크게 다르지 않게. 단 too much volume / too close to failure 회피" | RPE 7 (Base) → RPE 8 (Build) → RPE 8-9 (Peak) — failure 직전까지만 |
| **Layne Norton — Fat Loss Forever** ([Amazon](https://www.amazon.com/Fat-Loss-Forever-Lose-KEEP/dp/1794510109)) | 다이어트 주기화: 2-3주 적자 + 1-2주 maintenance (diet break) | Chapter 경계마다 diet break 옵션 |
| **Jeff Nippard — Min-Max Program** ([jeffnippard.com](https://jeffnippard.com/products/the-min-max-program)) | 12주 = 2 × 6주 블록. Block 2 강도 기법 도입 | 본 매트릭스 = 4주 × 3 (3 챕터 청킹 + Peak 에 finisher 도입) |
| **ACSM 2026 가이드라인** ([acsm.org](https://acsm.org/resistance-training-guidelines-update-2026/)) | "주 2-3회 모든 주요 근육 그룹" / 8-12회 × 60-80% 1RM | 모든 챕터 충족 |

---

## 분할 — 2분할 4일 (Upper A/B + Lower A/B)

각 근육 그룹 주 2회 (Schoenfeld 빈도 메타 충족). **슬롯 고정 + 슬롯 안 유사 운동 대체.**

### 월 — `upper_push` (가슴·삼두·어깨 강조)
| 슬롯 | 자극 | 유사 운동 그룹 (랜덤 선택) |
|---|---|---|
| Slot 1 | 가슴 horizontal push compound | 바벨 벤치 프레스 · 인클라인 바벨 프레스 · 덤벨 벤치 프레스 · 스미스 벤치 프레스 |
| Slot 2 | 가슴 보조 (incline/dip/fly) | 인클라인 덤벨 프레스 · 딥 (가슴 강조) · 케이블 크로스오버 · 펙덱 플라이 |
| Slot 3 | 어깨 (vertical push or lateral) | 오버헤드 프레스 (바벨/덤벨) · 사이드 레터럴 레이즈 · 머신 숄더 프레스 |
| Slot 4 | 삼두 isolation | 케이블 푸쉬다운 · 오버헤드 트라이셉 익스텐션 · 스컬크러셔 |

### 화 — `lower_squat` (스쿼트 day)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 dominant compound | 바벨 백 스쿼트 · 프론트 스쿼트 · 핵 스쿼트 |
| Slot 2 | 단일다리 무릎 dominant | 워킹 런지 · 불가리안 스플릿 스쿼트 · 리버스 런지 |
| Slot 3 | 대퇴사두 isolation | 레그 익스텐션 · 레그 프레스 (얕은 ROM) |
| Slot 4 | 카프 | 시티드 카프 레이즈 · 스탠딩 카프 레이즈 |

### 목 — `upper_pull` (등·이두·후면 어깨)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 등 vertical pull | 풀업 (or 어시스티드) · 랫 풀다운 · 클로즈그립 풀다운 |
| Slot 2 | 등 horizontal pull (row) | 시티드 케이블 로우 · 벤트오버 바벨 로우 · 체스트 서포티드 로우 · T-바 로우 |
| Slot 3 | 후면 어깨 isolation | 케이블 페이스풀 · 리어 델트 플라이 (덤벨/머신) |
| Slot 4 | 이두 isolation | 바벨 컬 · 해머 컬 · 프리처 컬 · 케이블 컬 |

### 금 — `lower_hinge` (데드 day)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 힌지 compound | 컨벤셔널 데드리프트 · 스모 데드리프트 · 트랩바 데드리프트 |
| Slot 2 | 힙 dominant | RDL (바벨/덤벨) · 굿모닝 |
| Slot 3 | 글루트 | 힙 쓰러스트 (바벨) · 글루트 브릿지 · 케이블 킥백 |
| Slot 4 | 햄스트링 isolation | 시티드 레그 컬 · 라잉 레그 컬 |

### 수·토·일
- 수: 카디오 (LISS 또는 HIIT — 챕터별 분기)
- 토: LISS 카디오 (선택, 30분 빠르게 걷기)
- 일: 휴식

**랜덤 시드 룰:** `(weekIndex × 7 + dayOfWeek)` 기반 결정적 랜덤 → 같은 주차 같은 요일 = 같은 운동 (재방문 시 일관). 다음 주차 = 슬롯 동일하지만 다른 운동.

---

## 주차별 매트릭스 (4주 × 3 챕터)

### Chapter 1 — Base (W1-W4) "적응 + 폼"

**목표:** 폼 익히기 + MEV 근접 볼륨 + 다이어트 시작 적응
**볼륨:** 6-9 sets/muscle/week (Israetel MEV)
**RPE:** 7 (Norton 권장 — failure 회피)

| 항목 | 값 |
|---|---|
| 컴파운드 (벤치·스쿼트·데드·풀업) | 3 sets × 12-15 reps @ 60-65% 1RM |
| 액세서리 (덤벨·머신) | 3 sets × 12-15 reps |
| 아이솔레이션 | 3 sets × 15-20 reps |
| 카디오 | LISS 20분 × 2회/주 (수·토) |
| 다이어트 | 칼로리 -20% (Norton) / 단백질 1.6-2.2g/kg |

### Chapter 2 — Build (W5-W8) "볼륨 ↑"

**목표:** Schoenfeld 10+ sets/muscle/week 달성 + 강도 보강
**볼륨:** 9-12 sets/muscle/week (Israetel MEV→MAV)
**RPE:** 8

| 항목 | 값 |
|---|---|
| 컴파운드 | 3-4 sets × 10-12 reps @ 65-75% 1RM |
| 액세서리 | 3-4 sets × 10-12 reps |
| 아이솔레이션 | 3 sets × 12-15 reps |
| 카디오 | LISS 25분 × 2 + HIIT 1회/주 |
| **W5 diet break (선택)** | 1주 maintenance 칼로리 (Norton) — 정체기 돌파 |

### Chapter 3 — Peak (W9-W12) "강도 + Finisher"

**목표:** MAV 영역 + finisher 기법으로 다이어트 마무리
**볼륨:** 12-16 sets/muscle/week (Israetel MAV)
**RPE:** 8-9 (단 마지막 세트만 — Norton "failure 너무 자주 X")

| 항목 | 값 |
|---|---|
| 컴파운드 | 4 sets × 8-10 reps @ 75-80% 1RM |
| 액세서리 | 3-4 sets × 10-12 reps |
| 아이솔레이션 | 3 sets × 12-15 reps + drop set or AMRAP |
| Finisher | 마지막 운동에 drop set 1세트 또는 AMRAP — Nippard Min-Max Block 2 차용 |
| 카디오 | HIIT 2회 + LISS 1회/주 |

---

## 챕터 경계 재후킹 ([memory:feedback_user_attention_span] 충족)

| 경계 | 메시지 | 데이터 |
|---|---|---|
| W4 → W5 (Base→Build) | "Base 4주 완주! 다음 4주는 볼륨 +30% 증가" | 챕터 1 totalVolume + bodyWeight 변화 |
| W8 → W9 (Build→Peak) | "Build 완료. 다음은 마무리 4주 — Peak 강도 + finisher 도입" | 챕터 2 통계 + 가능 시 1RM 변화 |
| W12 종료 | "12주 다이어트 완주!" + 결과 리포트 | 총 감량·근육 보존 추정 |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_summer_diet_12w",
  weeks: 12,
  chapters: 3,
  sessionsPerWeek: 4,  // 카디오 별도
  weeklyMatrix: [
    { week: 1, chapter: 1, dayOfWeek: 1, type: "upper_a", sets: 3, reps: "12-15", rpe: 7 },
    { week: 1, chapter: 1, dayOfWeek: 2, type: "lower_a", sets: 3, reps: "12-15", rpe: 7 },
    { week: 1, chapter: 1, dayOfWeek: 4, type: "upper_b", sets: 3, reps: "12-15", rpe: 7 },
    { week: 1, chapter: 1, dayOfWeek: 5, type: "lower_b", sets: 3, reps: "12-15", rpe: 7 },
    // ... W2-W4 동일 (Base 4주 반복)
    // W5-W8 Build (sets +1, reps 10-12, rpe 8)
    // W9-W12 Peak (sets 4, reps 8-10, rpe 8-9, finisher)
  ],
}
```

이 weeklyMatrix 를 룰엔진 입력으로 변환 → N개 SavedPlan 생성 (러닝 패턴 미러).

---

## 다음 단계

1. **자문단 검증** — 운동과학 (한체대 교수·운동생리학자·물리치료사) spot check
2. **페르소나 검증** — ♂40 fat_loss 페르소나 인터뷰 ("이 12주 따라할 의향?")
3. **OK 시** → SSOT (`programCatalog.ts`) 에 weeklyMatrix 박음
4. **다음 카탈로그** — `prog_quick_diet_4w` (급빠 4주) 또는 `prog_muscle_8w` (8주 근육)
