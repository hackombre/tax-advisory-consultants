export async function sendSecurityAlert(ip: string, attempts: number): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!apiUrl || !secret) return; // not configured — skip silently, never block login flow

  try {
    await fetch(`${apiUrl}/api/security-alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": secret,
      },
      body: JSON.stringify({ ip, attempts }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Best-effort only — a failed alert must never block the lockout itself.
  }
}
