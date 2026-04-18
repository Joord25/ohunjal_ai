# 러닝 자문단

**편성일**: 2026-04-18
**용도**: 러닝 룰엔진 설계 (VO2 max / 5K / 10K / Half / Full 프로그램), 주간 분포 규칙, limiter 판정, 페이스 공식, 부상 예방 룰, 레이스 영양 룰
**참고 메모리**: `feedback_source_grounded_opinions.md` — 인용 시 아래 URL 명시 의무

**구성**: 해외 12명 + 사내 러닝코치 1명. 학계 7 / 학계+현장 5 / 순수 현장 2 / 사내 1. 여성 3명 포함. 지리: 북유럽 2 · 남유럽 3 · 영미권 5 · 호주·뉴질랜드 2 · 케냐 현장 2.

**배제 이력**: Jack Daniels (VDOT 창시자) — 2025-09-12 작고. 그의 방법론은 Seiler/Bakken/Esteve-Lanao 3인이 계승.

---

## 1. 운동생리학 / VO2 max·강도 분포 연구자

### Stephen Seiler, PhD
- **소속**: University of Agder (노르웨이) 건강·스포츠과학 교수
- **저명도 근거**: 80/20 polarized training 패러다임 원저자. 2000년대 초 정상급 지구력 선수의 훈련 패턴 장기 추적. 대표 논문 *"What is best practice for training intensity and duration distribution in endurance athletes?"* (Scand J Med Sci Sports, 2010, PMID 20861519). 구글 스칼라 고인용.
- **전공 각도**: Zone 1 저강도 ~80% / Zone 3 고강도 ~20% / Zone 2 threshold 상대적 억제
- **우리 프로젝트 기여**: 주간 러닝 로테이션의 intensity distribution 검증자. 한국 아마추어(주 3-4회)에서 80/20을 어떻게 변형할지, limiter 후 Zone 2 vs threshold 비중 판단
- **출처**:
  - [Fast Talk Labs — Complete Guide to Polarized Training](https://www.fasttalklabs.com/pathways/polarized-training/)
  - [PubMed 20861519](https://pubmed.ncbi.nlm.nih.gov/20861519/)

### Iñigo San Millán, PhD
- **소속**: University of Colorado School of Medicine 부교수, UAE Team Emirates 팀닥터·코치
- **저명도 근거**: Tadej Pogačar 생리학 코치 (투르 드 프랑스 다회 우승). Peter Attia Drive 팟캐스트 다회 출연. *Cell Metabolism* 등 락테이트-운동 연구.
- **전공 각도**: Zone 2 (혈중 락테이트 1.7–2.0 mmol/L)에서 미토콘드리아 biogenesis·지방 산화 극대화. 6-zone 모델.
- **우리 프로젝트 기여**: Zone 2 baseline 시간 규정. "Full sub-3 주당 easy run 분량", "심박 vs 페이스 기준 중 한국 아마추어 현실성" 자문
- **출처**:
  - [Peter Attia #201 Zone 2 Deep Dive](https://peterattiamd.com/inigosanmillan2/)
  - [TrainingPeaks Coach Blog — Zone 2 Biochemistry](https://www.trainingpeaks.com/coach-blog/zone-2-biochemistry-biomechanical-energy-inigo-san-millan/)

---

## 2. 엘리트 마라톤 코치 (현장)

### Renato Canova
- **소속**: 이탈리아 출신, 현재 케냐 이텐(Iten) 거주·코치 활동
- **저명도 근거**: 50+ 올림픽·세계선수권 메달리스트 지도. Moses Mosop, Abel Kirui (2012 런던 마라톤 은), Wilson Kipsang (2013 베를린 세계기록 2:03:23), Florence Kiplagat (하프마라톤 세계기록), Sondre Moen. 저서 *Marathon Training — A Scientific Approach*. 2016년부터 케냐 영구 거주.
- **전공 각도**: "Golden Rule of Canova" — 레이스 페이스 근처 장시간 훈련 (마라톤 30-32km specific workout). 4단계 피리어다이제이션: general → fundamental → specific → special.
- **우리 프로젝트 기여**: specific block 설계. "Full sub-3 D-6주 시점에 25K progression vs 32K with MP" 검증. 목표 페이스 정확도 룰의 specific endurance 임계값
- **출처**:
  - [Wikipedia — Renato Canova](https://en.wikipedia.org/wiki/Renato_Canova)
  - [Running Writings — Marathon Training Lecture](https://runningwritings.com/2023/07/renato-canova-marathon-training-lecture.html)

### Patrick Sang
- **소속**: NN Running Team 수석 코치, 1992 바르셀로나 올림픽 3000m 장애물 은
- **저명도 근거**: Eliud Kipchoge 20년 지도 (베를린 2:01:09, Ineos 1:59, 2016·2020 올림픽 금). Faith Kipyegon (1500m 세계기록·올림픽 3연패), Geoffrey Kamworor (하프마라톤 세계기록). 2025년 기준 현역.
- **전공 각도**: "코치는 가치를 만든다" 철학. mileage보다 지속가능성·회복 주기. Kaptagat 캠프 주간 패턴 (Tue 인터벌 / Thu 템포 / Sat 롱런)이 아마추어 프로그램 원형.
- **우리 프로젝트 기여**: 주간 로테이션 템플릿 검증. "10K PR을 Tue 인터벌 + Thu 템포 + 주말 롱런 3포인트로 OK한가, 회복일 며칠 적정한가"
- **출처**:
  - [World Athletics — Patrick Sang Feature](https://worldathletics.org/news/feature/patrick-sang-distance-running-coach-kenya-kipchoge-kamworor-kipyegon)
  - [NN Running Team — Guide to Coaching](https://www.nnrunningteam.com/news/2019-01-08-patrick-sang8217s-guide-to-coaching/)

---

## 3. 러닝 바이오메카닉스 / 케이던스·부상 예방

### Irene Davis, PT, PhD, FAPTA
- **소속**: USF (University of South Florida) 보건전문대 교수, 전 Harvard 의대 Spaulding National Running Center 디렉터
- **저명도 근거**: 충격흡수·피로골절·PFPS 생체역학 20년+. NIH/DoD 펀딩. Peter Attia Drive #128 출연. 미 물리치료학회 펠로우(FAPTA). "Barefoot Running Professor".
- **전공 각도**: 과도한 loading rate가 tibial stress fracture·PFPS 주요 위험 인자. Cadence 170→180+ gait retraining.
- **우리 프로젝트 기여**: 부상 예방 룰. "cadence ≤ 165 + pace 하락 시 경고", weekly mileage 증가율 10% 룰의 한국 적용
- **출처**:
  - [Google Scholar — Irene Davis](https://scholar.google.com/citations?user=R_5-JUMAAAAJ&hl=en)
  - [Peter Attia #128](https://peterattiamd.com/irenedavis/)

### Benno M. Nigg, Dr.sc.nat
- **소속**: University of Calgary 운동학부 명예교수, Human Performance Lab 공동설립
- **저명도 근거**: 구글 스칼라 38,000+ 피인용. 저서 *Biomechanics of Sports Shoes* (2010). 러닝화 연구 40년. "impact force·pronation control" 패러다임 폐기 → "preferred movement path·comfort filter" 제안 (*Br J Sports Med*).
- **전공 각도**: 러닝화 안정성/완충이 부상 감소에 유의미 영향 없음. 개인별 선호 움직임 경로 이탈 시 부상.
- **우리 프로젝트 기여**: 러너 개인화 룰. Davis와 상호보완 (Davis: 명확한 위험 기준 / Nigg: 개인화 허용 범위)
- **출처**:
  - [PubMed 26221015 — Running shoes and running injuries: mythbusting](https://pubmed.ncbi.nlm.nih.gov/26221015/)
  - [Google Scholar — Benno Nigg](https://scholar.google.com/citations?user=Bw1TbIwAAAAJ&hl=en)

### Reed Ferber, PhD, ATC, CAT(C) — *대안 후보*
- **소속**: University of Calgary 운동학·간호·의학부 교수, Running Injury Clinic 설립·디렉터
- **저명도 근거**: 2003년부터 운영 세계 최대 규모 러닝 부상 연구 클리닉(12,000 러너, 4,000명 DB). 3D GAIT·KinetiGait 분석 툴 100+ 클리닉 보급.
- **전공 각도**: 웨어러블·모션센서 기반 부상 예방 알고리즘
- **우리 프로젝트 기여**: GPS·웨어러블 데이터로 부상 신호 탐지 — 앱 기능 연동에 Davis·Nigg보다 실무적으로 가까움
- **출처**: [McCaig Institute, UCalgary](https://mccaig.ucalgary.ca/ferber)

---

## 4. 훈련 방법론 / 프로그래밍 이론가

### Marius Bakken, MD
- **소속**: 노르웨이 크리스티안산 개업의, 전 올림피언·5000m 13:06.49 노르웨이 기록
- **저명도 근거**: "Norwegian Double Threshold Method" 원저자. 1998–2005년 5,500+ 자가 락테이트 테스트. Ingebrigtsen 형제·Blummenfelt(IM 세계챔피언)·Iden 훈련 기반. 저서 *The Norwegian Method Applied* (Steve Magness 공저, 2024).
- **전공 각도**: 주 2회 하루 2회 sub-threshold (락테이트 2.5–3.5 mmol/L). "더 빨리가 아니라 더 오래 threshold에서".
- **우리 프로젝트 기여**: **threshold 세션 강도 상한 룰** (limiter 판정 후 "세게 가지 마세요" 경고 기준). 아마추어용 포르말린화된 락테이트 감각
- **출처**:
  - [mariusbakken.com — Norwegian Lactate Threshold Model](https://www.mariusbakken.com/the-norwegian-model.html)
  - [Running Writings — Marius Bakken Double Threshold](https://runningwritings.com/2024/09/marius-bakken-double-threshold.html)

### Jonathan Esteve-Lanao, PhD
- **소속**: Universidad Europea de Madrid 교수, All in Your Mind (AYM) Endurance Academy 연구책임자
- **저명도 근거**: 2007 *J Strength Cond Res* 랜드마크 RCT (PMID 17685689) — Seiler 관찰을 **실험 검증**한 최초. 2013 추가 RCT (PMID 23752040) — **아마추어 대상** 80/20 효과 입증.
- **전공 각도**: 아마추어 대상 RCT로 주간 분포 효과 수치화. 우리 타깃 유저와 직접 부합.
- **우리 프로젝트 기여**: **핵심 자문** — 엘리트 데이터(Seiler/Canova)는 아마추어에게 그대로 안 맞음. 그의 RCT 결과가 한국 아마추어 분포 재단의 유일한 근거
- **출처**:
  - [PubMed 17685689 — Impact of Training Intensity Distribution](https://pubmed.ncbi.nlm.nih.gov/17685689/)
  - [PubMed 23752040 — Polarized training in recreational runners](https://pubmed.ncbi.nlm.nih.gov/23752040/)

---

## 5. 스포츠 의학 / 진화적 러닝 부상관

### Daniel Lieberman, PhD
- **소속**: Harvard University 인간진화생물학과 Edwin M. Lerner II 교수
- **저명도 근거**: *Nature* 2004 Bramble & Lieberman *"Endurance running and the evolution of Homo"*, *Nature* 2010 *"Foot strike patterns and collision forces..."* (PMID 20111000). 저서 *Born to Run* 자문, *Exercised* (2020), *The Story of the Human Body*.
- **전공 각도**: 인간은 진화적으로 장거리 러너. 현대 러닝화 heel-strike가 부상 증가. 아킬레스건·족궁·둔근 기능적 해석.
- **우리 프로젝트 기여**: **UX 카피 서사 자문**. "당신 몸은 달리도록 설계됐다" 동기부여 메시지의 과학적 근거. heel-strike 과부하 경고 룰 철학.
- **출처**:
  - [Wikipedia — Daniel Lieberman](https://en.wikipedia.org/wiki/Daniel_Lieberman)
  - [PubMed 20111000 — Foot strike patterns](https://pubmed.ncbi.nlm.nih.gov/20111000/)
  - [scholar.harvard.edu/dlieberman](https://scholar.harvard.edu/dlieberman/research)

---

## 6. 러닝 영양 / 대사

### Louise Burke, OAM, PhD
- **소속**: Australian Catholic University 스포츠영양학 석좌교수, AIS 영양전략 책임자 (전 AIS 영양팀장 1990–2018)
- **저명도 근거**: 피인용 29,000+, 논문 430+. *Clinical Sports Nutrition* (6판). IOC 스포츠영양 합의문(2019) 공동저자. "periodized nutrition" 개념 정립. Order of Australia Medal(OAM).
- **전공 각도**: "Train low, compete high" 주기화. LCHF vs high-CHO 핵심 연구자. RED-S 진단·관리.
- **우리 프로젝트 기여**: 러닝 영양 룰. "Full sub-3 훈련기 주중 CHO 체중 kg당 몇 g", "레이스 3일 전 카보 로딩 한국 식단 구성". **여성 러너 RED-S 감지 룰 필수**.
- **출처**:
  - [Wikipedia — Louise Burke](https://en.wikipedia.org/wiki/Louise_Burke)
  - [Louise Burke CV — sport-science.org](https://sport-science.org/images/ECSS_2024/GSSI_Symp_CV_Louise_Burke.pdf)
  - [Experimental Physiology 2021 — Nutritional approaches](https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/EP088188)

### Asker Jeukendrup, PhD
- **소속**: Loughborough University 방문교수, mysportscience 창립자, 전 PepsiCo/Gatorade Sports Science Institute 글로벌 영양 디렉터
- **저명도 근거**: *Sports Medicine* 2014 *"A Step Towards Personalized Sports Nutrition"* (PMCID PMC4008807). "Multiple transportable carbohydrates" (포도당+과당 2:1) 연구로 시간당 90g CHO 프로토콜 정립. Tour de France·IRONMAN 팀 영양.
- **전공 각도**: 운동 중 CHO 정량 글로벌 표준. <1h=mouth rinse, 1–2h=30g/h, 2–3h=60g/h, >2.5h=90g/h(glu+fru 복합).
- **우리 프로젝트 기여**: **in-session nutrition timing 룰**. "풀 마라톤 레이스 몇 km마다 몇 g 알림", 롱런 90분+ 복합 CHO 젤 권장 시점. 위장관 훈련 프로토콜.
- **출처**:
  - [PMC PMC4008807 — Personalized Sports Nutrition](https://pmc.ncbi.nlm.nih.gov/articles/PMC4008807/)
  - [mysportscience — Carb intake recommendations](https://www.mysportscience.com/post/2015/05/27/recommendations-for-carb-intake-during-exercise)

### Stacy Sims, PhD
- **소속**: Auckland University of Technology 연구원, Stanford Lifestyle Medicine 겸임교수
- **저명도 근거**: 저서 *ROAR* (2016, 2024 개정), *Next Level*. TEDx "Women Are Not Small Men". 2025 KV Switzer Award 후보, Springfield College Karpovich Lecture 2025.
- **전공 각도**: 생리 주기·페리메노포즈·포스트메노포즈 러너의 영양·훈련 차별화. 남성 기반 과학의 일률 적용 비판.
- **우리 프로젝트 기여**: **한국 여성 러너 성별 분기 룰**. "생리 주기 단계별 고강도 세션 배치 자동 권장", 폐경기 단백질·크레아틴 룰. Burke(선수 등급)와 상호보완(recreational 여성).
- **출처**:
  - [Wikipedia — Stacy Sims](https://en.wikipedia.org/wiki/Stacy_Sims)
  - [iRunFar — 'Women Are Not Small Men'](https://www.irunfar.com/dr-stacy-sims-profile)

---

## 사내 포지션

### 러닝코치 (서브3, 12년)
- **역할**: 한국 아마추어 현장 감각, 서브3 준비자 실무 시뮬레이션
- **소환 기준**: 해외 자문 결과를 한국 환경(도시 러닝, 한강 코스, 날씨, 국내 대회 캘린더)으로 변환할 때

---

## 최종 12인 매트릭스

| # | 이름 | 카테고리 | 지리·분야 축 | 주 기여 |
|---|---|---|---|---|
| 1 | Stephen Seiler | 생리학 | 북유럽·학계 | 80/20 분포 철학 |
| 2 | Iñigo San Millán | 생리학 | 미국/스페인·학계+현장 | Zone 2 / mitochondrial base |
| 3 | Renato Canova | 엘리트 코치 | 이탈리아→케냐·현장 | specific endurance 블록 |
| 4 | Patrick Sang | 엘리트 코치 | 케냐·현장 | 주간 템플릿·지속가능성 |
| 5 | Irene Davis | 바이오메카닉스 | 미국·학계 | cadence·loading rate 부상 룰 |
| 6 | Benno Nigg | 바이오메카닉스 | 캐나다·학계 | 개인화 comfort filter |
| 7 | Reed Ferber | 바이오메카닉스 | 캐나다·학계+현장 | 웨어러블 부상 탐지 |
| 8 | Marius Bakken | 훈련이론 | 노르웨이·학계+현장 | double threshold 룰 |
| 9 | Jonathan Esteve-Lanao | 훈련이론 | 스페인·학계 | **아마추어 RCT 검증** |
| 10 | Daniel Lieberman | 스포츠의학 | 미국·학계 | 진화적 러닝 근거·서사 |
| 11 | Louise Burke | 영양 | 호주·학계+AIS | 주기화 영양·RED-S |
| 12 | Asker Jeukendrup | 영양 | 영국·학계+산업 | 레이스 중 CHO 타이밍 |
| 13 | Stacy Sims | 영양 | 뉴질랜드/미국·학계+대중 | 여성 러너 성별 분기 |

## 오훈잘 러닝 룰엔진 설계 단계별 소환 우선순위

- **룰엔진 아키텍처 초안**: Seiler + Esteve-Lanao + Bakken (3인) — 주간 분포 수학적 근거
- **프로그램별 세션 검증**: Canova + Sang (2인) — 10K/Half/Full 특화 workout
- **부상 예방 경고 룰**: Davis + Ferber (2인) — cadence, mileage 증가율, loading rate
- **영양·연료 보급 룰**: Burke + Jeukendrup + Sims (3인) — 주기화, 세션 내 CHO, 여성 분기
- **UX 철학·카피 리뷰**: Lieberman 단독
- **한국 변환**: 사내 러닝코치 최종 필터
