# camp_cycle_diet_12w — 생리주기 다이어트 12주 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** ♀ fat_loss — 28일 생리주기 × 3 = 12주 정확 정렬
**기간:** 12주 (28일 × 3 cycle = 84일)
**주당 빈도:** 3-5회 (phase별 분기) + 카디오 phase별 분기

---

## ⚠ 디자인 원칙 + 28일 cycle 특화

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- **28일 cycle 기반** = Follicular(D1-14) / Luteal(D15-28) 분기. 매주 다른 강도·영양
- gender = "female" 한정 노출 (회의 ζ-5 match.gender)
- 페르소나 자기보고 cycle 시작일 등록 → cycle aware

---

## 학술 근거 — 해외 전문가 (생리주기 + 트레이닝 메타분석)

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Follicular vs Luteal RT 메타** ([PubMed 35471634](https://pubmed.ncbi.nlm.nih.gov/35471634/)) | "Follicular phase RT = strength·mass 우수 / Luteal RT 보다" | Follicular = 고강도 RT / Luteal = 저-중강도 |
| **Menstrual Cycle 운동 가이드** ([The Conversation](https://theconversation.com/from-energy-levels-to-metabolism-understanding-your-menstrual-cycle-can-be-key-to-achieving-exercise-goals-131561)) | "Follicular = 남성과 metabolism·recovery 유사. 운동 쉬움 / Luteal = 운동 힘듦. 저강도 + 액티브 회복" | Phase별 강도·빈도 분기 |
| **Menstrual Cycle Periodization** ([Menno Henselmans](https://mennohenselmans.com/menstrual-cycle-periodization/)) | "RT 빈도·볼륨 cycle 정렬 = strength gain 가속" | 본 매트릭스 핵심 |
| **Substrate Utilization 가이드** ([dietvsdisease](https://www.dietvsdisease.org/menstrual-cycle-phases-weight-loss/)) | "Follicular = carb 우선 substrate / Luteal = fat 우선 (gluconeogenesis 억제)" | Phase별 macro 분기 |
| **Menstrual Cycle 다이어트 매칭 연구** ([dietvsdisease](https://www.dietvsdisease.org/menstrual-cycle-phases-weight-loss/)) | "substrate 매칭 다이어트 = 4.3kg 더 많은 감량" | 본 카탈로그 핵심 효과 |
| **Ultimate Performance** ([blog](https://blog.ultimateperformance.com/the-menstrual-cycle-nutrition-training-fat-loss/)) | "Luteal = PMS 식욕 / 카디오 ↑ + RT volume 약간 ↓ 권장" | Luteal volume 조정 |
| **Schoenfeld 빈도 메타** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 각 근육" | Follicular 4-5일 / Luteal 3일 |

---

## 28일 Cycle Phase 정의

| Phase | 일자 | Hormone | Energy | Training Focus | Macro |
|---|---|---|---|---|---|
| **Menstrual** (D1-D5) | 생리 시작 ~ 5일 | Estrogen·Progesterone 낮음 | 낮음 (개인차) | **저강도** RT + 액티브 회복 | 평소 (다이어트 적자 약화 1주) |
| **Follicular** (D6-D14) | 생리 후 ~ 배란 | Estrogen ↑ peak | **HIGH** | **고강도** RT + HIIT | **Carb friendly** (substrate carb) |
| **Ovulation** (D14) | 배란일 ± | LH peak | HIGH | 고강도 (PR 시도 좋음) | Carb |
| **Early Luteal** (D15-D21) | 배란 후 ~ 1주 | Progesterone ↑ | 중간 | 중강도 RT + 카디오 ↑ | **Fat 우선 substrate** |
| **Late Luteal** (D22-D28) | PMS 기간 | E·P 모두 ↓ | 낮음 | **저-중강도** RT + 액티브 회복 (yoga/walking) | 적자 약화 (PMS 식욕 인정) |

---

## 분할 — Phase별 빈도·강도

### Menstrual Phase (D1-D5) — Recovery Week
| 요일 | 운동 | 강도 |
|---|---|---|
| D1·D3·D5 | **`upper_low_intensity`** 또는 yoga | RPE 5-6 / 가벼운 부하 |
| D2·D4 | LISS 20분 (걷기) | — |
| 적자 | **-10%** (Menstrual = 평소보다 약화) |

### Follicular Phase (D6-D14) — Power Week (남성과 동일)
| 요일 | 운동 | 강도 |
|---|---|---|
| D6·D8·D10·D12 | `upper_push_a` / `lower_squat` / `upper_pull_a` / `lower_hinge` | RPE 8 / **고강도** |
| D7·D9·D11·D13 | LISS 25분 또는 HIIT 1회 | — |
| D14 (배란) | 고강도 RT + PR 시도 가능 | RPE 8-9 |
| 적자 | **-20%** (정상 적자) + carb friendly |

### Early Luteal (D15-D21) — Cardio Week
| 요일 | 운동 | 강도 |
|---|---|---|
| D15·D17·D19·D21 | `upper_volume` / `lower_volume` (반복 ↑ + 무게 ↓) | RPE 7 / 12-15 reps |
| D16·D18·D20 | HIIT 또는 LISS 30-40분 | 카디오 비중 ↑ |
| 적자 | **-20%** (지방 substrate 우세) |

### Late Luteal (D22-D28) — PMS Recovery Week
| 요일 | 운동 | 강도 |
|---|---|---|
| D22·D24·D26 | `upper_low` / `lower_low` (가볍게) | RPE 6 / 폼 우선 |
| D23·D25·D27 | LISS 20분 또는 yoga | — |
| D28 | 휴식 또는 가벼운 산책 | — |
| 적자 | **-10%** (PMS 식욕 인정, 적자 약화) |

---

## 슬롯 정의 (간략 — 다른 카탈로그와 동일 패턴)

### `upper_push_a` (Follicular, 고강도)
- Slot 1: 가슴 horizontal push compound · Slot 2: 어깨 vertical push · Slot 3: 후면 어깨 (페이스풀) · Slot 4: 삼두 isolation

### `lower_squat` (Follicular, 글루트 강조)
- Slot 1: 무릎 dominant · Slot 2: 단일다리 · Slot 3: 글루트 compound · Slot 4: 카프

### `upper_pull_a` (Follicular)
- Slot 1: 등 vertical pull · Slot 2: 등 horizontal pull · Slot 3: 후면 어깨 · Slot 4: 이두

### `lower_hinge` (Follicular)
- Slot 1: 힌지 compound · Slot 2: 글루트 강조 · Slot 3: 햄 isolation · Slot 4: 코어

### `upper_volume` / `lower_volume` (Early Luteal)
- 위 분할 동일 + 횟수 12-15회 + 무게 약간 ↓ (RPE 7)

### `upper_low` / `lower_low` (Menstrual·Late Luteal)
- 가볍게 + 30s 등척 hold 슬롯 추가

---

## 12주 = 28일 × 3 Cycle

3 cycle 동안 매 cycle 정확히 같은 phase 패턴 반복. 단:
- Cycle 1 (W1-W4): Adaptation — 강도 보수적
- Cycle 2 (W5-W8): Build — 강도 ↑
- Cycle 3 (W9-W12): Peak — 강도 maximum (Follicular 에 PR 시도)

매 cycle Late Luteal 끝 = 미니 diet break (3일 maintenance, refeed effect).

---

## 영양 매트릭스 (Phase별 substrate)

| Phase | 칼로리 | 단백질 | Carb | Fat |
|---|---|---|---|---|
| Menstrual | -10% | 2.0g/kg | 평균 | 평균 |
| Follicular | -20% | 2.0g/kg | **40-50% (substrate carb 우세)** | 25-30% |
| Early Luteal | -20% | 2.0g/kg | 30-35% | **35-40% (substrate fat 우세)** |
| Late Luteal | -10% | 2.0g/kg | 약간 ↑ (PMS 식욕) | 평균 |

---

## 카탈로그 SSOT 박을 형식

```typescript
{
  id: "camp_cycle_diet_12w",
  weeks: 12,
  chapters: 3,  // 3 cycle
  sessionsPerWeek: 3-5,  // phase별 변동
  match: { goal: ["fat_loss"], gender: ["female"] },
  cycleAware: true,
  cycleStartDay: number,  // 사용자 자기보고 (cycle 시작일)
  weeklyMatrix: [
    // D1-D5 Menstrual Recovery
    // D6-D14 Follicular Power
    // D15-D21 Early Luteal Cardio
    // D22-D28 Late Luteal PMS Recovery
  ],
}
```

---

## 다른 fat_loss 카탈로그와 차이

| 항목 | summer_diet_12w | quick_diet_4w | diet_16w | **cycle_diet_12w** |
|---|---|---|---|---|
| 페르소나 | 일반 fat_loss | 단기 | 본격 4개월 | **♀ 28일 cycle 정렬** |
| 빈도 | 4일 고정 | 4 + MetCon | 4일 고정 | **3-5일 phase 변동** |
| 강도 | chapter별 progression | TIA Mini Cut 高 | 4 chapter macrocycle | **phase별 alternating** |
| 적자 | -20% | -25% | -15→-25% | **phase별 -10/-20 분기** |
| 카디오 | LISS·HIIT | MetCon 박힘 | HIIT 비중 ↑ | **Early Luteal cardio week** |
| 매크로 | 일정 | 일정 | 자연 보디빌더 | **phase별 substrate 매칭** |
| 효과 | 일반 | 단기 큰 효과 | 4개월 마라톤 | **연구: substrate 매칭 +4.3kg 추가 감량** |
