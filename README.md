# EnglishLearningApp

Web app for learning English vocabulary using flashcard sets. Users create sets of word cards, study them, and track progress (new / learning / learned).

**Stack:** React + Vite · Node.js + Express · PostgreSQL · Docker Compose

## Setup

**1. Copy env file and fill in values:**

```bash
cp .env.example .env
```

`.env` variables:

```
DB_USER=        # postgres username
DB_PASSWORD=    # postgres password
DB_NAME=        # database name
DB_HOST=postgres
DB_PORT=5432

PORT=3000
JWT_SECRET=     # any random secret string

PGADMIN_EMAIL=  # pgAdmin login email
PGADMIN_PASSWORD= # pgAdmin password
```

**2. Start:**

```bash
docker compose up
```

On first run PostgreSQL initializes the schema automatically from `backend/src/db/init.sql`.

## Services

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |
| pgAdmin  | http://localhost:5050 |

## Useful commands

```bash
# Rebuild backend after dependency changes
docker compose up --build

# Stop all services
docker compose down

# Reset database (deletes all data)
docker compose down && rm -rf ./postgres-data && docker compose up
```
