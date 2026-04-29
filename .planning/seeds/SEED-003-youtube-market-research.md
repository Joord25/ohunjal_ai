---
id: SEED-003
status: paused — **회의 ζ-5 (2026-04-30) 보류. 대표 결단 "조사는 넘기고". Claude 도메인 지식 기반 SSOT로 대체. 인프라 코드는 잔존(commit b9bb87c quota 절감 fix 포함). 추후 재개 시 즉시 활용 가능.**
planted: 2026-04-29
planted_during: 회의 2026-04-29-ζ-4 (SEED-002 P2 카탈로그 컨텐츠 의존성)
paused_during: 회의 2026-04-30-ζ-5 (대표 결단)
trigger_when: 카탈로그 1차 안 시장 검증 필요 시점 (분기별 재조사 등)
scope: M (조사 인프라 + 분석 1회 = 약 1주, 분기별 재실행)
parent: SEED-002 (ProgramFirst UX 전환 P2 카탈로그 의존) — 보류로 의존성 해제됨
---

# SEED-003: YouTube 시장 조사 — 카탈로그 컨텐츠 큐레이션 시그널

## Why This Matters

대표 지시(2026-04-29 ζ-4): "조회수가 많고 댓글에 참여도가 높은것 위주로 선정. 사람들이 선호하는것 위주 조사".

자문단 정합:
- **김경록** (일헥타르 Stage 1): "작은 문화의 행동 신호 읽기. 조회수 = 노출 / 댓글 = 행동. 둘 다 본다 = 정확"
- **Seth Godin**: "사람들이 시간 쓴 흔적이 의향(intent)보다 강함"
- ⚠ **박충환**: "인기 ≠ 효과. 운동과학 자문단 cross-check 필수"
- ⚠ **Nir Eyal**: "단순 댓글 多 보다 '따라했다·효과·재방문' 키워드 빈도가 더 강한 신호"
- ⚠ **Tunguz**: "댓글 多 = 호불호 갈리는 논쟁 영상일 수도. 좋아요 비율 보조"

→ **다층 필터로 보완**.

## 다층 필터 메서드

### 1차 필터: 정량 시장 신호 (대표 기준)

| 지표 | 한국 임계치 | 글로벌 임계치 | 측정 |
|---|---|---|---|
| 조회수 | ≥ 100K | ≥ 1M | YouTube Data API `viewCount` |
| 댓글 참여도 | ≥ 1.0% (산업 평균 0.3-0.5%의 2배+) | ≥ 0.5% | `commentCount / viewCount` |
| 좋아요 비율 | ≥ 3% (보조) | ≥ 2% (보조) | `likeCount / viewCount` |

**예외:** Stronger By Science (Greg Nuckols, ~250K 구독, 1M 미달) — 댓글 참여도·과학 신뢰도 高로 포함 (대표 컨펌).

### 2차 필터: 댓글 정성 분석 (Nir Eyal 의견)

**행동 신호 키워드 (영상당 top 30 댓글 샘플링):**
- 한국어: "따라했어요" / "효과 봤어요" / "1주차 후기" / "○○일 차" / "다시 봐요" / "구독했어요"
- 영어: "Day 1" / "followed along" / "results" / "subscribed" / "starting tomorrow" / "week N"

**임계치:** 행동 신호 댓글 비율 ≥ 30% (단순 칭찬 댓글 제외).

**분석 도구:** Gemini 2.5 Flash batch (영상별 1 request, 9,450 댓글 / 315 batch). 1회 비용 약 150원. 영상별 batch JSON output.

### 3차 필터: 운동과학 자문단 효과·안전성 검증 (박충환 의견)

운동과학 자문단(한체대 교수·운동생리학자·물리치료사)이 1·2차 통과 영상의 운동 구성·강도·안전성을 spot check. 통과한 것만 카탈로그 후보.

### 4차 필터: 페르소나 4명 투표

"이 5개 영상 중 따라하고 싶은 거" 인터뷰. 실제 의향 검증.

## 조사 대상 풀 (총 22 채널 / 약 315 영상)

### 한국 헬스 (6채널 × 15 영상 = 90)

| 채널 | 구독자 | 특징 | 우선 |
|---|---|---|---|
| 김계란 | 250만+ | 입문~중급 / 분할 다양 | ⭐⭐⭐ |
| 핏블리 | 110만+ | 운동과학 / 근비대 | ⭐⭐⭐ |
| 헬스마이프 | 80만+ | 5분할·푸쉬앤드풀 | ⭐⭐ |
| 강경원 | 70만+ | 보디빌딩 / 5분할 | ⭐⭐ |
| 혁피티 | 50만+ | 입문·다이어트 | ⭐⭐ |
| 임종성 | 30만+ | 파워리프팅 / 최대근력 | ⭐ |

### 글로벌 웨이트 1순위 — 과학 기반 (4채널 × 15 = 60)

| 채널 | 구독자 | 특화 |
|---|---|---|
| Jeff Nippard | ~5M | 근비대 / PPL / 무료 PDF 프로그램 |
| Jeremy Ethier (BuiltWithScience) | ~7M | 입문·다이어트·근비대 / 메타분석 |
| Mike Israetel (Renaissance Periodization) | ~2M | RP 다이어트·근비대 / MEV/MAV/MRV |
| Sean Nalewanyj | ~700K | 입문~중급 / 댓글 참여도 高 |

### 글로벌 웨이트 2순위 — 인기·다양성 (4채널 × 15 = 60)

| 채널 | 구독자 | 특화 / 비고 |
|---|---|---|
| AthleanX (Jeff Cavaliere) | ~14M | PPL / 부상 예방 / **2차 필터 빡세게** (entertainment 비중 高) |
| Mike Thurston | ~3M | PPL / 보디빌딩 / 5분할 |
| Greg Doucette | ~2M | 다이어트 / IFBB Pro / **Tunguz 경계** (controversial) |
| Layne Norton (Biolayne) | ~800K | 다이어트·파워리프팅 / PhD |

### 글로벌 여성 웨이트 3순위 (3채널 × 10 = 30)

| 채널 | 구독자 | 특화 |
|---|---|---|
| Krissy Cela | ~2M | 여성 PPL·다이어트 |
| Whitney Simmons | ~1.5M | 여성 웨이트 입문~중급 |
| Stephanie Buttermore | ~1M | 여성 + PhD 운동과학 |

### 임계치 예외 1채널

| 채널 | 구독자 | 사유 |
|---|---|---|
| Stronger By Science (Greg Nuckols) | ~250K | 1M 미달이지만 댓글 참여도·과학 신뢰도 매우 高. 대표 컨펌 포함 |

### 한국 홈트 (4채널 × 15 = 60)

| 채널 | 구독자 | 특화 |
|---|---|---|
| 땅끄부부 | 350만+ | 다이어트 / 따라하기 |
| 빅씨스 | 250만+ | 여성 라인 / 코어 |
| 에이핏 | 100만+ | 짧은 루틴 / 일상 |
| 강하나 | 60만+ | 시니어·저강도 |

### 글로벌 홈트 (1채널 × 15 = 15, 후속 추가 검토)

| 채널 | 구독자 | 특화 |
|---|---|---|
| Chloe Ting | ~25M | 글로벌 1위 홈트 |

## 조사 인프라 (코드)

### 필요 시크릿

- `YOUTUBE_API_KEY` — Cloud Functions 시크릿. 대표 발급 후 전달 대기 중
- `GEMINI_API_KEY` — 기존 활용

### 신규 Cloud Function

- `researchYoutubeChannel(channelId, options)` — 영상 메타데이터 + 댓글 수집 + Firestore 저장
  - Input: `{ channelId, maxVideos: 15, viewCountMin, commentRateMin }`
  - Output: Firestore `youtube_research/{channelId}/videos/{videoId}` (메타) + `comments/{commentId}` (top 30)
  - quota 사용: 채널당 약 130 units (search 100 + videos 15 + comments 15)

- `analyzeYoutubeComments(videoId)` — Gemini batch 분석
  - Input: 영상 ID + top 30 댓글 텍스트
  - Output: `{ behaviorSignalRate: 0-1, keywords: string[], sentiment: ... }`
  - Firestore `youtube_research/{channelId}/videos/{videoId}.analysis` 저장

### 분석 결과 산출물

- `youtube_research_summary.md` — 22 채널 / 315 영상 결과표
  - 1·2차 필터 통과 영상 리스트
  - 카탈로그 5개(웨이트) + 5개(홈트) 매핑 후보
- 운동과학 자문단 검토용 spot check 리스트 (3차 필터 입력)
- 페르소나 인터뷰 가이드 (4차 필터 입력)

## YouTube Data API quota 추정

| 작업 | 단가 | 횟수 | 소비 |
|---|---|---|---|
| 채널 검색 (search.list) | 100 | 22 | 2,200 |
| 영상 메타 (videos.list) | 1 | 315 | 315 |
| 댓글 수집 (commentThreads.list) | 1 | 315 | 315 |
| **합계** | — | — | **약 2,830 units** |

→ 일일 quota 10,000 의 28% 사용. 무료 충분.

## Gemini 비용 추정

| 항목 | 추정 |
|---|---|
| 분석 댓글 | 9,450 (315 × 30) |
| Input tokens | ~630K |
| Output tokens | ~63K |
| 비용 | $0.07 / 약 100~150원 |

**Rate limit:** 영상별 batch (315 requests/day) — 무료 tier RPD 1,500 한도 내.

## 작업 순서

1. ⏳ **대표 → YouTube API 키 발급 + 전달** (가이드 5 step 제공 완료)
2. Cloud Functions 시크릿 등록 (`firebase functions:secrets:set YOUTUBE_API_KEY`)
3. `researchYoutubeChannel` Cloud Function 구현 + 배포
4. 22 채널 백그라운드 수집 (1일 quota 충분)
5. `analyzeYoutubeComments` Gemini batch 분석 (315 영상)
6. 1·2차 필터 통과 결과표 작성 → `youtube_research_summary.md`
7. 운동과학 자문단 spot check (3차)
8. 페르소나 4명 인터뷰 (4차)
9. 카탈로그 5+5개 확정 → SEED-002 P2 입력

## 분기별 재실행

- 매 3개월 재조사 (시장 트렌드 갱신)
- 비용: 회당 ~150원 + Cloud Functions 실행 ~무시 가능
- 결과 변화 비교: 새 채널 등장 / 임계치 통과 영상 변동

## 관련 SEED·회의

- SEED-002 (parent — UX 재설계, P2 카탈로그 의존)
- 회의 2026-04-29-ζ-4 (등록 회의)
