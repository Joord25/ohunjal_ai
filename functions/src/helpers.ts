import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp();
export const db = getFirestore(app);

// Admin UID whitelist
const ADMIN_UIDS = ["jDkXqeAFCMgJj8cFbRZITpokS2H2"];

export async function verifyAuth(authHeader: string | undefined): Promise<string> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const idToken = authHeader.split("Bearer ")[1];
  const decoded = await getAuth().verifyIdToken(idToken);
  return decoded.uid;
}

export async function verifyAdmin(authHeader: string | undefined): Promise<string> {
  const uid = await verifyAuth(authHeader);
  if (!ADMIN_UIDS.includes(uid)) {
    throw new Error("Forbidden: not an admin");
  }
  return uid;
}
