# prog_inbody_d_12w — 3개월 인바디 D 만들기 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** muscle_gain goal — 근비대 + 체지방 동시 (한국 인바디 D 등급 = 운동선수 체형)
**개념:** Body Recomposition (recomp) — 작은 칼로리 적자 또는 surplus 에서 근육 ↑ + 체지방 ↓
**기간:** 12주 (4주 × 3 chapter — [memory:feedback_user_attention_span] 4주 청킹)
**주당 빈도:** 5회 weight + 2-3회 카디오 (LISS + HIIT 분기)

---

## ⚠ 디자인 원칙 (앞 카탈로그와 동일)

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- exerciseList 박지 X — 슬롯별 풀만 정의
- 랜덤 시드: `(weekIndex × 7 + dayOfWeek)` 결정적

---

## Body Recomp 적용 가능 페르소나 (학술 근거)

[Journal of Sports Sciences 2020](https://www.transparentlabs.com/blogs/all/body-recomposition-how-to-lose-fat-and-gain-muscle) 입증:
- ✅ 입문자 (1년 미만 구조적 트레이닝)
- ✅ 6개월+ 휴식 후 복귀 (re-comp 효과)
- ✅ 체지방 高 (♂ 20%+ / ♀ 30%+)

상급자·저체지방자는 **bulk-cut 분리** 권장 → 본 카탈로그에 안 맞음. UI 안내 필요.

---

## 학술 근거 — 해외 전문가

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Jeff Nippard + Chris Barakat — Ultimate Guide to Body Recomposition** ([jeffnippard.com](https://jeffnippard.com/products/the-ultimate-guide-to-body-recomposition)) | "작은 적자 또는 작은 surplus + 단백질 충분 + 점진 부하 + 칼로리 사이클링" | 본 카탈로그 핵심 디자인 |
| **Schoenfeld + Aragon + Krieger 단백질 타이밍 메타** ([PMC3879660](https://pmc.ncbi.nlm.nih.gov/articles/PMC3879660/)) | "단백질 양 > 타이밍. 4-6시간 anabolic window. 단백질 충분이면 타이밍 무관" | 단백질 1.8-2.2g/kg, 타이밍은 자유 |
| **Schoenfeld 단백질 + Body Comp 메타** ([PubMed 28698222](https://pubmed.ncbi.nlm.nih.gov/28698222/)) | "1.6g/kg 이상 단백질 = 근비대 효과 plateau (1.8-2.2g/kg 충분)" | 본 카탈로그 단백질 1.8-2.2g/kg |
| **Schoenfeld Volume Sweet Spot** ([PubMed 30153194](https://pubmed.ncbi.nlm.nih.gov/30153194/)) | "10+ sets/muscle/week. 16+ 시 분할 빈도 ↑" | 5일 PPL = 각 근육 주 2회+ |
| **Body Recomp 12주 가이드** ([Transparent Labs](https://www.transparentlabs.com/blogs/all/body-recomposition-how-to-lose-fat-and-gain-muscle)) | "5일 분할 60-90분 / 적자 10-15% / 단백질 1.8-2.2g/kg / W4-6 시각적 변화 / W12 명확" | 본 카탈로그 분할·기간·영양 |
| **Calorie Cycling (Nippard recomp)** ([Bestbookbits 요약](https://bestbookbits.com/the-ultimate-guide-to-body-recomposition-build-muscle-lose-fat-at-the-same-time-jeff-nippard/)) | "트레이닝 day = surplus / 휴식 day = deficit" 패턴 | 본 카탈로그 칼로리 가이드 |
| **Schoenfeld 빈도 메타** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 각 근육" | 5일 PPL 패턴 충족 |

---

## 분할 — 5일 PPL 변형 (Push / Pull / Legs / Push / Lower)

각 근육 주 2회+ (Schoenfeld). 본격 recomp 트레이닝 = 5일 (Nippard 권장).

| 요일 | 분할 type | 비고 |
|---|---|---|
| 월 | **`push_a`** | 가슴 강조 + 어깨·삼두 |
| 화 | **`pull_a`** | 등 강조 + 이두·후면 어깨 |
| 수 | **`legs_squat_focus`** | 스쿼트 day + 글루트 |
| 목 | **`push_b`** | 어깨 강조 + 가슴·삼두 (volume) |
| 금 | **`legs_hinge_focus`** 또는 **`pull_b`** (요일 유연) | 힌지 + 글루트 또는 등 (volume) |
| 토 | 카디오 (LISS 30분 + 코어) | — |
| 일 | 휴식 | — |

**카디오 (Nippard recomp)**: LISS 2-3회 (트레이닝 후 또는 별도) + Build 부터 HIIT 1회/주 추가.

---

## 슬롯 정의 — 유사 운동 그룹

### 월 — `push_a` (가슴 강조, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 가슴 horizontal push compound | 바벨 벤치 / 인클라인 바벨 / 덤벨 벤치 / 스미스 벤치 |
| Slot 2 | 가슴 보조 | 인클라인 덤벨 / 케이블 크로스오버 / 펙덱 / 딥 |
| Slot 3 | 어깨 vertical push | 오버헤드 프레스 (바벨/덤벨) / 머신 숄더 프레스 |
| Slot 4 | 어깨 isolation | 사이드 레터럴 / 케이블 사이드 레이즈 / 프론트 레이즈 |
| Slot 5 | 삼두 isolation | 케이블 푸쉬다운 / 오버헤드 익스텐션 / 스컬크러셔 |

### 화 — `pull_a` (등 강조, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 등 vertical pull | 풀업 (or 어시스티드) / 랫 풀다운 / 클로즈그립 풀다운 |
| Slot 2 | 등 horizontal pull | 시티드 케이블 로우 / 벤트오버 로우 / 체스트 서포티드 로우 / T-바 로우 |
| Slot 3 | 후면 어깨 | 케이블 페이스풀 / 리어 델트 플라이 |
| Slot 4 | 이두 compound | 바벨 컬 / 해머 컬 / 친업 (이두 강조) |
| Slot 5 | 이두 isolation | 프리처 컬 / 케이블 컬 / 인클라인 덤벨 컬 |

### 수 — `legs_squat_focus` (5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 dominant compound | 바벨 백 스쿼트 / 프론트 스쿼트 / 핵 스쿼트 |
| Slot 2 | 단일다리 | 워킹 런지 / 불가리안 스플릿 스쿼트 / 스텝업 |
| Slot 3 | 글루트 강조 | 힙 쓰러스트 / 글루트 브릿지 / 케이블 풀스루 |
| Slot 4 | 대퇴사두 isolation | 레그 익스텐션 / 레그 프레스 (얕은 ROM) |
| Slot 5 | 카프 | 시티드 카프 / 스탠딩 카프 |

### 목 — `push_b` (어깨 강조 / volume, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 어깨 vertical push compound | 시티드 덤벨 프레스 / 바벨 OHP / 머신 숄더 프레스 |
| Slot 2 | 어깨 isolation | 사이드 레터럴 / 케이블 사이드 / 머신 사이드 |
| Slot 3 | 가슴 보조 (incline 또는 dip) | 인클라인 덤벨 / 딥 / 푸쉬업 변형 |
| Slot 4 | 삼두 compound | 클로즈그립 벤치 / 딥 (삼두 강조) |
| Slot 5 | 삼두 isolation | 푸쉬다운 / 스컬크러셔 |

### 금 — `legs_hinge_focus` (5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 힌지 compound | 컨벤셔널 데드 / 스모 데드 / 트랩바 데드 / RDL |
| Slot 2 | 힙 dominant | 힙 쓰러스트 / 케이블 풀스루 / 굿모닝 |
| Slot 3 | 햄스트링 isolation | 시티드 레그 컬 / 라잉 레그 컬 |
| Slot 4 | 글루트 isolation | 케이블 킥백 / 머신 글루트 익스텐션 / 힙 어덕션·어브덕션 |
| Slot 5 | 코어 (선택) | 행잉 니레이즈 / 토즈투바 / 케이블 크런치 |

---

## 주차별 강도 매트릭스 (12주 = 4주 × 3 chapter)

### Chapter 1 — Base (W1-W4) "MEV + 폼"

**볼륨:** 8-10 sets/muscle/week (Schoenfeld MEV)
**RPE:** 7
**칼로리:** maintenance (-5% ~ +5% 작은 변동)

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| Compound (Slot 1·2 등) | 1세트 빈바 10-15 / 3세트 본격 8-12 | RPE 7 |
| Accessory | 3세트 × 10-12 | RPE 7 |
| Isolation | 3세트 × 12-15 | RPE 7 |

### Chapter 2 — Build (W5-W8) "MAV 도달 + recomp 본격"

**볼륨:** 12-16 sets/muscle/week (Schoenfeld MAV)
**RPE:** 8
**칼로리:** **calorie cycling** (Nippard recomp) — 트레이닝 day +5%, 휴식 day -10%

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| Compound | 4세트 × 8-10 (3세트 본격 + 1세트 backoff 12회) | RPE 8 |
| Accessory | 3-4세트 × 10-12 | RPE 8 |
| Isolation | 3-4세트 × 12-15 | RPE 8 |
| HIIT 1회/주 추가 (수 또는 토) | 4 라운드 × 30s on / 30s off | — |

### Chapter 3 — Peak (W9-W12) "MAV 유지 + 시각적 변화 명확"

**볼륨:** 14-18 sets/muscle/week (MAV 유지)
**RPE:** 8-9 (마지막 세트 만)
**칼로리:** 작은 적자 (-10%) — Peak 에서 체지방 마무리 (Nippard recomp)

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| Compound | 4세트 × 6-10 (피라미드 또는 정탑) | RPE 8-9 |
| Accessory | 4세트 × 10-12 + drop set 1 | RPE 8 |
| Isolation | 4세트 × 12-15 + AMRAP 마지막 | RPE 9 |
| HIIT 2회/주 + LISS 1회 | 5-6 라운드 | — |

---

## 영양 가이드 (Nippard + Schoenfeld 메타)

| 항목 | 값 |
|---|---|
| **단백질** | 1.8-2.2g/kg/day (Schoenfeld plateau 1.6g/kg 이상) |
| **칼로리 (Base)** | maintenance ±5% |
| **칼로리 (Build)** | calorie cycling (트레이닝 day +5%, 휴식 day -10%) |
| **칼로리 (Peak)** | 작은 적자 -10% (체지방 마무리) |
| **타이밍** | 4-6시간 anabolic window (Schoenfeld) — 트레이닝 전후 자유 |
| **추적** | 체중 X / 측정·사진·근력 변화로 (스케일 = 근육·지방 동시 변화로 무의미) |

---

## 챕터 경계 재후킹

| 시점 | 메시지 | 데이터 |
|---|---|---|
| W4 → W5 (Base → Build) | "Base 4주 적응 완료. 다음 4주 = 볼륨 ↑ + calorie cycling 도입" | Base totalVolume + 1RM 추정 변화 |
| W8 → W9 (Build → Peak) | "Build 완료. 다음 4주 = 적자 도입으로 체지방 마무리. 시각적 변화 명확해짐" | Build 통계 + 측정 변화 |
| W12 종료 | "12주 인바디 D 완주!" + 결과 리포트 | 부위별 측정·근력·체구성 변화 |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_inbody_d_12w",
  weeks: 12,
  chapters: 3,
  sessionsPerWeek: 5,  // weight 5일, 카디오 별도
  weeklyMatrix: [
    { week: 1, dayOfWeek: 1, type: "push_a", slots: 5, sets: 3, reps: "8-12", rpe: 7 },
    { week: 1, dayOfWeek: 2, type: "pull_a", slots: 5, sets: 3, reps: "8-12", rpe: 7 },
    { week: 1, dayOfWeek: 3, type: "legs_squat_focus", slots: 5, sets: 3, reps: "8-12", rpe: 7 },
    { week: 1, dayOfWeek: 4, type: "push_b", slots: 5, sets: 3, reps: "10-12", rpe: 7 },
    { week: 1, dayOfWeek: 5, type: "legs_hinge_focus", slots: 5, sets: 3, reps: "8-12", rpe: 7 },
    // W2-W4 동일
    // W5-W8 Build (sets 4, RPE 8, calorie cycling)
    // W9-W12 Peak (sets 4 + finisher, RPE 8-9, deficit -10%)
  ],
}
```

---

## 앞 3 카탈로그와 차이

| 항목 | summer_diet_12w | quick_diet_4w | muscle_8w | **inbody_d_12w** |
|---|---|---|---|---|
| 목적 | fat_loss | fat_loss 단기 | muscle_gain | **recomp (둘 다)** |
| 기간 | 12주 (3 chapter) | 4주 (1 chapter) | 8주 (2 chapter) | **12주 (3 chapter)** |
| 분할 | 2분할 4일 | 2분할 4일 + MetCon | 2분할 4일 | **5일 PPL 변형** |
| 칼로리 | -20% | -25% | maintenance/+5% | **cycling: maintenance → +5/-10% → -10%** |
| 카디오 | LISS 정기 | MetCon + 매일 걸음 | 선택 | **LISS 2-3 + Build HIIT 1 + Peak HIIT 2** |
| 볼륨 | MEV→MAV | TIA Mini Cut 高 | MEV→MAV | **MEV→MAV→MAV 유지** |
| 추적 | 체중 + 측정 | 체중 (-1.5-3.5%) | 1RM + 측정 | **측정·사진·근력만 (체중 X)** |
| 적용 페르소나 | 일반 fat_loss | 단기 다이어트 | 입문~중급 muscle | **입문/복귀/체지방 高 (recomp 가능 조건)** |

---

## 다음 단계

1. 자문단 검증 — 운동과학 spot check
2. OK 시 → SSOT 박음
3. 다음 카탈로그 — `prog_posture_8w` (거북목·굽은등 교정 8주, health 페르소나)
