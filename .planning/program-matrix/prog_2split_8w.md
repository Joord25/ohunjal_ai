# prog_2split_8w — 2분할 체력 튼튼 8주 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** muscle_gain·endurance 페르소나 — 입문·바쁨·기초 체력 빌드업 (♀27 muscle_gain 또는 endurance goal)
**기간:** 8주 (4주 × 2 chapter — [memory:feedback_user_attention_span] 4주 청킹)
**주당 빈도:** **3일** weight (월·수·금 비연속) + 매일 단순 모빌리티 (선택)

---

## ⚠ 디자인 원칙 (앞 카탈로그와 동일)

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- exerciseList 박지 X — 슬롯별 풀만 정의
- **Starting Strength linear progression** 패턴: 컴파운드 = 5 lb/세션 점진 증량 (Squat/Deadlift), 2.5-5 lb (Bench/OHP)
- 횟수 12-15 (체력·근지구력 강조, 대표 vision "체력 튼튼")

---

## 학술 근거 — 해외 전문가 (Rippetoe + Upper/Lower meta + 8주 conditioning)

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Mark Rippetoe — Starting Strength** ([Legion Athletics](https://legionathletics.com/starting-strength-program/) / [Starting Strength 공식](https://startingstrength.com/get-started/programs)) | "3일 비연속 (월·수·금) / Day A·B 교대 / Linear progression 5 lb 컴파운드 매 세션 / 2.5-5 lb upper" | 본 카탈로그 3일 비연속 + 매주 진행 |
| **3일 Upper/Lower 평가** ([Hevy](https://www.hevyapp.com/upper-lower-full-body-split/) / [Legion Upper Lower](https://legionathletics.com/upper-lower-split/) / [aworkoutroutine](https://www.aworkoutroutine.com/upper-lower-split/)) | "입문·바쁜 일정·다른 운동 병행자에게 적합 / 주 2회+ 주요 근육 빈도 일부 충족 (alternating)" | 본 카탈로그 페르소나 정합 |
| **Upper/Lower 8주 효과** ([Hevy 가이드](https://www.hevyapp.com/upper-lower-split-complete-guide/)) | "8주 = 근육 성장 시작 / 8-12주 일관 자극 권장" | 본 카탈로그 8주 적정 |
| **Schoenfeld 빈도 메타** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 빈도가 1회보다 hypertrophy 우수" | 3일 2분할 alternating = 격주로 한쪽 주 2회 (부분 충족) |
| **NASM Upper/Lower** ([NASM Blog](https://blog.nasm.org/upper-lower-splits-explained)) | "유연한 분할. 2-5일 가능. 가장 simple = 2-3일" | 본 3일 = NASM 권장 단순 진입 |
| **Tier Three Tactical 8주 strength + endurance hybrid** ([Tier Three](https://www.tierthreetactical.com/8-week-hybrid-strength-and-endurance-training-plan-part-1/)) | "3 strength days + 2 conditioning days = 균형 잡힌 8주" | 본 카탈로그 3일 + 매일 모빌리티 |
| **General Conditioning Effect 6-8주** (univ-denver / NFPT) | "6-8주 = 유의 컨디셔닝 효과 시작" | 본 카탈로그 8주 = 효과 보장 |
| **Muscular Endurance Range** (NFPT) | "20-25 reps = 근지구력. 12-15 reps = 근비대 + 일부 endurance" | 본 카탈로그 12-15회 (대표 vision "체력 튼튼") |

---

## 분할 — 3일 Upper/Lower Alternating (입문 친화)

3일 비연속 (월·수·금) + Upper/Lower **alternating**. 매주 다른 패턴.

### Week 패턴 (격주 교대)
**홀수주 (W1·3·5·7):** A → B → A
- 월: Upper A (Push 강조)
- 수: Lower (스쿼트 day)
- 금: Upper B (Pull 강조)

**짝수주 (W2·4·6·8):** B → A → B
- 월: Lower (스쿼트 또는 데드 — Slot 1 alternating)
- 수: Upper (Push 또는 Pull — Slot 1 alternating)
- 금: Lower (반대)

→ **8주 누적: 각 분할(Upper/Lower) 약 12회씩 균형**.
→ Lower = 매주 1-2회. Upper = 매주 1-2회. Schoenfeld 빈도 부분 충족 + 시간 부담 ↓ (대표 vision "체력 튼튼" + 입문).

| 요일 | 홀수주 | 짝수주 | 비고 |
|---|---|---|---|
| 월 | **`upper_push_focus`** | **`lower_squat_focus`** | 비연속 |
| 수 | **`lower_full`** (스쿼트+데드 통합) | **`upper_pull_focus`** | 회복 ↑ |
| 금 | **`upper_pull_focus`** | **`lower_hinge_focus`** | 주말 휴식 |
| 토·일 | 휴식 또는 가벼운 산책 | 동일 | — |

매일 5분 모빌리티 (캣카우 / 글루트 브릿지 / 데드버그) — 선택.

---

## 슬롯 정의 — 유사 운동 그룹 (4 슬롯, 입문 친화)

### `upper_push_focus` (홀수주 월 / 짝수주 수)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 가슴 horizontal push | 바벨 벤치 / 인클라인 바벨 / 덤벨 벤치 / 머신 체스트 프레스 |
| Slot 2 | 어깨 vertical push | 오버헤드 프레스 (바벨/덤벨) / 머신 숄더 프레스 |
| Slot 3 | 등 horizontal pull (보조) | 시티드 케이블 로우 / 인버티드 로우 |
| Slot 4 | 코어 (등척 30s 또는 컨디셔닝) | 플랭크 / 데드버그 / 행잉 니레이즈 |

### `upper_pull_focus` (홀수주 금 / 짝수주 수)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 등 vertical pull | 풀업 (or 어시스티드) / 랫 풀다운 |
| Slot 2 | 등 horizontal pull | 벤트오버 로우 / T-바 로우 / 시티드 케이블 로우 |
| Slot 3 | 후면 어깨 + 이두 | 페이스풀 + 바벨 컬 (super set) / 케이블 컬 |
| Slot 4 | 코어 (등척 30s 또는 컨디셔닝) | 사이드 플랭크 / 행잉 니레이즈 |

### `lower_squat_focus` (홀수주 수 / 짝수주 월)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 dominant compound | 바벨 백 스쿼트 / 프론트 스쿼트 / 핵 스쿼트 / 레그 프레스 |
| Slot 2 | 단일다리 | 워킹 런지 / 불가리안 스플릿 스쿼트 / 스텝업 |
| Slot 3 | 글루트 + 햄 | 글루트 브릿지 / 레그 컬 / 힙 쓰러스트 (선택) |
| Slot 4 | 카프 + 코어 | 카프 레이즈 + 행잉 니레이즈 또는 플랭크 |

### `lower_hinge_focus` (짝수주 금)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 힌지 compound | 컨벤셔널 데드 / RDL / 트랩바 데드 |
| Slot 2 | 글루트 강조 | 힙 쓰러스트 / 글루트 브릿지 / 케이블 풀스루 |
| Slot 3 | 햄 isolation | 시티드 레그 컬 / 라잉 레그 컬 |
| Slot 4 | 코어 + 카프 | 행잉 니레이즈 + 카프 레이즈 |

### `lower_full` (홀수주 수, 스쿼트 + 데드 통합)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 compound | 바벨 백 스쿼트 / 프론트 스쿼트 |
| Slot 2 | 힌지 compound | 컨벤셔널 데드 / RDL |
| Slot 3 | 글루트 또는 단일다리 | 힙 쓰러스트 / 워킹 런지 |
| Slot 4 | 코어 | 플랭크 / 행잉 니레이즈 |

---

## 주차별 강도 매트릭스 (8주 = 4주 × 2 chapter)

### Chapter 1 — Adaptation (W1-W4) "Linear Progression 입문 + 폼"

**Starting Strength 패턴**: 매 세션 컴파운드 5 lb 점진 (Squat/Deadlift), 2.5-5 lb (Bench/OHP)
**RPE:** 7 (마지막 세트만)
**횟수:** 12-15 (체력·근지구력 강조)

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| Slot 1 (compound) | 1세트 빈바 × 12-15 / **3세트 본격 무게 × 12-15** | Linear progression — 매 세션 +2.5-5kg |
| Slot 2 (compound 보조) | 3세트 × 12-15 | 동일 |
| Slot 3 (보조) | 3세트 × 12-15 | 동일 |
| Slot 4 (코어/등척) | 2-3세트 × 30-45s 유지 또는 12-15 reps | 시간/횟수 |

### Chapter 2 — Build (W5-W8) "부하 ↑ + 컨디셔닝 추가"

**RPE:** 7-8 (마지막 세트 challenge)
**횟수:** 10-12 (점진 부하)
**추가:** 매 세션 마지막에 5분 conditioning finisher (컨디셔닝)

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| Slot 1 (compound) | 1세트 빈바 × 10-12 / **3-4세트 본격 무게 × 10-12** | 진행 5kg 단위 |
| Slot 2 | 3세트 × 10-12 | 동일 |
| Slot 3 | 3세트 × 12-15 | 가벼운 펌프 |
| Slot 4 (코어/등척) | 3세트 × 45-60s 또는 12-15 reps + finisher | 시간 ↑ |
| **Finisher (5분)** | 4 라운드 × 30s on / 30s off | 케틀벨 스윙 / 버피 / 마운틴 클라이머 / 점프 스쿼트 |

---

## Linear Progression 실패 시 (Starting Strength deload 룰)

3 세션 연속 실패 → **10% 감량 후 재진행** (Rippetoe 룰).
- 예: 스쿼트 60kg 실패 3회 연속 → 다음 세션 54kg 부터 재시작
- 회복 후 다시 5kg/세션 진행

---

## 챕터 경계 재후킹

| 시점 | 메시지 | 데이터 |
|---|---|---|
| W4 → W5 (Adaptation → Build) | "4주 적응 완료. 다음 4주 = 부하 ↑ + 컨디셔닝 finisher 추가" | 컴파운드 1RM 추정 변화 (Linear progression 누적 무게) |
| W8 종료 | "8주 체력 튼튼 완주!" + 결과 리포트 | 시작·종료 1RM·반복 비교 |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_2split_8w",
  weeks: 8,
  chapters: 2,
  sessionsPerWeek: 3,  // 월·수·금
  weeklyMatrix: [
    // 홀수주 패턴 (W1·3·5·7): A → B → A
    { week: 1, dayOfWeek: 1, type: "upper_push_focus", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    { week: 1, dayOfWeek: 3, type: "lower_full", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    { week: 1, dayOfWeek: 5, type: "upper_pull_focus", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    // 짝수주 패턴 (W2·4·6·8): B → A → B
    { week: 2, dayOfWeek: 1, type: "lower_squat_focus", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    { week: 2, dayOfWeek: 3, type: "upper_pull_focus", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    { week: 2, dayOfWeek: 5, type: "lower_hinge_focus", slots: 4, sets: 3, reps: "12-15", rpe: 7, linearProgression: true },
    // W3-W4 동일
    // W5-W8 (Build, sets 4, reps 10-12, RPE 8, finisher)
  ],
}
```

---

## 앞 5 카탈로그와 차이 (특히 muscle_8w)

| 항목 | summer_diet_12w | quick_diet_4w | muscle_8w | inbody_d_12w | posture_8w | **2split_8w** |
|---|---|---|---|---|---|---|
| 빈도 | 4일 | 4+MetCon 2 | 4일 | 5일 | 4일 | **3일** (시간 부담 ↓) |
| 횟수 | 12-15→8-10 | 12-15+15-20 | 8-12 | 8-12 | 12-15 | **12-15→10-12** |
| 분할 | 2분할 (4일) | 2분할 + MetCon | 2분할 (4일, 글루트 강조) | 5일 PPL | 자세 4면 | **2분할 alternating (3일)** |
| Progression | 점진 부하 | 점진 부하 | 점진 부하 | 점진 부하 + cycling | 폼 우선 | **Linear (Rippetoe 5lb/세션)** |
| 컨디셔닝 | LISS·HIIT | MetCon 박힘 | 선택 | LISS+HIIT | X | **W5-8 finisher 5분/세션** |
| 적용 페르소나 | fat_loss 일반 | 단기 다이어트 | muscle_gain 본격 | recomp 가능 | UCS 자세 교정 | **입문/바쁨/체력 빌드업** |

---

## 다음 단계

1. 자문단 검증 — 운동과학 spot check
2. OK 시 → SSOT 박음
3. **6 카탈로그 매트릭스 1차 안 완료!** — 자문단 검증 통과 시 다음:
   - 정확한 운동 풀 → 슬롯별 매트릭스 코드 표기 (programCatalog.ts 확장)
   - 룰엔진 (workoutEngine.ts) 에 type별 슬롯 풀 처리 로직 추가
   - WeightHub UI 에서 매트릭스 정보 노출 (W X · Day Y · Slot 1-4)
