import { onRequest } from "firebase-functions/v2/https";
import { verifyAuth, db } from "../helpers";
import { generateAdaptiveWorkout, translateSessionToEn } from "../workoutEngine";

// 회의 ζ-5-A 평가자 P1-4 (2026-04-30): getGuestTrialStatus / 게스트 IP trial / isAnonymous 분기 통째 폐기.
// 클라가 익명 진입 못 하므로 dead code 였고, 익명 토큰 abuser 의 우회 경로 차단을 위해 제거.

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Plan Session — 운동 플랜 생성 (서버사이드 룰베이스)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const planSession = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    let uid: string;
    try {
      uid = await verifyAuth(req.headers.authorization);
    } catch {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Server-side usage limits — 회의 ζ-5-A 평가자 P1-4 (2026-04-30): 게스트 분기 폐기.
    // 로그인 free 유저만 FREE_PLAN_LIMIT 검증 (익명 토큰 우회 abuse 차단).
    const FREE_PLAN_LIMIT = 1;
    try {
      const subDoc = await db.collection("subscriptions").doc(uid).get();
      const subStatus = subDoc.exists ? subDoc.data()?.status : "free";

      if (subStatus !== "active") {
        const profileDoc = await db.collection("users").doc(uid).get();
        const planCount = profileDoc.exists ? (profileDoc.data()?.planCount || 0) : 0;

        if (planCount >= FREE_PLAN_LIMIT) {
          res.status(403).json({ error: "무료 플랜 생성 한도에 도달했습니다. 프리미엄 구독 후 이용해주세요.", code: "FREE_LIMIT" });
          return;
        }
      }
    } catch {
      // Subscription lookup failed — proceed anyway (don't block legitimate requests)
    }

    const {
      dayIndex,
      condition,
      goal,
      selectedSessionType,
      intensityOverride,
      sessionMode,
      targetMuscle,
      runType,
      lastUpperType,
      equipment,
      exerciseList,
      muscleGroup,
      locale, // 회의 ζ-5-A 평가자 P0-2 (2026-04-30): EN 유저 한글 라벨 변환용
    } = req.body;

    if (condition === undefined || goal === undefined) {
      res.status(400).json({ error: "Missing condition or goal" });
      return;
    }

    try {
      const session = generateAdaptiveWorkout(
        dayIndex ?? new Date().getDay(),
        condition,
        goal,
        selectedSessionType,
        intensityOverride,
        sessionMode,
        targetMuscle,
        runType,
        lastUpperType,
        equipment,
        Array.isArray(exerciseList) ? exerciseList : undefined,
        muscleGroup,
      );

      // 응답 랜덤 변형: main phase 내 마지막 2개 운동 순서 미세 셔플 (보안: 패턴 감지 방지)
      // 회의 37: 러닝 세션은 시간 순서가 엄격 (워밍업→드릴→메인→쿨다운).
      // 셔플이 마무리 조깅 ↔ 인터벌 스프린트를 바꿔버려 부상 위험 + UX 버그.
      // 러닝 세션은 셔플 제외, 웨이트 세션만 적용 (보안 목적 유지).
      // 회의 2026-04-24: exerciseList 경로는 유저가 지정한 순서 = 계약. 셔플 제외.
      const hasExerciseList = Array.isArray(exerciseList) && exerciseList.length > 0;
      if (sessionMode !== "running" && !hasExerciseList) {
        const mainIndices: number[] = [];
        session.exercises.forEach((e, i) => { if ((e.phase || e.type) === "main") mainIndices.push(i); });
        if (mainIndices.length >= 3 && Math.random() > 0.5) {
          const a = mainIndices[mainIndices.length - 1];
          const b = mainIndices[mainIndices.length - 2];
          [session.exercises[a], session.exercises[b]] = [session.exercises[b], session.exercises[a]];
        }
      }

      // 회의 ζ-5-A 평가자 P1-4 (2026-04-30): 게스트 trial 증가 로직 폐기.

      // 회의 ζ-5-A 평가자 P0-2 (2026-04-30): EN 유저는 title/description/count 영문 변환
      const finalSession = locale === "en" ? translateSessionToEn(session) : session;

      // AI 응답처럼 보이는 딜레이
      await new Promise(r => setTimeout(r, 100 + Math.random() * 200));

      res.status(200).json(finalSession);
    } catch (error) {
      console.error("planSession error:", error);
      res.status(500).json({ error: "Failed to generate workout plan" });
    }
  }
);

/**
 * POST /api/generateProgramSessions
 * 장기 프로그램 세션 일괄 생성 — 프리미엄 전용, 한도 체크 1번만.
 * Body: { sessions: Array<{ condition, goal, sessionMode, targetMuscle?, intensityOverride? }> }
 * Response: { sessions: WorkoutSessionData[] }
 */
export const generateProgramSessions = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    let uid: string;
    try { uid = await verifyAuth(req.headers.authorization); } catch {
      res.status(401).json({ error: "Unauthorized" }); return;
    }

    // 프리미엄 체크 (1번만)
    try {
      const subDoc = await db.collection("subscriptions").doc(uid).get();
      const subStatus = subDoc.exists ? subDoc.data()?.status : "free";
      if (subStatus !== "active") {
        res.status(403).json({ error: "Premium required", code: "PREMIUM_REQUIRED" }); return;
      }
    } catch { /* proceed */ }

    const body = req.body as { sessions?: Array<{ condition: any; goal: string; sessionMode?: string; targetMuscle?: string; intensityOverride?: string }> };
    if (!body?.sessions || !Array.isArray(body.sessions) || body.sessions.length === 0) {
      res.status(400).json({ error: "sessions array required" }); return;
    }
    if (body.sessions.length > 100) {
      res.status(400).json({ error: "Too many sessions (max 100)" }); return;
    }

    try {
      // 입력 로깅: Gemini가 보낸 sessionParams 전체
      console.log("[PROGRAM_DEBUG] Input sessionParams:", JSON.stringify(body.sessions.map((s: any, i: number) => ({
        idx: i,
        sessionMode: s.sessionMode,
        targetMuscle: s.targetMuscle,
        goal: s.goal,
        availableTime: s.condition?.availableTime,
        intensityOverride: s.intensityOverride,
      }))));

      const results = [];
      // push/pull 교대: "pull"로 시작하면 엔진이 첫 세션을 "push(밀기)"로 생성
      let lastUpper: "push" | "pull" = "pull";
      for (let i = 0; i < body.sessions.length; i++) {
        const s = body.sessions[i];
        if (!s.condition || !s.goal) continue;

        // runType 자동 추론: sessionMode=running이면 필수
        let runType = (s as any).runType as string | undefined;
        if (s.sessionMode === "running" && !runType) {
          runType = s.intensityOverride === "high" ? "interval" : "easy";
        }

        const session = generateAdaptiveWorkout(
          i % 7,
          s.condition,
          s.goal as any,
          undefined,
          s.intensityOverride as any,
          s.sessionMode as any,
          s.targetMuscle as any,
          runType as any,
          lastUpper,
        );
        // balanced 모드면 push↔pull 교대 추적 (엔진이 생성한 결과 기준)
        if (!s.sessionMode || s.sessionMode === "balanced") {
          lastUpper = lastUpper === "push" ? "pull" : "push";
        }
        results.push(session);
      }

      // 출력 로깅: 룰엔진이 만든 세션 요약
      console.log("[PROGRAM_DEBUG] Output sessions:", JSON.stringify(results.map((s, i) => ({
        idx: i,
        title: s.title,
        description: s.description,
        exerciseCount: s.exercises.length,
        strengthCount: s.exercises.filter((e: any) => e.type === "strength").length,
        weights: s.exercises.filter((e: any) => e.type === "strength").map((e: any) => ({ name: e.name, weight: e.weight })),
      }))));

      res.status(200).json({ sessions: results });
    } catch (error) {
      console.error("generateProgramSessions error:", error);
      res.status(500).json({ error: "Failed to generate program sessions" });
    }
  }
);
