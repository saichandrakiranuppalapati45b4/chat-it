import type { Env, RegistrationTransaction } from "../types/index.ts";
import { FirebaseAuthService } from "./firebaseAuthService.ts";

export class OtpService {
  private kv: KVNamespace;
  private doNamespace: DurableObjectNamespace;
  private hashSecret: string;
  private firebaseAuth: FirebaseAuthService;
  private env: Env;

  constructor(env: Env) {
    this.env = env;

    // Fail securely if required bindings are missing (no silent in-memory fallback in production)
    if (!env.OTP_STORE) {
      throw new Error("Critical configuration error: Cloudflare KV binding 'OTP_STORE' is missing.");
    }
    if (!env.RATE_LIMITER_DO) {
      throw new Error("Critical configuration error: Cloudflare Durable Object binding 'RATE_LIMITER_DO' is required for atomic rate limiting.");
    }

    this.kv = env.OTP_STORE;
    this.doNamespace = env.RATE_LIMITER_DO;
    // Server-side pepper for HMAC-SHA-256
    this.hashSecret = env.OTP_HASH_SECRET || "dev-pepper-chat-it-secure-2025-fallback";
    this.firebaseAuth = new FirebaseAuthService(env);
  }

  /**
   * Generates a cryptographically secure 6-digit numeric OTP
   */
  public generateOtp(): string {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = array[0] % 1000000;
    return code.toString().padStart(6, "0");
  }

  /**
   * Generates random 16-byte salt
   */
  public generateSalt(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Computes HMAC-SHA-256 of (OTP + salt + email) using server-side secret pepper
   */
  public async hashOtp(otp: string, salt: string, email: string): Promise<string> {
    const encoder = new TextEncoder();
    const pepperKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(this.hashSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const message = encoder.encode(`${otp.trim()}:${salt}:${email.trim().toLowerCase()}`);
    const signatureBuffer = await crypto.subtle.sign("HMAC", pepperKey, message);
    return Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Computes SHA-256 hash of a verification token for consumed receipt validation
   */
  public async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${token.trim()}:${this.hashSecret}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Constant-time string equality comparison using timing-safe XOR byte checks
   */
  public constantTimeEqual(a: string, b: string): boolean {
    if (typeof a !== "string" || typeof b !== "string") {
      return false;
    }

    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    if (aBytes.length !== bBytes.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
      diff |= aBytes[i] ^ bBytes[i];
    }
    return diff === 0;
  }

  /**
   * Atomically acquires a transaction lock from the Durable Object
   */
  public async acquireLock(key: string, ttlMs = 10000): Promise<boolean> {
    try {
      const id = this.doNamespace.idFromName("global-auth-limiter");
      const stub = this.doNamespace.get(id);
      const res = await stub.fetch("http://limiter/acquire-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, ttlMs }),
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Releases an acquired transaction lock from the Durable Object
   */
  public async releaseLock(key: string): Promise<void> {
    try {
      const id = this.doNamespace.idFromName("global-auth-limiter");
      const stub = this.doNamespace.get(id);
      await stub.fetch("http://limiter/release-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
    } catch {
      // Best-effort release; locks expire automatically via TTL
    }
  }

  /**
   * Atomic rate limit check strictly via Cloudflare Durable Object.
   * Fails closed if the Durable Object is unavailable (never falls back to non-atomic storage).
   */
  public async checkRateLimit(
    key: string,
    maxRequests = 5,
    windowMs = 10 * 60 * 1000
  ): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
    const rateKey = `rate:${key.toLowerCase()}`;

    try {
      const id = this.doNamespace.idFromName("global-auth-limiter");
      const stub = this.doNamespace.get(id);
      const response = await stub.fetch("http://limiter/rate-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: rateKey, maxRequests, windowMs }),
      });

      if (response.ok || response.status === 429) {
        const data = (await response.json()) as {
          allowed: boolean;
          remaining: number;
          resetInSeconds: number;
        };
        return data;
      }

      // Fail closed if Durable Object returned an unexpected error status
      return { allowed: false, remaining: 0, resetInSeconds: 60 };
    } catch (err) {
      // Fail closed if Durable Object is unreachable
      console.error("Durable Object rate limiter failure:", err instanceof Error ? err.message : err);
      return { allowed: false, remaining: 0, resetInSeconds: 60 };
    }
  }

  /**
   * Saves or updates a registration transaction strictly in Cloudflare KV.
   * Fails securely if KV binding is not available.
   */
  public async saveTransaction(tx: RegistrationTransaction): Promise<void> {
    const key = `tx:${tx.id}`;
    // Retain transaction for 15 minutes (900 seconds)
    await this.kv.put(key, JSON.stringify(tx), { expirationTtl: 900 });
    // Secondary lookup by email
    await this.kv.put(`email:${tx.email}`, tx.id, { expirationTtl: 900 });
  }

  /**
   * Retrieves a registration transaction strictly from Cloudflare KV.
   */
  public async getTransaction(transactionId: string): Promise<RegistrationTransaction | null> {
    const key = `tx:${transactionId}`;
    const data = await this.kv.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Creates a new registration transaction with an HMAC-SHA-256 hashed OTP
   */
  public async createRegistration(
    email: string,
    fullName: string
  ): Promise<{ transaction: RegistrationTransaction; plainOtp: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const plainOtp = this.generateOtp();
    const salt = this.generateSalt();
    const otpHash = await this.hashOtp(plainOtp, salt, normalizedEmail);
    const now = Date.now();

    const transaction: RegistrationTransaction = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      fullName: fullName.trim(),
      otpHash,
      salt,
      createdAt: now,
      expiresAt: now + 5 * 60 * 1000, // 5 minutes
      resendCooldownUntil: now + 60 * 1000, // 60 seconds
      attempts: 0,
      totalAttempts: 0,
      verified: false,
      completed: false,
    };

    await this.saveTransaction(transaction);
    return { transaction, plainOtp };
  }

  /**
   * Resends OTP for an existing transaction.
   *
   * Crucial Security Rules:
   * 1. Lifetime totalAttempts is NEVER reset on resend.
   * 2. Invalidate previous OTP by generating a brand new salt & HMAC hash.
   * 3. Enforces 60s cooldown strictly.
   */
  public async resendOtp(
    transactionId: string
  ): Promise<{
    success: boolean;
    plainOtp?: string;
    transaction?: RegistrationTransaction;
    error?: string;
    cooldownRemaining?: number;
  }> {
    const tx = await this.getTransaction(transactionId);
    if (!tx) {
      return { success: false, error: "Registration session not found or expired." };
    }

    if (tx.completed) {
      return { success: false, error: "This registration has already been completed. Please log in." };
    }

    if (tx.verified) {
      return { success: false, error: "This email has already been verified." };
    }

    // Check if lifetime maximum attempts exceeded
    if (tx.totalAttempts >= 5) {
      return {
        success: false,
        error: "Maximum verification attempts exceeded for this session. Please start registration again.",
      };
    }

    const now = Date.now();
    if (now < tx.resendCooldownUntil) {
      const remaining = Math.max(1, Math.ceil((tx.resendCooldownUntil - now) / 1000));
      return {
        success: false,
        error: `Please wait ${remaining} seconds before requesting a new code.`,
        cooldownRemaining: remaining,
      };
    }

    // Generate brand-new OTP and salt (completely invalidates previous OTP)
    const plainOtp = this.generateOtp();
    const salt = this.generateSalt();
    const otpHash = await this.hashOtp(plainOtp, salt, tx.email);

    tx.otpHash = otpHash;
    tx.salt = salt;
    tx.expiresAt = now + 5 * 60 * 1000; // 5 minutes fresh expiration
    tx.resendCooldownUntil = now + 60 * 1000; // 60 seconds cooldown
    tx.attempts = 0; // Reset attempts for this single OTP
    // NOTE: tx.totalAttempts is strictly PRESERVED across the lifetime of the transaction!

    await this.saveTransaction(tx);
    return { success: true, plainOtp, transaction: tx };
  }

  /**
   * Verifies submitted OTP against stored HMAC-SHA-256 hash using constant-time check.
   * Uses Durable Object transaction locking to serialize concurrent attempts.
   */
  public async verifyOtp(
    transactionId: string,
    submittedOtp: string
  ): Promise<{
    success: boolean;
    verificationToken?: string;
    error?: string;
    attemptsRemaining?: number;
  }> {
    const lockKey = `tx-verify:${transactionId}`;
    const acquired = await this.acquireLock(lockKey, 8000);
    if (!acquired) {
      return {
        success: false,
        error: "A verification attempt is currently being processed for this session. Please wait.",
      };
    }

    try {
      const tx = await this.getTransaction(transactionId);
      if (!tx) {
        return {
          success: false,
          error: "Verification session not found or expired. Please sign up again.",
        };
      }

      if (tx.completed) {
        return {
          success: false,
          error: "This registration has already been completed. Please log in.",
        };
      }

      // If already verified, return existing active verification token if valid
      if (tx.verified && tx.verificationToken) {
        if (tx.verificationTokenExpiresAt && Date.now() > tx.verificationTokenExpiresAt) {
          return {
            success: false,
            error: "Verification session expired. Please restart registration.",
          };
        }
        return {
          success: true,
          verificationToken: tx.verificationToken,
        };
      }

      const now = Date.now();
      if (now > tx.expiresAt) {
        return {
          success: false,
          error: "Verification code has expired. Please request a new code.",
        };
      }

      // Check lifetime attempt limits
      if (tx.totalAttempts >= 5) {
        return {
          success: false,
          error: "Maximum verification attempts exceeded. Please restart registration.",
          attemptsRemaining: 0,
        };
      }

      // Compute HMAC-SHA-256 of candidate OTP
      const computedHash = await this.hashOtp(submittedOtp.trim(), tx.salt, tx.email);

      // Constant-time comparison
      const matches = this.constantTimeEqual(computedHash, tx.otpHash);

      if (!matches) {
        tx.attempts += 1;
        tx.totalAttempts += 1;
        await this.saveTransaction(tx);

        const remaining = Math.max(0, 5 - tx.totalAttempts);
        return {
          success: false,
          error:
            remaining > 0
              ? `Invalid verification code. ${remaining} attempt(s) remaining.`
              : "Too many incorrect attempts. Maximum limit reached.",
          attemptsRemaining: remaining,
        };
      }

      // Success! Mark verified and invalidate raw OTP hash so it cannot be reused
      const verificationToken = crypto.randomUUID();
      tx.verified = true;
      tx.verificationToken = verificationToken;
      tx.verificationTokenExpiresAt = now + 10 * 60 * 1000; // 10 minutes to complete registration
      tx.otpHash = ""; // Invalidate OTP hash to prevent replay
      tx.salt = "";

      await this.saveTransaction(tx);

      return {
        success: true,
        verificationToken,
      };
    } finally {
      await this.releaseLock(lockKey);
    }
  }

  /**
   * Completes registration transaction using verified Firebase ID token.
   * Uses Durable Object transaction locking to serialize concurrent completion calls.
   */
  public async completeRegistration(
    transactionId: string,
    verificationToken: string,
    idToken: string
  ): Promise<{ success: boolean; uid?: string; error?: string }> {
    const lockKey = `tx-complete:${transactionId}`;
    const acquired = await this.acquireLock(lockKey, 10000);
    if (!acquired) {
      return {
        success: false,
        error: "Registration completion is already being processed for this session. Please wait.",
      };
    }

    try {
      const tx = await this.getTransaction(transactionId);
      if (!tx) {
        return { success: false, error: "Transaction not found or expired." };
      }

      const candidateTokenHash = await this.hashToken(verificationToken);

      // Check if already completed (idempotent retry check)
      if (tx.completed) {
        // Only allow idempotent completion if caller possessed the exact token that completed this transaction
        if (tx.consumedTokenHash && this.constantTimeEqual(tx.consumedTokenHash, candidateTokenHash)) {
          try {
            const decoded = await this.firebaseAuth.verifyIdToken(idToken);
            if (tx.uid && tx.uid === decoded.uid) {
              return { success: true, uid: tx.uid };
            }
          } catch (err) {
            return {
              success: false,
              error: `Authentication verification failed: ${err instanceof Error ? err.message : "Invalid token"}`,
            };
          }
        }
        return {
          success: false,
          error: "Registration transaction has already been completed and cannot be replayed.",
        };
      }

      if (!tx.verified || !tx.verificationToken) {
        return {
          success: false,
          error: "Email has not been verified yet. Please complete verification first.",
        };
      }

      // Constant-time check on verification token
      if (!this.constantTimeEqual(tx.verificationToken, verificationToken.trim())) {
        return {
          success: false,
          error: "Invalid or expired verification token.",
        };
      }

      // Check verification token expiration
      if (tx.verificationTokenExpiresAt && Date.now() > tx.verificationTokenExpiresAt) {
        return {
          success: false,
          error: "Verification session has expired. Please verify your email again.",
        };
      }

      // Server-side verification of Firebase ID token
      let decodedToken;
      try {
        decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
      } catch (err) {
        return {
          success: false,
          error: `Firebase authentication validation failed: ${err instanceof Error ? err.message : "Invalid ID token"}`,
        };
      }

      // Validate that the Firebase account email strictly matches the verified OTP email
      const tokenEmail = decodedToken.email?.trim().toLowerCase();
      if (!tokenEmail || tokenEmail !== tx.email.toLowerCase()) {
        return {
          success: false,
          error: `Authenticated account email (${tokenEmail || "none"}) does not match the verified registration email (${tx.email}).`,
        };
      }

      const verifiedUid = decodedToken.uid;

      // Optional: Update Firebase native emailVerified: true if service account is configured
      try {
        await this.firebaseAuth.markEmailAsVerifiedInFirebase(verifiedUid, this.env);
      } catch (e) {
        console.warn("Could not natively set emailVerified in Firebase Auth:", e);
      }

      // Mark completed, store consumed receipt hash, invalidate verification token (single-use), and clear sensitive data
      tx.completed = true;
      tx.completedAt = Date.now();
      tx.uid = verifiedUid;
      tx.consumedTokenHash = candidateTokenHash;
      tx.verificationToken = undefined;
      tx.verificationTokenExpiresAt = undefined;
      tx.otpHash = "";
      tx.salt = "";

      await this.saveTransaction(tx);

      return { success: true, uid: verifiedUid };
    } finally {
      await this.releaseLock(lockKey);
    }
  }
}
