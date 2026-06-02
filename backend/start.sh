#!/usr/bin/env bash
set -e

# Run DB migrations then start the app with Gunicorn
export FLASK_APP=manage.py
echo "Running migrations..."
flask db upgrade || true

echo "Starting Gunicorn"
exec gunicorn wsgi:app --bind 0.0.0.0:${PORT:-5000} --workers 4
