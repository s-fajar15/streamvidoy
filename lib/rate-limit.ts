type RateLimitRecord = {
  count: number;
  lastReset: number;
};

const rateLimits = new Map<string, RateLimitRecord>();

export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > windowMs) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function cleanupRateLimits(windowMs: number) {
  const now = Date.now();
  for (const [ip, record] of rateLimits.entries()) {
    if (now - record.lastReset > windowMs) {
      rateLimits.delete(ip);
    }
  }
}
