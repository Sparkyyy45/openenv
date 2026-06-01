<div align="center">

# 🌍 openenv

**The open standard for production-ready full-stack starter kits.**

Stop rebuilding auth, payments, and infrastructure from scratch.
Pick a kit. Run one command. Ship.

[![npm version](https://img.shields.io/npm/v/openenv?color=blue&label=npm)](https://www.npmjs.com/package/openenv)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Verify Kits](https://github.com/openenv/openenv/actions/workflows/verify-kits.yml/badge.svg)](https://github.com/openenv/openenv/actions/workflows/verify-kits.yml)

</div>

---

## The Problem

Every new project starts the same way: set up auth, configure a database, wire up payments, write Docker configs, create CI pipelines... You've done it a dozen times. It takes days.

**openenv** fixes this.

## The Solution

openenv is an **open registry of production-ready starter kits** with a CLI that scaffolds them in seconds. Every kit follows a strict spec, is verified by CI, and comes with:

- ✅ Working authentication
- ✅ Database with migrations
- ✅ Docker Compose for local dev
- ✅ Health check endpoints
- ✅ One-command setup script
- ✅ Environment variable documentation
- ✅ Deployment-ready configuration

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g openenv

# See available kits
openenv list

# Scaffold a kit
openenv init saas-nextjs-supabase-stripe

# Check your environment
openenv doctor
```

---

## 📦 Available Kits

| Kit | Stack | Description |
|-----|-------|-------------|
| **[saas-nextjs-supabase-stripe](kits/saas-nextjs-supabase-stripe)** | Next.js 14 · Supabase · Stripe · Tailwind | Full SaaS starter with auth, payments, and dashboard |
| **[api-fastapi-postgres-redis](kits/api-fastapi-postgres-redis)** | FastAPI · PostgreSQL · Redis · SQLAlchemy | Production API with async CRUD, caching, and tests |

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

Diagnose your local environment and verify everything works.

```bash
openenv doctor          # Check environment
openenv doctor --fix    # Auto-fix safe issues
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

---

<div align="center">

**Built with ❤️ by the openenv community**

[Website](https://openenv.dev) · [npm](https://www.npmjs.com/package/openenv) · [GitHub](https://github.com/openenv/openenv)

</div>
