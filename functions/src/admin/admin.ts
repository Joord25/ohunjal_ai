import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdmin, db } from "../helpers";

/**
 * POST /adminActivate
 * Body: { email, months? }
 * Admin only: 이메일로 유저 찾아서 구독 활성화
 */
export const adminActivate = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    let adminUid: string;
    try { adminUid = await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    const { email, months = 1 } = req.body;
    if (!email) { res.status(400).json({ error: "Missing email" }); return; }

    try {
      // 이메일로 유저 UID 조회
      const userRecord = await getAuth().getUserByEmail(email);
      const uid = userRecord.uid;

      // 구독 활성화
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + months);

      const subRef = db.collection("subscriptions").doc(uid);
      const existingDoc = await subRef.get();

      if (existingDoc.exists) {
        await subRef.update({
          status: "active",
          plan: "monthly",
          amount: 0,
          billingKey: "manual_admin",
          lastPaymentAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await subRef.set({
          uid,
          status: "active",
          plan: "monthly",
          amount: 0,
          billingKey: "manual_admin",
          lastPaymentAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      // 관리자 로그 기록
      await db.collection("admin_logs").add({
        action: "activate",
        adminUid,
        targetEmail: email,
        targetUid: uid,
        months,
        expiresAt: expiresAt.toISOString(),
        timestamp: FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        status: "activated",
        email,
        uid,
        months,
        expiresAt: expiresAt.toISOString(),
      });
    } catch (error: unknown) {
      console.error("adminActivate error:", error);
      const msg = error instanceof Error && error.message.includes("no user record")
        ? "해당 이메일의 유저를 찾을 수 없습니다."
        : "구독 활성화에 실패했습니다.";
      res.status(error instanceof Error && error.message.includes("no user record") ? 404 : 500).json({ error: msg });
    }
  }
);

/**
 * POST /adminCheckUser
 * Body: { email }
 * Admin only: 유저 구독 상태 조회
 */
export const adminCheckUser = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    try { await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    const { email } = req.body;
    if (!email) { res.status(400).json({ error: "Missing email" }); return; }

    try {
      const userRecord = await getAuth().getUserByEmail(email);
      const uid = userRecord.uid;
      const doc = await db.collection("subscriptions").doc(uid).get();

      if (!doc.exists) {
        res.status(200).json({ email, uid, status: "free", displayName: userRecord.displayName || null });
        return;
      }

      const data = doc.data()!;
      res.status(200).json({
        email,
        uid,
        displayName: userRecord.displayName || null,
        status: data.status,
        plan: data.plan || null,
        expiresAt: data.expiresAt || null,
        lastPaymentAt: data.lastPaymentAt || null,
        amount: data.amount || null,
        billingKey: data.billingKey === "manual_admin" ? "수동 활성화" : "카카오페이",
      });
    } catch (error: unknown) {
      console.error("adminCheckUser error:", error);
      const msg = error instanceof Error && error.message.includes("no user record")
        ? "해당 이메일의 유저를 찾을 수 없습니다."
        : "조회에 실패했습니다.";
      res.status(error instanceof Error && error.message.includes("no user record") ? 404 : 500).json({ error: msg });
    }
  }
);

/**
 * POST /adminDeactivate
 * Body: { email }
 * Admin only: 유저 구독 비활성화 (free로 전환)
 */
export const adminDeactivate = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    let adminUid: string;
    try { adminUid = await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    const { email } = req.body;
    if (!email) { res.status(400).json({ error: "Missing email" }); return; }

    try {
      const userRecord = await getAuth().getUserByEmail(email);
      const uid = userRecord.uid;

      const subRef = db.collection("subscriptions").doc(uid);
      const doc = await subRef.get();

      if (!doc.exists || doc.data()?.status === "free") {
        res.status(400).json({ error: "이미 무료 상태입니다." });
        return;
      }

      await subRef.update({
        status: "free",
        billingKey: "",
        expiresAt: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      await db.collection("admin_logs").add({
        action: "deactivate",
        adminUid,
        targetEmail: email,
        targetUid: uid,
        timestamp: FieldValue.serverTimestamp(),
      });

      res.status(200).json({ status: "deactivated", email, uid });
    } catch (error: unknown) {
      console.error("adminDeactivate error:", error);
      const msg = error instanceof Error && error.message.includes("no user record")
        ? "해당 이메일의 유저를 찾을 수 없습니다."
        : "비활성화에 실패했습니다.";
      res.status(error instanceof Error && error.message.includes("no user record") ? 404 : 500).json({ error: msg });
    }
  }
);

/**
 * POST /adminDashboard
 * Admin only: 통계 대시보드 (총유저, 구독자, 무료, 만료임박, 매출)
 */
export const adminDashboard = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    try {
      const subsSnap = await db.collection("subscriptions").get();
      let active = 0, cancelled = 0, expired = 0, expiringIn3Days = 0, monthlyRevenue = 0;
      const now = new Date();
      const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      subsSnap.forEach(doc => {
        const d = doc.data();
        if (d.status === "active") {
          active++;
          if (d.expiresAt) {
            const exp = new Date(d.expiresAt);
            if (exp <= threeDaysLater && exp > now) expiringIn3Days++;
          }
          if (d.lastPaymentAt && new Date(d.lastPaymentAt) >= monthStart && d.amount > 0) {
            monthlyRevenue += d.amount;
          }
        } else if (d.status === "cancelled") { cancelled++; }
        else if (d.status === "expired") { expired++; }
      });

      // Total registered users from Firebase Auth
      const listResult = await getAuth().listUsers(1);
      const totalUsers = listResult.users.length > 0 ? (await getAuth().listUsers(1000)).users.length : 0;

      res.status(200).json({
        totalUsers,
        active,
        free: totalUsers - active - cancelled - expired,
        cancelled,
        expired,
        expiringIn3Days,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("adminDashboard error:", error);
      res.status(500).json({ error: "대시보드 조회 실패" });
    }
  }
);

/**
 * POST /adminListUsers
 * Body: { status?, page?, limit? }
 * Admin only: 구독자 목록 (필터 + 페이지네이션)
 */
export const adminListUsers = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    const { status, page = 1, limit = 20 } = req.body;

    try {
      let query: FirebaseFirestore.Query = db.collection("subscriptions").orderBy("updatedAt", "desc");
      if (status && status !== "all") {
        query = query.where("status", "==", status);
      }

      const allDocs = await query.get();
      const total = allDocs.size;
      const startIdx = (page - 1) * limit;
      const pageDocs = allDocs.docs.slice(startIdx, startIdx + limit);

      const users = await Promise.all(pageDocs.map(async (doc) => {
        const d = doc.data();
        let email = "", displayName = "";
        try {
          const userRecord = await getAuth().getUser(doc.id);
          email = userRecord.email || "";
          displayName = userRecord.displayName || "";
        } catch { email = doc.id; }

        return {
          uid: doc.id,
          email,
          displayName,
          status: d.status || "free",
          expiresAt: d.expiresAt || null,
          lastPaymentAt: d.lastPaymentAt || null,
          amount: d.amount || 0,
          billingKey: d.billingKey === "manual_admin" ? "수동" : d.billingKey ? "카카오페이" : "-",
        };
      }));

      res.status(200).json({ users, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) {
      console.error("adminListUsers error:", error);
      res.status(500).json({ error: "유저 목록 조회 실패" });
    }
  }
);

/**
 * POST /adminLogs
 * Admin only: 최근 활성화 이력 조회
 */
export const adminLogs = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    try { await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    try {
      const snapshot = await db.collection("admin_logs")
        .orderBy("timestamp", "desc")
        .limit(20)
        .get();

      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          action: data.action,
          targetEmail: data.targetEmail,
          months: data.months,
          expiresAt: data.expiresAt,
          timestamp: data.timestamp?.toDate?.().toISOString() || null,
        };
      });

      res.status(200).json({ logs });
    } catch (error) {
      console.error("adminLogs error:", error);
      res.status(500).json({ error: "이력 조회에 실패했습니다." });
    }
  }
);
