export interface FitnessProfile {
  gender: "male" | "female";
  birthYear: number;
  height: number;                // cm
  bodyWeight: number;
  weeklyFrequency: number;       // 주 몇 회
  sessionMinutes: number;        // 1회 운동 시간(분)
  goal: "fat_loss" | "muscle_gain" | "endurance" | "health";
  bench1RM?: number;             // 상급자 선택 입력
  squat1RM?: number;
  deadlift1RM?: number;
}
