WareFlow
=========

Inventory & Order Management System (MVP)

Tech: Flask, PostgreSQL, SQLAlchemy, Marshmallow; React (Vite), Tailwind.

This repo hosts design, docs, and implementation for WareFlow.

Next steps:
- Implement backend Flask scaffold
- Design DB models and migrations
- Scaffold frontend Vite app

Getting started (local development)
----------------------------------

Backend (Python):

```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://user:pass@localhost:5432/wareflow
export FLASK_APP=manage.py
flask db upgrade
flask run
```

Frontend (Node):

```
cd frontend
npm install
npm run dev
```

Notes:
- If your environment restricts system pip (PEP 668), create and activate a virtualenv as above before installing.
- The project contains `infra/` manifests for Render and `frontend/vercel.json` for Vercel.

