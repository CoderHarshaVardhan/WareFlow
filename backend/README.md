Backend
-------

Flask backend for WareFlow. Will contain application package, migrations, and requirements.

Typical commands (once implemented):

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run
```

Migrations
----------

This project uses Flask-Migrate (Alembic). To initialize migrations locally:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=manage.py
flask db init    # run once to create migrations/ (already present as placeholder)
flask db migrate -m "initial"
flask db upgrade
```

When deploying to Render, run `flask db upgrade` during deploy or as a release step.

