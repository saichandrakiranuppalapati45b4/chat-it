export interface Env {
  ENVIRONMENT?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  OTP_HASH_SECRET?: string;
  FRONTEND_ORIGIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_SERVICE_ACCOUNT_KEY?: string;
  OTP_STORE?: KVNamespace;
  RATE_LIMITER_DO?: DurableObjectNamespace;
}

export interface RegistrationTransaction {
  id: string;
  email: string;
  fullName: string;
  otpHash: string;
  salt: string;
  createdAt: number;
  expiresAt: number;
  resendCooldownUntil: number;
  attempts: number; // Attempts on current OTP
  totalAttempts: number; // Lifetime attempts across entire transaction (max 5)
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: number;
  completed: boolean;
  completedAt?: number;
  consumedTokenHash?: string;
  uid?: string;
}

export interface SendOtpRequest {
  email: string;
  fullName: string;
}

export interface VerifyOtpRequest {
  transactionId: string;
  otp: string;
}

export interface ResendOtpRequest {
  transactionId: string;
}

export interface CompleteRegistrationRequest {
  transactionId: string;
  verificationToken: string;
  idToken: string; // Firebase ID Token from verified client
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
