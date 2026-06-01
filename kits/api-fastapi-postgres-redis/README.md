# 🚀 api-fastapi-postgres-redis

> **Production API starter kit** — FastAPI, PostgreSQL, Redis, async SQLAlchemy, Docker Compose.
>
> Part of the [openenv](https://openenv.dev) open standard for production-ready starter kits.

---

## ✨ Features

| Category       | What you get                                                       |
| -------------- | ------------------------------------------------------------------ |
| **Framework**  | FastAPI with async/await, auto-generated OpenAPI docs              |
| **Database**   | PostgreSQL 16 + async SQLAlchemy 2.0 with Alembic-ready models    |
| **Cache**      | Redis 7 with AOF persistence and connection pooling                |
| **Testing**    | pytest + httpx async test client, pre-configured                   |
| **DX**         | Docker Compose, virtual env, hot reload, type hints everywhere     |
| **Monitoring** | `/api/health` endpoint with DB + Redis connectivity checks         |

---

## 📁 Project Structure

```
api-fastapi-postgres-redis/
├── kit.json                  # openenv kit metadata
├── .env.example              # All required env vars (documented)
├── docker-compose.yml        # PostgreSQL + Redis + App
├── setup.sh                  # One-command local setup
├── README.md                 # You are here
└── template/                 # ← Your FastAPI app
    ├── main.py               # App entrypoint (uvicorn target)
    ├── requirements.txt      # Pinned dependencies
    ├── app/
    │   ├── __init__.py
    │   ├── config.py          # Pydantic settings (env vars)
    │   ├── database.py        # Async SQLAlchemy engine + session
    │   ├── models/
    │   │   ├── __init__.py
    │   │   └── user.py        # User SQLAlchemy model
    │   ├── routers/
    │   │   ├── __init__.py
    │   │   ├── health.py      # Health check router
    │   │   └── users.py       # CRUD users router
    │   └── schemas/
    │       ├── __init__.py
    │       └── user.py        # Pydantic request/response schemas
    └── tests/
        └── test_main.py      # Async test suite with httpx
```

---

## 🏁 Quick Start

### Prerequisites

| Tool       | Version | Install                                    |
| ---------- | ------- | ------------------------------------------ |
| Python     | ≥ 3.11  | [python.org](https://python.org)           |
| Docker     | Latest  | [docker.com](https://docs.docker.com/get-docker/) |

### 1. Scaffold with openenv

```bash
npx openenv init api-fastapi-postgres-redis
cd api-fastapi-postgres-redis
```

### 2. Configure environment

```bash
cp .env.example .env
# Defaults work for local dev — adjust as needed
```

### 3. Run setup

```bash
chmod +x setup.sh
./setup.sh
```

### 4. Start the API

```bash
cd template
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Open your API

| Service          | URL                                |
| ---------------- | ---------------------------------- |
| **API Root**     | [http://localhost:8000](http://localhost:8000) |
| **Swagger UI**   | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **ReDoc**        | [http://localhost:8000/redoc](http://localhost:8000/redoc) |
| **Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) |

---

## 🔑 Environment Variables

See [`.env.example`](.env.example) for all variables. Key ones:

| Variable           | Default     | Description                     |
| ------------------ | ----------- | ------------------------------- |
| `DATABASE_URL`     | (composed)  | Async PostgreSQL connection URL |
| `REDIS_URL`        | (composed)  | Redis connection URL            |
| `APP_ENV`          | development | Environment name                |
| `DEBUG`            | true        | Enable debug mode               |
| `CORS_ORIGINS`     | localhost   | Comma-separated allowed origins |

---

## 📡 API Endpoints

| Method | Path              | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/health`     | Health check (DB+Redis)  |
| GET    | `/api/users`      | List all users           |
| POST   | `/api/users`      | Create a user            |
| GET    | `/api/users/{id}` | Get user by ID           |
| PATCH  | `/api/users/{id}` | Update user              |
| DELETE | `/api/users/{id}` | Delete user              |

---

## 🐳 Docker Services

```bash
docker compose up -d          # Start Postgres + Redis
docker compose logs -f        # Stream logs
docker compose down           # Stop services
docker compose down -v        # Stop and delete volumes
```

| Service    | Port | Image              |
| ---------- | ---- | ------------------ |
| PostgreSQL | 5432 | `postgres:16-alpine` |
| Redis      | 6379 | `redis:7-alpine`   |

---

## 🧪 Testing

```bash
cd template
source venv/bin/activate
pytest -v                # Run all tests
pytest --cov=app         # With coverage
```

---

## 🚀 Deployment

### Docker

```bash
docker compose -f docker-compose.yml up -d --build
```

### Manual

```bash
cd template
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🩺 Health Check

```bash
curl http://localhost:8000/api/health
# → {"status":"ok","database":"connected","redis":"connected","timestamp":"..."}

openenv doctor   # Full environment diagnostic
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://openenv.dev">openenv</a>
</p>
