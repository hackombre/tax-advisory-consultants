import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth";
import { checkLock, getClientKey, registerFailedAttempt, resetAttempts } from "@/lib/rateLimit";
import { sendSecurityAlert } from "@/lib/securityAlert";

export async function POST(req: NextRequest) {
  const key = getClientKey(req);

  const lock = checkLock(key);
  if (lock.locked) {
    return NextResponse.json(
      {
        success: false,
        locked: true,
        retryAfterSeconds: lock.retryAfterSeconds,
        message: `Trop de tentatives. Réessayez dans ${Math.ceil((lock.retryAfterSeconds ?? 0) / 60)} min.`,
      },
      { status: 429 }
    );
  }

  let username = "";
  let password = "";

  try {
    const body = await req.json();
    username = body.username ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ success: false, message: "Requête invalide." }, { status: 400 });
  }

  if (username === "user" && password === "user") {
    resetAttempts(key);
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  }

  const result = registerFailedAttempt(key);

  if (result.justLocked) {
    void sendSecurityAlert(key, result.attempts);
    return NextResponse.json(
      {
        success: false,
        locked: true,
        retryAfterSeconds: result.lock.retryAfterSeconds,
        message: "Trop de tentatives. Accès bloqué pendant 5 minutes.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Identifiants incorrects.",
      attemptsRemaining: Math.max(0, 5 - result.attempts),
    },
    { status: 401 }
  );
}
