import type {
  Env,
  SendOtpRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  CompleteRegistrationRequest,
} from "./types/index.ts";
import { OtpService } from "./services/otpService.ts";
import { EmailService } from "./services/emailService.ts";
import { AuthRateLimiter } from "./services/rateLimiterDo.ts";

// Export Durable Object class for Cloudflare Worker runtime
export { AuthRateLimiter };

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function isOriginAllowed(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  const normalized = origin.trim().toLowerCase().replace(/\/$/, "");

  // Check configured production frontend origin
  if (env.FRONTEND_ORIGIN) {
    const configuredOrigin = env.FRONTEND_ORIGIN.trim().toLowerCase().replace(/\/$/, "");
    const isPlaceholder =
      configuredOrigin.includes("your_actual") ||
      configuredOrigin.includes("placeholder") ||
      configuredOrigin.includes("example");

    if (!isPlaceholder && normalized === configuredOrigin) {
      return true;
    }
  }

  // Strictly disallow localhost origins in production environment
  const isProduction = env.ENVIRONMENT === "production";
  if (isProduction) {
    return false;
  }

  // Local development origins are strictly restricted to development/test environments
  return DEFAULT_ALLOWED_ORIGINS.includes(normalized);
}

function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin");

  if (origin && isOriginAllowed(origin, env)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
  }

  // If origin is not allowed, do not reflect origin
  return {
    "Vary": "Origin",
  };
}

function jsonResponse(
  data: unknown,
  status = 200,
  request?: Request,
  env?: Env
): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(request && env ? getCorsHeaders(request, env) : {}),
  };
  return new Response(JSON.stringify(data), { status, headers });
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      if (origin && !isOriginAllowed(origin, env)) {
        return new Response(JSON.stringify({ error: "CORS origin forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    // 2. Reject non-OPTIONS requests with unauthorized Origin
    if (origin && !isOriginAllowed(origin, env)) {
      return new Response(
        JSON.stringify({ success: false, error: "Origin not permitted by CORS policy." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get("cf-connecting-ip") || "127.0.0.1";

    try {
      const otpService = new OtpService(env);
      const emailService = new EmailService(env);

      // Health check endpoint
      if (path === "/api/health" && request.method === "GET") {
        return jsonResponse(
          {
            status: "healthy",
            resendConfigured: emailService.isConfigured(),
            durableObjectsAvailable: Boolean(env.RATE_LIMITER_DO),
            timestamp: new Date().toISOString(),
          },
          200,
          request,
          env
        );
      }

      // 1. Send OTP: POST /api/auth/register/send-otp
      if (path === "/api/auth/register/send-otp" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Partial<SendOtpRequest>;
        const email = body.email?.trim().toLowerCase();
        const fullName = body.fullName?.trim();

        if (!email || !validateEmail(email)) {
          return jsonResponse(
            { success: false, error: "Please provide a valid email address." },
            400,
            request,
            env
          );
        }

        if (!fullName || fullName.length < 1) {
          return jsonResponse(
            { success: false, error: "Please provide your full name." },
            400,
            request,
            env
          );
        }

        // Rate limiting by IP (max 5 per 10 mins)
        const ipLimit = await otpService.checkRateLimit(`send:ip:${clientIp}`, 5, 10 * 60 * 1000);
        if (!ipLimit.allowed) {
          return jsonResponse(
            {
              success: false,
              error: `Too many verification requests from this network. Try again in ${ipLimit.resetInSeconds} seconds.`,
            },
            429,
            request,
            env
          );
        }

        // Rate limiting by Email (max 5 per 10 mins)
        const emailLimit = await otpService.checkRateLimit(`send:email:${email}`, 5, 10 * 60 * 1000);
        if (!emailLimit.allowed) {
          return jsonResponse(
            {
              success: false,
              error: `Too many verification requests for this email address. Try again in ${emailLimit.resetInSeconds} seconds.`,
            },
            429,
            request,
            env
          );
        }

        // Generate OTP & create transaction
        const { transaction, plainOtp } = await otpService.createRegistration(
          email,
          fullName
        );

        // Send OTP email via Resend API
        const emailResult = await emailService.sendOtpEmail(
          email,
          fullName,
          plainOtp
        );

        if (!emailResult.success) {
          return jsonResponse(
            {
              success: false,
              error: emailResult.error || "Failed to send verification email.",
              resendConfigured: emailService.isConfigured(),
            },
            500,
            request,
            env
          );
        }

        return jsonResponse(
          {
            success: true,
            transactionId: transaction.id,
            email,
            cooldownSeconds: 60,
            expiresInSeconds: 300,
            message: "Verification code sent successfully.",
          },
          200,
          request,
          env
        );
      }

      // 2. Resend OTP: POST /api/auth/register/resend-otp
      if (path === "/api/auth/register/resend-otp" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Partial<ResendOtpRequest>;
        const transactionId = body.transactionId?.trim();

        if (!transactionId) {
          return jsonResponse(
            { success: false, error: "Missing transaction identifier." },
            400,
            request,
            env
          );
        }

        // Rate limit by IP (max 5 resends per 10 mins)
        const ipLimit = await otpService.checkRateLimit(`resend:ip:${clientIp}`, 5, 10 * 60 * 1000);
        if (!ipLimit.allowed) {
          return jsonResponse(
            {
              success: false,
              error: `Too many resend requests from this network. Try again in ${ipLimit.resetInSeconds} seconds.`,
            },
            429,
            request,
            env
          );
        }

        const resendResult = await otpService.resendOtp(transactionId);
        if (!resendResult.success || !resendResult.plainOtp || !resendResult.transaction) {
          return jsonResponse(
            {
              success: false,
              error: resendResult.error || "Could not resend verification code.",
              cooldownRemaining: resendResult.cooldownRemaining,
            },
            400,
            request,
            env
          );
        }

        // Rate limit by Email (max 3 resends per 10 mins)
        const emailLimit = await otpService.checkRateLimit(
          `resend:email:${resendResult.transaction.email}`,
          3,
          10 * 60 * 1000
        );
        if (!emailLimit.allowed) {
          return jsonResponse(
            {
              success: false,
              error: `Too many resend attempts for this email. Try again in ${emailLimit.resetInSeconds} seconds.`,
            },
            429,
            request,
            env
          );
        }

        // Send new email via Resend
        const emailResult = await emailService.sendOtpEmail(
          resendResult.transaction.email,
          resendResult.transaction.fullName,
          resendResult.plainOtp
        );

        if (!emailResult.success) {
          return jsonResponse(
            {
              success: false,
              error: emailResult.error || "Failed to deliver email.",
            },
            500,
            request,
            env
          );
        }

        return jsonResponse(
          {
            success: true,
            cooldownSeconds: 60,
            expiresInSeconds: 300,
            message: "A fresh verification code has been sent.",
          },
          200,
          request,
          env
        );
      }

      // 3. Verify OTP: POST /api/auth/register/verify-otp
      if (path === "/api/auth/register/verify-otp" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Partial<VerifyOtpRequest>;
        const transactionId = body.transactionId?.trim();
        const otp = body.otp?.trim();

        if (!transactionId || !otp) {
          return jsonResponse(
            { success: false, error: "Missing transaction ID or OTP." },
            400,
            request,
            env
          );
        }

        if (!/^\d{6}$/.test(otp)) {
          return jsonResponse(
            { success: false, error: "Verification code must be 6 digits." },
            400,
            request,
            env
          );
        }

        // Rate limit verification attempts by IP (max 15 per 10 mins)
        const ipLimit = await otpService.checkRateLimit(`verify:ip:${clientIp}`, 15, 10 * 60 * 1000);
        if (!ipLimit.allowed) {
          return jsonResponse(
            {
              success: false,
              error: `Too many verification attempts from this network. Try again in ${ipLimit.resetInSeconds} seconds.`,
            },
            429,
            request,
            env
          );
        }

        const verifyResult = await otpService.verifyOtp(transactionId, otp);
        if (!verifyResult.success || !verifyResult.verificationToken) {
          return jsonResponse(
            {
              success: false,
              error: verifyResult.error || "Verification failed.",
              attemptsRemaining: verifyResult.attemptsRemaining,
            },
            400,
            request,
            env
          );
        }

        return jsonResponse(
          {
            success: true,
            verified: true,
            verificationToken: verifyResult.verificationToken,
            message: "Email verified successfully.",
          },
          200,
          request,
          env
        );
      }

      // 4. Complete Registration: POST /api/auth/register/complete
      if (path === "/api/auth/register/complete" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Partial<CompleteRegistrationRequest>;
        const transactionId = body.transactionId?.trim();
        const verificationToken = body.verificationToken?.trim();
        const idToken = body.idToken?.trim();

        if (!transactionId || !verificationToken || !idToken) {
          return jsonResponse(
            {
              success: false,
              error: "Missing required completion parameters (transactionId, verificationToken, or idToken).",
            },
            400,
            request,
            env
          );
        }

        const completeResult = await otpService.completeRegistration(
          transactionId,
          verificationToken,
          idToken
        );

        if (!completeResult.success) {
          const status = completeResult.error?.includes("already completed") ? 409 : 400;
          return jsonResponse(
            {
              success: false,
              error: completeResult.error || "Failed to complete registration.",
            },
            status,
            request,
            env
          );
        }

        return jsonResponse(
          {
            success: true,
            uid: completeResult.uid,
            message: "Registration completed successfully.",
          },
          200,
          request,
          env
        );
      }

      // 404 for unknown endpoints
      return jsonResponse({ error: "Endpoint not found" }, 404, request, env);
    } catch (err) {
      // Do not expose stack traces or internal secrets
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return jsonResponse({ success: false, error: message }, 500, request, env);
    }
  },
};
