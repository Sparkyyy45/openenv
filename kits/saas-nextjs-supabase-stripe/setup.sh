#!/usr/bin/env bash
# =============================================================================
# openenv — saas-nextjs-supabase-stripe setup script
# Run once after cloning to get the full stack running locally.
# Idempotent: safe to run multiple times.
# =============================================================================
set -euo pipefail

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

pass()  { echo -e "${GREEN}  ✓ $1${RESET}"; }
warn()  { echo -e "${YELLOW}  ⚠ $1${RESET}"; }
fail()  { echo -e "${RED}  ✗ $1${RESET}"; exit 1; }
info()  { echo -e "${CYAN}  → $1${RESET}"; }
title() { echo -e "\n${BOLD}$1${RESET}"; }

# ── Header ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}"
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  openenv — saas-nextjs-supabase-stripe   ║"
echo "  ║  Setup Script                            ║"
echo "  ╚══════════════════════════════════════════╝"
echo -e "${RESET}"

# ── Step 1: Check prerequisites ──────────────────────────────────────────────
title "1/5  Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
  fail "Node.js not found. Install Node.js >=18 from https://nodejs.org"
fi
NODE_VERSION=$(node -e "process.stdout.write(process.version)")
pass "Node.js ${NODE_VERSION}"

# npm
if ! command -v npm &> /dev/null; then
  fail "npm not found. Install Node.js >=18 from https://nodejs.org"
fi
pass "npm $(npm --version)"

# Docker
if ! command -v docker &> /dev/null; then
  fail "Docker not found. Install Docker Desktop from https://docs.docker.com/get-docker/"
fi
pass "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"

# Docker daemon
if ! docker info &> /dev/null; then
  fail "Docker daemon is not running. Start Docker Desktop and try again."
fi
pass "Docker daemon running"

# Docker Compose
if ! docker compose version &> /dev/null 2>&1 && ! docker-compose version &> /dev/null 2>&1; then
  fail "Docker Compose not found. Install Docker Desktop (includes Compose)."
fi
pass "Docker Compose available"

# ── Step 2: Environment file ─────────────────────────────────────────────────
title "2/5  Setting up environment..."

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    pass ".env created from .env.example"
    warn "⚠ Open .env and fill in your Supabase, Stripe, and Resend credentials"
    echo ""
    echo -e "${YELLOW}  Required values to fill in:${RESET}"
    echo -e "${YELLOW}    • NEXT_PUBLIC_SUPABASE_URL${RESET}"
    echo -e "${YELLOW}    • NEXT_PUBLIC_SUPABASE_ANON_KEY${RESET}"
    echo -e "${YELLOW}    • SUPABASE_SERVICE_ROLE_KEY${RESET}"
    echo -e "${YELLOW}    • STRIPE_SECRET_KEY${RESET}"
    echo -e "${YELLOW}    • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY${RESET}"
    echo -e "${YELLOW}    • STRIPE_WEBHOOK_SECRET${RESET}"
    echo ""
    read -p "  Press Enter after filling in .env to continue..." _
  else
    fail ".env.example not found. The repository may be incomplete."
  fi
else
  pass ".env already exists"
fi

# ── Step 3: Install Node dependencies ────────────────────────────────────────
title "3/5  Installing Node.js dependencies..."

cd template

if [ ! -d "node_modules" ]; then
  info "Running npm install..."
  npm install
  pass "Dependencies installed"
else
  pass "node_modules already present"
fi

cd ..

# ── Step 4: Start Docker services ────────────────────────────────────────────
title "4/5  Starting Docker services..."

COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
fi

info "Pulling latest images and starting containers..."
$COMPOSE_CMD up -d --build

pass "Docker services started"

# Wait for Supabase DB to be healthy
info "Waiting for Supabase database to be ready..."
ATTEMPTS=0
MAX_ATTEMPTS=30
until docker inspect --format='{{.State.Health.Status}}' saas_supabase_db 2>/dev/null | grep -q "healthy" || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
  sleep 2
  ATTEMPTS=$((ATTEMPTS + 1))
  echo -n "."
done
echo ""

if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
  warn "Database took longer than expected. Check: docker logs saas_supabase_db"
else
  pass "Supabase database is healthy"
fi

# ── Step 5: Health check ─────────────────────────────────────────────────────
title "5/5  Running health check..."

info "Waiting for app to be ready (up to 60s)..."
ATTEMPTS=0
MAX_ATTEMPTS=30
HTTP_STATUS=0
until [ "$HTTP_STATUS" -eq 200 ] || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
  sleep 2
  ATTEMPTS=$((ATTEMPTS + 1))
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "0")
done

if [ "$HTTP_STATUS" -eq 200 ]; then
  pass "App is healthy at http://localhost:3000"
else
  warn "App health check failed (status: ${HTTP_STATUS}). Check: docker logs saas_app"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}  ══════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✓ Setup complete!${RESET}"
echo ""
echo -e "  ${BOLD}Open in browser:${RESET}"
echo -e "  ${CYAN}http://localhost:3000${RESET}        — Your app"
echo -e "  ${CYAN}http://localhost:54323${RESET}       — Supabase Studio"
echo ""
echo -e "  ${BOLD}Useful commands:${RESET}"
echo -e "  ${CYAN}npm run dev${RESET}                  — Start dev server (hot reload)"
echo -e "  ${CYAN}docker compose logs -f${RESET}       — Stream all logs"
echo -e "  ${CYAN}docker compose down${RESET}           — Stop all services"
echo -e "  ${CYAN}openenv doctor${RESET}                — Check environment health"
echo ""
