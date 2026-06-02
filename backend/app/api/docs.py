import os
from flask import Blueprint, send_from_directory, current_app, abort

docs_bp = Blueprint('docs', __name__)

HERE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DOCS_DIR = os.path.join(HERE, 'docs')


@docs_bp.route('/openapi.yaml')
def openapi_yaml():
    if not os.path.exists(os.path.join(DOCS_DIR, 'openapi.yaml')):
        abort(404)
    return send_from_directory(DOCS_DIR, 'openapi.yaml')


@docs_bp.route('/docs')
def redoc():
    # serve the redoc HTML which references openapi.yaml in same folder
    if not os.path.exists(os.path.join(DOCS_DIR, 'redoc.html')):
        abort(404)
    return send_from_directory(DOCS_DIR, 'redoc.html')
