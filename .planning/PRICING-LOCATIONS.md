# 가격 관련 위치 전수 맵 — ₩4,900 / $4.99 개정

작성: 2026-09-08 · 기준 커밋: a3a4b38 (main)

- **개정가(현행):** **KRW 4,900 / USD 4.99** — 2026-09-08 적용
- **직전(할인 실험):** KRW 1,900 / USD 1.99 — 커밋 `853b593` (2026-05-06)
- **그 이전(구 정가):** KRW 6,900 / USD 4.99
- **역맵 정본:** `git show 853b593` (7파일)

## 가격 근거

| 항목 | 값 |
|---|---|
| 표시가 (VAT 포함, 총액표시제) | 4,900원 |
| ├─ 공급가액 | 4,455원 |
| └─ 부가세 (납부) | 445원 |
| PG 수수료 (0.56~3.20%) | 27~157원 |
| **실수령** | **4,298 ~ 4,428원** |
| 랜딩 할인율 (9,900 대비) | 50.5% → **"50% 할인"** 표기 |

해외: $4.99 − Paddle MoR(5% + $0.50 = $0.75) = 순 **$4.24**.

> 수수료율 실측치는 포트원 관리자콘솔에서 확인 필요. 공개 요율표 없음(계약별·VAT 별도).
> 출처: [PortOne 헬프센터](https://help.portone.io/content/hub-service-fee) · [PortOne PG 비교](https://blog.portone.io/opi_pg-comparison/) · [Paddle Pricing 2026](https://www.stackscored.com/pricing/saas-billing/paddle/)

---

## A. 실제 청구 금액 (서버 SSOT — 돈이 빠져나가는 지점)

| # | 위치 | 값 | 상태 |
|---|---|---|---|
| A1 | `functions/src/billing/subscription.ts:11` | `LIST_PRICE_KRW = 4900` | ✅ 완료 |
| A2 | `functions/src/billing/renewPortOneSubscriptions.ts:11` | `LIST_PRICE_KRW = 4900` + `resolveRenewalAmount()` | ✅ 완료 |
| A3 | Paddle 대시보드 Price 객체 | `pri_01kppp2svqxqb9q2fzqcs0nbse` ($4.99) 활성화 | ⚠ **코드 밖 수동 작업 — 미완** |
| A4 | `src/utils/paddle.ts:28` | `PRICE_499 \|\| PRICE_MONTHLY` | ✅ 완료 |
| A5 | `src/utils/pricingExperiment.ts:38` | `FIXED_PADDLE_PRICE_ID = PRICE_499` | ✅ 완료 |

> 기존 구독자는 `lockedPriceKrw` 기준으로 **가입 당시 가격 평생 유지** — 이번 인상의 영향 없음.

## B. 클라이언트 가격 SSOT ✅

`src/utils/pricingExperiment.ts:36-37` — `FIXED_KRW = 4900` / `FIXED_USD = 4.99`.
`KRW_BY_TIER` / `USD_BY_TIER` / `formatPriceForLocale` 전부 여기서 파생. **표시 가격의 유일한 뿌리.**

## C. UI 하드코딩 fallback ✅ (tier 조회 실패 경로)

`src/components/profile/SubscriptionScreen.tsx` — 453(`4900`), 454(`4.99`), 455(`₩4,900`/`$4.99`), 505(GA `4900`), 549(Paddle GA `4.99`).

## D. i18n ✅

`ko.json:533` `4,900원/월` · `en.json:537` `$4.99/mo` · `ko.json:617` + `en.json:621` `Subscribe — $4.99/mo`.

변경 불필요(비교군): `my.premium.originalPrice` ko `9,900원` / en `$9.99`, `sub.discount`, `sub.earlyBird`.

## E. 랜딩 ✅ (`src/app/landing/landingTexts.ts`)

115 `월 4,900원` · 129 `4,900원` · 131 `50% 할인` · 225 `$4.99/mo` · 239 `$4.99` · 241 `50% off`.

변경 불필요: `headingDim`(19,800원 / $15.99), `priceOld`(9,900원 / $7.99).

## F. 이전 인하 때 누락됐던 곳 ✅ (이번에 함께 정합)

| # | 위치 | 값 |
|---|---|---|
| F1 | `src/app/layout.tsx:142` JSON-LD `offers.price` | `"4900"` |
| F2 | `src/app/layout.tsx:277` noscript 요금 안내 | `월 4,900원` |
| F3 | `src/app/app/page.tsx:935` 영양탭 페이월 버튼 | `월 4,900원` / `Unlock Premium · $4.99/mo` |

> F3 EN 카피는 원화 표기(`6,900 KRW/mo`)였던 것을 `$4.99/mo` 로 정정.

## G. 분석/어드민 ✅ (표시가 — 청구와 무관)

`functions/src/admin/pricingExperiment.ts:22-23` (`4900`/`4.99`) · `src/app/admin/page.tsx:984,1019,1025` 문구.
`functions/src/billing/paddleWebhook.ts:200-207` Price ID→tier 역매핑은 **수정 불필요** (`t4` = $4.99 이미 등재).

## H. 배포 환경 (env)

`.github/workflows/firebase-hosting-{merge,pull-request}.yml` 에 `NEXT_PUBLIC_PADDLE_PRICE_199/299/399/499/599/699` + `_MONTHLY` **전부 이미 주입 중** → 워크플로 수정 불필요.
⚠ GitHub Secrets 의 `NEXT_PUBLIC_PADDLE_PRICE_499` 값이 살아있어야 함.

---

## 검증 결과 (2026-09-08)

- `npm run typecheck` ✅
- `npm run build` ✅
- `cd functions && npm run build` ✅

## 배포 전 남은 작업

1. ⚠ **Paddle $4.99 Price 활성화 확인** (A3) — archived 면 해외 결제 전면 실패
2. ⚠ **GitHub Secrets `NEXT_PUBLIC_PADDLE_PRICE_499` 값 확인** (H)
3. ⚠ **기존 구독자 `lockedPriceKrw` 백필** — `functions/scripts/lock-subscription-prices.js` **아직 없음**.
   미보유 문서는 `amount` fallback 으로 버티나, 그것도 없으면 1,900원 가입자에게 4,900원 청구됨. **정가 배포 전 선행 필수.**
4. **결제 진입점 매트릭스 검증** — PC 팝업 / 모바일 redirect / PortOne iframe / Paddle Checkout / 갱신 크론 5경로 × 신규·기존 구독자
5. **배포 순서**: `git push` (Hosting CI) → `firebase deploy --only functions`

## 표시광고법 주의

회의 ζ-5-A P1-5 결정으로 SubscriptionScreen 의 `9,900원` line-through 는 제거됨(최초 판매가 입증 부담).
랜딩 `priceOld: "9,900원"` + `discount: "50% 할인"` 은 유지 — 실제 50.5% 이므로 과장 아님(낮게 표기).
단 9,900원이 **실제 판매된 이력**이 있어야 방어 가능. 없으면 랜딩에서도 제거 권장.
