# 🚀 saas-nextjs-supabase-stripe

> **Full SaaS starter kit** — Next.js 14 (App Router), Supabase auth + database, Stripe payments, Tailwind CSS.
>
> Part of the [openenv](https://openenv.dev) open standard for production-ready starter kits.

---

## ✨ Features

| Category       | What you get                                                  |
| -------------- | ------------------------------------------------------------- |
| **Frontend**   | Next.js 14 App Router, React Server Components, Tailwind CSS  |
| **Auth**       | Supabase Auth (email/password, OAuth-ready), middleware guard  |
| **Database**   | PostgreSQL via Supabase, type-safe client/server helpers       |
| **Payments**   | Stripe Checkout, webhook handling, subscription management     |
| **DX**         | TypeScript, ESLint, Docker Compose, one-command setup          |
| **Monitoring** | `/api/health` endpoint, Docker healthchecks                   |

---

## 📁 Project Structure

```
saas-nextjs-supabase-stripe/
├── kit.json                  # openenv kit metadata
├── .env.example              # All required env vars (documented)
├── docker-compose.yml        # Supabase DB + PostgREST + Studio + App
├── setup.sh                  # One-command local setup
├── README.md                 # You are here
└── template/                 # ← Your Next.js app
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── middleware.ts              # Auth route protection
    ├── app/
    │   ├── layout.tsx             # Root layout (fonts, metadata)
    │   ├── page.tsx               # Landing page
    │   ├── (auth)/login/page.tsx  # Login / sign-up page
    │   ├── dashboard/page.tsx     # Protected dashboard
    │   └── api/
    │       ├── health/route.ts    # Health check endpoint
    │       └── webhooks/stripe/route.ts  # Stripe webhook handler
    ├── lib/
    │   ├── supabase/client.ts     # Browser Supabase client
    │   ├── supabase/server.ts     # Server-side Supabase client
    │   └── stripe.ts              # Stripe SDK singleton
    └── components/
        └── ui/button.tsx          # Reusable button component
```

---

## 🏁 Quick Start

### Prerequisites

| Tool       | Version | Install                                    |
| ---------- | ------- | ------------------------------------------ |
| Node.js    | ≥ 18    | [nodejs.org](https://nodejs.org)           |
| Docker     | Latest  | [docker.com](https://docs.docker.com/get-docker/) |
| Stripe CLI | Latest  | [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli) |

### 1. Scaffold with openenv

```bash
npx openenv init saas-nextjs-supabase-stripe
cd saas-nextjs-supabase-stripe
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in your Supabase, Stripe, and Resend credentials
```

### 3. Run setup

```bash
chmod +x setup.sh
./setup.sh
```

This will:
1. ✅ Check prerequisites (Node, Docker, Compose)
2. ✅ Create `.env` from `.env.example`
3. ✅ Install Node.js dependencies
4. ✅ Start Docker services (Supabase DB, PostgREST, Studio)
5. ✅ Run health check

### 4. Open your app

| Service          | URL                                |
| ---------------- | ---------------------------------- |
| **App**          | [http://localhost:3000](http://localhost:3000) |
| **Supabase Studio** | [http://localhost:54323](http://localhost:54323) |
| **Health Check** | [http://localhost:3000/api/health](http://localhost:3000/api/health) |

---

## 🔑 Environment Variables

See [`.env.example`](.env.example) for all variables. Key ones:

| Variable                           | Required | Description                    |
| ---------------------------------- | -------- | ------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`         | ✅       | Your Supabase project URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | ✅       | Supabase anonymous key         |
| `SUPABASE_SERVICE_ROLE_KEY`        | ✅       | Supabase service role key      |
| `STRIPE_SECRET_KEY`                | ✅       | Stripe secret key (sk_test_…)  |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅     | Stripe publishable key         |
| `STRIPE_WEBHOOK_SECRET`            | ✅       | Stripe webhook signing secret  |

---

## 🔒 Auth Flow

1. **Middleware** (`middleware.ts`) protects `/dashboard` routes
2. **Login page** uses Supabase Auth with email/password
3. **Session** is managed via Supabase's `@supabase/ssr` cookie strategy
4. Unauthenticated users are redirected to `/login`

---

## 💳 Stripe Integration

### Webhook Setup

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Forward events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copy the webhook signing secret to your `.env`

### Handled Events

| Event                              | Action                          |
| ---------------------------------- | ------------------------------- |
| `checkout.session.completed`       | Activate subscription           |
| `invoice.payment_succeeded`        | Extend subscription             |
| `customer.subscription.deleted`    | Cancel subscription             |

---

## 🐳 Docker Services

```bash
docker compose up -d          # Start all services
docker compose logs -f        # Stream logs
docker compose down           # Stop all services
docker compose down -v        # Stop and delete volumes
```

| Service           | Port  | Image                          |
| ----------------- | ----- | ------------------------------ |
| Supabase DB       | 5432  | `supabase/postgres:15.1.0.117` |
| PostgREST API     | 54321 | `postgrest/postgrest:v11.2.0`  |
| Supabase Studio   | 54323 | `supabase/studio:20240101`     |
| Next.js App       | 3000  | Custom (Dockerfile in template)|

---

## 🧪 Development

```bash
cd template
npm run dev       # Start Next.js dev server (hot reload)
npm run build     # Production build
npm run lint      # ESLint check
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Set `Root Directory` to `template`
4. Add environment variables from `.env`
5. Deploy ✅

### Docker

```bash
docker compose -f docker-compose.yml up -d --build
```

---

## 🩺 Health Check

```bash
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}

openenv doctor   # Full environment diagnostic
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://openenv.dev">openenv</a>
</p>
