Render deployment notes
-----------------------

Example Render service for the backend:

1. Create a new Web Service on Render.
2. Connect your GitHub repo and select the `backend/` folder as the root (or use root and set build commands accordingly).
3. Build Command:

   pip install -r backend/requirements.txt && flask db upgrade

4. Start Command:

   gunicorn wsgi:app --bind 0.0.0.0:$PORT

Environment variables to set on Render:
- `DATABASE_URL` (Postgres connection)
- `SECRET_KEY`
- `FLASK_ENV=production`

For managed Postgres use Render Managed Database or Neon and provide the `DATABASE_URL`.
