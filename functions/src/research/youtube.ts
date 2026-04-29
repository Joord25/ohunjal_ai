/**
 * YouTube Data API v3 시장 조사 모듈 (회의 ζ-4 / SEED-003).
 * - 채널 search → 영상 메타데이터 → 댓글 수집 → Firestore 저장
 * - Gemini 2.5 Flash batch 분석 — 행동 신호 키워드 빈도
 *
 * 보안: verifyAdmin 보호. YOUTUBE_API_KEY / GEMINI_API_KEY 시크릿.
 * SEED-002 P2 카탈로그 컨텐츠 큐레이션 입력으로 사용.
 */
import { onRequest } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdmin, db } from "../helpers";
import { getGemini, GEMINI_MODEL } from "../gemini";

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YtChannelSearchItem {
  id: { channelId?: string };
  snippet: { channelId?: string; title: string; description: string; thumbnails?: unknown };
}
interface YtVideoItem {
  id: string;
  snippet: { title: string; publishedAt: string; channelId: string; channelTitle: string; thumbnails?: { medium?: { url: string } } };
  statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
}
interface YtCommentThreadItem {
  snippet: {
    topLevelComment: {
      id: string;
      snippet: {
        textOriginal: string;
        likeCount: number;
        publishedAt: string;
        authorDisplayName: string;
      };
    };
  };
}

async function ytFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");
  const qs = new URLSearchParams({ ...params, key: apiKey }).toString();
  const url = `${YT_API_BASE}/${path}?${qs}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// 회의 ζ-4 fix (quota 절감): Firestore 캐시 활용 — 1번 lookup 후 channelId 재사용. search.list 회피.
async function lookupChannelIdByName(name: string): Promise<{ channelId: string; title: string }> {
  // 1) Firestore 캐시 조회 (searchName 일치)
  const cached = await db.collection("youtube_research").where("searchName", "==", name).limit(1).get();
  if (!cached.empty) {
    const d = cached.docs[0].data();
    if (d.channelId) return { channelId: d.channelId, title: d.title ?? name };
  }
  // 2) miss → search.list (100 units, 신규 채널만)
  type SearchResp = { items: YtChannelSearchItem[] };
  const json = await ytFetch<SearchResp>("search", {
    part: "snippet",
    q: name,
    type: "channel",
    maxResults: "1",
  });
  const item = json.items?.[0];
  const channelId = item?.id?.channelId ?? item?.snippet?.channelId;
  if (!channelId) throw new Error(`Channel not found: ${name}`);
  return { channelId, title: item.snippet.title };
}

// 회의 ζ-4 fix (quota 절감): search.list (100 units) → channels.list + playlistItems.list + videos.list (3 units). 90% 절감.
// 트레이드오프: search.list `order=viewCount` 폐기 → 최근 50 영상 fetch 후 메모리에서 viewCount 정렬.
//                 채널의 진짜 all-time top 영상이 최근 50 안에 없으면 누락 가능. 인기 영상은 보통 최근 1-2년이라 실용적 영향 X.
async function fetchChannelTopVideos(channelId: string, maxResults: number): Promise<YtVideoItem[]> {
  // 1) channels.list — uploads playlist ID 추출 (1 unit)
  type ChannelsResp = { items: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[] };
  const ch = await ytFetch<ChannelsResp>("channels", {
    part: "contentDetails",
    id: channelId,
  });
  const uploadsPlaylistId = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) return [];

  // 2) playlistItems.list — 최근 50 영상 ID (1 unit)
  type PlaylistResp = { items: { contentDetails: { videoId: string } }[] };
  const pl = await ytFetch<PlaylistResp>("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: "50",
  });
  const allIds = pl.items.map((i) => i.contentDetails.videoId).filter(Boolean);
  if (allIds.length === 0) return [];

  // 3) videos.list — 메타 + statistics (1 unit, 최대 50개 한 번에)
  type VideosResp = { items: YtVideoItem[] };
  const videos = await ytFetch<VideosResp>("videos", {
    part: "snippet,statistics",
    id: allIds.join(","),
  });

  // 4) viewCount 내림차순 정렬 → top maxResults
  const sorted = [...videos.items].sort((a, b) => {
    const av = parseInt(a.statistics.viewCount ?? "0", 10);
    const bv = parseInt(b.statistics.viewCount ?? "0", 10);
    return bv - av;
  });
  return sorted.slice(0, maxResults);
}

async function fetchTopComments(videoId: string, maxResults: number): Promise<YtCommentThreadItem[]> {
  try {
    type CommentsResp = { items: YtCommentThreadItem[] };
    const json = await ytFetch<CommentsResp>("commentThreads", {
      part: "snippet",
      videoId,
      order: "relevance",
      maxResults: String(Math.min(maxResults, 100)),
      textFormat: "plainText",
    });
    return json.items ?? [];
  } catch (err) {
    // 댓글 비활성화 영상 등 — 빈 배열 반환
    console.warn(`fetchTopComments fail ${videoId}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

interface VideoRecord {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number; // commentCount / viewCount
  likeRate: number;       // likeCount / viewCount
  filter1Pass: boolean;   // 1차 정량 필터 통과 여부
  region: "kr" | "global";
  fetchedAt: FirebaseFirestore.FieldValue;
}

// 회의 ζ-4 fix (2026-04-29): 임계치 완화 — 실측 데이터 기반.
// 한국 운동 영상 댓글 참여도 평균 ~0.2%, 좋아요율 평균 ~3%. 기존 1%/3% 는 너무 빡세서 0% 통과 → 0.2%/1.5% 로 완화.
function classifyFilter1(v: { viewCount: number; engagementRate: number; likeRate: number }, region: "kr" | "global"): boolean {
  const viewMin = region === "kr" ? 100_000 : 1_000_000;
  const engMin = region === "kr" ? 0.002 : 0.001;
  const likeMin = region === "kr" ? 0.015 : 0.010;
  return v.viewCount >= viewMin && v.engagementRate >= engMin && v.likeRate >= likeMin;
}

/**
 * researchYoutubeChannel — 1채널 영상 + 댓글 수집 → Firestore 저장
 *
 * Body: { channelName?: string, channelId?: string, maxVideos?: number (default 15), maxComments?: number (default 30), region: "kr"|"global" }
 * Output: { channelId, title, videosFetched, filter1Passed }
 *
 * Firestore 저장:
 * - youtube_research/{channelId} — 채널 메타
 * - youtube_research/{channelId}/videos/{videoId} — 영상 메타 + 1차 필터 결과
 * - youtube_research/{channelId}/videos/{videoId}/comments/{commentId} — top 댓글
 */
export const researchYoutubeChannel = onRequest(
  { cors: true, secrets: ["YOUTUBE_API_KEY"], timeoutSeconds: 300 },
  async (req, res): Promise<void> => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAdmin(req.headers.authorization); }
    catch { res.status(403).json({ error: "Forbidden — admin only" }); return; }

    const { channelName, channelId: providedId, maxVideos = 15, maxComments = 30, region = "kr" } = req.body ?? {};
    if (!channelName && !providedId) { res.status(400).json({ error: "channelName or channelId required" }); return; }
    if (region !== "kr" && region !== "global") { res.status(400).json({ error: "region must be 'kr' or 'global'" }); return; }

    try {
      let channelId: string;
      let channelTitle: string;
      if (providedId) {
        channelId = providedId;
        channelTitle = channelName ?? providedId;
      } else {
        const looked = await lookupChannelIdByName(channelName);
        channelId = looked.channelId;
        channelTitle = looked.title;
      }

      // 채널 메타 저장
      const channelRef = db.collection("youtube_research").doc(channelId);
      await channelRef.set({
        channelId,
        title: channelTitle,
        searchName: channelName ?? null,
        region,
        lastResearchAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      // 영상 + 댓글 수집
      const videos = await fetchChannelTopVideos(channelId, maxVideos);
      const passedVideos: VideoRecord[] = [];

      for (const v of videos) {
        const viewCount = parseInt(v.statistics.viewCount ?? "0", 10);
        const likeCount = parseInt(v.statistics.likeCount ?? "0", 10);
        const commentCount = parseInt(v.statistics.commentCount ?? "0", 10);
        const engagementRate = viewCount > 0 ? commentCount / viewCount : 0;
        const likeRate = viewCount > 0 ? likeCount / viewCount : 0;
        const filter1Pass = classifyFilter1({ viewCount, engagementRate, likeRate }, region);

        const record: VideoRecord = {
          videoId: v.id,
          channelId,
          channelTitle: v.snippet.channelTitle,
          title: v.snippet.title,
          publishedAt: v.snippet.publishedAt,
          thumbnailUrl: v.snippet.thumbnails?.medium?.url ?? null,
          viewCount, likeCount, commentCount, engagementRate, likeRate, filter1Pass, region,
          fetchedAt: FieldValue.serverTimestamp(),
        };

        await channelRef.collection("videos").doc(v.id).set(record, { merge: true });

        // 회의 ζ-4 fix (2026-04-29): 1차 필터 통과 무관 모든 영상 댓글 수집.
        // 사유 — 임계치 미세 조정 필요 시 매번 재수집 비효율. quota 충분 (영상당 1 unit).
        if (filter1Pass) passedVideos.push(record);
        const comments = await fetchTopComments(v.id, maxComments);
        const batch = db.batch();
        for (const c of comments) {
          const cs = c.snippet.topLevelComment;
          batch.set(channelRef.collection("videos").doc(v.id).collection("comments").doc(cs.id), {
            commentId: cs.id,
            videoId: v.id,
            text: cs.snippet.textOriginal,
            likeCount: cs.snippet.likeCount,
            author: cs.snippet.authorDisplayName,
            publishedAt: cs.snippet.publishedAt,
          });
        }
        if (comments.length > 0) await batch.commit();
      }

      res.status(200).json({
        channelId,
        title: channelTitle,
        region,
        videosFetched: videos.length,
        filter1Passed: passedVideos.length,
        passedVideoIds: passedVideos.map((v) => v.videoId),
        // 회의 ζ-4 fix: 분석 대상은 모든 영상 (1차 필터는 정보용)
        allVideoIds: videos.map((v) => v.id),
      });
    } catch (err) {
      console.error("researchYoutubeChannel error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "unknown" });
    }
  }
);

const ANALYSIS_PROMPT_KO = `다음은 한국어 운동 영상의 인기 댓글 ${'$'}{count}개입니다. 행동 신호 분석을 수행하세요.

행동 신호 = "실제로 따라했거나 효과를 봤거나 반복 시청·구독한" 흔적이 있는 댓글.
판정 키워드 예시:
- "따라했어요" / "효과 봤어요" / "1주차 / N일차 / Day N" / "다시 봐요" / "구독했어요" / "운동 시작했어요" / "결과 공유"

JSON 만 출력. 다른 텍스트·마크다운·코드블록 X. 스키마:
{
  "behaviorSignalRate": 0.0-1.0,
  "behaviorCount": number,
  "topKeywords": [{"keyword": string, "count": number}],
  "topQuotes": [string, string, string]
}

댓글 (JSON array):
${'$'}{commentsJson}`;

const ANALYSIS_PROMPT_EN = `Below are the top ${'$'}{count} comments on a fitness video (English). Analyze behavior signals.

Behavior signal = comments showing the user actually followed along, saw results, came back, or subscribed.
Example keywords:
- "Day N" / "followed along" / "results" / "subscribed" / "starting tomorrow" / "week N" / "completed"

Return JSON ONLY. No markdown, no code fence. Schema:
{
  "behaviorSignalRate": 0.0-1.0,
  "behaviorCount": number,
  "topKeywords": [{"keyword": string, "count": number}],
  "topQuotes": [string, string, string]
}

Comments (JSON array):
${'$'}{commentsJson}`;

interface AnalysisResult {
  behaviorSignalRate: number;
  behaviorCount: number;
  topKeywords: { keyword: string; count: number }[];
  topQuotes: string[];
}

/**
 * analyzeYoutubeComments — 한 영상의 top 댓글 → Gemini batch 분석
 *
 * Body: { channelId: string, videoId: string, language?: "ko"|"en" (default "ko") }
 * Output: AnalysisResult + filter2Pass (행동 신호 비율 ≥ 0.30)
 *
 * 비용: 영상당 input ~2K + output ~200 tokens ≒ Gemini 2.5 Flash $0.0002 (약 0.3원)
 */
export const analyzeYoutubeComments = onRequest(
  { cors: true, secrets: ["YOUTUBE_API_KEY", "GEMINI_API_KEY"], timeoutSeconds: 60 },
  async (req, res): Promise<void> => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAdmin(req.headers.authorization); }
    catch { res.status(403).json({ error: "Forbidden — admin only" }); return; }

    const { channelId, videoId, language = "ko" } = req.body ?? {};
    if (!channelId || !videoId) { res.status(400).json({ error: "channelId and videoId required" }); return; }

    try {
      const commentsSnap = await db.collection("youtube_research").doc(channelId)
        .collection("videos").doc(videoId).collection("comments").get();
      const comments = commentsSnap.docs.map((d) => d.data().text as string).filter(Boolean);
      if (comments.length === 0) { res.status(404).json({ error: "No comments stored for this video — run researchYoutubeChannel first" }); return; }

      const tpl = language === "en" ? ANALYSIS_PROMPT_EN : ANALYSIS_PROMPT_KO;
      const prompt = tpl
        .replace("${count}", String(comments.length))
        .replace("${commentsJson}", JSON.stringify(comments));

      const ai = getGemini();
      const resp = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const raw = resp.text ?? "";
      let parsed: AnalysisResult;
      try { parsed = JSON.parse(raw) as AnalysisResult; }
      catch (e) {
        console.error("analyzeYoutubeComments: JSON parse fail. Raw:", raw.slice(0, 500));
        res.status(500).json({ error: "Gemini output JSON parse failed", raw: raw.slice(0, 500) }); return;
      }

      const filter2Pass = (parsed.behaviorSignalRate ?? 0) >= 0.30;

      await db.collection("youtube_research").doc(channelId)
        .collection("videos").doc(videoId).set({
          analysis: { ...parsed, filter2Pass, analyzedAt: FieldValue.serverTimestamp(), language },
        }, { merge: true });

      res.status(200).json({ videoId, ...parsed, filter2Pass });
    } catch (err) {
      console.error("analyzeYoutubeComments error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "unknown" });
    }
  }
);

interface ResultVideo {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  region: "kr" | "global";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
  likeRate: number;
  filter1Pass: boolean;
  thumbnailUrl: string | null;
  publishedAt: string;
  analyzed: boolean;
  behaviorSignalRate?: number;
  behaviorCount?: number;
  topKeywords?: { keyword: string; count: number }[];
  topQuotes?: string[];
  filter2Pass?: boolean;
}

interface ChannelSummary {
  channelId: string;
  title: string;
  region: "kr" | "global";
  videosFetched: number;
  filter1PassedCount: number;
  filter2PassedCount: number;
  avgBehaviorRate: number;
  topVideoId: string | null;
}

/**
 * getResearchResults — Firestore 결과 종합 조회.
 *
 * Body: { sortBy?: "behavior"|"view"|"engagement", region?: "kr"|"global"|"all", filter?: "all"|"filter1"|"filter2" }
 * Output: { videos: ResultVideo[] (정렬), channels: ChannelSummary[] }
 */
export const getResearchResults = onRequest(
  { cors: true, timeoutSeconds: 60 },
  async (req, res): Promise<void> => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAdmin(req.headers.authorization); }
    catch { res.status(403).json({ error: "Forbidden — admin only" }); return; }

    const { sortBy = "behavior", region = "all", filter = "all" } = req.body ?? {};

    try {
      // collectionGroup 쿼리 — 모든 채널의 videos 서브컬렉션
      const snap = await db.collectionGroup("videos").get();
      const videos: ResultVideo[] = snap.docs.map((d) => {
        const data = d.data();
        const analysis = data.analysis;
        return {
          videoId: data.videoId,
          channelId: data.channelId,
          channelTitle: data.channelTitle,
          title: data.title,
          region: data.region,
          viewCount: data.viewCount,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          engagementRate: data.engagementRate,
          likeRate: data.likeRate,
          filter1Pass: data.filter1Pass,
          thumbnailUrl: data.thumbnailUrl ?? null,
          publishedAt: data.publishedAt,
          analyzed: Boolean(analysis),
          behaviorSignalRate: analysis?.behaviorSignalRate,
          behaviorCount: analysis?.behaviorCount,
          topKeywords: analysis?.topKeywords,
          topQuotes: analysis?.topQuotes,
          filter2Pass: analysis?.filter2Pass,
        };
      });

      // region 필터
      const regionFiltered = region === "all" ? videos : videos.filter((v) => v.region === region);
      // filter 필터
      const filtered = filter === "filter1" ? regionFiltered.filter((v) => v.filter1Pass)
        : filter === "filter2" ? regionFiltered.filter((v) => v.filter2Pass === true)
        : regionFiltered;

      // 정렬
      filtered.sort((a, b) => {
        if (sortBy === "view") return b.viewCount - a.viewCount;
        if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
        // default: behavior — 분석 안 된 영상은 뒤로
        const ar = a.behaviorSignalRate ?? -1;
        const br = b.behaviorSignalRate ?? -1;
        return br - ar;
      });

      // 채널별 요약
      const byChannel = new Map<string, { videos: ResultVideo[] }>();
      for (const v of videos) {
        const key = v.channelId;
        if (!byChannel.has(key)) byChannel.set(key, { videos: [] });
        byChannel.get(key)!.videos.push(v);
      }
      const channels: ChannelSummary[] = [];
      for (const [channelId, { videos: chVideos }] of byChannel) {
        const analyzed = chVideos.filter((v) => v.analyzed);
        const avgBehavior = analyzed.length > 0
          ? analyzed.reduce((sum, v) => sum + (v.behaviorSignalRate ?? 0), 0) / analyzed.length
          : 0;
        const sortedByBehavior = [...analyzed].sort((a, b) => (b.behaviorSignalRate ?? 0) - (a.behaviorSignalRate ?? 0));
        channels.push({
          channelId,
          title: chVideos[0]?.channelTitle ?? channelId,
          region: chVideos[0]?.region ?? "kr",
          videosFetched: chVideos.length,
          filter1PassedCount: chVideos.filter((v) => v.filter1Pass).length,
          filter2PassedCount: chVideos.filter((v) => v.filter2Pass === true).length,
          avgBehaviorRate: avgBehavior,
          topVideoId: sortedByBehavior[0]?.videoId ?? null,
        });
      }
      channels.sort((a, b) => b.avgBehaviorRate - a.avgBehaviorRate);

      res.status(200).json({ videos: filtered, channels });
    } catch (err) {
      console.error("getResearchResults error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "unknown" });
    }
  }
);
