import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp();
export const db = getFirestore(app);

// 부트스트랩용 하드코딩 UID (최초 어드민) — Firestore admins 컬렉션 비어있을 때 fallback
const BOOTSTRAP_ADMIN_UIDS = ["jDkXqeAFCMgJj8cFbRZITpokS2H2"];

export async function verifyAuth(authHeader: string | undefined): Promise<string> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const idToken = authHeader.split("Bearer ")[1];
  const decoded = await getAuth().verifyIdToken(idToken);
  return decoded.uid;
}

/**
 * 회의 57 Tier 3: Admin 권한 체크를 Firestore로 이관
 * - 1순위: Firestore `admins/{uid}` 문서 존재 여부
 * - 2순위: BOOTSTRAP_ADMIN_UIDS 하드코딩 fallback (최초 어드민 보호)
 * - 추가 어드민은 재배포 없이 Firestore에 문서만 생성하면 됨
 */
export async function verifyAdmin(authHeader: string | undefined): Promise<string> {
  const uid = await verifyAuth(authHeader);

  // 1. Firestore admins 컬렉션 체크
  try {
    const adminDoc = await db.collection("admins").doc(uid).get();
    if (adminDoc.exists) return uid;
  } catch { /* Firestore 오류 시 부트스트랩으로 진행 */ }

  // 2. 부트스트랩 UID fallback
  if (BOOTSTRAP_ADMIN_UIDS.includes(uid)) return uid;

  throw new Error("Forbidden: not an admin");
}
