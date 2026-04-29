# prog_posture_8w — 거북목·굽은등 교정 8주 매트릭스

**생성:** 2026-04-30 (회의 ζ-5 / SEED-002 P2)
**target:** health goal — 거북목·라운드 숄더·흉추 과도 후만 (= **Upper Crossed Syndrome** by Vladimir Janda)
**기간:** 8주 (4주 × 2 chapter — [memory:feedback_user_attention_span] 4주 청킹)
**주당 빈도:** 4회 weight (주 자세 교정 + 등·후면 어깨 강화) + 매일 5분 모빌리티 (선택)

---

## ⚠ 디자인 원칙 (앞 카탈로그와 동일 + 자세 교정 특화)

- 매트릭스 = **(슬롯 + 강도 + 볼륨)만 고정**, 운동은 슬롯 안 유사 운동 그룹에서 랜덤
- exerciseList 박지 X — 슬롯별 풀만 정의
- **무게보다 폼·등척 hold·정밀 ROM 우선** (Eric Cressey 원칙)
- 카디오 X (자세 교정 카탈로그는 카디오 부수 — 모빌리티 우선)

---

## 학술 근거 — 해외 전문가 (Janda + 메타분석 + Cressey)

| 출처 | 핵심 인용 | 적용 |
|---|---|---|
| **Vladimir Janda — Upper Crossed Syndrome** ([Physiopedia](https://www.physio-pedia.com/Upper-Crossed_Syndrome)) | UCS 정의: 약화근(deep cervical flexor / 하부 트랩 / 전거근) vs 단축근(상부 트랩 / 견갑거근 / 대흉근) | 약화근 강화 + 단축근 스트레칭 양면 |
| **8주 종합 corrective exercise RCT** ([PMC7692548](https://pmc.ncbi.nlm.nih.gov/articles/PMC7692548/)) | "8주 = 자세 정렬 + 근육 활성화 + 움직임 패턴 모두 개선" | 본 카탈로그 8주 기간 정합 |
| **Janda Approach 메타분석 2024** ([BMC Musculoskeletal Disorders](https://link.springer.com/article/10.1186/s12891-024-07224-4)) | "종합 corrective exercise = forward head + rounded shoulder + thoracic kyphosis 모두 개선" | 본 카탈로그 4 분할 (모빌리티·등·견갑·코어 종합) |
| **8주 EMG RCT** ([ScienceDirect S1466853X18305960](https://www.sciencedirect.com/science/article/abs/pii/S1466853X18305960)) | "초기 phase: 폼롤러·side-lying 외회전·standing diagonal flexion·military press / 향상 phase: 덤벨·밴드 추가·prone V-T-W" | Chapter 1 (활성화) → Chapter 2 (강화) 진행 |
| **8주 후 4주 detraining 효과 유지** ([PMC7692548](https://pmc.ncbi.nlm.nih.gov/articles/PMC7692548/)) | "8주 종료 후 4주 휴식해도 효과 유지" | 8주 = 적정 기간. 12주 너무 김. 4주 너무 짧음 |
| **kyphosis 8주 메타** ([PubMed 38302926](https://pubmed.ncbi.nlm.nih.gov/38302926/)) | "스트레칭·strength·shoulder·comprehensive 모두 효과 / 3개월 이내 = 효과적" | 본 8주 = 메타 권장 범위 |
| **Eric Cressey — 회전근개 + 견갑 동시** ([EricCressey.com](https://ericcressey.com/training-the-rotator-cuff-and-scapular-stabilizers-simultaneously/)) | "회전근개·견갑 안정근 = 분리 X. unilateral upper body strength + 흉추 회전 + 견갑 protraction/retraction 통합" | Slot 설계 시 두 그룹 통합 운동 우선 |
| **Eric Cressey — 하부 트랩·전거근 활성화** ([EricCressey.com 자세 교정](https://ericcressey.com/strategies-for-correcting-bad-posture-part-4/)) | "Serratus·하부 트랩 stiffness·perf 증가 + 라트·능형근 stiffness 감소" | Y-T-W 레이즈 / 푸쉬업 플러스 슬롯 |
| **homebased kyphosis** ([PMC10148263](https://pmc.ncbi.nlm.nih.gov/articles/PMC10148263/)) | "홈 베이스 자세 교정 운동도 유의 효과" | 매일 5분 홈 모빌리티 보충 가능 |

---

## 분할 — 4일 자세 교정 분할 (각 일별 다른 자세 측면)

UCS = 4면 균형 (모빌리티 / 수직 풀 / 견갑·회전근개 / 코어). 각 일별 1면 강조.

| 요일 | 분할 type | 강조 영역 |
|---|---|---|
| 월 | **`posture_thoracic_pull`** | 흉추 모빌리티 + 등 수직 풀 (랫·랫풀다운) |
| 화 | **`posture_core_glute`** | 코어 + 글루트 (자세 안정 기반) |
| 수 | 휴식 또는 매일 5분 모빌리티 (홈) | — |
| 목 | **`posture_scap_rotator`** | 견갑 안정 + 회전근개 (Cressey 통합) |
| 금 | **`posture_thoracic_rotation`** | 흉추 회전 + 등 horizontal pull (로우) |
| 토 | LISS 30분 (선택, 걷기) | 회복·혈류 |
| 일 | 휴식 + 단축근 스트레칭 (대흉근·상부 트랩·견갑거근) | Janda 단축근 스트레칭 |

---

## 슬롯 정의 — 유사 운동 그룹

### 월 — `posture_thoracic_pull` (흉추 모빌리티 + 등 수직 풀, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 (모빌리티) | 흉추 ext | 폼롤러 흉추 ext / 캣카우 / 차일드 포즈 + 사이드 reach |
| Slot 2 (compound) | 등 vertical pull | 어시스티드 풀업 / 랫 풀다운 / 클로즈그립 풀다운 |
| Slot 3 (보조) | 등 horizontal pull | 시티드 케이블 로우 / 인버티드 로우 / 체스트 서포티드 로우 |
| Slot 4 (회전근개·후면 어깨) | 외회전 / 페이스풀 | 케이블 페이스풀 / 밴드 풀 어파트 / 사이드 라잉 외회전 |
| Slot 5 (등척, 30s 유지) | 척추 신전근 | 슈퍼맨 / 백 익스텐션 |

### 화 — `posture_core_glute` (코어 + 글루트, 4 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 (코어 안정) | anti-extension / anti-rotation | 데드버그 / 버드독 / 팔로프 프레스 |
| Slot 2 (등척 30s 유지) | 코어 anti-extension | 플랭크 (포어암/하이) |
| Slot 3 (글루트 활성화) | 글루트 medius·maximus | 글루트 브릿지 / 클램쉘 / 사이드 라잉 레그 레이즈 |
| Slot 4 (등척 20-30s) | 코어 측면 | 사이드 플랭크 (RT·LT 양쪽) |

### 목 — `posture_scap_rotator` (견갑 + 회전근개, Cressey 통합, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 (Cressey 핵심) | 하부 트랩 + 견갑 retraction | Y 레이즈 / T 레이즈 / W 레이즈 (prone, foam roll) |
| Slot 2 (회전근개) | 외회전 | 사이드 라잉 외회전 (덤벨) / 스탠딩 케이블 외회전 / 밴드 외회전 |
| Slot 3 (전거근, Cressey 핵심) | 전거근 활성화 | 푸쉬업 플러스 / 월 슬라이드 / 시팅 서비투스 펀치 |
| Slot 4 (후면 어깨) | rounded shoulder 교정 | 리어 델트 플라이 (덤벨/머신) / 페이스풀 |
| Slot 5 (등척 20-30s) | 흉추 신전 | 코브라 / 프론 lift |

### 금 — `posture_thoracic_rotation` (흉추 회전 + 등 수평 풀, 5 슬롯)
| 슬롯 | 자극 | 유사 운동 그룹 |
|---|---|---|
| Slot 1 (모빌리티) | 흉추 회전 | 오픈 북 / threading the needle / 시티드 thoracic 회전 |
| Slot 2 (compound, 가벼운) | 힌지 (자세 안정) | RDL (가벼운 덤벨) / 굿모닝 (가벼운 무게) |
| Slot 3 (등 horizontal pull) | 등 두께 + 후면 어깨 | T-바 로우 / 시티드 로우 (와이드 그립) / 케이블 로우 |
| Slot 4 (코어 hanging) | 복근 + 그립 | 행잉 니레이즈 / 토즈투바 |
| Slot 5 (등척 20-30s) | 코어 anti-flexion | 데드 행 (그립 + 자세) |

---

## 주차별 강도 매트릭스 (8주 = 4주 × 2 chapter, EMG RCT 패턴)

### Chapter 1 — Activation Phase (W1-W4) "활성화 + 폼"

**근거:** EMG RCT 초기 phase = 폼롤러·side-lying 외회전·standing diagonal flexion·military press
**RPE:** 6 (매우 가볍게, 폼 우선)
**무게:** 모빌리티는 맨몸. 회전근개·외회전 = 가벼운 덤벨(♂2-3kg / ♀1-2kg). 등 운동 = 가벼운 무게.

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| 모빌리티 (Slot 1) | 2 sets × 8-10 reps | 천천히 + 호흡 |
| Compound 등 운동 | 3 sets × 12-15 reps | 폼 우선, 가벼운 무게 |
| 견갑·회전근개 | 3 sets × 12-15 reps | 가벼운 덤벨·밴드 |
| 등척 hold (Slot 5) | 2 sets × 30s 유지 | 슈퍼맨·코브라·플랭크 등 |
| 코어 | 3 sets × 10-12 reps 또는 30s hold | 데드버그·버드독·플랭크 |

### Chapter 2 — Strengthening Phase (W5-W8) "강화 + 부하"

**근거:** EMG RCT 향상 phase = 덤벨/밴드 추가, prone V-T-W
**RPE:** 7 (가볍게~중간, 폼 유지 우선)
**무게:** 약간 ↑. 등 컴파운드 = 점진 부하. 회전근개 = 덤벨 1-2kg ↑.

| 슬롯 타입 | Sets × Reps | 비고 |
|---|---|---|
| 모빌리티 | 2 sets × 10-12 reps | 동일 — ROM 약간 확대 |
| Compound 등 운동 | 3-4 sets × 10-12 reps | 무게 점진 ↑ |
| 견갑·회전근개 | 3-4 sets × 12-15 reps | 덤벨 1-2kg ↑ |
| 등척 hold | 3 sets × 45-60s 유지 | 시간 ↑ |
| 코어 | 3-4 sets × 12-15 reps 또는 45-60s hold | 시간·횟수 ↑ |

---

## Janda 단축근 스트레칭 (매일 일요일 + 평일 5분 권장)

UCS 단축근 = 매일 스트레칭. 8주 동안 일관:

- **상부 trapezius 스트레칭** — 머리 측면 굴곡 + 같은 쪽 손으로 보강 (양쪽 30s × 2)
- **견갑거근 스트레칭** — 머리 회전 + 굴곡 (대각선) + 손 보강 (양쪽 30s × 2)
- **대흉근 스트레칭** — 도어웨이 가슴 스트레칭 (저·중·고 3가지 각도, 각 30s)
- **목 깊은 굴곡근 강화** — 친 턱 (chin tuck) — 매일 10회 × 3 (Cressey)

---

## 챕터 경계 재후킹

| 시점 | 메시지 | 데이터 |
|---|---|---|
| W4 → W5 (Activation → Strengthening) | "4주 적응 완료. 자세 정렬 약간 개선 시작. 다음 4주 = 부하 강화" | 자기 측정 (벽에 등 대고 머리 거리 측정 등) |
| W8 종료 | "8주 자세 교정 완주! 효과는 4주 detraining 후에도 유지 (Janda RCT 입증)" | 시작·종료 측정 비교 (사진·자기 평가·통증 척도) |

---

## 카탈로그 SSOT 박을 형식 (참고)

```typescript
{
  id: "prog_posture_8w",
  weeks: 8,
  chapters: 2,
  sessionsPerWeek: 4,
  weeklyMatrix: [
    { week: 1, dayOfWeek: 1, type: "posture_thoracic_pull", slots: 5, sets: 3, reps: "12-15", rpe: 6 },
    { week: 1, dayOfWeek: 2, type: "posture_core_glute", slots: 4, sets: 3, reps: "10-12 또는 30s", rpe: 6 },
    { week: 1, dayOfWeek: 4, type: "posture_scap_rotator", slots: 5, sets: 3, reps: "12-15", rpe: 6 },
    { week: 1, dayOfWeek: 5, type: "posture_thoracic_rotation", slots: 5, sets: 3, reps: "12-15", rpe: 6 },
    // W2-W4 동일 (Activation)
    // W5-W8 (Strengthening, sets 3-4, RPE 7, hold time ↑)
  ],
  dailyStretching: [  // 매일 권장
    "상부 trapezius 스트레칭",
    "견갑거근 스트레칭",
    "대흉근 도어웨이 스트레칭",
    "친 턱 (chin tuck) 10×3"
  ],
}
```

---

## 앞 4 카탈로그와 차이

| 항목 | summer_diet_12w | quick_diet_4w | muscle_8w | inbody_d_12w | **posture_8w** |
|---|---|---|---|---|---|
| 목적 | fat_loss | fat_loss 단기 | muscle_gain | recomp | **자세 교정** |
| 분할 일수 | 4 | 4+MetCon 2 | 4 | 5 PPL | **4 (자세 4면 분할)** |
| 무게 강조 | 점진 ↑ | 점진 ↑ | 점진 ↑ | 점진 ↑ | **무게보다 폼·등척 hold·ROM 우선** |
| 카디오 | LISS 정기 | MetCon 박힘 | 선택 | LISS+HIIT | **X (모빌리티 우선)** |
| 등척 hold | 카탈로그 일부 | 일부 | 일부 | 일부 | **모든 일별 1 슬롯 (30-60s)** |
| 매일 권장 | 걸음만 | 10-15K 걸음 | 단백질 | 단백질 | **단축근 스트레칭 + 친 턱** |
| 적용 페르소나 | fat_loss 일반 | 단기 | 입문~중급 | recomp 가능 | **거북목·굽은등 인지 / 사무직 / UCS** |

---

## 다음 단계

1. 자문단 검증 — 운동과학 + 물리치료사 spot check (자세 교정 = 의학·재활 영역, 안전성 중요)
2. OK 시 → SSOT 박음 (현재 기존 exerciseList 5개를 본 매트릭스 슬롯 그룹으로 대체)
3. 다음 카탈로그 — `prog_2split_8w` (2분할 체력 튼튼 8주, endurance 페르소나)
