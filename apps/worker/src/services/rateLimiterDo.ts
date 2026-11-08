/**
 * Cloudflare Durable Object for strongly consistent, atomic rate limiting
 * and transaction coordination in Chat-it.
 *
 * All state access within this Durable Object is single-threaded and serialized,
 * preventing race conditions on read-modify-write operations across distributed workers.
 */
export class AuthRateLimiter {
  private state: DurableObjectState;
  private limits: Map<string, { count: number; resetAt: number }>;
  private activeLocks: Map<string, number>; // key -> expiration timestamp (ms)

  constructor(state: DurableObjectState) {
    this.state = state;
    this.limits = new Map();
    this.activeLocks = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. Atomic Rate Limiting
    if (url.pathname === "/rate-limit" && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as {
        key?: string;
        maxRequests?: number;
        windowMs?: number;
      };

      const key = body.key?.toLowerCase() || "unknown";
      const maxRequests = body.maxRequests || 5;
      const windowMs = body.windowMs || 600000; // 10 minutes default
      const now = Date.now();

      let record = this.limits.get(key);
      if (!record || now > record.resetAt) {
        record = { count: 0, resetAt: now + windowMs };
      }

      if (record.count >= maxRequests) {
        const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
        return new Response(
          JSON.stringify({
            allowed: false,
            remaining: 0,
            resetInSeconds,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }

      record.count += 1;
      this.limits.set(key, record);

      const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return new Response(
        JSON.stringify({
          allowed: true,
          remaining: maxRequests - record.count,
          resetInSeconds,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Atomic Transaction Locking (preventing concurrent verification or completion races)
    if (url.pathname === "/acquire-lock" && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { key?: string; ttlMs?: number };
      const key = body.key || "";
      const ttlMs = body.ttlMs || 10000; // 10-second default lock safety timeout
      const now = Date.now();

      const existingLockExpiry = this.activeLocks.get(key);
      if (existingLockExpiry && existingLockExpiry > now) {
        return new Response(JSON.stringify({ acquired: false }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }

      this.activeLocks.set(key, now + ttlMs);
      return new Response(JSON.stringify({ acquired: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/release-lock" && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { key?: string };
      const key = body.key || "";
      this.activeLocks.delete(key);
      return new Response(JSON.stringify({ released: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }
}
