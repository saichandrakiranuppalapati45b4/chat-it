import type { Env } from "../types/index.ts";

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private environment: string;

  constructor(env: Env) {
    this.apiKey = env.RESEND_API_KEY || "";
    this.fromEmail = env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    this.environment = env.ENVIRONMENT || "development";
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public isVerifiedSenderConfigured(): boolean {
    if (this.environment !== "production") return true;
    if (!this.fromEmail) return false;
    if (this.fromEmail.includes("onboarding@resend.dev")) return false;
    if (this.fromEmail.includes("YOUR_VERIFIED_DOMAIN")) return false;
    return true;
  }

  public async sendOtpEmail(
    toEmail: string,
    fullName: string,
    otpCode: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "RESEND_API_KEY is not configured. Run 'npx wrangler secret put RESEND_API_KEY' to configure it.",
      };
    }

    if (this.environment === "production" && !this.isVerifiedSenderConfigured()) {
      return {
        success: false,
        error:
          "Deployment blocker: RESEND_FROM_EMAIL must be configured with your verified domain in production (unverified sandbox or placeholder address cannot be used in production).",
      };
    }

    const html = this.buildHtmlTemplate(fullName, otpCode);

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Chat-it <${this.fromEmail}>`,
          to: [toEmail],
          subject: "Your Chat-it verification code",
          html,
        }),
      });

      const data = (await response.json()) as {
        id?: string;
        message?: string;
        name?: string;
      };

      if (!response.ok) {
        return {
          success: false,
          error:
            data.message ||
            `Resend API returned status ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        id: data.id,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        success: false,
        error: `Failed to connect to Resend API: ${message}`,
      };
    }
  }

  private buildHtmlTemplate(fullName: string, otpCode: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Chat-it verification code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAFAFA;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #102448;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAFAFA;
      padding: 40px 0;
    }
    .main {
      background-color: #FFFFFF;
      margin: 0 auto;
      width: 100%;
      max-width: 520px;
      border-radius: 24px;
      border: 1px solid #E6EFF8;
      box-shadow: 0 10px 30px rgba(22, 140, 245, 0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #44A2FF 0%, #177EEB 100%);
      padding: 36px 30px;
      text-align: center;
    }
    .logo-text {
      color: #FFFFFF;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .tagline {
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      margin-top: 6px;
      margin-bottom: 0;
    }
    .content {
      padding: 36px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #102448;
      margin: 0 0 12px 0;
    }
    .text {
      font-size: 15px;
      line-height: 24px;
      color: #555663;
      margin: 0 0 28px 0;
    }
    .otp-box {
      background-color: #EAF4FF;
      border: 2px dashed #168CF5;
      border-radius: 16px;
      padding: 18px 24px;
      display: inline-block;
      margin: 0 auto 24px auto;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #168CF5;
      font-family: 'SF Mono', Consolas, Menlo, Monaco, monospace;
      padding-left: 10px;
    }
    .expiry {
      font-size: 13px;
      color: #9FA0B5;
      margin-top: 8px;
      margin-bottom: 0;
    }
    .divider {
      border-top: 1px solid #F0F4F8;
      margin: 28px 0 20px 0;
    }
    .footer {
      font-size: 12px;
      color: #9FA0B5;
      line-height: 18px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <h1 class="logo-text">Chat-it</h1>
          <p class="tagline">Connect. Chat. Share.</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2 class="greeting">Verify your email address</h2>
          <p class="text">
            Hi ${fullName || "there"},<br>
            Welcome to Chat-it! Use the verification code below to complete your registration:
          </p>
          <div class="otp-box">
            <span class="otp-code">${otpCode}</span>
          </div>
          <p class="expiry">⏱ This code expires in <strong>5 minutes</strong>.</p>
          <div class="divider"></div>
          <p class="footer">
            If you did not create an account with Chat-it, you can safely ignore this email.<br>
            Please do not share this code with anyone.
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  }
}
