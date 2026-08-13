import { cookies } from "next/headers";

export const SESSION_COOKIE = "tac_admin_session";
export const SESSION_VALUE = "tac-admin-authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}
