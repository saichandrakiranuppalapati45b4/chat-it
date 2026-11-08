export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Short-lived in-memory registration session state.
 * NEVER persisted in localStorage, sessionStorage, query params, or history.state.
 */
export interface PendingRegistration {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  transactionId: string;
  cooldownSeconds?: number;
  expiresAt: number; // Expiration timestamp in ms
}

export interface SendOtpResult {
  success: boolean;
  transactionId?: string;
  email?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  message?: string;
  error?: string;
  resendConfigured?: boolean;
}

export interface VerifyOtpResult {
  success: boolean;
  verified?: boolean;
  verificationToken?: string;
  message?: string;
  error?: string;
  attemptsRemaining?: number;
}

export interface ResendOtpResult {
  success: boolean;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  message?: string;
  error?: string;
  cooldownRemaining?: number;
}

export interface CompleteRegistrationResult {
  success: boolean;
  uid?: string;
  message?: string;
  error?: string;
}

export interface UserProfileDocument {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string | null;
  photoURL?: string | null;
  createdAt: unknown;
  updatedAt: unknown;
  emailVerified: boolean;
  accountStatus: "active" | "suspended" | "pending";
}
