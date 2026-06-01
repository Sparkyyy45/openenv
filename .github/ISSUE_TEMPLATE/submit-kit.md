---
name: 🧰 Submit a Kit
about: Propose a new starter kit for the openenv registry
title: "[Kit] "
labels: ["kit-submission", "needs-review"]
assignees: []
---

## Kit Details

**Kit name** (lowercase, hyphen-separated):
<!-- e.g. blog-astro-mdx-tailwind -->

**One-line description:**
<!-- e.g. "Static blog with Astro, MDX content, and Tailwind CSS" -->

**Tech stack:**
<!-- List the main technologies -->
- Framework:
- Database:
- Language:
- Other:

---

## Checklist

Before submitting, ensure your kit follows the [openenv kit spec](../docs/kit-spec.md):

- [ ] `kit.json` — Valid metadata with name, version, description, health_check
- [ ] `.env.example` — All env vars documented with comments
- [ ] `docker-compose.yml` — All services with healthchecks
- [ ] `setup.sh` — Idempotent, checks prerequisites, colorized output
- [ ] `README.md` — Quick start, project structure, deployment guide
- [ ] `template/` — Complete, runnable application

### Quality gates

- [ ] App starts successfully with `./setup.sh`
- [ ] Health check endpoint returns `200`
- [ ] `openenv doctor` passes all checks
- [ ] No hardcoded secrets or credentials
- [ ] All ports declared in `kit.json.required_ports`

---

## Repository

**Link to your kit repository** (or indicate if this is a PR to this repo):

---

## Additional context

<!-- Anything else reviewers should know? -->
