/**
 * 코치 전우애 멘트 — 장비별/시간대별/렙구간별 분류
 * 변수: {name}=운동명, {weight}=무게, {prev}=이전무게, {diff}=렙차이, {current}=현재렙수, {days}=연속일수
 */

export type EquipmentType = "barbell" | "dumbbell" | "kettlebell" | "machine" | "bodyweight" | "running" | "general";
export type TimeBand = "dawn" | "lunch" | "evening" | "night" | "general";
export type RepBand = "low" | "mid" | "high";

export interface CoachMessage {
  ko: string;
  en: string;
  minHistory?: number; // 최소 히스토리 횟수 (없으면 제한 없음)
}

// ─── 장비 분류 ─────────────────────────────────────────────
export function getEquipmentType(name: string, exerciseType?: string): EquipmentType {
  if (exerciseType === "cardio") return "running";
  const n = name.toLowerCase();
  if (/바벨|barbell/.test(n)) return "barbell";
  if (/덤벨|dumbbell/.test(n)) return "dumbbell";
  if (/케틀벨|kettlebell/.test(n)) return "kettlebell";
  if (/머신|machine|케이블|cable|풀다운|pulldown|프레스다운|pushdown|스미스|smith|펙덱|pec.?deck|레그.?프레스|leg.?press|핵.?스쿼트|hack/.test(n)) return "machine";
  if (/풀업|pull.?up|친업|chin.?up|푸시업|push.?up|딥스|dips|플랭크|plank|행잉|hanging|버피|burpee|마운틴|mountain|점프|jump|스텝업|step.?up/.test(n)) return "bodyweight";
  return "general";
}

// ─── 시간대 분류 ───────────────────────────────────────────
export function getTimeBand(hour: number): TimeBand {
  if (hour >= 5 && hour < 11) return "dawn";
  if (hour >= 11 && hour < 14) return "lunch";
  if (hour >= 14 && hour < 22) return "evening";
  if (hour >= 22 || hour < 5) return "night";
  return "general";
}

// ─── 렙수 구간 분류 ────────────────────────────────────────
export function getRepBand(reps: number): RepBand {
  if (reps <= 5) return "low";
  if (reps <= 12) return "mid";
  return "high";
}

// ─── 랜덤 선택 (세션 날짜 시드) ────────────────────────────
export function pickMessage(pool: CoachMessage[], dateSeed: string, historyCount: number): CoachMessage {
  const filtered = pool.filter(m => !m.minHistory || historyCount >= m.minHistory);
  if (filtered.length === 0) return pool[0];
  // 간단한 해시 기반 시드
  let hash = 0;
  for (let i = 0; i < dateSeed.length; i++) {
    hash = ((hash << 5) - hash) + dateSeed.charCodeAt(i);
    hash |= 0;
  }
  return filtered[Math.abs(hash) % filtered.length];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 무게 PR 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const WEIGHT_PR: Record<EquipmentType, CoachMessage[]> = {
  barbell: [
    { ko: "아 {name} {weight}kg 갈 때 걱정했는데, 올리는 거 보고 소름 돋았어요. 같이 해서 뿌듯하네요", en: "I was nervous when you went for {weight}kg on {name}. Watching you lift it gave me chills" },
    { ko: "{name} {weight}kg 성공하는 순간 저도 심장이 쿵 했어요. 같이 긴장한 보람이 있네요", en: "My heart jumped when you got {weight}kg on {name}. Worth every second of tension together" },
    { ko: "{name} {weight}kg 쉽지 않았을 텐데 해냈네요. 옆에서 보면서 저도 힘줬어요 진짜", en: "{weight}kg on {name} isn't easy but you did it. I was pushing with you from the side" },
    { ko: "저도 {name} {weight}kg 올라갈 때 숨 참고 있었어요. 해내는 거 보고 감동이었어요", en: "I was holding my breath when you went for {weight}kg. Watching you get it was something" },
    { ko: "{name} 오늘 무게 도전할 때 조마조마했거든요. 성공하는 순간 소름이었어요", en: "I was so anxious during your {name} attempt today. The moment you got it — goosebumps" },
    { ko: "{name} {prev}kg → {weight}kg, 숫자로 보면 간단한데 얼마나 힘든 건지 저는 알아요", en: "{name} {prev}kg → {weight}kg looks simple on paper but I know how hard that is" },
    { ko: "{name} {weight}kg 성공했을 때 하이파이브 하고 싶었어요 진짜. 같이 만든 기록이에요", en: "I wanted to high-five you when you hit {weight}kg on {name}. This is our record" },
    { ko: "{name} {weight}kg 벽을 같이 넘었네요. 이런 순간이 있어서 같이 하는 게 좋아요", en: "We broke through the {weight}kg wall on {name} together. Moments like this are why I love training with you" },
    { ko: "{name} 무게 올리는 거 보면서 '된다 된다' 속으로 외쳤어요. 역시 해내더라고요", en: "I was silently chanting 'you got this' watching your {name}. And you did" },
    { ko: "{name} {weight}kg이라니. 처음 생각하면 진짜 많이 왔어요 우리", en: "{weight}kg on {name}. Think about where we started. We've come so far", minHistory: 3 },
  ],
  dumbbell: [
    { ko: "{name} {weight}kg 터치하는 거 보고 저도 모르게 주먹 쥐었어요. 이 맛에 같이 하는 거죠", en: "I clenched my fist when you hit {weight}kg on {name}. This is why we train together" },
    { ko: "양쪽 {weight}kg씩 잡고 올리는 거, 밸런스 잡는 것만 해도 대단한데 끝까지 갔네요", en: "Holding {weight}kg each side and keeping balance is hard enough. You went all the way" },
    { ko: "{name} {weight}kg 찍는 거 보고 뿌듯해서 웃음이 나왔어요. 우리 진짜 잘하고 있어요", en: "Seeing you hit {weight}kg on {name} made me smile. We're really doing this" },
    { ko: "{name} 새 무게 도전하는 거 보면서 진짜 두근거렸어요. 같이 넘어서 기쁘네요", en: "My heart was racing watching your {name} attempt. So glad we cleared it together" },
    { ko: "{name} 덤벨로 {weight}kg 가는 거 보면 컨트롤이 확실히 좋아졌어요", en: "Hitting {weight}kg with dumbbells on {name} shows your control has really improved" },
    { ko: "{name} 무게 올리는 거 보면서 '된다 된다' 속으로 외쳤어요. 역시 해내더라고요", en: "I was chanting 'you got this' watching your {name}. And you did" },
    { ko: "{name} {weight}kg 도전한다고 했을 때 같이 긴장했는데, 성공하는 순간 둘 다 웃었죠", en: "When you said you'd go for {weight}kg on {name} I got nervous too. We both smiled when you got it" },
    { ko: "{name} {prev}kg → {weight}kg으로 올린 거 장난 아니에요. 같이 달려온 보람이 있네요", en: "Going from {prev} to {weight}kg on {name} is no joke. All our work together paid off" },
  ],
  kettlebell: [
    { ko: "{name} {weight}kg 리듬 끊기지 않고 끝까지 간 거 보면서 '와 체력 올라왔다' 느꼈어요", en: "Watching you keep rhythm with {weight}kg on {name} till the end — your conditioning is leveling up" },
    { ko: "케틀벨 {weight}kg은 한 번 리듬 깨지면 끝인데, 끝까지 유지한 거 대단해요", en: "With {weight}kg kettlebell one rhythm break and it's over. Holding it together was impressive" },
    { ko: "{name} {weight}kg 갈 때 걱정했는데, 올리는 거 보고 소름 돋았어요", en: "I worried when you went for {weight}kg on {name}. Watching you do it gave me chills" },
    { ko: "{name} {weight}kg 성공하는 순간 저도 심장이 쿵 했어요", en: "My heart jumped the moment you nailed {weight}kg on {name}" },
  ],
  machine: [
    { ko: "{name}에서 마지막에 타는 느낌 참고 끝까지 간 거 다 봤어요. 그게 근육 만드는 순간이에요", en: "I saw you push through the burn on {name} till the end. That's when muscles are built" },
    { ko: "머신이라고 쉬운 게 아니잖아요. {name} {weight}kg에서 고립시키는 거 진짜 힘든 건데", en: "Machines aren't easy. Isolating at {weight}kg on {name} is genuinely tough" },
    { ko: "{name} {weight}kg 터치하는 거 보고 주먹 쥐었어요. 이 맛에 같이 하는 거죠", en: "I clenched my fist when you hit {weight}kg on {name}. This is why we do this together" },
    { ko: "{name} {weight}kg 찍는 거 보고 뿌듯해서 웃음이 나왔어요", en: "Seeing you hit {weight}kg on {name} made me genuinely smile" },
    { ko: "{name} 보면서 '이 사람 진짜 성장하고 있구나' 느꼈어요", en: "Watching your {name} I thought 'this person is genuinely growing'" },
    { ko: "{name} 무게 올리는 거 보면서 '된다 된다' 속으로 외쳤어요. 역시요", en: "I was silently chanting 'you got this' on your {name}. And of course you did" },
  ],
  bodyweight: [
    // 맨몸은 무게PR 거의 없지만, 가중 풀업 등 대비
    { ko: "{name}에 {weight}kg 추가하고 올라가는 거 보고 소름 돋았어요", en: "Watching you go up on {name} with {weight}kg added gave me chills" },
    { ko: "자기 체중에 {weight}kg까지 더해서 해내는 거, 진짜 강해졌어요", en: "Doing {name} with an extra {weight}kg on top of bodyweight — you've gotten seriously strong" },
  ],
  running: [],  // 러닝은 무게PR 해당 없음
  general: [
    { ko: "아 {name} {weight}kg 갈 때 걱정했는데, 올리는 거 보고 소름 돋았어요", en: "I was nervous when you went for {weight}kg on {name}. Watching you lift it gave me chills" },
    { ko: "{name} {weight}kg 성공하는 순간 저도 심장이 쿵 했어요", en: "My heart jumped when you got {weight}kg on {name}" },
    { ko: "{name} {weight}kg 해냈네요. 옆에서 저도 힘줬어요 진짜", en: "You did {weight}kg on {name}. I was pushing with you from the side, for real" },
    { ko: "{prev}kg도 충분했는데 {name} {weight}kg까지 간 거잖아요. 그 욕심이 멋있었어요", en: "{prev}kg was already good but you pushed to {weight}kg on {name}. That hunger is beautiful" },
    { ko: "{name} 무게 보고 '이거 되나?' 했는데 해내는 거 보고 제가 더 흥분했어요", en: "I looked at today's {name} weight and thought 'can we?' Then you did it and I got more hyped" },
    { ko: "{name} 무게 올리는 거 보면서 '된다 된다' 속으로 외쳤어요. 역시 해내더라고요", en: "I was silently chanting 'you got this' watching your {name}. And you did" },
    { ko: "{name} {weight}kg 올리는 거 보면서 저도 느꼈어요. 포기 안 하면 결국 되는구나", en: "Watching you lift {weight}kg on {name} taught me something too. Never giving up works" },
    { ko: "{name} {weight}kg이라니. 처음 생각하면 진짜 많이 왔어요 우리", en: "{weight}kg on {name}. Think about where we started. We've come so far", minHistory: 3 },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 렙수 PR 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const REPS_PR: Record<RepBand | "bodyweight", CoachMessage[]> = {
  bodyweight: [
    { ko: "{name} {current}개까지 간 거 대단해요. 자기 몸을 들어올리는 게 얼마나 힘든 건데", en: "{current} reps on {name} is incredible. Lifting your own bodyweight is no joke" },
    { ko: "매달려서 한 개 더 올라가는 그 순간, 저도 같이 매달린 기분이었어요", en: "That moment pulling up for one more — I felt like I was hanging there with you" },
    { ko: "{name} {prev}개에서 {current}개로 간 거, 맨몸이라 더 대단한 거예요", en: "Going from {prev} to {current} on {name} — even more impressive at bodyweight" },
    { ko: "마지막에 떨리면서 올라가는 거 보고 '와 진짜 간다' 했어요. 끝까지 갔잖아요", en: "Watching you shake on that last rep and still go up — 'wow they're going for it'" },
    { ko: "{name}은 속일 수가 없어요. {current}개 한 건 진짜 {current}개 한 거예요", en: "You can't fake {name}. {current} reps means you actually did {current}" },
    { ko: "자기 체중으로 {current}개 하는 거, 이게 진짜 실전 근력이에요. 멋있었어요", en: "{current} reps at bodyweight — that's real functional strength" },
    { ko: "{name} 마지막에 버티는 거 보면서 '이 사람 진짜 강해졌다' 느꼈어요", en: "Watching you grind through the last reps of {name} — 'they've gotten truly strong'" },
    { ko: "처음에 {prev}개였는데 이제 {current}개잖아요. 같이 온 길이 보여서 뿌듯해요", en: "Started at {prev} and now {current}. I can see how far we've come", minHistory: 2 },
  ],
  low: [ // 1-5 reps: 고중량 저렙
    { ko: "마지막 {diff}개 버틸 때 저도 같이 이 악물었어요. 쉬운 게 아닌 거 아시죠?", en: "I was gritting my teeth with you on those last {diff} reps. You know that's not easy right?" },
    { ko: "{name} {prev}개에서 멈출 줄 알았는데 {current}개까지 갔네요. 그 끈기 멋있어요", en: "Thought you'd stop at {prev} on {name} but you pushed to {current}. Beautiful grit" },
    { ko: "{name} {prev}개 넘어가는 순간 힘들었을 텐데, 거기서 더 간 게 대단해요", en: "It must've been brutal past rep {prev} on {name} but you kept going" },
    { ko: "{name} 마지막에 버티는 거 보면서 저도 긴장해서 숨 참았어요", en: "I was holding my breath watching you grind through those last reps on {name}" },
    { ko: "{diff}개 더 간 건 진짜 의지력이에요. 몸은 멈추라는데 마음이 이긴 거잖아요", en: "Those extra {diff} reps are pure willpower. Your body said stop but your mind won" },
  ],
  mid: [ // 6-12 reps: 중렙
    { ko: "{name} 같은 무게에서 {diff}개 더 간 거 보고 소름 돋았어요. 강해지고 있어요", en: "{diff} more reps on {name} at the same weight gave me chills. You're getting strong" },
    { ko: "마지막에 {diff}개 더 짜낼 때 속으로 '한 개만 더!' 외쳤어요. 해냈잖아요", en: "I was screaming 'one more!' inside during those last {diff}. And you did it" },
    { ko: "{name}에서 같은 무게로 더 가는 건 근성이에요. 오늘 그 근성 보여줬어요", en: "More reps at the same weight on {name} is pure grit. You showed that today" },
    { ko: "{current}개까지 가는 거 보면서 저도 주먹 쥐고 응원했어요. 같이 해서 다행이에요", en: "I was clenching my fists cheering you to {current}. So glad we're in this together" },
    { ko: "마지막 렙 올릴 때 같이 힘줬어요 진짜. 같이 만든 기록이에요 이거", en: "I was pushing with you on that last rep for real. This record is ours" },
    { ko: "{name} {prev}개 → {current}개, 숫자는 작아 보여도 얼마나 어려운 건지 알아요", en: "{name} {prev} → {current} might look small but I know exactly how hard that is" },
    { ko: "렙수 올라가는 거 보면서 뿌듯했어요. 같이 훈련한 보람이 있네요", en: "Watching your reps go up made me genuinely proud. Our training together is paying off" },
  ],
  high: [ // 13+ reps: 고렙
    { ko: "마지막 몇 개 할 때 표정 보면서 '한계인데 가는구나' 느꼈어요. 진짜 대단해요", en: "Watching your face on those last few — 'at the limit but still going'. Incredible" },
    { ko: "그 마지막 {diff}개가 진짜 근육을 키우는 렙이에요. 거기까지 간 거 대단해요", en: "Those last {diff} reps are the ones that actually build muscle. Getting there is incredible" },
    { ko: "옆에서 보면서 '와 아직도 가네?' 했어요. 한계를 넘어가는 걸 봤어요", en: "I was watching like 'wait, still going?' I literally saw you push past your limit" },
    { ko: "{current}개 찍는 순간 저도 고개 끄덕였어요. '이 사람 진짜 성장했다'", en: "When you hit {current} I caught myself nodding. 'This person has truly grown'" },
    { ko: "마지막에 떨리면서도 올린 거 다 봤어요. 그 순간이 진짜 성장하는 순간이에요", en: "I saw every shaky rep at the end. Those moments are when real growth happens" },
    { ko: "{name} 같은 무게에서 더 치는 게 얼마나 힘든지 알아요. 진짜 잘했어요", en: "I know how hard more reps at the same weight is on {name}. You crushed it" },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 전 세트 완벽 수행 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PERFECT_SESSION: CoachMessage[] = [
  { ko: "한 세트도 안 무너지고 끝까지 갔네요. '진짜 되나?' 했는데 해냈잖아요", en: "Not a single set broke down. I kept thinking 'is this happening?' and you did it" },
  { ko: "첫 세트부터 마지막까지 흐트러짐이 없었어요. 같이 하면서 저도 집중했어요", en: "No wavering from first to last. Training with you kept me focused too" },
  { ko: "중간에 힘들었을 텐데 티도 안 내고 끝까지 갔네요. 멋있었어요 진짜", en: "It must've been tough in the middle but you didn't show it. Genuinely cool" },
  { ko: "보면서 '와 이 사람 진짜 달라졌다' 느꼈어요. 한 세트도 안 빠졌잖아요", en: "Watching you I thought 'wow they've really changed'. Not a single set missed" },
  { ko: "100% 해내는 게 얼마나 어려운 건지 아시죠? 오늘 그걸 한 거예요", en: "You know how hard 100% execution is right? That's what you did today" },
  { ko: "마지막 세트까지 같은 집중력으로 간 거 대단해요. 같이 해서 뿌듯하네요", en: "Same focus from first to last set. I'm proud we did this together" },
  { ko: "오늘 처음부터 끝까지 같이 집중했는데, 진짜 좋았어요", en: "We were locked in from start to finish today. It felt really good" },
  { ko: "전 세트 클리어하는 거 보면서 '역시' 했어요. 이 꾸준함이 진짜 실력이에요", en: "Watching you clear every set I thought 'of course'. This consistency is real skill" },
  { ko: "하나도 안 빠지고 다 해냈네요. 쉬워 보여도 이게 제일 어려운 거거든요", en: "Not a single one missed. Looks easy but this is actually the hardest thing" },
  { ko: "운동 끝나고 제가 더 기분 좋아요. 같이 완벽하게 마무리했으니까요", en: "I feel even better than you right now. Because we finished this perfectly together" },
  { ko: "후반 세트 갈 때 걱정했는데 끝까지 가더라고요. 역시 믿을 만해요", en: "I worried going into the later sets but you went all the way. Should've trusted you" },
  { ko: "오늘 같은 날이 있어서 같이 하는 게 즐거워요. 빈틈이 없었어요", en: "Days like today are why training together is a joy. Not a single gap" },
  { ko: "첫 세트 때 '컨디션 좋은데?' 했는데 끝까지 유지하는 건 다른 문제잖아요. 해냈네요", en: "At set one I thought 'good day?' but maintaining it is different. You did it" },
  { ko: "전 세트 끝까지 가는 거, 매번 되는 게 아닌 거 알아요. 오늘 그걸 해낸 거예요", en: "Completing every set isn't a given. The focus you showed today was incredible" },
  { ko: "마지막 세트 들어갈 때 '여기서 무너지나?' 했는데 끝까지 가는 거 보고 감동이었어요", en: "Going into the last set I thought 'will it break?' Watching you finish was moving" },
  { ko: "오늘 같이 운동하면서 딱딱 맞아떨어지는 느낌이었어요. 진짜 좋았어요", en: "Everything clicked during today's session. It felt really great" },
  { ko: "전 세트 끝낸 거 쉬워 보이지만, 저는 그 안에 담긴 노력을 알아요", en: "Finishing every set looks easy but I know the effort behind it" },
  { ko: "보면서 '이게 꾸준함의 힘이구나' 느꼈어요. 같이 해서 다행이에요", en: "Watching you I felt 'so this is the power of consistency'. Glad we're together" },
  { ko: "한 세트도 포기 안 하고 끝까지 간 거, 말로 표현하기 어려운데 멋있었어요", en: "Not giving up on a single set — hard to put into words but genuinely impressive" },
  { ko: "조용히 감탄했어요. 흐트러짐 없이 끝까지 가는 모습이 프로 같았어요", en: "I was quietly amazed. Going to the end without breaking form looked professional" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 기본 (그냥 와서 했을 때) — 시간대별
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VOLUME_DEFAULT: Record<TimeBand, CoachMessage[]> = {
  dawn: [
    { ko: "누가 시킨 것도 아닌데 이 시간에 스스로 온 거잖아요. 그 마음이 대단한 거예요", en: "Nobody made you come at this hour. That decision itself is what makes you great" },
    { ko: "이른 아침에 나온 거 보면서 '꾸준한 사람이 이기는구나' 다시 느꼈어요", en: "Seeing you come out this early reminded me that consistent people always win" },
    { ko: "아침에 일어나서 운동하러 온 거 자체가 승리예요. 같이 해서 좋았어요", en: "Getting up and coming to train this morning is already a win. Glad we were together" },
    { ko: "이 시간에 와서 끝까지 한 거, 이게 진짜 기록이에요. 같이 해서 좋았어요", en: "Coming at this hour and finishing — that's the real record. Glad we did it together" },
  ],
  lunch: [
    { ko: "바쁜 와중에 시간 내서 온 거잖아요. 그 선택이 얼마나 가치 있는 건지", en: "You made time despite being busy. That choice is more valuable than you think" },
    { ko: "쉬는 시간 쪼개서 온 거 저는 알아요. 같이 해서 시간 금방 갔죠?", en: "I know you squeezed this in. Time flies when we train together right?" },
    { ko: "점심시간에 운동 온 거, 그거 아무나 못 해요. 같이 해서 고마워요", en: "Working out at lunch — not everyone can do that. Thanks for being here" },
    { ko: "힘든 중에도 시간 내서 온 거, 그게 진짜 실력이에요. 같이 해서 뿌듯해요", en: "Making time even when it's tough — that's real skill. Proud we did this" },
  ],
  evening: [
    { ko: "솔직히 오늘 안 올 수도 있었잖아요. 근데 왔어요. 그게 제일 어려운 건데", en: "You could've skipped today. But you showed up. That's the hardest part" },
    { ko: "오늘도 빠지지 않고 와줬네요. 저도 기다리고 있었거든요", en: "You didn't miss today. I was waiting for you" },
    { ko: "하루 끝에 운동하러 온 거, 그 의지가 진짜 대단해요. 같이 해서 좋았어요", en: "Coming to train at the end of a long day — that willpower is incredible" },
    { ko: "가끔은 '오늘은 쉴까' 하는 날도 있잖아요. 근데 왔어요. 그게 승리예요", en: "Some days you think 'should I skip?' But you came. That's the win" },
    { ko: "오늘 운동 같이 하면서 좋았어요. 내일 또 봐요 우리", en: "Enjoyed training together today. See you tomorrow" },
  ],
  night: [
    { ko: "이 시간에 운동하러 온 거, 그거 보통 의지가 아니에요. 같이 해서 영광이에요", en: "Training at this hour takes serious willpower. Honored to be here with you" },
    { ko: "남들 쉬는 시간에 온 거잖아요. 묵묵히 하는 거, 그게 진짜 강한 사람이에요", en: "You came when everyone else is resting. Quietly doing the work — that's real strength" },
    { ko: "밤늦게 와서 끝까지 한 거, 저도 같이 해서 힘이 났어요", en: "Coming late and finishing — having you here gave me energy too" },
  ],
  general: [
    { ko: "오늘도 같이 했네요. 꾸준히 가는 사람 옆에 있으면 저도 힘이 나요", en: "Another session together. Being next to someone this consistent gives me energy" },
    { ko: "오늘도 함께해서 고마워요. 이 하루하루가 쌓여서 진짜 변화가 되는 거예요", en: "Thanks for being here today. These days add up to real change" },
    { ko: "오늘 와서 끝까지 한 거, 이게 진짜 기록이에요. 같이 해서 좋았어요", en: "Showing up and finishing today — that's the real record" },
    { ko: "기록 깨는 것보다 매일 오는 게 더 어려운 거 알아요. 오늘도 해냈네요", en: "I know showing up daily is harder than breaking records. You did it again" },
    { ko: "같이 운동하는 게 일상이 된 거잖아요. 이게 얼마나 대단한 건지", en: "Training together became our routine. That's more powerful than you realize" },
    { ko: "오늘도 와줘서 고마워요. 같이 하니까 저도 운동이 더 기다려지거든요", en: "Thanks for coming today. Training with you makes me look forward to it more" },
    { ko: "오늘도 끝났네요. 같이 해서 시간 금방 갔죠? 내일도 기다릴게요", en: "Another one done. Time flies together right? I'll be waiting tomorrow" },
    { ko: "묵묵히 와서 하고 가는 거. 그게 진짜 강한 사람이에요. 같이 해서 영광이에요", en: "Quietly showing up, doing the work, going home. That's real strength. Honored to be with you" },
    { ko: "오늘 운동 같이 하면서 느꼈는데, 확실히 예전보다 여유가 생겼어요 우리", en: "I noticed during today's session — we've gotten more comfortable than before", minHistory: 3 },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 첫 운동 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FIRST_WORKOUT: CoachMessage[] = [
  { ko: "첫 발 같이 뗐네요. 앞으로 제가 옆에 있을게요", en: "We took the first step together. I'll be right here from now on" },
  { ko: "와 드디어 시작했네요! 첫 운동 같이 해서 진짜 기뻐요", en: "You finally started! So happy we did the first one together" },
  { ko: "첫날이 제일 어려운 건데 해냈잖아요. 저도 오늘부터 같이 달릴게요", en: "Day one is the hardest and you did it. I'll be running with you from today" },
  { ko: "오늘 첫 운동 같이 해서 감동이에요. 이 기록이 시작점이 될 거예요", en: "Moved that we did your first workout together. This is your starting point" },
  { ko: "첫 운동 끝! 오늘 오기까지가 제일 힘들었을 거예요. 그걸 해낸 거예요", en: "First workout done! Getting here was the hardest part. And you did it" },
  { ko: "처음이라 낯설었을 텐데 끝까지 잘 따라왔어요. 같이 해서 좋았어요", en: "Must've felt unfamiliar but you followed through. Glad we were together" },
  { ko: "오늘부터 우리 같이 가는 거예요. 첫날 기록은 제가 기억해둘게요", en: "From today we're in this together. I'll remember today's numbers" },
  { ko: "첫 운동 축하해요! 내일은 오늘보다 몸이 뭘 해야 하는지 더 알 거예요", en: "Congrats! Tomorrow your body will know what to do even better" },
  { ko: "시작이 반이라고 하잖아요. 오늘 그 반을 같이 해냈어요", en: "They say starting is half the battle. We just did that half together" },
  { ko: "드디어! 오늘을 기다렸어요. 첫 발 같이 내딛어서 저도 설레네요", en: "Finally! I've been waiting. Taking the first step with you is exciting" },
  { ko: "첫날 긴장했을 텐데 잘 해냈어요. 저도 좀 긴장했어요 사실", en: "You must've been nervous. Honestly I was a bit nervous too" },
  { ko: "오늘 시작한 거, 나중에 돌아보면 진짜 잘했다고 느낄 거예요. 같이 가요", en: "Looking back you'll be glad you started today. Let's keep going" },
  { ko: "첫 운동이라 서툴러도 괜찮아요. 같이 배워가면 돼요", en: "It's okay to be clumsy on day one. We'll learn together" },
  { ko: "첫날인데 끝까지 잘 따라왔어요. 앞으로 같이 가면 더 재밌을 거예요", en: "You followed through on day one. It'll be even more fun going forward together" },
  { ko: "첫 운동 같이 해서 고마워요. 앞으로 매일 옆에서 응원할게요", en: "Thanks for doing your first workout with me. I'll cheer you on every day" },
  { ko: "오늘부터 동료예요 우리. 첫날 기록, 나중에 보면 웃을 거예요", en: "We're partners from today. You'll smile looking back at these numbers" },
  { ko: "첫 발 내딛는 게 가장 용기 있는 순간이에요. 오늘 그걸 해냈어요", en: "The first step is the bravest moment. That's what you did today" },
  { ko: "첫날인데 끝까지 잘 버텼어요. 옆에서 보면서 뿌듯했어요", en: "You hung in there on day one. I was watching with pride" },
  { ko: "이제 시작이에요. 같이 하니까 분명 혼자보다 멀리 갈 수 있을 거예요", en: "This is just the beginning. Together we'll go further than alone" },
  { ko: "첫 운동 끝! 이 느낌 기억해두세요. 나중에 이날이 전환점이에요", en: "First workout done! Remember this feeling. This day is your turning point" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 러닝 전용 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RUNNING: CoachMessage[] = [
  { ko: "중간에 멈추고 싶었을 텐데 끝까지 달렸잖아요. 저도 같이 뛰었어요", en: "You must've wanted to stop but you kept running. I was running with you" },
  { ko: "후반에 페이스 떨어질 줄 알았는데 끝까지 유지하더라고요. 소름이었어요", en: "I expected your pace to drop but you held it. That was something" },
  { ko: "달리는 동안 '그만할까' 하는 순간이 있었을 거예요. 근데 안 멈췄잖아요", en: "There must've been moments you thought 'should I stop'. But you didn't" },
  { ko: "러닝은 결국 자기 자신과의 싸움인데, 오늘 이겼네요. 같이 해서 뿌듯해요", en: "Running is a fight against yourself and you won today. Proud to be here" },
  { ko: "오늘 달리는 거 보면서 '체력 올라왔다' 느꼈어요. 같이 달린 보람이 있네요", en: "Watching you today I felt your stamina improve. Worth running together" },
  { ko: "마지막에 힘들었을 텐데 페이스 안 줄이고 간 거 다 봤어요. 대단해요", en: "I saw you push through without slowing down. Truly impressive" },
  { ko: "오늘 달리면서 저도 숨이 차더라고요. 같이 뛴 느낌이에요 진짜", en: "I was getting out of breath watching you. Really felt like we ran together" },
  { ko: "달리기는 거짓말을 못 하잖아요. 오늘 결과가 그동안의 노력 그 자체예요", en: "Running can't lie. Today's result is your effort speaking for itself" },
  { ko: "한 발 한 발 나가는 거 끝까지 유지하는 건 다른 문제거든요. 해냈잖아요", en: "Each step looks easy but maintaining it is different. You did it" },
  { ko: "오늘 달리는 모습 보면서 '이 사람 러너가 다 됐다' 느꼈어요", en: "Watching you today I thought 'this person has become a real runner'", minHistory: 3 },
  { ko: "러닝이 제일 힘들어요. 숨기가 안 되니까. 근데 끝까지 갔잖아요", en: "Running is the hardest. You can't fake it. But you went all the way" },
  { ko: "같이 뛰면서 좋았어요. 달리고 나면 기분이 다르잖아요. 그 느낌 즐기세요", en: "Loved running together. That post-run feeling is different right? Enjoy it" },
  { ko: "중간에 페이스 흔들렸을 때 '괜찮아 다시 잡아' 속으로 응원했어요. 잡더라고요", en: "When your pace wobbled I was cheering 'get it back'. And you did" },
  { ko: "러닝 끝나고 그 성취감 있잖아요. 오늘 같이 느껴서 좋았어요", en: "That achievement feeling after a run — glad we felt that together" },
  { ko: "머릿속이 복잡했을 수도 있는데, 끝나고 나면 개운하죠. 그게 러닝이에요", en: "Your mind might've been busy but it clears after. That's what running does" },
  { ko: "뛰는 거 보면서 '처음보다 확실히 편해졌다' 느꼈어요. 같이 성장하고 있어요", en: "I noticed you're more comfortable than when we started. We're growing", minHistory: 2 },
  { ko: "러닝은 멈추지 않는 게 전부예요. 오늘 멈추지 않았잖아요", en: "In running not stopping is everything. You didn't stop today" },
  { ko: "마지막에 숨 차는데도 계속 간 거, 옆에서 보면서 진짜 응원했어요", en: "You kept going even gasping at the end. I was cheering so hard" },
  { ko: "같이 뛰니까 혼자 뛸 때보다 더 멀리 가는 느낌이죠? 저도 그래요", en: "Running together feels like going further right? Same here" },
  { ko: "오늘 러닝 끝내고 표정이 좋더라고요. 그 표정 보면서 저도 기분 좋았어요", en: "Your face after today's run looked great. Seeing that made me feel good" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 볼륨 PR 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VOLUME_PR: CoachMessage[] = [
  { ko: "오늘 양이 장난 아니었는데, 끝까지 같이 갔네요", en: "Today's volume was no joke and we went all the way together" },
  { ko: "오늘 볼륨 역대급이었어요. 저도 '언제 끝나나' 했는데 끝까지 가더라고요", en: "Today's volume was insane. Even I wondered 'when will it end' but you kept going" },
  { ko: "이 양을 소화한 거 대단해요. 예전 같으면 중간에 지쳤을 텐데", en: "Handling this volume is incredible. Before you would've faded mid-session", minHistory: 2 },
  { ko: "오늘 총 작업량 보고 저도 놀랐어요. 같이 한 보람이 있네요", en: "I was surprised at today's total volume. Our work together paid off" },
  { ko: "이 정도 양을 소화하는 거 보면 확실히 체력이 올라왔어요", en: "Handling this volume shows your conditioning has clearly improved" },
  { ko: "오늘 진짜 많이 했어요. 끝까지 집중력 잃지 않은 게 더 대단해요", en: "You did so much today. Keeping focus till the end is even more impressive" },
  { ko: "양으로 승부한 날이네요. 힘들었을 텐데 끝까지 같이 간 거 뿌듯해요", en: "A volume day for sure. Must've been tough but going together till the end feels great" },
  { ko: "오늘 총량 보세요. 매 세트 집중한 결과예요", en: "Look at today's total. That's the result of focusing every set" },
  { ko: "솔직히 중간에 '너무 많은 거 아닌가' 했는데 해내더라고요. 역시", en: "I thought 'is this too much?' mid-session. But you did it. Of course" },
  { ko: "볼륨 신기록이에요! 같이 축하해야죠. 오늘 진짜 잘했어요", en: "Volume record! We should celebrate. You really killed it today" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 스트릭 멘트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const STREAK: CoachMessage[] = [
  { ko: "{days}일째 같이 달리고 있네요. 솔직히 저도 뿌듯해요", en: "Day {days} running together. Honestly I'm proud too" },
  { ko: "벌써 {days}일 연속이에요. 이쯤 되면 우리 일상이죠", en: "{days} days straight. At this point it's just our routine" },
  { ko: "{days}일 연속이라니. 같이 달려온 날들이 벌써 이만큼이네요", en: "{days} consecutive days. We've already come this far together" },
  { ko: "아 {days}일째! 매일 올 때마다 반가워요", en: "Day {days}! I'm happy to see you every time" },
  { ko: "{days}일 연속으로 같이 하고 있는 거 알아요? 쉬운 게 아닌데", en: "Did you know we've been at it for {days} days straight? That's not easy" },
  { ko: "매일 오는 게 당연해진 것 같지만, {days}일 연속은 진짜 대단한 거예요", en: "Showing up daily seems normal now but {days} straight is genuinely impressive" },
  { ko: "{days}일째 같이 하고 있네요. 저도 이 기록 깨고 싶지 않아요", en: "Day {days} together. I don't want to break this streak either" },
  { ko: "{days}일! 이 꾸준함 앞에선 어떤 재능도 못 이겨요. 같이 가요", en: "{days} days! No talent beats this consistency. Let's keep going" },
  { ko: "{days}일 연속이면 안 오는 게 더 이상한 거예요. 습관의 힘이에요", en: "At {days} days not coming would be weird. That's the power of habit" },
  { ko: "매일 같이 하는 게 제일 좋아요. 벌써 {days}일째네요 우리", en: "Training together daily is the best. Already day {days} for us" },
  { ko: "{days}일 연속 보면서 '진짜 꾸준하다' 감탄했어요", en: "Looking at {days} straight days I thought 'genuinely consistent'" },
  { ko: "{days}일 연속은 아무나 못 해요. 같이 해서 자랑스러워요", en: "Not everyone can do {days} straight. Proud to be doing this with you" },
  { ko: "{days}일째! 비 오나 눈 오나 같이 하고 있네요. 진짜 실력이에요", en: "Day {days}! Rain or shine we show up. That's real skill" },
  { ko: "또 왔어요! {days}일째 같이 하니까 이제 전우 같아요 진짜", en: "You're here again! Day {days} together — we're like war buddies now" },
  { ko: "{days}일 연속이면 습관을 넘어서 라이프스타일이에요. 같이 만든 거예요", en: "{days} straight is beyond habit — it's a lifestyle. We built this together" },
  { ko: "매일 와주는 거 감사해요. {days}일째 같이 달리는 거 저도 힘이 나요", en: "Thanks for showing up daily. Running day {days} with you gives me energy" },
  { ko: "{days}일 연속... 이 숫자가 얼마나 대단한 건지 나중에 알게 될 거예요", en: "{days} consecutive days... You'll realize how incredible this number is later" },
  { ko: "오늘도 왔어요! {days}일째! 이 기록 같이 이어가요", en: "Here again! Day {days}! Let's keep this record going together" },
  { ko: "{days}일 연속은 의지만으로 안 돼요. 마음이 진짜 원해야 가능한 거예요", en: "{days} straight isn't just willpower. Your heart has to truly want it" },
  { ko: "매일 같이 하면서 느끼는 건데, 확실히 처음과 달라졌어요 우리", en: "Training daily together I notice — we've definitely changed from the start", minHistory: 5 },
];
