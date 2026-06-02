# Run locally (developer guide)

This guide helps run WareFlow backend and frontend locally.

Backend
-------

1. Create and activate virtual environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Configure environment variables (example)

```bash
export DATABASE_URL=postgresql://user:pass@localhost:5432/wareflow
export FLASK_APP=manage.py
export FLASK_ENV=development
```

4. Initialize or upgrade database

```bash
flask db upgrade
```

5. Run the server

```bash
flask run
```

Frontend
--------

1. Install dependencies and run dev server

```bash
cd frontend
npm install
npm run dev
```

Notes and troubleshooting
-------------------------
- If `pip install` fails due to system restrictions, ensure you have a virtualenv activated as shown above.
- If you cannot connect to Postgres locally, consider using Docker or a managed DB and set `DATABASE_URL` accordingly.
