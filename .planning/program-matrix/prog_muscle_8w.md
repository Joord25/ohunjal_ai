# prog_muscle_8w — 8주 근육량 증가 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** ♀27 muscle_gain 페르소나 (또는 muscle_gain goal 일반)
**기간:** 8주 (4주 × 2 chapter — [memory:feedback_user_attention_span] 4주 청킹)
**주당 빈도:** 4회 weight + 1-2회 가벼운 카디오 (선택)

---

## ⚠ 디자인 원칙 (앞 카탈로그와 동일)

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- exerciseList 박지 X — 슬롯별 풀만 정의
- 랜덤 시드: `(weekIndex × 7 + dayOfWeek)` 결정적

---

## 학술 근거 — 해외 전문가 (Schoenfeld·Nippard·메타분석)

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Schoenfeld 빈도 메타** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 각 근육 = 최적 / 16 sets/week 이상이면 분할 빈도 ↑" | 2분할 4일 = 각 근육 주 2회 |
| **Schoenfeld — 권장 rep range** ([BarBend](https://barbend.com/brad-schoenfeld-hypertrophy/)) | "효율적 근비대 = 8-12 또는 8-15회" | 본격 세트 = 8-12회 (대표 vision 일치) |
| **Schoenfeld 8주 여성 연구** ([PubMed Phys athletes](https://pubmed.ncbi.nlm.nih.gov/30153194/)) | 8주 RT + 단백질 = 여성 근비대·체구성 개선 입증 | 8주 = 효과 입증 기간 |
| **Schoenfeld evidence-based 가이드라인** ([ResearchGate PDF](https://www.researchgate.net/profile/Brad-Schoenfeld/publication/322023636_Evidence-Based_Guidelines_for_Resistance_Training_Volume_to_Maximize_Muscle_Hypertrophy/links/5a425e5c0f7e9ba868a46e58/Evidence-Based-Guidelines-for-Resistance-Training-Volume-to-Maximize-Muscle-Hypertrophy.pdf)) | "10+ sets/muscle/week sweet spot" | Base = 10 sets, Build = 15-20 sets |
| **8주 볼륨 비교 메타** ([PMC8884877](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)) | "12-24 weekly sets = 최대 hypertrophy plateau / 6-8 sets per session = best" | 본 매트릭스 슬롯당 3-4 sets, 4일 = 최대 16-24 sets/muscle/week |
| **남녀 차이 메타** ([PMC8884877](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)) | "**상대 gain (%) = 남녀 동일**. 여성도 근비대 효과 거의 동일" | 본 카탈로그 ♀ 페르소나 정합 |
| **Jeff Nippard Fundamentals 8주** ([jeffnippard.com](https://jeffnippard.com/products/fundamentals-hypertrophy-program)) | 입문~중급 8주 / 운동 substitution OK | 본 카탈로그 분할 + 슬롯 substitution 패턴 |
| **Jeff Nippard Glute Hypertrophy 8주** ([jeffnippard.com](https://jeffnippard.com/products/glute-hypertrophy-program)) | 8주 글루트 + 해부학·바이오메카닉스 교육 | Lower day 에 글루트 강조 슬롯 추가 (♀ 페르소나 친화) |
| **Loading 메타 (10RM vs 30RM)** ([PMC7927075](https://pmc.ncbi.nlm.nih.gov/articles/PMC7927075/)) | "8주 비슷한 근비대 효과" | 본 카탈로그 8-12회 (10RM 근접) — 효율적 |

---

## 분할 — 2분할 4일 (Upper A·B + Lower A·B with 글루트 강조)

각 근육 주 2회 (Schoenfeld). Lower day 에 글루트 슬롯 강조 (Nippard Glute 패턴 차용).

| 요일 | 분할 type | 비고 |
|---|---|---|
| 월 | **`upper_a_push_emphasis`** | 가슴·삼두·어깨 |
| 화 | **`lower_a_squat_glute`** | 스쿼트 + 글루트 보조 |
| 수 | 휴식 또는 가벼운 카디오 (LISS 20-30분) | — |
| 목 | **`upper_b_pull_emphasis`** | 등·이두·후면 어깨 |
| 금 | **`lower_b_hinge_glute`** | 힌지 + 글루트 강조 |
| 토 | 가벼운 카디오 (선택) 또는 휴식 | LISS 30분 |
| 일 | 휴식 | — |

---

## 슬롯 정의 — 유사 운동 그룹

### 월 — `upper_a_push_emphasis` (4 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 가슴 horizontal push compound | 바벨 벤치 / 인클라인 바벨 / 덤벨 벤치 / 스미스 벤치 |
| Slot 2 | 가슴 보조 | 인클라인 덤벨 / 케이블 크로스오버 / 펙덱 / 푸쉬업 변형 |
| Slot 3 | 어깨 | 오버헤드 프레스 (바벨/덤벨) / 머신 숄더 프레스 / 사이드 레터럴 |
| Slot 4 | 삼두 isolation | 케이블 푸쉬다운 / 오버헤드 익스텐션 / 스컬크러셔 |

### 화 — `lower_a_squat_glute` (4 슬롯, 글루트 강조)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 dominant compound | 바벨 백 스쿼트 / 프론트 스쿼트 / 핵 스쿼트 / 레그 프레스 |
| Slot 2 | 글루트 compound | **힙 쓰러스트 (바벨/머신)** / **워킹 런지** / **불가리안 스플릿 스쿼트** |
| Slot 3 | 대퇴사두 isolation | 레그 익스텐션 / 사이드 런지 / 스텝업 |
| Slot 4 | 글루트 isolation | 케이블 킥백 / 머신 글루트 익스텐션 / 힙 어덕션·어브덕션 |

### 목 — `upper_b_pull_emphasis` (4 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 등 vertical pull | 풀업 (어시스티드 OK) / 랫 풀다운 / 클로즈그립 풀다운 |
| Slot 2 | 등 horizontal pull (row) | 시티드 케이블 로우 / 벤트오버 로우 / 체스트 서포티드 로우 / T-바 로우 |
| Slot 3 | 후면 어깨 | 케이블 페이스풀 / 리어 델트 플라이 (덤벨/머신) |
| Slot 4 | 이두 isolation | 바벨 컬 / 해머 컬 / 프리처 컬 / 케이블 컬 |

### 금 — `lower_b_hinge_glute` (4 슬롯, 힌지 + 글루트 강조)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 힌지 compound | RDL (바벨/덤벨) / 컨벤셔널 데드 / 트랩바 데드 |
| Slot 2 | 글루트 강조 compound | **힙 쓰러스트** / **글루트 브릿지** / **케이블 풀스루** |
| Slot 3 | 햄스트링 isolation | 시티드 레그 컬 / 라잉 레그 컬 / 굿모닝 |
| Slot 4 | 카프 + 코어 (선택) | 카프 레이즈 + 행잉 니레이즈 / 플랭크 |

---

## 주차별 강도 매트릭스 (8주 = 4주 × 2 chapter)

### Chapter 1 — Base (W1-W4) "MEV + 폼 + 적응"

**볼륨:** 8-10 sets/muscle/week (Schoenfeld MEV 근접)
**RPE:** 7 (failure 회피, 폼 학습 우선)

| 항목 | 값 |
|---|---|
| Slot 1·2 (compound) | 1세트 빈바 (♀15kg 바벨 / ♀2kg 덤벨) × 10-15 / 2-3세트 본격 무게 × 8-12 |
| Slot 3·4 (accessory/isolation) | 3세트 × 10-15 |
| 카디오 | LISS 20-30분 × 1-2회 (선택) |

### Chapter 2 — Build (W5-W8) "MAV + 강도 ↑"

**볼륨:** 12-16 sets/muscle/week (Schoenfeld 10+ 충족, plateau 도달)
**RPE:** 8 (마지막 세트 만)

| 항목 | 값 |
|---|---|
| Slot 1·2 (compound) | 1세트 빈바 × 10-15 / 3세트 본격 무게 × 8-12 |
| Slot 3·4 (accessory/isolation) | 3-4세트 × 10-15 |
| **W7-W8 마지막 세트:** drop set 또는 AMRAP 도입 (Nippard Min-Max Block 2 차용) |
| 카디오 | LISS 25-30분 × 2회 (선택) |

---

## 챕터 경계 재후킹 ([memory:feedback_user_attention_span])

| 시점 | 메시지 | 데이터 |
|---|---|---|
| W4 → W5 (Base → Build) | "Base 4주 완주! 다음 4주 = 볼륨 ↑ + Build 강도" | Base 챕터 totalVolume + 1RM 추정 |
| W8 종료 | "8주 근육량 증가 완주!" + 결과 리포트 | Build 챕터 통계 + 부위별 볼륨 변화 |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_muscle_8w",
  weeks: 8,
  chapters: 2,
  sessionsPerWeek: 4,
  weeklyMatrix: [
    { week: 1, dayOfWeek: 1, type: "upper_a_push_emphasis", sets: 3, reps: "8-12", rpe: 7, firstSet: "warmup_15reps" },
    { week: 1, dayOfWeek: 2, type: "lower_a_squat_glute", sets: 3, reps: "8-12", rpe: 7, firstSet: "warmup_15reps" },
    { week: 1, dayOfWeek: 4, type: "upper_b_pull_emphasis", sets: 3, reps: "8-12", rpe: 7, firstSet: "warmup_15reps" },
    { week: 1, dayOfWeek: 5, type: "lower_b_hinge_glute", sets: 3, reps: "8-12", rpe: 7, firstSet: "warmup_15reps" },
    // W2-W4 동일 progression
    // W5-W8 Build (sets 3-4, RPE 8, finisher)
  ],
}
```

---

## prog_summer_diet_12w / prog_quick_diet_4w 와 차이

| 항목 | summer_diet_12w | quick_diet_4w | **muscle_8w** |
|---|---|---|---|
| 목적 | fat_loss | fat_loss (단기) | **muscle_gain** |
| 기간 | 12주 (3 chapter) | 4주 (1 chapter) | **8주 (2 chapter)** |
| 볼륨 | MEV → MAV (점진) | TIA Mini Cut 처음부터 高 | **MEV → MAV (점진)** |
| 횟수 | 12-15 → 8-10 | 12-15 → 15-20 (MetCon) | **8-12 (1세트 10-15 빈바)** |
| RPE | 7 → 8-9 | 7 → 9 | **7 → 8** (근비대 sweet spot) |
| MetCon | 별도 카디오 | 세션 자체 박힘 | **선택 카디오 만** |
| Lower | 일반 분할 | 일반 분할 | **글루트 강조 슬롯** (♀ 페르소나) |
| 다이어트 | -20% kcal | -25% kcal | **maintenance 또는 +5-10%** (lean bulk) |

---

## 다음 단계

1. 자문단 검증 — 운동과학 spot check
2. OK 시 → SSOT 박음
3. 다음 카탈로그 — `prog_inbody_d_12w` (3개월 인바디 D 만들기, 근비대 + 체지방 동시)
