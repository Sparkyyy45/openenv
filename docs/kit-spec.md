# openenv Kit Specification v1.0

> The open standard for production-ready full-stack starter kits.

This document defines the required structure, files, and conventions that every openenv kit must follow.

---

## 1. Directory Structure

Every kit lives in `kits/<kit-name>/` and must contain:

```
kits/<kit-name>/
├── kit.json              # REQUIRED — Kit metadata
├── .env.example          # REQUIRED — Documented environment variables
├── docker-compose.yml    # REQUIRED — Local development services
├── setup.sh              # REQUIRED — One-command setup script
├── README.md             # REQUIRED — Documentation
└── template/             # REQUIRED — The application template
    └── ...               # Kit-specific application files
```

---

## 2. `kit.json` — Kit Metadata

The metadata file that the openenv CLI reads to scaffold and verify kits.

### Required fields

| Field            | Type     | Description                                  |
| ---------------- | -------- | -------------------------------------------- |
| `name`           | string   | Kit name (lowercase, hyphen-separated)       |
| `version`        | string   | Semantic version (e.g. `1.0.0`)              |
| `description`    | string   | One-line human-readable description          |
| `author`         | string   | Author name or GitHub handle                 |
| `required_ports` | number[] | Ports the kit needs (e.g. `[3000, 5432]`)    |
| `setup_commands` | string[] | Commands to run during setup                 |
| `health_check`   | object   | Health check configuration (see below)       |

### `health_check` object

| Field             | Type   | Description                            |
| ----------------- | ------ | -------------------------------------- |
| `url`             | string | Health check URL                       |
| `timeout_seconds` | number | Max seconds to wait for healthy status |
| `expected_status` | number | Expected HTTP status code (usually 200)|

### Example

```json
{
  "name": "my-awesome-kit",
  "version": "1.0.0",
  "description": "A brief description of what this kit does",
  "author": "your-github-handle",
  "required_ports": [3000, 5432],
  "setup_commands": ["npm install", "docker-compose up -d", "npm run dev"],
  "health_check": {
    "url": "http://localhost:3000/api/health",
    "timeout_seconds": 30,
    "expected_status": 200
  }
}
```

---

## 3. `.env.example` — Environment Variables

- **MUST** list every environment variable the kit uses
- **MUST** include comments explaining where to get each value
- **MUST** use placeholder values, never real secrets
- **SHOULD** group variables by service with comment headers
- **SHOULD** provide sensible defaults for local development

### Format

```bash
# ─── Service Name ─────────────────────────────────────────────────────────────
# Get from: https://example.com/settings
VARIABLE_NAME=placeholder_value
```

---

## 4. `docker-compose.yml` — Local Services

- **MUST** define all infrastructure services (databases, caches, etc.)
- **MUST** include healthchecks for every service
- **MUST** use named volumes for data persistence
- **MUST** use a dedicated network
- **SHOULD** use Alpine-based images where possible
- **SHOULD** reference env vars with `${VAR:-default}` syntax

---

## 5. `setup.sh` — Setup Script

The one-command setup experience. Must be:

- **Idempotent** — safe to run multiple times
- **Prerequisite-checking** — verify Node/Python/Docker/etc. before proceeding
- **Colorized** — clear pass/fail/warning indicators
- **Self-contained** — should not require additional manual steps

### Required behavior

1. Check all prerequisites and fail fast with helpful error messages
2. Create `.env` from `.env.example` (if `.env` doesn't exist)
3. Install application dependencies
4. Start Docker services
5. Wait for services to be healthy
6. Run health check
7. Print success message with useful URLs and commands

---

## 6. `README.md` — Documentation

Every kit README must include:

| Section             | Description                                   |
| ------------------- | --------------------------------------------- |
| **Features**        | What the kit includes (table format)          |
| **Project Structure** | Directory tree with file descriptions       |
| **Quick Start**     | Step-by-step setup instructions               |
| **Environment Variables** | Table of key env vars                   |
| **Docker Services** | Services, ports, and images table             |
| **Development**     | Dev commands (start, test, lint)              |
| **Deployment**      | How to deploy to production                   |
| **Health Check**    | How to verify the app is running              |

---

## 7. `template/` — Application Template

The `template/` directory contains the actual application that gets scaffolded. It must:

- **Be a complete, runnable application** — no missing files
- **Include a health check endpoint** at the path specified in `kit.json`
- **Use the environment variables** defined in `.env.example`
- **Follow the conventions** of its primary framework
- **Include no secrets, API keys, or credentials**

---

## 8. Registry Entry

Every kit must have an entry in the root `registry.json`:

```json
{
  "name": "kit-name",
  "description": "One-line description",
  "author": "author-handle",
  "tags": ["tag1", "tag2"],
  "repo": "https://github.com/openenv/openenv",
  "template_path": "kits/kit-name/template",
  "verified": true,
  "last_verified": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "required_ports": [3000],
  "tech": {
    "framework": "Framework Name",
    "language": "Language"
  }
}
```

### Required registry fields

| Field           | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| `name`          | string   | Must match `kit.json` name               |
| `description`   | string   | Short description for CLI display        |
| `author`        | string   | Kit author                               |
| `tags`          | string[] | Searchable tags for `openenv list --tag` |
| `repo`          | string   | Git repository URL                       |
| `template_path` | string   | Path to template dir within the repo     |
| `verified`      | boolean  | Has the kit been verified by maintainers |
| `version`       | string   | Must match `kit.json` version            |

---

## 9. Naming Convention

Kit names must be:

- **Lowercase** with hyphens as separators
- **Descriptive** of the stack: `{type}-{framework}-{database}-{extras}`
- **Unique** within the registry

Examples:
- `saas-nextjs-supabase-stripe`
- `api-fastapi-postgres-redis`
- `blog-astro-mdx-tailwind`
- `ecommerce-remix-prisma-stripe`

---

## 10. Verification

A kit is considered **verified** when it passes all of the following:

1. ✅ `kit.json` has all required fields
2. ✅ All required files exist
3. ✅ `./setup.sh` completes successfully on a clean machine
4. ✅ Health check endpoint returns expected status
5. ✅ `openenv doctor` passes all checks
6. ✅ No hardcoded secrets or credentials
7. ✅ CI pipeline passes (`verify-kits.yml`)
