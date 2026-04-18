/**
 * 러닝 프로그램 Cloud Function API.
 *
 * 두 엔드포인트:
 * - POST /generateRunningProgram — 유저 입력으로 프로그램 세션 배열 생성 (저장은 /saveProgram 후속)
 * - POST /checkFullSub3Gate      — Full sub-3 진입 가능 여부 판정
 *
 * SPEC: .planning/RUNNING_PROGRAM_SPEC.md v1
 */

import { onRequest } from "firebase-functions/v2/https";
import { verifyAuth } from "../helpers";
import {
  generateRunningProgram,
  canEnterFullSub3,
  type RunningProgramId,
  type DaysPerWeek,
  type Limiter,
  type FullSub3GateInput,
} from "../runningProgram";

const VALID_PROGRAMS: RunningProgramId[] = ["vo2_boost", "10k_sub_50", "half_sub_2", "full_sub_3"];
const VALID_DAYS: DaysPerWeek[] = [3, 4, 5];
const VALID_LIMITERS: Limiter[] = ["build_aerobic", "break_ceiling"];

interface GenerateRequestBody {
  programId?: string;
  limiter?: string;
  daysPerWeek?: number;
  user5kPaceSec?: number;
}

function randomProgramId(): string {
  return `prog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function randomSessionId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * POST /generateRunningProgram
 * Body: { programId, limiter, daysPerWeek, user5kPaceSec? }
 * 반환: { ok: true, programId, programName, totalWeeks, totalSessions, sessions: SavedPlan[] }
 *
 * 보안: 인증 필수. 생성만 담당 (저장 아님). Full sub-3 게이트 체크는 별도 엔드포인트.
 */
export const generateRunningProgramFn = onRequest(
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

    const body = (req.body ?? {}) as GenerateRequestBody;
    const programId = body.programId as RunningProgramId;
    const limiter = body.limiter as Limiter;
    const daysPerWeek = body.daysPerWeek as DaysPerWeek;

    if (!VALID_PROGRAMS.includes(programId)) {
      res.status(400).json({ error: "Invalid programId" });
      return;
    }
    if (!VALID_LIMITERS.includes(limiter)) {
      res.status(400).json({ error: "Invalid limiter" });
      return;
    }
    if (!VALID_DAYS.includes(daysPerWeek)) {
      res.status(400).json({ error: "Invalid daysPerWeek (must be 3, 4, or 5)" });
      return;
    }
    if (programId === "vo2_boost" && (typeof body.user5kPaceSec !== "number" || body.user5kPaceSec <= 0)) {
      res.status(400).json({ error: "user5kPaceSec required for VO2 program" });
      return;
    }

    try {
      const gen = generateRunningProgram({
        programId,
        limiter,
        daysPerWeek,
        user5kPaceSec: body.user5kPaceSec,
      });

      const newProgramId = randomProgramId();
      const now = Date.now();

      // ProgramSessionSpec → SavedPlan 형식으로 변환 (클라가 /saveProgram에 그대로 던지면 저장됨)
      const sessions = gen.sessions.map(s => ({
        id: randomSessionId(),
        name: `${gen.programName} · ${s.sessionNumber}/${gen.totalSessions}`,
        sessionData: {
          title: s.title,
          description: s.description,
          exercises: s.exercises,
          intendedIntensity: s.intendedIntensity,
        },
        createdAt: now,
        lastUsedAt: null,
        useCount: 0,
        programId: newProgramId,
        sessionNumber: s.sessionNumber,
        totalSessions: gen.totalSessions,
        programName: gen.programName,
        completedAt: null,
        // v1 신규 필드
        programCategory: "running" as const,
        programGoal: programId,
        limiterAtStart: limiter,
        weekIndex: s.weekIndex,
        chapterIndex: s.chapterIndex,
        dayOfWeek: s.dayOfWeek,
        targetPaceSec: s.targetPaceSec,
        slotType: s.slotType,
      }));

      res.status(200).json({
        ok: true,
        programId: newProgramId,
        programName: gen.programName,
        totalWeeks: gen.totalWeeks,
        totalSessions: gen.totalSessions,
        daysPerWeek: gen.daysPerWeek,
        sessions,
      });
    } catch (err) {
      console.error("generateRunningProgram error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to generate program" });
    }
  },
);

interface GateRequestBody {
  weeklyAvgKm8wk?: number;
  recentHalfMarathonSec?: number;
  recent30KRunWithinWeeks?: number;
  recentInjury?: boolean;
}

/**
 * POST /checkFullSub3Gate
 * Body: FullSub3GateInput
 * 반환: GateResult { ok, reasons?, redirect? }
 *
 * 프로그램 선택 UI에서 "Full sub-3 잠김 상태" 렌더용. 인증 필수.
 */
export const checkFullSub3GateFn = onRequest(
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

    const body = (req.body ?? {}) as GateRequestBody;
    if (typeof body.weeklyAvgKm8wk !== "number" || body.weeklyAvgKm8wk < 0) {
      res.status(400).json({ error: "weeklyAvgKm8wk required (number >= 0)" });
      return;
    }

    const input: FullSub3GateInput = {
      weeklyAvgKm8wk: body.weeklyAvgKm8wk,
      recentHalfMarathonSec: body.recentHalfMarathonSec,
      recent30KRunWithinWeeks: body.recent30KRunWithinWeeks,
      recentInjury: body.recentInjury,
    };
    const result = canEnterFullSub3(input);
    res.status(200).json(result);
  },
);
