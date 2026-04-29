---
id: SEED-002
status: planted — **시장 조사 백그라운드 즉시 시작 (SEED-003) / P1~P4 코드는 SEED-001 Phase 2 마무리 후 대표 트리거 대기**
planted: 2026-04-29
planted_during: 회의 2026-04-29-ζ-4 (대표 소집, ChatHome 폐기 + 카탈로그 중심 UX 재설계)
trigger_when: SEED-001 Phase 2 (가이드 90종 + carousel + swap) 마무리 + 대표 트리거
scope: XL (4 Phase, 약 4주 추정)
depends_on: SEED-003 (YouTube 시장 조사 산출물 필수)
---

# SEED-002: ProgramFirst UX 전환 — ChatHome 폐기 + 큐레이션 카탈로그 도입

## Why This Matters

대표 결단(2026-04-29 ζ-4): "유저 선택 자유도를 줄이고 내가 주도한 프로그램에 유저들이 따르는걸 유도".

자문단 다수 의견 정합:
- **박충환** (한국 시장): "한국 컨슈머는 결정 피로 강한 회피. '뭘 해야 할지 모름' = 1주 이탈 1순위"
- **Nir Eyal** (*Hooked*): "Action 단순화 = 습관 형성 1순위. 채팅 입력 = 마찰. 카드 클릭 = 마찰 0"
- **Seth Godin** (*마케팅이다*): "변화 중심 — '누구를 어떤 변화로'가 명확할수록 메뉴는 줄어도 됨"
- **April Dunford**: "'코치가 짜준 프로그램' 포지션이 'AI 채팅'보다 카테고리 점유 명확"

프로젝트 룰 정합:
- [memory:feedback_product_scope_focus]: "측정·진단 X, 실행" — 카탈로그 = 실행 강화
- [memory:feedback_user_attention_span]: 12주 상한 + 4주 청킹 = 프로그램 구조 강제

## 현재 흐름 vs 제안 흐름

| 진입 | 현재 (코드 검증) | 제안 |
|---|---|---|
| 웨이트 | ROOT → ChatHome → parseIntent → Gemini → 실행 → MasterPlan → 운동 (6 step) | ROOT → **WeightHub** → 카탈로그 선택 → MasterPlan → 운동 (4 step) |
| 러닝 | ROOT → RunningHub → 4 프로그램 → MasterPlan → 운동 (4 step) | **그대로 유지** (대표 명시) |
| 홈트 | ROOT → HomeWorkoutHub → 단일 세션 → MasterPlan → 운동 (4 step) | ROOT → HomeWorkoutHub → **카탈로그 5** → MasterPlan → 운동 |

## 페르소나 (Seth Godin "최소 유효 시장")

1. **30대 직장 다이어트 (여성)**: 12주 다이어트 → ✅ 강한 찬성
2. **50대 근력 시니어 (남성)**: 건강·입문 → ✅ 강한 찬성
3. **20대 헬스 마니아 (남성)**: 자유도 中시 → ⚠ "추천 외 검색은 남겨주세요" → 후속 회의로 연기
4. **40대 마라톤 러너 (남성)**: 이미 RunningHub 패턴 익숙 → ✅ 자연 수용

## Phase 분리 (4 Phase, 약 4주)

### P1: 온보딩 확장 (룰 매트릭스, AI X)

**근거:** Amanda Askell + 이화식 — AI 자동 분기 X (latency·hallucination·디버깅).

**변경:**
- [src/components/layout/Onboarding.tsx](../../src/components/layout/Onboarding.tsx) 5단계 → 6단계
- 신규 step: `workout_preference` (multi-select: 웨이트/러닝/홈트)
- 저장: `localStorage.ohunjal_fitness_profile.workoutPreference: ("weight"|"running"|"home")[]`
- Firestore: `users/{uid}/fitnessProfile.workoutPreference`
- i18n: `onboarding.workoutPreference.*` (KO+EN)
- Analytics: 신규 1 이벤트 `onboarding_workout_preference` (선택값 array)

**예상 작업:** 1-2일.

### P2: 웨이트·홈트 카탈로그 5+5개 (가장 큰 작업)

**의존성:** SEED-003 시장 조사 산출물.

**웨이트 5개 (1차 안):**

| ID | 이름 | 분할 | 강도 | 횟수 | 기간 | 타겟 |
|---|---|---|---|---|---|---|
| `weight_diet_12w` | 3개월 다이어트 | 2분할 | 저-중강도 | 15-20+ | 12주 (4w×3) | 30대 직장 다이어트 |
| `weight_starter_8w` | 헬스 입문 8주 | 2분할 | 중강도 | 10-15 | 8주 (4w×2) | 운동 처음·6개월 휴식 |
| `weight_hypertrophy_12w` | PPL 근비대 | 3분할 | 중-고강도 | 8-12 | 12주 (4w×3) | 6개월+ 경험자 |
| `weight_strength_8w` | 최대근력 | 2-3분할 | 고강도 | 3-6 | 8주 (4w×2) | 1RM 갱신 |
| `weight_bro_split_12w` | 5분할 12주 | 5분할 | 중강도 | 8-15 | 12주 (4w×3) | 헬스 마니아 |

**홈트 5개:** SEED-003 조사 후 확정.

**카탈로그 SSOT 결정 (P2 시작 시):**
- 옵션 A (정적 JSON): 표시 즉시 / 콘텐츠 큐레이션 자유 / 사진·영상 1:1 매칭
- 옵션 B (룰엔진 재활용 `generateAdaptiveWorkout`): 코드 자산 재사용 / condition·intensity 어댑티브
- 옵션 C (하이브리드): 카탈로그 = 정적 골격 + 운동 어댑테이션은 룰엔진 ⭐ 권장

**공통 포맷:** 웜업 → 메인 → 코어. 4주 청킹 + 챕터 경계 재후킹.

**예상 작업:** 2주 (조사 + 자문단 검증 + 페르소나 인터뷰 + 코드).

### P3: WeightHub 신설 + ChatHome 완전 폐기 + 트라이얼 재설계

**WeightHub 신설:**
- 신규 [src/components/dashboard/WeightHub.tsx](../../src/components/dashboard/WeightHub.tsx) ([RunningHub.tsx](../../src/components/dashboard/RunningHub.tsx) 패턴 미러)
- ViewState 신규: `view === "weight_hub"` ([src/app/app/page.tsx](../../src/app/app/page.tsx) 라우팅)
- 진행 중 프로그램 (있을 시) + 신규 시작 카드 5개
- onboarding `workout_preference` 결과로 추천 정렬
- 우상단 [📋] 내 플랜 / [👤] 프로필 (러닝/홈트 동일 패턴)

**ChatHome 완전 폐기:**
- 삭제: [src/components/dashboard/ChatHome.tsx](../../src/components/dashboard/ChatHome.tsx)
- 삭제: parseIntent 호출부 + Gemini chat 핸들러
- 백엔드 `/api/parseIntent` Cloud Function — keep until P4 사용 0 확인 후 deprecate
- ROOT 카드 "웨이트" 클릭 → `setView("weight_hub")` 변경 ([src/components/dashboard/RootHomeCards.tsx](../../src/components/dashboard/RootHomeCards.tsx))

**트라이얼 재설계 (대표 컨펌):**
- 비로그인 1세션 무료 → **2회 진행 시점에 로그인 + 결제 유도 모달**
- `trial_ips` IP 해시 로직 재활용 ([functions/src/plan/session.ts:78-91](../../functions/src/plan/session.ts#L78-L91))
- 로그인 무료: `FREE_PLAN_LIMIT = 2` 흐름 미러링

**예상 작업:** 1주.

### P4: 마케팅 카피 갱신 (김경록 우려 대응)

**변경 대상:**
- 랜딩 페이지: [src/components/LandingContent.tsx](../../src/components/LandingContent.tsx) — "AI 채팅" → "코치가 짜준 프로그램"
- i18n KO·EN 동시 ([memory:feedback_i18n_always])
- SEO meta: [memory:feedback_seo] 자연어 문장형
- 영문 시장: 네이티브 광고 문법 1차 ([memory:feedback_native_copy_frame])
- SNS·외부 마케팅 자산 점진 갱신

**예상 작업:** 3-5일 (카피 검토 + 디자이너 협업).

## GA 영향 (이화식 + Tunguz 의견)

**제거되는 이벤트:**
- `parseIntent_call` (현재 핵심 KPI)
- `chat_message_send`
- `redirect_card_click`

**신규 이벤트:**
- `onboarding_workout_preference` (P1)
- `program_card_click` (P2/P3 — `{ category, programId, locale }`)
- `program_session_start` (P3)
- `trial_2nd_session_modal_show` (P3)

**KPI 카테고리 재정의:** [memory:reference_ga_analytics_kpi] 26 이벤트 카탈로그 P3 시작 시 갱신.

## 리스크 매트릭스

| 리스크 | 강도 | 완화 |
|---|---|---|
| ChatHome 자산 손실 (parseIntent 코드) | 中 | parseIntent Cloud Function 은 deprecate 절차로 keep, P4까지 모니터 |
| Free tier 트라이얼 단절 | 中 | 2회 게이트로 재설계 (대표 컨펌) |
| 마케팅 카피 회수 비용 (김경록 우려) | 中 | P4 단계 출시, KO·EN 동시 갱신 |
| 헬스 마니아 페르소나 이탈 (검색 기능 폐기) | 低 | P3 시작 시 재투표, 보존 옵션 검토 |
| 카탈로그 5개로 입문자 다양성 부족 | 低 | 카탈로그 내부 condition 기반 어댑테이션 (옵션 C 하이브리드) |

## 시작 트리거

- SEED-001 Phase 2 마무리 신호 (대표 검증 또는 ζ-3 측정 지표 확인)
- 대표 명시 트리거 ("ζ-4 시작합시다")
- SEED-003 조사 산출물 1차 완성 (P2 의존)

## 관련 회의

- 회의 2026-04-29-ζ-4 (본 SEED 등록 회의)
