#!/usr/bin/env bash
# =============================================================================
# openenv — api-fastapi-postgres-redis setup script
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
echo "  ║  openenv — api-fastapi-postgres-redis    ║"
echo "  ║  Setup Script                            ║"
echo "  ╚══════════════════════════════════════════╝"
echo -e "${RESET}"

# ── Step 1: Check prerequisites ──────────────────────────────────────────────
title "1/5  Checking prerequisites..."

# Python
if ! command -v python3 &> /dev/null; then
  fail "Python 3 not found. Install Python >=3.11 from https://python.org"
fi
PYTHON_VERSION=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
pass "Python ${PYTHON_VERSION}"

# pip
if ! command -v pip3 &> /dev/null && ! python3 -m pip --version &> /dev/null; then
  fail "pip not found. Install pip: python3 -m ensurepip --upgrade"
fi
pass "pip available"

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
    warn "Review .env and adjust settings if needed (defaults work for local dev)"
  else
    fail ".env.example not found. The repository may be incomplete."
  fi
else
  pass ".env already exists"
fi

# ── Step 3: Python virtual environment + dependencies ────────────────────────
title "3/5  Installing Python dependencies..."

cd template

if [ ! -d "venv" ]; then
  info "Creating virtual environment..."
  python3 -m venv venv
  pass "Virtual environment created"
fi

# Activate venv
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

info "Installing dependencies from requirements.txt..."
pip install -r requirements.txt --quiet
pass "Dependencies installed"

cd ..

# ── Step 4: Start Docker services ────────────────────────────────────────────
title "4/5  Starting Docker services..."

COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
fi

info "Pulling latest images and starting containers..."
$COMPOSE_CMD up -d postgres redis

pass "Docker services started"

# Wait for Postgres to be healthy
info "Waiting for PostgreSQL to be ready..."
ATTEMPTS=0
MAX_ATTEMPTS=30
until docker inspect --format='{{.State.Health.Status}}' api_postgres 2>/dev/null | grep -q "healthy" || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
  sleep 2
  ATTEMPTS=$((ATTEMPTS + 1))
  echo -n "."
done
echo ""

if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
  warn "PostgreSQL took longer than expected. Check: docker logs api_postgres"
else
  pass "PostgreSQL is healthy"
fi

# Wait for Redis to be healthy
info "Waiting for Redis to be ready..."
ATTEMPTS=0
until docker inspect --format='{{.State.Health.Status}}' api_redis 2>/dev/null | grep -q "healthy" || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
  sleep 2
  ATTEMPTS=$((ATTEMPTS + 1))
  echo -n "."
done
echo ""

if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
  warn "Redis took longer than expected. Check: docker logs api_redis"
else
  pass "Redis is healthy"
fi

# ── Step 5: Start the API and health check ───────────────────────────────────
title "5/5  Starting the API..."

cd template
info "Starting FastAPI with uvicorn..."
echo ""
echo -e "${CYAN}  Run this in a separate terminal:${RESET}"
echo -e "${BOLD}    cd template && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000${RESET}"
echo ""
cd ..

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}  ══════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✓ Setup complete!${RESET}"
echo ""
echo -e "  ${BOLD}Open in browser:${RESET}"
echo -e "  ${CYAN}http://localhost:8000${RESET}            — API root"
echo -e "  ${CYAN}http://localhost:8000/docs${RESET}       — Swagger UI"
echo -e "  ${CYAN}http://localhost:8000/redoc${RESET}      — ReDoc"
echo -e "  ${CYAN}http://localhost:8000/api/health${RESET} — Health check"
echo ""
echo -e "  ${BOLD}Useful commands:${RESET}"
echo -e "  ${CYAN}uvicorn main:app --reload${RESET}       — Start dev server"
echo -e "  ${CYAN}pytest${RESET}                          — Run tests"
echo -e "  ${CYAN}docker compose logs -f${RESET}          — Stream DB/Redis logs"
echo -e "  ${CYAN}docker compose down${RESET}             — Stop all services"
echo -e "  ${CYAN}openenv doctor${RESET}                  — Check environment health"
echo ""
