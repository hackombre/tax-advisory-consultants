import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "login-attempts.json");

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;

interface AttemptRecord {
  count: number;
  lockedUntil?: number;
}

type Store = Record<string, AttemptRecord>;

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}", "utf-8");
}

function read(): Store {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function write(store: Store) {
  fs.writeFileSync(FILE, JSON.stringify(store, null, 2), "utf-8");
}

export interface LockStatus {
  locked: boolean;
  retryAfterSeconds?: number;
}

export function checkLock(key: string): LockStatus {
  const store = read();
  const record = store[key];
  if (record?.lockedUntil && record.lockedUntil > Date.now()) {
    return { locked: true, retryAfterSeconds: Math.ceil((record.lockedUntil - Date.now()) / 1000) };
  }
  return { locked: false };
}

/**
 * Registers a failed attempt. Returns whether this attempt triggered a brand-new
 * lockout (so the caller can decide to send a single alert email) plus the
 * current lock status.
 */
export function registerFailedAttempt(key: string): {
  justLocked: boolean;
  attempts: number;
  lock: LockStatus;
} {
  const store = read();
  const existing = store[key];

  if (existing?.lockedUntil && existing.lockedUntil > Date.now()) {
    return {
      justLocked: false,
      attempts: existing.count,
      lock: { locked: true, retryAfterSeconds: Math.ceil((existing.lockedUntil - Date.now()) / 1000) },
    };
  }

  const count = existing?.lockedUntil ? 1 : (existing?.count ?? 0) + 1;
  let justLocked = false;
  const record: AttemptRecord = { count };

  if (count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS;
    justLocked = true;
  }

  store[key] = record;
  write(store);

  return {
    justLocked,
    attempts: count,
    lock: record.lockedUntil
      ? { locked: true, retryAfterSeconds: Math.ceil(LOCK_DURATION_MS / 1000) }
      : { locked: false },
  };
}

export function resetAttempts(key: string): void {
  const store = read();
  if (store[key]) {
    delete store[key];
    write(store);
  }
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export { MAX_ATTEMPTS };
