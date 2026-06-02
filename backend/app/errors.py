from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        return jsonify({
            'error': e.name,
            'description': e.description,
        }), e.code

    @app.errorhandler(Exception)
    def handle_exception(e):
        # fallback for unhandled exceptions
        app.logger.exception(e)
        return jsonify({'error': 'internal_server_error', 'details': str(e)}), 500
