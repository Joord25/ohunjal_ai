import { initializePaddle, Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) return paddleInstance;

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const env = (process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox") as "sandbox" | "production";

  if (!token) {
    console.warn("[Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN missing");
    return null;
  }

  const paddle = await initializePaddle({
    environment: env,
    token,
  });

  if (paddle) paddleInstance = paddle;
  return paddle ?? null;
}

export function getPaddleMonthlyPriceId(): string {
  // 가격 실험 종료 (2026-05-06): PADDLE_PRICE_MONTHLY env 가 archived $4.99 Price ID 가리킬 수 있음
  // → PRICE_199 우선 사용 (단일 활성 가격), MONTHLY 는 backup.
  return process.env.NEXT_PUBLIC_PADDLE_PRICE_199 || process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY || "";
}

/**
 * Paddle 결제 활성화 여부. 심사 통과 전에는 false 로 두고 "Coming soon" 노출.
 * 안전한 기본값: unset 이면 비활성. 프로덕션 실수 방지.
 */
export function isPaddleEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PADDLE_ENABLED === "true";
}
