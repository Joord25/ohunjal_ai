# prog_quick_diet_4w — 급빠 4주 체지방감량 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** ♂40 fat_loss 페르소나 (단기 집중 — 휴가 전 / 행사 전 등)
**기간:** 4주 (1 chapter — [memory:feedback_user_attention_span] 최소 단위)
**주당 빈도:** 4회 weight + 1-2회 MetCon (HIIT) + 매일 걷기 (LISS)

---

## 핵심 디자인 — Israetel TIA Mini Cut + Helms 큰 적자 패턴

대표 vision = "급빠 4주 (2분할 저중강도 15-20+회 + HIIT)". 학술 근거 일치:
- **Israetel TIA Mini Cut**: 3-6주 단기 큰 적자 + 고볼륨 + 고카디오 (근손실 신호 상쇄)
- **Helms 큰 적자 연구**: 4주 750kcal 적자 = 4lb 지방 감량 + lean mass·테스토·코르티솔 변화 X
- **Norton 짧은 cut**: 4-6주 bulk + 2-3주 cut 패턴 = 짧은 적자에선 큰 결손 OK
- **MetCon 메타분석**: 60-65% 1RM × 15-20회 = 대사 스트레스 + 기계적 긴장 동시 (다이어트 친화)

→ 4주 = 적자 큼 + 트레이닝 강도 유지 + MetCon 추가 + 매일 걷기.

---

## ⚠ 디자인 원칙 (prog_summer_diet_12w 와 동일)

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- exerciseList 박지 X — 슬롯별 풀만 정의
- 랜덤 시드: `(weekIndex × 7 + dayOfWeek)` 결정적 → 같은 주차 같은 요일 = 같은 운동

---

## 학술 근거

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Israetel TIA Mini Cut** ([RP Strength](https://rpstrength.com/blogs/articles/minicuts-dr-mike-israetel)) | "3-6주 단기. 고볼륨 + 고카디오 + 큰 적자. 10-15K 걸음/일. 단백질 1g/lb" | 4주 = TIA 범위 / 매일 걷기 + MetCon |
| **Israetel — 단백질·체중 감량 속도** ([RP cutting diet](https://rpstrength.com/blogs/podcasts/dr-mike-israetel-s-cutting-diet-macros-cardio-strategy)) | "0.5-1.0% bw/주 손실 / 12주 max 후 8주 break" | 4주 1.5-3.5% bw 손실 가능 |
| **Helms et al. 4주 적자 연구** ([Calories in Context](https://nutridylan.com/2012/08/29/roundtable-interview-with-layne-norton-phd-eric-helms-and-alan-aragon/)) | "750kcal 적자 4주 = 4lb 지방 / lean mass 손실 X" | 4주 큰 적자 안전성 입증 |
| **MetCon 메타분석** ([PMC11966053](https://pmc.ncbi.nlm.nih.gov/articles/PMC11966053/)) | "60-65% 1RM × 15-20회 = 대사 + 근비대 동시 자극" | 본 카탈로그 RPE/볼륨 기준 |
| **8-week HIIRT 연구** ([Frontiers Public Health 2025](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1578569/pdf)) | "8주 HIIRT = bw -11.4kg / fat% -3.1%" | 4주 단축 적용 시 절반 효과 추정 |
| **Schoenfeld 빈도 메타** ([PubMed 27102172](https://pubmed.ncbi.nlm.nih.gov/27102172/)) | "주 2회+ 각 근육 그룹" | 2분할 4일 = 각 근육 주 2회 |
| **Norton 큰 적자 단기** ([Biolayne fat loss](https://help.biolayne.com/article/36-fat-loss-programs)) | "짧은 cut 일수록 적자 클수록 OK" | 4주 = -25% 칼로리 (적극) |

---

## 분할 — 2분할 4일 + MetCon 2일

| 요일 | 분할 type | 비고 |
|---|---|---|
| 월 | **`upper_compound`** | Upper 컴파운드 + 보조 |
| 화 | **`lower_compound`** | Lower 컴파운드 + 보조 |
| 수 | **`metcon_circuit`** | MetCon 서킷 (HIIT) — 20-25분 |
| 목 | **`upper_volume`** | Upper 고반복 + 펌프 |
| 금 | **`lower_volume`** | Lower 고반복 + 펌프 |
| 토 | **`metcon_circuit`** 또는 LISS 60분 | 선택 |
| 일 | LISS 30-60분 (걷기) | 회복 |

**매일 추가:** 10K-15K 걸음 (Israetel TIA mini cut 권장)

---

## 슬롯 정의 — 유사 운동 그룹

### 월 — `upper_compound`
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 가슴 horizontal push | 바벨 벤치 / 인클라인 바벨 / 덤벨 벤치 / 스미스 벤치 |
| Slot 2 | 등 vertical pull | 풀업 (or 어시스티드) / 랫 풀다운 / 클로즈그립 풀다운 |
| Slot 3 | 어깨 vertical push | 오버헤드 프레스 (바벨/덤벨) / 머신 숄더 프레스 |
| Slot 4 | 등 horizontal pull | 시티드 케이블 로우 / 벤트오버 로우 / 체스트 서포티드 로우 |

### 화 — `lower_compound`
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 무릎 dominant | 바벨 백 스쿼트 / 프론트 스쿼트 / 핵 스쿼트 |
| Slot 2 | 힌지 dominant | 컨벤셔널 데드 / 스모 데드 / 트랩바 데드 / RDL |
| Slot 3 | 단일다리 | 워킹 런지 / 불가리안 스플릿 스쿼트 / 스텝업 |
| Slot 4 | 글루트 + 햄 | 힙 쓰러스트 / 글루트 브릿지 / 레그 컬 |

### 수·토 — `metcon_circuit` (HIIT)
| 라운드 (4-6 라운드 × 30-40초 work / 20-30초 rest) | 풀 |
|---|---|
| Slot A | 케틀벨 스윙 / 케틀벨 클린 / 덤벨 스내치 |
| Slot B | 버피 / 마운틴 클라이머 / 박스 점프 |
| Slot C | 푸쉬업 변형 (스탠다드/디클라인/박수) |
| Slot D | 점프 스쿼트 / 점프 런지 / 워킹 런지 |
| Slot E | 행잉 니레이즈 / 토즈투바 / 바이시클 크런치 |

### 목 — `upper_volume`
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 가슴 보조 | 인클라인 덤벨 / 딥 / 케이블 크로스오버 / 펙덱 |
| Slot 2 | 등 보조 | 케이블 로우 / T-바 로우 / 풀오버 |
| Slot 3 | 어깨 isolation | 사이드 레터럴 / 프론트 레이즈 / 페이스풀 |
| Slot 4 | 팔 isolation | 케이블 컬 / 해머 컬 / 트라이셉 푸쉬다운 / 스컬크러셔 |

### 금 — `lower_volume`
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 | 대퇴사두 isolation | 레그 익스텐션 / 레그 프레스 (얕은 ROM) |
| Slot 2 | 햄 isolation | 시티드 레그 컬 / 라잉 레그 컬 |
| Slot 3 | 글루트 보조 | 케이블 킥백 / 머신 글루트 익스텐션 / 힙 어덕션 |
| Slot 4 | 카프 + 코어 | 시티드/스탠딩 카프 + 행잉 니레이즈 또는 플랭크 |

---

## 주차별 강도 매트릭스 (4주 = 1 chapter, 매주 progression)

| 주차 | 컴파운드 (월·화) | 볼륨 (목·금) | MetCon (수·토) | RPE | 카디오 |
|---|---|---|---|---|---|
| **W1 적응** | 3 sets × 12-15 reps @ 60-65% 1RM | 3 sets × 15-20 reps | 4 라운드 × 30s on / 30s off | 7 | LISS 30분 매일 |
| **W2 볼륨 ↑** | 3-4 sets × 12-15 reps | 3-4 sets × 15-20 reps | 5 라운드 × 35s on / 25s off | 8 | LISS 35분 매일 |
| **W3 강도 ↑** | 4 sets × 10-12 reps @ 65-70% | 3-4 sets × 15-20 + drop set 1 | 5 라운드 × 40s on / 20s off | 8-9 | LISS 40분 매일 |
| **W4 마무리** | 4 sets × 10-12 + finisher | 4 sets × 15-20 + AMRAP 마지막 | 6 라운드 × 40s on / 20s off | 9 | LISS 30분 + 1회 HIIT 추가 |

**적자 가이드 (Norton 큰 적자):** -25% 칼로리 / 단백질 2.2g/kg (Israetel 1g/lb) / 매일 10-15K 걸음

---

## 챕터 경계 재후킹 (4주 = 1 챕터 종료 시)

| 시점 | 메시지 | 데이터 |
|---|---|---|
| W1 종료 (적응 완료) | "1주 적응 완료. 다음 3주 본격 강도 ↑" | 첫 주 totalVolume + bw 변화 |
| W4 종료 | "4주 단기 다이어트 완주!" + 결과 리포트 | 총 bw 손실·MetCon 라운드 수·총 걸음 수 |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_quick_diet_4w",
  weeks: 4,
  chapters: 1,
  sessionsPerWeek: 4,  // weight 4일, MetCon 별도
  weeklyMatrix: [
    { week: 1, dayOfWeek: 1, type: "upper_compound", sets: 3, reps: "12-15", rpe: 7 },
    { week: 1, dayOfWeek: 2, type: "lower_compound", sets: 3, reps: "12-15", rpe: 7 },
    { week: 1, dayOfWeek: 3, type: "metcon_circuit", rounds: 4, work: 30, rest: 30 },
    { week: 1, dayOfWeek: 4, type: "upper_volume", sets: 3, reps: "15-20", rpe: 7 },
    { week: 1, dayOfWeek: 5, type: "lower_volume", sets: 3, reps: "15-20", rpe: 7 },
    { week: 1, dayOfWeek: 6, type: "metcon_circuit", rounds: 4, work: 30, rest: 30 },
    // W2-W4 progression (sets/rounds/intensity ↑)
  ],
}
```

---

## prog_summer_diet_12w 와 차이

| 항목 | summer_diet_12w | quick_diet_4w |
|---|---|---|
| 기간 | 12주 (4×3 chapter) | 4주 (1 chapter) |
| 적자 강도 | -20% (Norton 일반) | -25% (Norton 짧은 cut + Israetel TIA) |
| MetCon | 카디오 LISS·HIIT 별도 | **세션 자체에 MetCon 2회/주 박힘** |
| 분할 | 2분할 4일 (Upper/Lower) | 2분할 4일 + MetCon 2일 |
| 볼륨 | Schoenfeld 10+ sets MEV→MAV | Israetel 고볼륨 (TIA Mini Cut) 처음부터 |
| 매일 걷기 | LISS 별도 카디오 | 10-15K 걸음 매일 (Israetel TIA) |
| 챕터 재후킹 | 3회 (W4·W8·W12) | 1회 (W4 종료) |

---

## 다음 단계

1. 자문단 검증 — 운동과학 spot check
2. OK 시 → SSOT 박음
3. 다음 카탈로그 — `prog_muscle_8w` (8주 근육량 증가, ♀27 페르소나)
