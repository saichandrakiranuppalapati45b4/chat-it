import type { Env } from "../types/index.ts";

export interface DecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  aud: string;
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  [key: string]: unknown;
}

interface GoogleJwkKey {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

interface GoogleJwksResponse {
  keys: GoogleJwkKey[];
}

// In-memory cache for Google's public JWK keys to avoid fetching on every request
let cachedJwks: { keys: GoogleJwkKey[]; expiresAt: number } | null = null;
let testJwksOverride: GoogleJwkKey[] | null = null;

function base64UrlDecode(str: string): Uint8Array {
  // Convert Base64URL to standard Base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export class FirebaseAuthService {
  private projectId: string;

  constructor(env: Env) {
    this.projectId = env.FIREBASE_PROJECT_ID || "chat-it-eeb44";
  }

  /**
   * For integration testing: override Google's JWKS with a test key
   */
  public static setTestJwks(keys: GoogleJwkKey[] | null): void {
    testJwksOverride = keys;
  }

  /**
   * Fetches and caches Google's public JWKs for Firebase Authentication
   */
  private async getGoogleJwks(): Promise<GoogleJwkKey[]> {
    if (testJwksOverride) {
      return testJwksOverride;
    }

    const now = Date.now();
    if (cachedJwks && cachedJwks.expiresAt > now) {
      return cachedJwks.keys;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
        {
          headers: { "User-Agent": "chat-it-worker" },
          cf: { cacheTtl: 3600, cacheEverything: true } as RequestInitCfProperties,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch JWKS from Google: ${response.status}`);
      }

      const data = (await response.json()) as GoogleJwksResponse;
      if (!data.keys || !Array.isArray(data.keys)) {
        throw new Error("Invalid JWKS response structure from Google");
      }

      // Cache for 1 hour
      cachedJwks = {
        keys: data.keys,
        expiresAt: now + 3600 * 1000,
      };

      return data.keys;
    } catch (err) {
      if (cachedJwks) {
        return cachedJwks.keys; // Return stale cache if network hiccup
      }
      throw err;
    }
  }

  /**
   * Verifies a Firebase ID token using Web Crypto API RS256 signature verification.
   * Enforces audience, issuer, expiration, auth_time, and non-empty sub claims.
   */
  public async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    if (!idToken || typeof idToken !== "string") {
      throw new Error("Missing or invalid Firebase ID token.");
    }

    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Malformed Firebase ID token: Must have 3 parts.");
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header
    let header: { alg?: string; kid?: string };
    try {
      const headerStr = new TextDecoder().decode(base64UrlDecode(headerB64));
      header = JSON.parse(headerStr);
    } catch {
      throw new Error("Invalid ID token header encoding.");
    }

    if (header.alg !== "RS256" || !header.kid) {
      throw new Error("ID token must use RS256 algorithm with a valid key ID (kid).");
    }

    // Decode payload
    let payload: DecodedIdToken;
    try {
      const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
      payload = JSON.parse(payloadStr);
    } catch {
      throw new Error("Invalid ID token payload encoding.");
    }

    // Standard Claim Validations
    const nowSeconds = Math.floor(Date.now() / 1000);
    const clockToleranceSeconds = 300; // 5 minutes clock drift allowance

    // 1. Expiration check
    if (payload.exp < nowSeconds - clockToleranceSeconds) {
      throw new Error("Firebase ID token has expired.");
    }

    // 2. Auth time check
    if (payload.auth_time > nowSeconds + clockToleranceSeconds) {
      throw new Error("Firebase ID token auth_time is in the future.");
    }

    // 3. Audience check
    if (payload.aud !== this.projectId) {
      throw new Error(
        `Firebase ID token audience mismatch. Expected: ${this.projectId}, Received: ${payload.aud}`
      );
    }

    // 4. Issuer check
    const expectedIssuer = `https://securetoken.google.com/${this.projectId}`;
    if (payload.iss !== expectedIssuer) {
      throw new Error(
        `Firebase ID token issuer mismatch. Expected: ${expectedIssuer}, Received: ${payload.iss}`
      );
    }

    // 5. Subject check
    if (!payload.sub || typeof payload.sub !== "string" || payload.sub.trim().length === 0) {
      throw new Error("Firebase ID token subject (sub) must be a non-empty string.");
    }

    payload.uid = payload.sub;

    // Signature verification against Google's public keys
    const jwks = await this.getGoogleJwks();
    const matchingKey = jwks.find((k) => k.kid === header.kid);

    if (!matchingKey) {
      throw new Error(`Public key matching kid "${header.kid}" not found in Google JWKS.`);
    }

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      matchingKey,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      false,
      ["verify"]
    );

    const encoder = new TextEncoder();
    const signedData = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecode(signatureB64);

    const isValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      signatureBytes,
      signedData
    );

    if (!isValid) {
      throw new Error("Invalid Firebase ID token signature.");
    }

    return payload;
  }

  /**
   * Optionally updates Firebase Auth native `emailVerified: true` property using
   * a server-side Google Service Account if configured in secrets.
   */
  public async markEmailAsVerifiedInFirebase(
    uid: string,
    env: Env
  ): Promise<{ success: boolean; error?: string }> {
    const rawKey = env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!rawKey) {
      // Service account is not configured yet. This is expected if the admin
      // has not set FIREBASE_SERVICE_ACCOUNT_KEY secret yet.
      return {
        success: false,
        error: "FIREBASE_SERVICE_ACCOUNT_KEY secret not configured.",
      };
    }

    try {
      let serviceAccount: {
        client_email: string;
        private_key: string;
        project_id: string;
      };

      try {
        serviceAccount = JSON.parse(rawKey);
      } catch {
        return {
          success: false,
          error: "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.",
        };
      }

      // Generate OAuth2 token via RS256 assertion
      const now = Math.floor(Date.now() / 1000);
      const jwtHeader = { alg: "RS256", typ: "JWT" };
      const jwtClaimSet = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/identitytoolkit",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      };

      const encoder = new TextEncoder();
      const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(jwtHeader)));
      const encodedClaimSet = base64UrlEncode(encoder.encode(JSON.stringify(jwtClaimSet)));
      const signInput = `${encodedHeader}.${encodedClaimSet}`;

      // Convert PEM to DER
      const pem = serviceAccount.private_key
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\s+/g, "");
      const binaryDer = atob(pem);
      const derBytes = new Uint8Array(binaryDer.length);
      for (let i = 0; i < binaryDer.length; i++) {
        derBytes[i] = binaryDer.charCodeAt(i);
      }

      const privKey = await crypto.subtle.importKey(
        "pkcs8",
        derBytes.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privKey,
        encoder.encode(signInput)
      );

      const assertion = `${signInput}.${base64UrlEncode(new Uint8Array(signature))}`;

      // Exchange assertion for access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion,
        }),
      });

      if (!tokenResponse.ok) {
        return {
          success: false,
          error: `Google OAuth2 token exchange failed with status ${tokenResponse.status}`,
        };
      }

      const tokenData = (await tokenResponse.json()) as { access_token?: string };
      if (!tokenData.access_token) {
        return { success: false, error: "No access token returned from Google OAuth2." };
      }

      // Call Firebase Identity Toolkit accounts:update API
      const updateResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            localId: uid,
            emailVerified: true,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        return {
          success: false,
          error: `Identity toolkit update failed: ${errorText}`,
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update emailVerified in Firebase Auth",
      };
    }
  }
}
