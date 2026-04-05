import { onRequest } from "firebase-functions/v2/https";
import { verifyAuth } from "../helpers";
import { generateAdaptiveWorkout } from "../workoutEngine";

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

    try {
      await verifyAuth(req.headers.authorization);
    } catch {
      res.status(401).json({ error: "Unauthorized" });
      return;
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
      );

      // 응답 랜덤 변형: main phase 내 마지막 2개 운동 순서 미세 셔플 (보안: 패턴 감지 방지)
      // 회의 37: 러닝 세션은 시간 순서가 엄격 (워밍업→드릴→메인→쿨다운).
      // 셔플이 마무리 조깅 ↔ 인터벌 스프린트를 바꿔버려 부상 위험 + UX 버그.
      // 러닝 세션은 셔플 제외, 웨이트 세션만 적용 (보안 목적 유지).
      if (sessionMode !== "running") {
        const mainIndices: number[] = [];
        session.exercises.forEach((e, i) => { if ((e.phase || e.type) === "main") mainIndices.push(i); });
        if (mainIndices.length >= 3 && Math.random() > 0.5) {
          const a = mainIndices[mainIndices.length - 1];
          const b = mainIndices[mainIndices.length - 2];
          [session.exercises[a], session.exercises[b]] = [session.exercises[b], session.exercises[a]];
        }
      }

      // AI 응답처럼 보이는 딜레이
      await new Promise(r => setTimeout(r, 100 + Math.random() * 200));

      res.status(200).json(session);
    } catch (error) {
      console.error("planSession error:", error);
      res.status(500).json({ error: "Failed to generate workout plan" });
    }
  }
);
