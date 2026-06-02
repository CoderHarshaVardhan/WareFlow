import os
from flask import Flask

# Zero-dependency, lightweight .env loader
try:
    dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(dotenv_path):
        with open(dotenv_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, val = line.split('=', 1)
                    os.environ[key.strip()] = val.strip()
except Exception:
    pass

from .extensions import db, migrate, ma, cors
from .config import Config


def create_app(config_object=None):
    app = Flask(__name__, instance_relative_config=False)

    # configuration: use provided config object or default Config
    app.config.from_object(config_object or Config)

    # initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    cors.init_app(app)

    # register blueprints
    from .api.products import products_bp
    from .api.customers import customers_bp
    from .api.orders import orders_bp
    from .api.dashboard import dashboard_bp
    from .errors import register_error_handlers
    from .api.docs import docs_bp

    app.register_blueprint(products_bp, url_prefix="/api/v1/products")
    app.register_blueprint(customers_bp, url_prefix="/api/v1/customers")
    app.register_blueprint(orders_bp, url_prefix="/api/v1/orders")
    app.register_blueprint(dashboard_bp, url_prefix="/api/v1/dashboard")
    app.register_blueprint(docs_bp, url_prefix="")

    # register error handlers
    register_error_handlers(app)

    return app
