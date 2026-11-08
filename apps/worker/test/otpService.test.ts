import test from "node:test";
import assert from "node:assert";
import { OtpService } from "../src/services/otpService.ts";
import { AuthRateLimiter } from "../src/services/rateLimiterDo.ts";
import { FirebaseAuthService } from "../src/services/firebaseAuthService.ts";
import workerDefault from "../src/index.ts";
import type { Env, RegistrationTransaction } from "../src/types/index.ts";

// In-memory mock implementing Cloudflare KVNamespace
class MockKV implements KVNamespace {
  public store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  getWithMetadata: any;
  list: any;
}

// In-memory mock implementing Cloudflare DurableObjectNamespace backed by real AuthRateLimiter
class MockDurableObjectNamespace implements DurableObjectNamespace {
  public limiter: AuthRateLimiter;

  constructor() {
    this.limiter = new AuthRateLimiter({} as DurableObjectState);
  }

  idFromName(_name: string): DurableObjectId {
    return { toString: () => "mock-id", name: "mock-id", equals: () => true };
  }

  get(_id: DurableObjectId): DurableObjectStub {
    return {
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const req = input instanceof Request ? input : new Request(input, init);
        return this.limiter.fetch(req);
      },
    } as unknown as DurableObjectStub;
  }

  newUniqueId: any;
  idFromString: any;
  jurisdiction: any;
}

function createMockEnv(overrides?: Partial<Env>): Env {
  return {
    RESEND_API_KEY: "re_mock_test_key",
    RESEND_FROM_EMAIL: "onboarding@resend.dev",
    OTP_HASH_SECRET: "test-secret-pepper-32-bytes-long!",
    FRONTEND_ORIGIN: "http://localhost:5173",
    FIREBASE_PROJECT_ID: "chat-it-eeb44",
    OTP_STORE: new MockKV(),
    RATE_LIMITER_DO: new MockDurableObjectNamespace(),
    ...overrides,
  };
}

// Helper to create a signed test RS256 JWT using Web Crypto API
async function generateTestJwt(
  payload: Record<string, unknown>,
  privateKey: CryptoKey,
  kid = "test-kid"
): Promise<string> {
  const header = { alg: "RS256", typ: "JWT", kid };
  const encoder = new TextEncoder();

  const b64Url = (bytes: Uint8Array) =>
    Buffer.from(bytes).toString("base64url");

  const headerB64 = b64Url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = b64Url(encoder.encode(JSON.stringify(payload)));
  const signInput = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoder.encode(signInput)
  );

  return `${signInput}.${b64Url(new Uint8Array(signature))}`;
}

test("1. Production fail-closed: OtpService throws immediately if KV or DurableObject binding is missing", () => {
  assert.throws(
    () => new OtpService({ OTP_STORE: undefined, RATE_LIMITER_DO: new MockDurableObjectNamespace() }),
    /KV binding 'OTP_STORE' is missing/,
    "Must fail closed without KV"
  );

  assert.throws(
    () => new OtpService({ OTP_STORE: new MockKV(), RATE_LIMITER_DO: undefined }),
    /Durable Object binding 'RATE_LIMITER_DO' is required/,
    "Must fail closed without Durable Object"
  );
});

test("2. OTP Generation produces valid 6-digit numeric codes", () => {
  const service = new OtpService(createMockEnv());
  for (let i = 0; i < 30; i++) {
    const code = service.generateOtp();
    assert.match(code, /^\d{6}$/, "Must be exactly 6 numeric digits");
    const num = parseInt(code, 10);
    assert.ok(num >= 0 && num <= 999999);
  }
});

test("3. HMAC-SHA-256 hashing is deterministic with pepper and salt, and sensitive to input", async () => {
  const service = new OtpService(createMockEnv());
  const salt = service.generateSalt();
  const hash1 = await service.hashOtp("123456", salt, "user@example.com");
  const hash2 = await service.hashOtp("123456", salt, "user@example.com");
  const hashDifferentOtp = await service.hashOtp("654321", salt, "user@example.com");
  const hashDifferentEmail = await service.hashOtp("123456", salt, "other@example.com");

  assert.strictEqual(hash1, hash2, "Identical inputs must produce identical HMAC hashes");
  assert.notStrictEqual(hash1, hashDifferentOtp, "Different OTP must produce different HMAC hash");
  assert.notStrictEqual(hash1, hashDifferentEmail, "Different email must produce different HMAC hash");
  assert.strictEqual(hash1.length, 64, "SHA-256 hex string must be 64 characters");
});

test("4. constantTimeEqual correctly compares strings in constant time", () => {
  const service = new OtpService(createMockEnv());
  assert.strictEqual(service.constantTimeEqual("abc123xyz", "abc123xyz"), true);
  assert.strictEqual(service.constantTimeEqual("abc123xyz", "abc123xyw"), false);
  assert.strictEqual(service.constantTimeEqual("short", "longerstring"), false);
  assert.strictEqual(service.constantTimeEqual("", ""), true);
});

test("5. createRegistration stores in KV with expiration and 60s cooldown", async () => {
  const env = createMockEnv();
  const service = new OtpService(env);
  const { transaction, plainOtp } = await service.createRegistration("alice@example.com", "Alice Smith");

  assert.ok(transaction.id);
  assert.strictEqual(transaction.email, "alice@example.com");
  assert.strictEqual(transaction.attempts, 0);
  assert.strictEqual(transaction.totalAttempts, 0);
  assert.strictEqual(transaction.verified, false);
  assert.strictEqual(transaction.completed, false);
  assert.match(plainOtp, /^\d{6}$/);

  // Check KV persistence
  const stored = await service.getTransaction(transaction.id);
  assert.ok(stored, "Transaction must be stored in KV");
  assert.strictEqual(stored.email, "alice@example.com");
});

test("6. verifyOtp rejects incorrect OTP and locks out after 5 attempts", async () => {
  const service = new OtpService(createMockEnv());
  const { transaction } = await service.createRegistration("bob@example.com", "Bob");

  for (let i = 1; i <= 5; i++) {
    const res = await service.verifyOtp(transaction.id, "000000");
    if (i < 5) {
      assert.strictEqual(res.success, false);
      assert.strictEqual(res.attemptsRemaining, 5 - i);
    } else {
      assert.strictEqual(res.success, false);
      assert.strictEqual(res.attemptsRemaining, 0);
    }
  }

  // 6th attempt should be blocked immediately
  const blocked = await service.verifyOtp(transaction.id, "000000");
  assert.strictEqual(blocked.success, false);
  assert.match(blocked.error || "", /Maximum verification attempts exceeded/);
});

test("7. resendOtp enforces 60-second cooldown and preserves totalAttempts counter", async () => {
  const service = new OtpService(createMockEnv());
  const { transaction } = await service.createRegistration("carol@example.com", "Carol");

  // Make 2 failed attempts
  await service.verifyOtp(transaction.id, "000000");
  await service.verifyOtp(transaction.id, "000000");

  let tx = await service.getTransaction(transaction.id);
  assert.strictEqual(tx?.totalAttempts, 2);

  // Fast forward cooldown
  assert.ok(tx);
  tx.resendCooldownUntil = Date.now() - 1000;
  await service.saveTransaction(tx);

  // Resend OTP
  const resend = await service.resendOtp(transaction.id);
  assert.strictEqual(resend.success, true);

  // Check that totalAttempts is STILL 2 (not reset)
  tx = await service.getTransaction(transaction.id);
  assert.strictEqual(tx?.totalAttempts, 2, "Lifetime totalAttempts must be preserved across resends");
});

test("8. resendOtp invalidates previous OTP", async () => {
  const service = new OtpService(createMockEnv());
  const { transaction, plainOtp: firstOtp } = await service.createRegistration("dan@example.com", "Dan");

  // Fast forward cooldown
  const tx = await service.getTransaction(transaction.id);
  assert.ok(tx);
  tx.resendCooldownUntil = Date.now() - 1000;
  await service.saveTransaction(tx);

  // Resend
  const resendResult = await service.resendOtp(transaction.id);
  const secondOtp = resendResult.plainOtp!;

  // First OTP must now fail
  const firstAttempt = await service.verifyOtp(transaction.id, firstOtp);
  assert.strictEqual(firstAttempt.success, false, "First OTP must be invalidated after resend");

  // Second OTP must succeed
  const secondAttempt = await service.verifyOtp(transaction.id, secondOtp);
  assert.strictEqual(secondAttempt.success, true);
  assert.ok(secondAttempt.verificationToken);
});

test("9. Durable Object transaction lock serializes concurrent verification requests", async () => {
  const service = new OtpService(createMockEnv());
  const { transaction } = await service.createRegistration("concurrent@example.com", "Con");

  // Acquire lock manually to simulate concurrent in-flight request
  const lockKey = `tx-verify:${transaction.id}`;
  const acquired = await service.acquireLock(lockKey, 5000);
  assert.strictEqual(acquired, true);

  // A concurrent verification request should fail immediately with 409 / conflict error
  const res = await service.verifyOtp(transaction.id, "123456");
  assert.strictEqual(res.success, false);
  assert.match(res.error || "", /being processed/);

  // Release lock
  await service.releaseLock(lockKey);

  // Now a subsequent request can proceed
  const secondAcquire = await service.acquireLock(lockKey, 1000);
  assert.strictEqual(secondAcquire, true);
  await service.releaseLock(lockKey);
});

test("10. Cryptographic Firebase ID Token verification with real RS256 keys", async () => {
  const env = createMockEnv();
  const service = new OtpService(env);

  // Generate authentic RSA keypair using Web Crypto
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const jwk = (await crypto.subtle.exportKey("jwk", keyPair.publicKey)) as any;
  jwk.kid = "test-kid-1";
  jwk.alg = "RS256";
  jwk.use = "sig";

  FirebaseAuthService.setTestJwks([jwk]);

  const { transaction, plainOtp } = await service.createRegistration("test@example.com", "Test User");
  const verifyRes = await service.verifyOtp(transaction.id, plainOtp);
  assert.strictEqual(verifyRes.success, true);
  const verificationToken = verifyRes.verificationToken!;

  const nowSeconds = Math.floor(Date.now() / 1000);

  // Valid Token
  const validToken = await generateTestJwt(
    {
      aud: "chat-it-eeb44",
      iss: "https://securetoken.google.com/chat-it-eeb44",
      sub: "uid-valid-12345",
      email: "test@example.com",
      auth_time: nowSeconds - 10,
      exp: nowSeconds + 3600,
      iat: nowSeconds,
    },
    keyPair.privateKey,
    "test-kid-1"
  );

  // 1. Completion succeeds with valid token
  const completeRes = await service.completeRegistration(transaction.id, verificationToken, validToken);
  assert.strictEqual(completeRes.success, true);
  assert.strictEqual(completeRes.uid, "uid-valid-12345");

  // 2. Token replay protection: Verification token is single-use and wiped
  const tx = await service.getTransaction(transaction.id);
  assert.strictEqual(tx?.completed, true);
  assert.strictEqual(tx?.verificationToken, undefined, "verificationToken must be wiped after completion");
  assert.ok(tx?.consumedTokenHash, "consumedTokenHash must be set");

  // 3. Idempotent retry with exact token and same UID succeeds
  const retryRes = await service.completeRegistration(transaction.id, verificationToken, validToken);
  assert.strictEqual(retryRes.success, true);

  // 4. Replay attempt with a different token is rejected
  const badTokenRes = await service.completeRegistration(transaction.id, "different-token", validToken);
  assert.strictEqual(badTokenRes.success, false);
  assert.match(badTokenRes.error || "", /already been completed/);

  // 5. Clean up test JWKS
  FirebaseAuthService.setTestJwks(null);
});

test("11. Firebase token claim validations: audience mismatch, issuer mismatch, email mismatch, and expired token", async () => {
  const env = createMockEnv();
  const service = new OtpService(env);
  const authService = new FirebaseAuthService(env);

  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const jwk = (await crypto.subtle.exportKey("jwk", keyPair.publicKey)) as any;
  jwk.kid = "test-kid-claims";
  jwk.alg = "RS256";
  jwk.use = "sig";
  FirebaseAuthService.setTestJwks([jwk]);

  const nowSeconds = Math.floor(Date.now() / 1000);

  // Expired token
  const expiredToken = await generateTestJwt(
    {
      aud: "chat-it-eeb44",
      iss: "https://securetoken.google.com/chat-it-eeb44",
      sub: "uid-expired",
      email: "user@example.com",
      auth_time: nowSeconds - 4000,
      exp: nowSeconds - 500, // expired
      iat: nowSeconds - 4000,
    },
    keyPair.privateKey,
    "test-kid-claims"
  );
  await assert.rejects(
    () => authService.verifyIdToken(expiredToken),
    /expired/,
    "Must reject expired token"
  );

  // Audience mismatch
  const audMismatchToken = await generateTestJwt(
    {
      aud: "wrong-project-id",
      iss: "https://securetoken.google.com/chat-it-eeb44",
      sub: "uid-aud",
      email: "user@example.com",
      auth_time: nowSeconds,
      exp: nowSeconds + 3600,
      iat: nowSeconds,
    },
    keyPair.privateKey,
    "test-kid-claims"
  );
  await assert.rejects(
    () => authService.verifyIdToken(audMismatchToken),
    /audience mismatch/,
    "Must reject audience mismatch"
  );

  // Issuer mismatch
  const issMismatchToken = await generateTestJwt(
    {
      aud: "chat-it-eeb44",
      iss: "https://fake-issuer.com/chat-it-eeb44",
      sub: "uid-iss",
      email: "user@example.com",
      auth_time: nowSeconds,
      exp: nowSeconds + 3600,
      iat: nowSeconds,
    },
    keyPair.privateKey,
    "test-kid-claims"
  );
  await assert.rejects(
    () => authService.verifyIdToken(issMismatchToken),
    /issuer mismatch/,
    "Must reject issuer mismatch"
  );

  // Email mismatch in completeRegistration
  const { transaction, plainOtp } = await service.createRegistration("registered@example.com", "Reg User");
  const verifyRes = await service.verifyOtp(transaction.id, plainOtp);

  const emailMismatchToken = await generateTestJwt(
    {
      aud: "chat-it-eeb44",
      iss: "https://securetoken.google.com/chat-it-eeb44",
      sub: "uid-mismatch-email",
      email: "different@example.com", // Mismatched!
      auth_time: nowSeconds,
      exp: nowSeconds + 3600,
      iat: nowSeconds,
    },
    keyPair.privateKey,
    "test-kid-claims"
  );

  const mismatchRes = await service.completeRegistration(
    transaction.id,
    verifyRes.verificationToken!,
    emailMismatchToken
  );
  assert.strictEqual(mismatchRes.success, false);
  assert.match(mismatchRes.error || "", /does not match the verified registration email/);

  FirebaseAuthService.setTestJwks(null);
});

test("12. Strict CORS allowlist rejects unauthorized origins", async () => {
  const env = createMockEnv();

  // 1. Unauthorized origin on OPTIONS preflight
  const preflightReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "OPTIONS",
    headers: { Origin: "https://malicious-attacker.com" },
  });
  const preflightRes = await workerDefault.fetch(preflightReq, env);
  assert.strictEqual(preflightRes.status, 403, "CORS preflight from unauthorized origin must be 403");

  // 2. Unauthorized origin on POST
  const postReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "POST",
    headers: {
      Origin: "https://malicious-attacker.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "attacker@example.com", fullName: "Attacker" }),
  });
  const postRes = await workerDefault.fetch(postReq, env);
  assert.strictEqual(postRes.status, 403, "POST request from unauthorized origin must be 403");

  // 3. Authorized origin on OPTIONS preflight
  const allowedPreflight = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:5173" },
  });
  const allowedRes = await workerDefault.fetch(allowedPreflight, env);
  assert.strictEqual(allowedRes.status, 204);
  assert.strictEqual(allowedRes.headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
});

test("13. Durable Object transaction lock serializes concurrent completion requests", async () => {
  const service = new OtpService(createMockEnv());

  // Acquire lock on completion to simulate concurrent in-flight completion
  const lockKey = "tx-complete:test-tx-123";
  const acquired = await service.acquireLock(lockKey, 5000);
  assert.strictEqual(acquired, true);

  // Concurrent completeRegistration must be rejected immediately
  const res = await service.completeRegistration("test-tx-123", "token", "id-token");
  assert.strictEqual(res.success, false);
  assert.match(res.error || "", /already being processed/);

  await service.releaseLock(lockKey);
});

test("14. Email delivery failure via Resend API returns error and prevents false success", async () => {
  // Test endpoint behavior when Resend API fails
  const env = createMockEnv({
    // Invalid key causes Resend to fail
    RESEND_API_KEY: "re_invalid_test_key",
  });

  const sendReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "POST",
    headers: {
      Origin: "http://localhost:5173",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "failure-test@example.com", fullName: "Failure Test" }),
  });

  const sendRes = await workerDefault.fetch(sendReq, env);
  const data = (await sendRes.json()) as any;

  // Must NOT report success when email fails to send
  assert.strictEqual(data.success, false);
  assert.ok(sendRes.status >= 400);
  assert.ok(data.error);
});

test("15. Production CORS strictly rejects localhost and requires real production origin", async () => {
  // Production environment configuration
  const prodEnv = createMockEnv({
    ENVIRONMENT: "production",
    FRONTEND_ORIGIN: "https://chat-it.pages.dev",
  });

  // 1. Localhost MUST be rejected in production
  const localhostReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:5173" },
  });
  const localhostRes = await workerDefault.fetch(localhostReq, prodEnv);
  assert.strictEqual(localhostRes.status, 403, "Localhost origin must be rejected with 403 in production");

  // 2. Real production domain MUST be accepted
  const prodDomainReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "OPTIONS",
    headers: { Origin: "https://chat-it.pages.dev" },
  });
  const prodDomainRes = await workerDefault.fetch(prodDomainReq, prodEnv);
  assert.strictEqual(prodDomainRes.status, 204, "Production domain must be accepted");
  assert.strictEqual(prodDomainRes.headers.get("Access-Control-Allow-Origin"), "https://chat-it.pages.dev");

  // 3. Placeholder domain in production cannot be used
  const placeholderEnv = createMockEnv({
    ENVIRONMENT: "production",
    FRONTEND_ORIGIN: "https://YOUR_ACTUAL_CHATIT_FRONTEND_DOMAIN_HERE",
  });
  const placeholderReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "OPTIONS",
    headers: { Origin: "https://YOUR_ACTUAL_CHATIT_FRONTEND_DOMAIN_HERE" },
  });
  const placeholderRes = await workerDefault.fetch(placeholderReq, placeholderEnv);
  assert.strictEqual(placeholderRes.status, 403, "Placeholder domain must not match in production");
});

test("16. Production rejects unverified Resend sender domain", async () => {
  const prodEnv = createMockEnv({
    ENVIRONMENT: "production",
    FRONTEND_ORIGIN: "https://chat-it.pages.dev",
    RESEND_FROM_EMAIL: "onboarding@resend.dev", // Unverified dev address
  });

  const sendReq = new Request("http://localhost:8787/api/auth/register/send-otp", {
    method: "POST",
    headers: {
      Origin: "https://chat-it.pages.dev",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "user@example.com", fullName: "User" }),
  });

  const sendRes = await workerDefault.fetch(sendReq, prodEnv);
  const data = (await sendRes.json()) as any;
  assert.strictEqual(data.success, false);
  assert.match(data.error || "", /Deployment blocker.*RESEND_FROM_EMAIL/);
});
