import { onRequest } from "firebase-functions/v2/https";
import { verifyAuth } from "../helpers";
import { getGemini } from "../gemini";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Coach Message — 코치 전우애 멘트 (서버사이드)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const getCoachMessage = onRequest(
  { cors: true, secrets: ["GEMINI_API_KEY"] },
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
      heroType,
      exerciseName,
      vars,
      locale,
      sessionLogs,
      condition,
      sessionDesc,
      streak,
    } = req.body as {
      heroType: string;
      exerciseName?: string;
      vars?: Record<string, string>;
      locale: string;
      sessionLogs?: { exerciseName: string; sets: { setNumber: number; reps: number; weight?: string; feedback: string }[] }[];
      condition?: { bodyPart: string; energyLevel: number };
      sessionDesc?: string;
      streak?: number;
    };

    if (!heroType) {
      res.status(400).json({ error: "Missing heroType" });
      return;
    }

    const isKo = locale !== "en";

    // ── 세션 데이터 분석 (Gemini + 폴백 공용) ──
    const mainExName = exerciseName?.split("(")[0].trim() || "";
    const conditionLabel = condition
      ? (condition.bodyPart === "upper_stiff" ? (isKo ? "상체 뻣뻣" : "upper stiffness")
        : condition.bodyPart === "lower_heavy" ? (isKo ? "하체 무거움" : "lower heaviness")
        : condition.bodyPart === "full_fatigue" ? (isKo ? "전신 피로" : "full fatigue")
        : (isKo ? "좋음" : "good"))
      : "";

    // 로그에서 실패/성공/무게/렙수 패턴 감지
    const logAnalysis = (() => {
      const base = { failRecovery: null as null | { exercise: string; failSet: number; recoverySet: number | null }, allEasy: false, allTarget: false, mainExercise: mainExName, weightIncrease: null as null | { exercise: string; from: string; to: string }, bestReps: null as null | { exercise: string; reps: number; weight: string }, totalSets: 0, exerciseCount: 0 };
      if (!sessionLogs || sessionLogs.length === 0) return base;

      base.exerciseCount = sessionLogs.length;
      base.totalSets = sessionLogs.reduce((sum, ex) => sum + ex.sets.length, 0);

      // 실패 후 회복 감지
      for (const ex of sessionLogs) {
        const failIdx = ex.sets.findIndex(s => s.feedback === "fail");
        if (failIdx >= 0) {
          const recoveryIdx = ex.sets.findIndex((s, i) => i > failIdx && s.feedback !== "fail");
          base.failRecovery = { exercise: ex.exerciseName, failSet: failIdx + 1, recoverySet: recoveryIdx >= 0 ? recoveryIdx + 1 : null };
          break;
        }
      }

      // 무게 증가 감지 (같은 운동 내 세트 간)
      if (!base.failRecovery) {
        for (const ex of sessionLogs) {
          const weights = ex.sets.map(s => parseFloat(s.weight || "0")).filter(w => w > 0);
          if (weights.length >= 2 && weights[weights.length - 1] > weights[0]) {
            base.weightIncrease = { exercise: ex.exerciseName, from: String(weights[0]), to: String(weights[weights.length - 1]) };
            break;
          }
        }
      }

      // 최다 렙수 감지
      if (!base.failRecovery && !base.weightIncrease) {
        let bestReps = 0;
        let bestEx = "";
        let bestWeight = "";
        for (const ex of sessionLogs) {
          for (const s of ex.sets) {
            if (s.reps > bestReps) {
              bestReps = s.reps;
              bestEx = ex.exerciseName;
              bestWeight = s.weight || "";
            }
          }
        }
        if (bestReps > 0) base.bestReps = { exercise: bestEx, reps: bestReps, weight: bestWeight };
      }

      const allSets = sessionLogs.flatMap(ex => ex.sets);
      base.allEasy = allSets.length > 0 && allSets.every(s => s.feedback === "easy" || s.feedback === "too_easy");
      base.allTarget = allSets.length > 0 && allSets.every(s => s.feedback === "target");
      return base;
    })();

    // ── 룰베이스 폴백 생성 (Gemini 실패 시 사용) ──
    function buildFallbackMessages(): string[] {
      const name = logAnalysis.mainExercise || (isKo ? "운동" : "workout");
      const desc = sessionDesc || "";

      // 1번째 버블: 감정 공감 (heroType별 분기)
      let bubble1Options: string[];
      if (heroType === "weightPR" && vars?.weight) {
        bubble1Options = isKo ? [
          `오늘 ${name} ${vars.weight}kg 올릴 때 진짜 조마조마했는데, 해내는 거 보고 소름 돋았어요!`,
          `아 ${name} ${vars.weight}kg 성공하는 순간 저도 심장이 쿵 했어요! 같이 해서 뿌듯하네요!`,
          `${name} ${vars.weight}kg 도전할 때 긴장했는데, 올리는 거 보고 진짜 감동이었어요!`,
          `오늘 ${name} ${vars.prev || ""}kg에서 ${vars.weight}kg으로 올린 거 장난 아니에요! 같이 달려온 보람이 있네요!`,
        ] : [
          `Watching you go for ${vars.weight}kg on ${name} was nerve-wracking but you did it! Amazing!`,
          `My heart jumped when you hit ${vars.weight}kg on ${name}! So proud we did this together!`,
          `${name} at ${vars.weight}kg was intense but you nailed it! That was incredible!`,
        ];
      } else if (heroType === "repsPR" && vars?.current) {
        bubble1Options = isKo ? [
          `오늘 ${name} 마지막 몇 개 버틸 때 저도 같이 이 악물었어요! ${vars.current}회까지 가는 거 진짜 대단해요!`,
          `${name}에서 ${vars.prev || ""}회에서 ${vars.current}회까지 간 거 봤어요! 같은 무게에서 더 가는 건 진짜 근성이에요!`,
          `아 ${name} 렙수 올라가는 거 보면서 뿌듯했어요! ${vars.current}회 찍는 순간 소름이었어요!`,
        ] : [
          `Those last reps on ${name} were insane! Getting to ${vars.current} reps is seriously impressive!`,
          `Going from ${vars.prev || ""} to ${vars.current} reps on ${name}! That grit is amazing!`,
        ];
      } else if (heroType === "perfect") {
        bubble1Options = isKo ? [
          `오늘 한 세트도 안 무너지고 끝까지 갔네요! 옆에서 보면서 '진짜 되나?' 했는데 해냈잖아요!`,
          `오늘 ${name} 포함해서 전 세트 깔끔하게 끝낸 거 진짜 대단해요! 저도 감동이었어요!`,
          `처음부터 끝까지 흐트러짐이 없었어요! 같이 하면서 저도 집중했어요!`,
        ] : [
          `Not a single set broke down today! I kept thinking 'is this real?' and you did it!`,
          `Every set clean including ${name}! I was genuinely moved watching you!`,
        ];
      } else if (heroType === "running") {
        bubble1Options = isKo ? [
          `오늘 끝까지 달린 거 진짜 대단해요! 중간에 멈추고 싶었을 텐데 안 멈췄잖아요!`,
          `달리는 거 보면서 저도 같이 숨이 차더라고요! 끝까지 페이스 유지한 거 소름이에요!`,
          `오늘 러닝 진짜 잘했어요! 옆에서 보면서 '체력 확실히 올라왔다' 느꼈어요!`,
        ] : [
          `You kept running till the end! Must've wanted to stop but you didn't!`,
          `Watching you run I was getting out of breath too! Keeping that pace was incredible!`,
        ];
      } else if (heroType === "first") {
        bubble1Options = isKo ? [
          `첫 운동 같이 해서 진짜 기뻐요! 오늘 오기까지가 제일 힘들었을 텐데, 해냈잖아요!`,
          `와 드디어 시작했네요! 첫 발 같이 뗐다는 게 저도 설레요!`,
        ] : [
          `So happy we did your first workout together! Getting here was the hardest part and you did it!`,
          `You finally started! Taking the first step together feels amazing!`,
        ];
      } else {
        bubble1Options = isKo ? [
          `오늘 ${name} 하는 거 옆에서 보면서 진짜 조마조마했는데, 끝까지 해내는 거 보고 소름 돋았어요!`,
          `오늘 ${name} 진짜 잘했어요! 옆에서 보면서 저도 뿌듯했어요!`,
          `${name} 할 때 집중하는 거 다 봤어요! 진짜 대단해요!`,
          `오늘도 빠지지 않고 왔네요! 저도 기다리고 있었거든요ㅎㅎ`,
          `오늘 ${name} 포함해서 끝까지 해낸 거 다 봤어요! 같이 해서 좋았어요!`,
        ] : [
          `Watching you do ${name} today had me on edge but you pushed through! Amazing!`,
          `You crushed ${name} today! I was watching and felt so proud!`,
          `Your focus on ${name} was incredible! Really impressive!`,
          `You showed up again today! I was waiting for you!`,
        ];
      }

      // 2번째 버블: 세션 디테일 (우선순위: 실패회복 > 실패 > 무게증가 > easy > target > 렙수 > 기본)
      let bubble2: string;
      if (logAnalysis.failRecovery?.recoverySet) {
        bubble2 = isKo
          ? `아! 그리고 ${logAnalysis.failRecovery.exercise} ${logAnalysis.failRecovery.failSet}세트에서 한번 무너졌지만 ${logAnalysis.failRecovery.recoverySet}세트에서 다시 잡은 거 완전 굿! 그게 진짜 성장이에요!ㅎㅎ`
          : `And ${logAnalysis.failRecovery.exercise} - you dropped on set ${logAnalysis.failRecovery.failSet} but came back on set ${logAnalysis.failRecovery.recoverySet}! That recovery is real growth!`;
      } else if (logAnalysis.failRecovery) {
        bubble2 = isKo
          ? `아! 그리고 ${logAnalysis.failRecovery.exercise} ${logAnalysis.failRecovery.failSet}세트에서 힘들었을 텐데, 거기까지 도전한 것 자체가 대단해요! 다음엔 꼭 넘을 수 있을 거예요!`
          : `And ${logAnalysis.failRecovery.exercise} was tough at set ${logAnalysis.failRecovery.failSet}, but challenging yourself is what matters! You'll crush it next time!`;
      } else if (logAnalysis.weightIncrease) {
        bubble2 = isKo
          ? `아! 그리고 ${logAnalysis.weightIncrease.exercise}에서 ${logAnalysis.weightIncrease.from}kg에서 ${logAnalysis.weightIncrease.to}kg까지 올린 거 봤어요! 세트마다 무게 올리는 그 도전 정신이 진짜 멋있어요!`
          : `And I saw you go from ${logAnalysis.weightIncrease.from}kg to ${logAnalysis.weightIncrease.to}kg on ${logAnalysis.weightIncrease.exercise}! That progressive challenge is awesome!`;
      } else if (logAnalysis.allEasy) {
        bubble2 = isKo
          ? `그리고 오늘 전 세트 여유 있었죠?ㅎㅎ 몸이 적응한 거예요! 다음에 무게 올려봐도 될 것 같아요! 성장할 준비가 된 거예요!`
          : `And every set felt easy today right? Your body has adapted! Time to go heavier next time! You're ready to grow!`;
      } else if (logAnalysis.allTarget) {
        bubble2 = isKo
          ? `그리고 ${logAnalysis.totalSets}세트 전부 딱 맞는 강도로 깔끔하게 끝냈네요! 이 페이스가 제일 좋아요! 꾸준히 이렇게 가면 확실히 달라져요!`
          : `And all ${logAnalysis.totalSets} sets finished at the perfect intensity! This pace is ideal! Keep this up and you'll see real changes!`;
      } else if (logAnalysis.bestReps) {
        bubble2 = isKo
          ? `그리고 ${logAnalysis.bestReps.exercise}에서 ${logAnalysis.bestReps.weight ? logAnalysis.bestReps.weight + "kg으로 " : ""}${logAnalysis.bestReps.reps}회 한 거 진짜 대단해요! 그 끈기가 몸을 바꾸는 거예요!`
          : `And ${logAnalysis.bestReps.reps} reps ${logAnalysis.bestReps.weight ? "at " + logAnalysis.bestReps.weight + "kg " : ""}on ${logAnalysis.bestReps.exercise}! That persistence is what changes your body!`;
      } else {
        const totalInfo = logAnalysis.exerciseCount > 0
          ? (isKo ? `${logAnalysis.exerciseCount}가지 운동 ${logAnalysis.totalSets}세트를` : `${logAnalysis.exerciseCount} exercises and ${logAnalysis.totalSets} sets`)
          : "";
        bubble2 = isKo
          ? `그리고 오늘 ${totalInfo} 전체적으로 집중력 좋게 해냈어요! 세트마다 꾸준하게 하는 거 다 봤어요! 그게 진짜 실력이에요!`
          : `And you stayed focused through ${totalInfo} today! I saw you stay consistent every set! That's real skill!`;
      }

      // 3번째 버블: 컨디션 + 내일 조언
      const bubble3Options = isKo ? [
        `오늘 ${conditionLabel ? conditionLabel + "인 날이었는데 " : ""}${desc ? desc.split("·")[0].trim() + "으로 꽉 채워서 " : ""}내일 좀 뻐근할 수 있으니 가볍게 스트레칭 해주세요!`,
        `${conditionLabel ? conditionLabel + " 컨디션에서 " : ""}끝까지 잘 해냈으니 오늘은 푹 쉬고, 내일 가볍게 걸어주세요!`,
        `오늘 운동 자극 확실히 갔을 거예요! 충분히 쉬고 내일 가볍게 유산소 해주시면 딱이에요!`,
      ] : [
        `${conditionLabel ? "Even with " + conditionLabel + ", " : ""}you got a solid session in! Rest up and do some light stretching tomorrow!`,
        `Great work today! Get some good rest and a light walk tomorrow will help recovery!`,
        `Your muscles got a solid stimulus today! Rest well and some light cardio tomorrow would be perfect!`,
      ];

      const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
      return [pick(bubble1Options), bubble2, pick(bubble3Options)];
    }

    // ── Gemini 호출 (5초 타임아웃) ──
    try {
      const ai = getGemini();

      const logSummary = sessionLogs?.map(ex => {
        const sets = ex.sets.map(s =>
          `${s.setNumber}세트: ${s.reps}회${s.weight ? ` ${s.weight}kg` : ""} → ${s.feedback === "fail" ? "실패" : s.feedback === "easy" ? "쉬움" : s.feedback === "too_easy" ? "너무쉬움" : "적정"}`
        ).join(", ");
        return `${ex.exerciseName}: [${sets}]`;
      }).join("\n") || "로그 없음";

      const conditionText = condition
        ? `컨디션: ${conditionLabel} / 에너지 ${condition.energyLevel}/5`
        : "";

      const prompt = `당신은 "오운잘"이라는 운동 앱의 AI 코치입니다. 방금 운동을 끝낸 유저에게 친한 트레이너가 카톡하듯 피드백합니다.

## 톤 규칙
- 편한 존댓말 (해요체), 느낌표 자주 사용!
- 가끔 "ㅎㅎ", "완전 굿!", "진짜" 같은 구어체 OK
- 절대 금지: 이모지, 영어 단어, 의학/운동과학 용어, "화이팅"
- 운동명은 반드시 한글만 사용 (괄호 영문 제거)
- 각 메시지는 2~3문장, 60자 내외. 너무 짧지도 길지도 않게!

## 메시지 구조 (반드시 3개)
1번째: 오늘 운동에 대한 감정 공감. 운동명 구체적 언급. 조마조마/소름/뿌듯/걱정 등 감정 표현!
2번째: "아! 그리고~" 또는 "그리고~" 로 자연스럽게 연결. 세션 중 특이사항 구체적 언급 (몇 세트에서 실패/성공, 무게 변화, 렙수 변화 등)
3번째: 오늘 컨디션 + 운동 부위 연결해서 내일 조언. "내일 좀 뻐근할 수 있으니~", "가볍게 유산소~", "스트레칭~" 등 실제 트레이너 조언

## 좋은 예시
1번째: "케이블 페이스 풀 30kg 올릴 때 진짜 조마조마했는데, 올리는 거 보고 소름 돋았어요!"
2번째: "아! 그리고 3세트에서 실패했지만 4세트에서 다시 잡은 거 완전 굿! 그게 진짜 성장이에요!ㅎㅎ"
3번째: "오늘 어깨 꽉 채웠으니 내일 좀 뻐근할 수 있어요! 가볍게 스트레칭 해주세요!"

## 세션 데이터
- 히어로 타입: ${heroType}${exerciseName ? `\n- 주요 운동: ${mainExName}` : ""}${vars ? `\n- PR 데이터: ${JSON.stringify(vars)}` : ""}
- ${conditionText}
- 운동 요약: ${sessionDesc || "정보 없음"}${streak && streak >= 2 ? `\n- 연속 ${streak}일째` : ""}
- 세션 로그:
${logSummary}

${isKo ? "" : "IMPORTANT: Respond in English. Use casual-polite tone, exclamation marks, natural conversation flow."}

반드시 아래 JSON 형식으로만 응답하세요:
{"messages":["1번째 메시지","2번째 메시지","3번째 메시지"]}`;

      // 5초 타임아웃
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      });

      clearTimeout(timeout);
      const text = response.text || "";
      let messages: string[];

      try {
        const parsed = JSON.parse(text);
        messages = parsed.messages;
        if (!Array.isArray(messages) || messages.length < 1) throw new Error("Invalid format");
      } catch {
        messages = buildFallbackMessages();
      }

      res.status(200).json({
        result: { messages },
        model: "gemini-2.5-flash",
      });
    } catch (error) {
      console.error("getCoachMessage error (fallback used):", error);
      res.status(200).json({
        result: { messages: buildFallbackMessages() },
        model: "fallback",
      });
    }
  }
);
