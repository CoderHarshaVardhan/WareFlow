# Deployment Guide

This document explains how to deploy WareFlow backend (Flask) and frontend (Vite React).

Backend (Render)
- Ensure `DATABASE_URL` environment variable points to a Postgres instance (Neon or Render Postgres).
- Set `SECRET_KEY` and `FLASK_ENV=production`.
- Build command (Render):

```
pip install -r backend/requirements.txt
flask db upgrade
```

- Start command:

```
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

Alternatively use the provided `backend/Procfile` or `backend/start.sh` to run migrations then start.

Frontend (Vercel)
- Configure project in Vercel and set root to `frontend/`.
- Build command: `npm run build` (or `pnpm build`)
- Output directory: `dist`
- Ensure `VITE_API_BASE_URL` is set in Vercel environment variables.

Database (Neon / Render Postgres)
- Create a managed Postgres instance and copy the connection string into `DATABASE_URL`.
- Run migrations: `flask db upgrade` after deploying or as a pre-release step.

CI
- GitHub Actions workflow at `.github/workflows/ci.yml` runs backend tests.
