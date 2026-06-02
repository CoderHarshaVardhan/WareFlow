Alembic migrations
-----------------

This folder stores Alembic migration scripts. To use migrations locally:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://user:pass@localhost:5432/wareflow
export FLASK_APP=manage.py
flask db upgrade
```

You can also run Alembic directly:

```
alembic -c migrations/alembic.ini upgrade head
```

If you need to generate a new migration after model changes, run:

```
flask db migrate -m "describe change"
```
