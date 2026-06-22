# MatInformatics — Local Run Guide

This repository includes a Node/TypeScript backend, a Next.js frontend, and an ML microservice.

Quick start (recommended: Docker)

1. Docker Compose (build and run all services):

```powershell
docker compose up --build
```

This starts services:
- `backend` (Node, port 5000)
- `frontend` (Next.js, port 3000)
- `ml-service` (ML microservice, port 8000)
- `mongodb` (port 27017)
- `redis` (port 6379)

Local dev (without Docker)

1. Start MongoDB and Redis locally (or run them in Docker):

```powershell
# run only DBs with docker-compose.override.yml
docker compose up -d
```

Or start them manually without Docker by installing MongoDB and Redis locally.

2. ML service — Python FastAPI service:

```powershell
cd ml-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

3. Backend:

```powershell
cd backend
npm install
# dev with ts-node + nodemon
npm run dev
# or build + start
npm run build
npm start
```

Set environment variables from `.env.example` or export them in your shell.

4. Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Health endpoints
- Backend: `http://localhost:5000/health`
- ML service: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

Notes
- The Python FastAPI ML service may fail on some Windows setups due to missing precompiled `pydantic_core` wheels. If you see that issue, reinstall the Python packages in the `ml-service` venv.
- The current local setup uses the Python ML service at `http://localhost:8000`.