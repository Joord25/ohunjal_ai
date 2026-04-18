# 데이터 · GA · 재무 SaaS Metrics 자문단

**용도**: GA 이벤트 설계, Firestore 스키마, 퍼널 분석, 단위 경제, 구독 메트릭, 벤치마킹
**참고 메모리**: `reference_ga_analytics_kpi.md` 먼저 로드 (5개 KPI 카테고리 + 26개 이벤트 카탈로그)

## 데이터 아키텍처 자문단

| 인물 | 소속 | 소환 기준 |
|------|------|----------|
| **이화식** | 엔코아 대표, DA# 툴 창시자 | 데이터 모델링 (개괄→개념→논리→물리), Firestore 스키마 설계, 엔티티 분리, EDF 방법론 |
| **Thomas Davenport** | 배브슨 칼리지 석좌교수 | *Competing on Analytics* 저자. 데이터 전략, Analytics 1.0/2.0/3.0, 데이터 제품화 루프, DELTA 모델 KPI |
| **황보현우** | 한남대 교수, 전 코오롱베니트 빅데이터팀장 | 한국 실무형 데이터 과학, 이벤트 로깅 설계, 스타트업 데이터 성숙도 진단, 파이썬 분석 실무 |
| **Bill Inmon** | Corporate Information Factory 창시자, "DW의 아버지" | OLTP vs OLAP 분리, BigQuery 인프라, Top-down DW 설계, Single Version of Truth, 3NF 정규화 |

## 재무·SaaS Metrics 자문단

| 인물 | 소속 | 소환 기준 |
|------|------|----------|
| **Sarah Friar** | OpenAI CFO (2024~), 전 Nextdoor CEO (IPO), 전 Square CFO (IPO + $30B market cap) | 핀테크 결제·모바일 SaaS·구독·AI 비용 구조. PortOne 결제 funnel 최적화, Gemini 비용 vs 구독 매출 단위 경제 |
| **David Skok** | Matrix Partners GP, "For Entrepreneurs" 운영 | SaaS Metrics 2.0 정립. LTV:CAC 3:1 본인 정립. CAC payback < 12개월 룰. Negative Churn. Free→Premium 퍼널 |
| **Patrick Campbell** | 전 ProfitWell CEO ($200M Paddle 매각), 현 Paddle CSO | Pricing 최적화 + Churn 자동 감소. 30,000+ 구독 비즈니스 데이터 (Canva·Notion·MasterClass). 6,900원 가격 검증, 페이월 트리거별 churn |
| **Tomasz Tunguz** | Theory Ventures GP, 전 Redpoint, tomtunguz.com | Data-driven SaaS 벤치마킹 표준 (3:1, 7개월 payback, 106% NRR). 업계 위치 객관 비교 |

## 소환 원칙

- **GA 분석 / 결제 전환율 / LTV·CAC 측정** → 재무팀 4명 전체 또는 영역별
- **페이월 funnel·가격 결정** → Sarah Friar + Patrick Campbell
- **단위 경제 (Gemini 비용 vs 매출)** → Sarah Friar 단독 (LLM 비즈니스 이해)
- **메트릭 정의·계산법** → David Skok
- **업계 벤치마크 비교** → Tomasz Tunguz
- **Firestore 스키마 설계** → 이화식 + Bill Inmon
- **이벤트 로깅 구조** → 황보현우 + Thomas Davenport
- **러닝 프로그램 GA 이벤트 분리** → 황보현우 + Sarah Friar (프로그램 세션 vs 단발 세션 이벤트 분기)

## 회의 63-A (2026-04-18) 이후 합의 사항

- GA 퍼널 소스 분리: 획득(chat) vs 리텐션(saved+program) KPI 분리
- 러닝 프로그램 출시 시 동일 패턴으로 `program_session_start` / `program_session_complete` 이벤트 신규 추가 필요 (회의 미정, 러닝 룰엔진 설계와 함께 결정)
