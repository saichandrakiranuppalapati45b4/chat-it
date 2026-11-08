# Chat-it

Chat-it is a modern, real-time messaging application engineered with a decoupled, serverless architecture:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 hosted on **Cloudflare Pages**.
- **Backend API**: Cloudflare Workers + TypeScript + Cloudflare Durable Objects + Cloudflare KV.
- **Authentication & Database**: Firebase Authentication + Cloud Firestore.
- **Transactional Email**: Resend API with cryptographic HMAC-SHA-256 OTP verification.

---

## Architecture Overview

```text
chat-it/
├── apps/
│   ├── web/                     # React + Vite Frontend (Cloudflare Pages)
│   │   ├── public/              # Static assets, _redirects (SPA routing), _headers
│   │   ├── src/                 # Application components, hooks, contexts, services
│   │   ├── .env.example         # Client environment variable template
│   │   ├── package.json
│   │   └── vite.config.ts       # Optimized Vite build with vendor chunking
│   │
│   └── worker/                  # Cloudflare Worker Backend API
│       ├── src/                 # Worker entrypoint, OTP services, Durable Objects
│       ├── test/                # Automated OTP security & fail-closed unit tests
│       ├── .dev.vars.example    # Local development secrets template
│       ├── package.json
│       └── wrangler.toml        # Authoritative Cloudflare Worker configuration
│
├── firestore.rules              # Production Cloud Firestore Security Rules
├── package.json                 # Monorepo workspace configuration
├── package-lock.json            # Deterministic dependency lockfile
└── README.md
```

---

## 1. Frontend — Cloudflare Pages Deployment

The frontend is completely decoupled from Cloudflare Workers and deploys independently as a static Single Page Application (SPA).

### Cloudflare Pages Dashboard Setup

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository: `saichandrakiranuppalapati45b4/chat-it`.
3. Configure the build settings:
   - **Project Name**: `chat-it` (or your preferred name)
   - **Production Branch**: `main`
   - **Framework Preset**: `None` or `Vite`
   - **Root Directory**: `/`
   - **Build Command**: `npm run build --workspace=apps/web` (or `npm run build`)
   - **Build Output Directory**: `apps/web/dist`

> **Alternative Subdirectory Configuration**:
> If you prefer setting the Root Directory to `apps/web`:
> - **Root Directory**: `apps/web`
> - **Build Command**: `npm run build`
> - **Build Output Directory**: `dist`

### Required Environment Variables (Cloudflare Pages)

In the Cloudflare Pages project settings (**Settings** > **Environment variables**), add:

| Variable | Description | Example / Source |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | Firebase Console > Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `chat-it-eeb44.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `chat-it-eeb44` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `chat-it-eeb44.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID | `24184061440` |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID | `1:24184061440:web:d88309a360f8c04fdba2e5` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics ID (optional) | `G-XXXXXXXXXX` |
| `VITE_API_BASE_URL` | Deployed Cloudflare Worker URL | `https://chat-it-worker.<subdomain>.workers.dev` |

### SPA Routing & Security Headers

Cloudflare Pages automatically serves `apps/web/public/_redirects`:
```text
/*    /index.html   200
```
This ensures direct URLs (e.g., `/login`, `/signup`, `/forgot-password`) resolve properly without 404 errors on page reload.

Security headers are automatically applied via `apps/web/public/_headers`:
```text
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Custom Domain

1. In the Pages project dashboard, go to **Custom domains** > **Set up a custom domain**.
2. Enter your domain (e.g., `chat.yourdomain.com`).
3. Follow Cloudflare's automatic DNS CNAME record generation.

---

## 2. Backend — Cloudflare Workers Deployment

The backend runs independently on Cloudflare Workers, providing atomic OTP registration, rate limiting, and cryptographic token verification.

### Authoritative Configuration (`apps/worker/wrangler.toml`)

- **Worker Name**: `chat-it-worker`
- **Compatibility Date**: `2025-02-14` (`nodejs_compat` enabled)
- **KV Binding**: `OTP_STORE`
- **Durable Object**: `RATE_LIMITER_DO` (Class: `AuthRateLimiter`)

### Cloudflare Resource Provisioning (One-Time Setup)

From PowerShell or bash inside `apps/worker` (or from root using npx):

```powershell
# 1. Login to Cloudflare Wrangler
npx wrangler login

# 2. Create the Production KV Namespace for OTP storage
npx wrangler kv namespace create OTP_STORE

# 3. Create the Development KV Namespace for local testing
npx wrangler kv namespace create OTP_STORE --env development
```

Copy the generated 32-character namespace IDs into [apps/worker/wrangler.toml](file:///mnt/c/projects/chat-it/apps/worker/wrangler.toml) under `[[env.production.kv_namespaces]]` and `[[env.development.kv_namespaces]]`.

### Setting Production Secrets

Set production secrets securely in Cloudflare (never commit secrets to Git):

```powershell
# 1. Resend API Key for sending verification emails
npx wrangler secret put RESEND_API_KEY --env production

# 2. HMAC-SHA-256 Secret Pepper (random 32-byte hex string)
npx wrangler secret put OTP_HASH_SECRET --env production
```

> **Generating a secure 32-byte pepper**:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Updating Production Variables Before Deployment

In [apps/worker/wrangler.toml](file:///mnt/c/projects/chat-it/apps/worker/wrangler.toml):
- Update `FRONTEND_ORIGIN` to your deployed Cloudflare Pages URL (e.g., `https://chat-it.pages.dev` or custom domain). **Note**: Localhost origins are rejected in production for security.
- Update `RESEND_FROM_EMAIL` to your verified domain sender in Resend (e.g., `Chat-it <noreply@yourdomain.com>`).

### Deploying the Backend

```powershell
# Deploy to Cloudflare Workers production environment
npm run deploy:worker

# Or from inside apps/worker:
cd apps/worker
npx wrangler deploy --env production
```

---

## 3. Firebase Setup

### Firebase Authentication Configuration
1. Open the [Firebase Console](https://console.firebase.google.com/) for project `chat-it-eeb44`.
2. Go to **Authentication** > **Sign-in method**.
3. Enable:
   - **Email/Password**
   - **Google**
   - **GitHub** (requires OAuth Client ID and secret from GitHub Settings > Developer settings)
   - **Apple** (optional)
4. Under **Settings** > **Authorized domains**, add:
   - `localhost`
   - Your Cloudflare Pages domain (e.g., `chat-it.pages.dev`)
   - Any custom production domain

### Cloud Firestore Rules Deployment
Chat-it includes production-hardened security rules in [firestore.rules](file:///mnt/c/projects/chat-it/firestore.rules). Deploy them using the Firebase CLI:

```powershell
# Login to Firebase
firebase login

# Set active project
firebase use chat-it-eeb44

# Deploy Firestore Security Rules
firebase deploy --only firestore:rules
```

---

## 4. Local Development (PowerShell / Windows)

Run frontend and backend concurrently or independently on your machine.

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure Local Environment Files

**Frontend Environment** (`apps/web/.env`):
```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=chat-it-eeb44.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chat-it-eeb44
VITE_FIREBASE_STORAGE_BUCKET=chat-it-eeb44.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=24184061440
VITE_FIREBASE_APP_ID=1:24184061440:web:d88309a360f8c04fdba2e5
VITE_API_BASE_URL=
```
*(Leaving `VITE_API_BASE_URL` empty routes `/api` through Vite's local dev proxy to `http://localhost:8787`)*.

**Worker Local Secrets** (`apps/worker/.dev.vars`):
```env
RESEND_API_KEY=your_resend_api_key_here
OTP_HASH_SECRET=your_32_byte_local_secret_pepper_here
```

### Step 3: Run Development Servers

Open two PowerShell windows:

**Terminal 1 — Backend Worker API (`http://localhost:8787`)**:
```powershell
npm run dev:worker
```

**Terminal 2 — Frontend Application (`http://localhost:5173`)**:
```powershell
npm run dev:web
```

---

## 5. Verification & Testing Commands

| Purpose | Command |
| :--- | :--- |
| **Build Frontend** | `npm run build` *(or `npm run build:web`)* |
| **Lint Frontend** | `npm run lint` |
| **Build / Dry-run Worker** | `npm run build:worker` |
| **Run Worker Security Tests** | `npm run test:worker` |
| **Typecheck Worker** | `npm run typecheck --workspace=apps/worker` |

All 16 automated security tests verify:
- Production fail-closed behavior for missing bindings
- Deterministic HMAC-SHA-256 OTP hashing with secret pepper
- Constant-time equality checks preventing timing attacks
- Durable Object atomic rate limiting and single-flight transaction locks
- Cryptographic Firebase ID Token RS256 signature verification
- Strict CORS protection prohibiting unauthorized origins
