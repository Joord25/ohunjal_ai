---
id: SEED-002
status: active — **회의 ζ-5 (2026-04-30) 카탈로그 콘텐츠 정의 갱신. 카탈로그 SSOT 1차 작성 진행 중. WeightHub UI 등 P3 코드는 대표 트리거 대기**
planted: 2026-04-29
planted_during: 회의 2026-04-29-ζ-4 (대표 소집, ChatHome 폐기 + 카탈로그 중심 UX 재설계)
revised_during: 회의 2026-04-30-ζ-5 (카탈로그 콘텐츠 정의 변경 + 디폴트 무게 시스템)
trigger_when: 카탈로그 SSOT 검토 완료 + 대표 트리거
scope: XL (4 Phase, 약 4주 추정)
depends_on: ~~SEED-003 (YouTube 시장 조사)~~ — **회의 ζ-5에서 paused. Claude 도메인 지식 기반 SSOT로 대체**
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

### P2: 웨이트·홈트 카탈로그 (회의 ζ-5 갱신)

**의존성:** ~~SEED-003 시장 조사~~ — paused. Claude 도메인 지식 기반.

**카탈로그 콘텐츠 정의 (≤ 4 카드 큐레이션):**

| 카드 종류 | 노출 조건 | 예시 |
|---|---|---|
| **부위별 (중·상급자용)** — 그날 단발 | 모든 사용자 | 5개 부위 선택창 (가/등/어/팔/하체) |
| **목적별 프로그램** | onboarding goal 매칭 | 여름 다이어트 12w / 8주 근육 / 거북목 교정 8w |
| **캠페인성** (시즌·이벤트·여성) | 조건부 | 휴가 전 7일 팔뚝 / 생리주기 다이어트 12w |

**페르소나 매칭 룰** (대표 예시):
- ♂40세 173/78 fat_loss → 부위별 / 여름 다이어트 12주 / 급빠 4주 / HIIT
- ♀27세 152/41 muscle_gain → 부위별 / 8주 근육 / 3개월 인바디 D / 2분할 체력

**SSOT 결정 (회의 ζ-5 확정): 하이브리드**
- 카탈로그 SSOT (`src/constants/programCatalog.ts`): 프로그램 정의 + setTemplate (1세트 빈바, 2세트~ 본격)
- 룰엔진 (`workoutEngine.ts`): 운동 풀·구성·카디오 담당
- 카탈로그가 룰엔진 호출 시 setTemplate override 전달

**디폴트 무게·세트 시스템 (회의 ζ-5 신규):**

| 목적 | 1세트 (사실상 웜업, UI 명칭 X) | 2세트~ |
|---|---|---|
| fat_loss | 빈바(♂20·♀15) × 15-20 | 빈바 점진 증량, 15-20 유지 |
| muscle_gain | 빈바 × 10-15 | 8-12회 |
| strength | 빈바 × 10-15 | 3-5회 |
| 덤벨 모든 목적 | (♂3·♀2)kg | 점진 증량 |

**기간 룰 (회의 ζ-5 갱신, [memory:feedback_user_attention_span] 16주 갱신):**
- 웨이트·홈트: 4주 ~ 16주 (4w × 4 chapter)
- 러닝: 12주 cap 그대로

**예상 작업:** SSOT 1차 작성 즉시. 자문단 검토 + 페르소나 인터뷰는 P3 시점.

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
