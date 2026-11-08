import type {
  SendOtpResult,
  VerifyOtpResult,
  ResendOtpResult,
  CompleteRegistrationResult,
  UserProfileDocument,
  PendingRegistration,
} from "../types/auth";
import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : "";

class AuthService {
  private baseUrl: string;
  // In-memory pending registration state; never exposed to localStorage or URL
  private pendingRegistration: PendingRegistration | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL.replace(/\/$/, "");
  }

  /**
   * Stores the short-lived registration session in memory.
   */
  public setPendingRegistration(pending: PendingRegistration): void {
    this.pendingRegistration = { ...pending };
  }

  /**
   * Retrieves the in-memory registration session if not expired.
   */
  public getPendingRegistration(): PendingRegistration | null {
    if (!this.pendingRegistration) {
      return null;
    }
    if (Date.now() > this.pendingRegistration.expiresAt) {
      this.clearPendingRegistration();
      return null;
    }
    return this.pendingRegistration;
  }

  /**
   * Clears the in-memory registration session, removing the password reference
   * to allow immediate V8 garbage collection (in JS runtimes, primitive strings
   * are immutable and cannot be synchronously zeroed; detaching references ensures
   * they are collected and never persisted).
   */
  public clearPendingRegistration(): void {
    if (this.pendingRegistration) {
      this.pendingRegistration.password = "";
      this.pendingRegistration = null;
    }
  }

  /**
   * Request email OTP from Cloudflare Worker
   */
  public async sendRegistrationOtp(
    email: string,
    fullName: string
  ): Promise<SendOtpResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      });

      const data = (await response.json().catch(() => ({}))) as SendOtpResult;

      if (!response.ok) {
        return {
          success: false,
          error:
            data.error ||
            `Server returned ${response.status}: Failed to send verification email.`,
          resendConfigured: data.resendConfigured,
        };
      }

      return data;
    } catch (err) {
      const isConnectionError =
        err instanceof TypeError && err.message.toLowerCase().includes("fetch");

      if (isConnectionError) {
        return {
          success: false,
          error:
            "Could not connect to the authentication server. Please ensure the Cloudflare Worker is running (run: npm run dev:worker).",
        };
      }

      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to send verification code.",
      };
    }
  }

  /**
   * Resend email OTP from Cloudflare Worker
   */
  public async resendRegistrationOtp(
    transactionId: string
  ): Promise<ResendOtpResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/register/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        }
      );

      const data = (await response.json().catch(() => ({}))) as ResendOtpResult;

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to resend verification code.",
          cooldownRemaining: data.cooldownRemaining,
        };
      }

      // Update in-memory session expiration if session exists
      if (this.pendingRegistration && this.pendingRegistration.transactionId === transactionId) {
        this.pendingRegistration.expiresAt = Date.now() + 5 * 60 * 1000;
        this.pendingRegistration.cooldownSeconds = data.cooldownSeconds || 60;
      }

      return data;
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect to verification service.",
      };
    }
  }

  /**
   * Verify submitted OTP code against Cloudflare Worker
   */
  public async verifyRegistrationOtp(
    transactionId: string,
    otp: string
  ): Promise<VerifyOtpResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/register/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId, otp }),
        }
      );

      const data = (await response.json().catch(() => ({}))) as VerifyOtpResult;

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Verification failed. Please check your code.",
          attemptsRemaining: data.attemptsRemaining,
        };
      }

      return data;
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect to verification service.",
      };
    }
  }

  /**
   * Mark registration transaction as completed on Worker using verified Firebase ID token
   */
  public async completeRegistration(
    transactionId: string,
    verificationToken: string,
    idToken: string
  ): Promise<CompleteRegistrationResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/register/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId, verificationToken, idToken }),
        }
      );

      const data = (await response.json().catch(() => ({}))) as CompleteRegistrationResult;

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to finalize registration transaction.",
        };
      }

      return data;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to server.",
      };
    }
  }

  /**
   * Stores verified user profile in Cloud Firestore under users/{uid}
   */
  public async saveUserProfile(profile: {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber?: string | null;
    photoURL?: string | null;
  }): Promise<void> {
    if (!db) {
      throw new Error("Cloud Firestore database is not initialized.");
    }

    const userRef = doc(db, "users", profile.uid);
    const userDoc: UserProfileDocument = {
      uid: profile.uid,
      displayName: profile.displayName,
      email: profile.email.toLowerCase(),
      phoneNumber: profile.phoneNumber || null,
      photoURL: profile.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: true,
      accountStatus: "active",
    };

    await setDoc(userRef, userDoc, { merge: true });
  }
}

export const authService = new AuthService();
