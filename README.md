<div align="center">

# 🌍 openenv

**The open standard for production-ready full-stack starter kits.**

Stop rebuilding auth, payments, and infrastructure from scratch.
Pick a kit. Run one command. Ship.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🚨 The Problem

Every new project starts the exact same way. You spend days setting up authentication, configuring a database, wiring up payments, writing Docker configs, and wrestling with CI pipelines. By the time you're ready to write your actual app, you're already exhausted.

**openenv** fixes this.

## 💡 The Solution

openenv is an **open registry of production-ready starter kits** powered by an ultra-fast, bulletproof CLI. It scaffolds everything you need in seconds. Every kit is verified by CI and comes pre-configured with:

- ✅ Working authentication (NextAuth, Supabase, JWT)
- ✅ Database with migrations (Prisma, Drizzle, SQLAlchemy)
- ✅ Docker Compose for instant local dev environments
- ✅ Health check endpoints (pre-configured)
- ✅ One-command setup scripts (`./setup.sh`)
- ✅ Environment variable documentation
- ✅ Deployment-ready configurations (Dockerfiles, GitHub Actions)

---

## ⚡ Quick Start (Interactive)

Just run `openenv` in your terminal! The CLI is fully interactive, completely beginner-friendly, and handles all errors gracefully.

```bash
# 1. Install globally directly from GitHub
npm install -g Sparkyyy45/openenv

# 2. Run the interactive kit picker
openenv
```

You'll be greeted with our beautiful CLI interface:

```text
╔═════════════════════════════════╗
║  openenv  v0.1.0                ║
║  production-ready stacks, fast  ║
╚═════════════════════════════════╝

? Which kit would you like to initialize? (Use arrow keys)
❯ api-fastapi-postgres-redis  — Production API: FastAPI, PostgreSQL, Redis
  saas-nextjs-supabase-stripe — Full SaaS starter with auth, payments
  ...
```

---

## ⚡ Quick Start

If you already know what you want, you can pass arguments directly:

```bash
# See all available kits
openenv list

# Scaffold a specific kit directly
openenv init saas-nextjs-supabase-stripe

# Check your environment (Docker, Ports, Node version)
openenv doctor

# Generate deployment pipelines!
openenv deploy
```

---

## 📦 Available Kits

| Kit | Stack | Description |
|-----|-------|-------------|
| **[saas-nextjs-supabase-stripe](kits/saas-nextjs-supabase-stripe)** | Next.js 14 · Supabase · Stripe · Tailwind | Full SaaS starter with auth, payments, and dashboard |
| **[api-fastapi-postgres-redis](kits/api-fastapi-postgres-redis)** | FastAPI · PostgreSQL · Redis · SQLAlchemy | Production API with async CRUD, caching, and tests |
| **[mern-stack-auth](kits/mern-stack-auth)** | React · Express.js · MongoDB | MERN Stack with JWT Auth and Docker MongoDB |
| **[t3-app-router](kits/t3-app-router)** | Next.js 14 · Prisma · tRPC | T3 Stack: Next.js 14, Tailwind, Prisma, tRPC |
| **[django-react-postgres](kits/django-react-postgres)** | Django · React · PostgreSQL | Django REST Framework backend with React frontend and Postgres |
| **[go-gin-postgres-api](kits/go-gin-postgres-api)** | Go · Gin · PostgreSQL | High performance Go API with Gin and PostgreSQL |
| **[vue-vite-firebase](kits/vue-vite-firebase)** | Vue 3 · Vite · Firebase | Vue 3 serverless frontend with Firebase auth and database |
| **[express-prisma-sqlite](kits/express-prisma-sqlite)** | Express.js · Prisma · SQLite | Fastest Node.js API setup with Express, Prisma and local SQLite |

> Want to see more? [Submit a kit →](.github/ISSUE_TEMPLATE/submit-kit.md)

---

## 🔧 CLI Commands

### `openenv list`

Browse all available kits from the registry.

```bash
openenv list                    # Show all kits
openenv list --tag saas         # Filter by tag
openenv list --json             # Raw JSON output
```

### `openenv init [kit-name]`

Scaffold a kit into your project directory.

```bash
openenv init                                    # Interactive picker
openenv init saas-nextjs-supabase-stripe        # Direct scaffold
openenv init api-fastapi-postgres-redis --dir ./my-api  # Custom directory
openenv init saas-nextjs-supabase-stripe --dry-run      # Preview only
```

### `openenv doctor`

Diagnose your local environment. It checks if you have Node.js, Docker, and the correct ports available. It even suggests how to fix issues!

```bash
openenv doctor          # Check environment
openenv doctor --fix    # Auto-fix safe issues (like npm install)
```

### `openenv deploy`

Generate deployment configurations (Dockerfiles and GitHub Actions) for your project instantly.

```bash
openenv deploy --provider render
```

---

## 📐 Kit Spec

Every openenv kit follows a [strict specification](docs/kit-spec.md):

```
kits/<kit-name>/
├── kit.json              # Metadata + health check config
├── .env.example          # Documented environment variables
├── docker-compose.yml    # Local development services
├── setup.sh              # One-command setup (idempotent)
├── README.md             # Full documentation
└── template/             # The runnable application
```

This ensures **every kit is consistent, verified, and production-ready**.

---

## 🤝 Contributing

We'd love your help! Here's how:

| Contribution | Guide |
|-------------|-------|
| 🧰 Submit a new kit | [Kit Spec](docs/kit-spec.md) + [Issue Template](.github/ISSUE_TEMPLATE/submit-kit.md) |
| 🐛 Report a bug | [Open an Issue](https://github.com/openenv/openenv/issues) |
| 📝 Improve docs | [Contributing Guide](CONTRIBUTING.md) |
| ⭐ Star this repo | It helps more than you think! |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## 🏗️ Architecture

```
openenv/
├── packages/cli/          # The `openenv` npm package
│   ├── src/index.js       # CLI entry point (Commander.js)
│   ├── src/commands/      # list, init, doctor
│   └── src/utils/         # logger, registry helpers
├── kits/                  # Starter kit templates
├── docs/                  # Specification & guides
├── registry.json          # Master kit registry
└── .github/workflows/     # CI: verify-kits + publish-cli
```

---

## 📄 License

MIT — see [LICENSE](LICENSE).

## 🚀 What's Next? (Roadmap)

We are constantly improving `openenv`. Here is what we plan to implement next:

1. **`openenv add <feature>`**: Instead of scaffolding a full kit, inject features (like Stripe, Tailwind, or Redis) directly into your existing projects.
2. **Custom GitHub Repositories**: Run `openenv init username/repo` to scaffold from any public GitHub repository, utilizing `openenv`'s robust setup checks.
3. **Cloud Environment Sync (`openenv env`)**: Securely pull `.env` secrets from Vercel, Render, or a centralized vault so you never have to copy-paste API keys again.
4. **Auto-provisioning (`openenv deploy`)**: Native integrations with Vercel and Railway APIs to automatically provision live databases and hostings straight from the CLI.

---

<div align="center">

**Built with ❤️ by the openenv community**

[Website](https://openenv.dev) · [GitHub](https://github.com/Sparkyyy45/openenv)

</div>
