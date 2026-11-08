# Chat-it

Chat-it is a modern, real-time messaging application engineered with a clean, decoupled architecture:
- **Frontend (`frontend/`)**: React 19 + TypeScript + Vite + Tailwind CSS v4 hosted on **Cloudflare Pages**.
- **Backend (`backend/`)**: Cloudflare Workers + TypeScript + Cloudflare Durable Objects + Cloudflare KV.
- **Authentication & Database**: Firebase Authentication + Cloud Firestore.
- **Transactional Email**: Resend API with cryptographic HMAC-SHA-256 OTP verification.

---

## 1. Repository Structure

```text
chat-it/
├── frontend/                    # Independent React SPA (Cloudflare Pages)
│   ├── public/                  # Static assets, _redirects (SPA routing), _headers
│   │   ├── _headers             # Security headers (nosniff, DENY frame options)
│   │   ├── _redirects           # Client-side SPA fallback (/* /index.html 200)
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/                     # React components, pages, hooks, services
│   ├── index.html               # Vite HTML entry
│   ├── vite.config.ts           # Bundler config with vendor chunking & dev proxy
│   ├── tsconfig.json            # TypeScript configuration
│   ├── package.json             # Frontend dependencies and scripts
│   └── .env.example             # Frontend environment template
│
├── backend/                     # Independent Cloudflare Worker API
│   ├── src/                     # Worker entrypoint, OTP services, Durable Objects
│   │   ├── index.ts             # REST router & CORS preflight handler
│   │   ├── services/            # OtpService, EmailService, RateLimiter DO
│   │   └── types/               # Worker and API TypeScript interfaces
│   ├── test/                    # Automated security & fail-closed unit tests
│   ├── wrangler.toml            # Authoritative Cloudflare Worker configuration
│   ├── tsconfig.json            # Worker TypeScript configuration
│   ├── package.json             # Backend dependencies and scripts
│   └── .dev.vars.example        # Local secrets template
│
├── firestore.rules              # Production Cloud Firestore Security Rules
├── package.json                 # Monorepo root scripts & workspace configuration
├── package-lock.json            # Deterministic lockfile for all packages
└── README.md                    # System documentation and deployment guide
```

---

## 2. Command Reference

### Root-Level Commands
Run convenient workspace-delegated scripts directly from the repository root:

```bash
# Development
npm run dev:frontend          # Starts the React development server (http://localhost:5173)
npm run dev:backend           # Starts the Cloudflare Worker dev server (http://localhost:8787)

# Builds & Validation
npm run build:frontend        # Typechecks & builds the frontend into frontend/dist
npm run build:backend         # Typechecks & dry-run packages the Cloudflare Worker
npm run test:backend          # Runs all 16 backend security and OTP unit tests
npm run lint                  # Runs ESLint across the frontend codebase

# Deployment
npm run deploy:frontend       # Informative notice on Cloudflare Pages Git deployment
npm run deploy:backend        # Deploys backend to Cloudflare Workers production
```

### Frontend-Only Commands
Navigate directly into `frontend/` to run independent frontend tasks:

```bash
cd frontend
npm install                   # Install frontend dependencies
npm run dev                   # Start Vite local development server
npm run build                 # Compile TypeScript and bundle with Vite into dist/
npm run preview               # Preview production build locally
npm run lint                  # Run ESLint
```

### Backend-Only Commands
Navigate directly into `backend/` to run independent backend tasks:

```bash
cd backend
npm install                   # Install backend dependencies
npm run dev                   # Start Wrangler local dev server with Miniflare
npm run build                 # Run tsc check & Wrangler production dry-run
npm run test                  # Execute node test runner for OTP & security suites
npm run typecheck             # Run TypeScript type check (tsc --noEmit)
npm run deploy                # Deploy worker directly to Cloudflare production
```

---

## 3. Cloudflare Deployment Configuration

### A. Frontend — Cloudflare Pages

The frontend deploys as a static Single Page Application (SPA) on Cloudflare Pages.

1. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository: `saichandrakiranuppalapati45b4/chat-it`.
3. Set the build parameters:
   - **Framework Preset**: `None` or `Vite`
   - **Root directory**: `/`
   - **Build command**: `npm run build:frontend`
   - **Build output directory**: `frontend/dist`
   - **Production branch**: `main`

> **Alternative Subdirectory Configuration**:
> - **Root directory**: `frontend`
> - **Build command**: `npm run build`
> - **Build output directory**: `dist`

#### Frontend Environment Variables (Cloudflare Pages Dashboard)
Under **Settings** > **Environment variables**, configure:

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

#### SPA Fallback & Security Headers
- `frontend/public/_redirects` ensures all client-side paths (`/login`, `/signup`, `/forgot-password`, `/verify-email`) resolve to `index.html` without 404 errors on reload.
- `frontend/public/_headers` adds strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

### B. Backend — Cloudflare Workers

The backend operates on Cloudflare Workers with native Durable Objects and KV storage.

#### Settings
- **Root directory**: `/backend`
- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy --env production` (or root `npm run deploy:backend`)
- **Production branch**: `main`

#### Cloudflare Resource Provisioning (One-Time Setup)
Run from PowerShell in `backend/` or root:

```powershell
# 1. Login to Cloudflare Wrangler
npx wrangler login

# 2. Create the Production KV Namespace for OTP storage
npx wrangler kv namespace create OTP_STORE

# 3. Create the Development KV Namespace for local testing
npx wrangler kv namespace create OTP_STORE --env development
```

Update the returned namespace IDs in [backend/wrangler.toml](file:///mnt/c/projects/chat-it/backend/wrangler.toml) under `[[env.production.kv_namespaces]]` and `[[env.development.kv_namespaces]]`.

#### Production Secrets Configuration
Set production secrets securely in Cloudflare (never commit secrets to version control):

```powershell
# 1. Resend API Key for sending verification emails
npx wrangler secret put RESEND_API_KEY --env production

# 2. HMAC-SHA-256 Secret Pepper (random 32-byte hex string)
npx wrangler secret put OTP_HASH_SECRET --env production
```

> Generate a cryptographically secure 32-byte pepper:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

#### Update Production Variables in `backend/wrangler.toml`
- `FRONTEND_ORIGIN`: Set to your deployed Cloudflare Pages URL (e.g., `https://chat-it.pages.dev`). Localhost is strictly disallowed in production.
- `RESEND_FROM_EMAIL`: Set to your verified domain sender in Resend (e.g., `Chat-it <noreply@yourdomain.com>`).

---

## 4. Firebase Setup

### Authentication Setup
1. In the [Firebase Console](https://console.firebase.google.com/) for project `chat-it-eeb44`, open **Authentication** > **Sign-in method**.
2. Enable **Email/Password**, **Google**, and **GitHub** providers.
3. In **Settings** > **Authorized domains**, add:
   - `localhost`
   - Your Cloudflare Pages URL (e.g., `chat-it.pages.dev`)
   - Any production custom domain

### Cloud Firestore Rules Deployment
Chat-it includes production-hardened security rules in [firestore.rules](file:///mnt/c/projects/chat-it/firestore.rules). Deploy via Firebase CLI:

```powershell
firebase login
firebase use chat-it-eeb44
firebase deploy --only firestore:rules
```

---

## 5. Local Development (Windows PowerShell)

Run frontend and backend concurrently in separate PowerShell windows.

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure Local Environment Files

**Frontend (`frontend/.env`)**:
```env
VITE_FIREBASE_API_KEY=AIzaSyDmXIDTsJqNCzAjvfCZhEYw5oaL_kbC6JA
VITE_FIREBASE_AUTH_DOMAIN=chat-it-eeb44.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chat-it-eeb44
VITE_FIREBASE_STORAGE_BUCKET=chat-it-eeb44.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=24184061440
VITE_FIREBASE_APP_ID=1:24184061440:web:d88309a360f8c04fdba2e5
VITE_API_BASE_URL=
```
*(Leaving `VITE_API_BASE_URL` empty automatically proxies `/api` calls to `http://localhost:8787` via Vite).*

**Backend (`backend/.dev.vars`)**:
```env
RESEND_API_KEY=your_resend_api_key_here
OTP_HASH_SECRET=your_32_byte_local_secret_pepper_here
```

### Step 3: Run Servers

**Terminal 1 — Backend Worker (`http://localhost:8787`)**:
```powershell
npm run dev:backend
```

**Terminal 2 — Frontend Application (`http://localhost:5173`)**:
```powershell
npm run dev:frontend
```
