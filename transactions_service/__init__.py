import os
from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.transactions import bp as transactions_bp
from routes.transactions import init_jwt
from db.db import prepare_db

def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "dev"),
        DATABASE=os.environ.get("DATABASE", "instance/armma.sqlite"),  # <- folosește DB partajată
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=8),
    )

    CORS(app)

    jwt = JWTManager(app)
    init_jwt(jwt)

    if test_config:
        app.config.update(test_config)

    os.makedirs(os.path.dirname(app.config["DATABASE"]), exist_ok=True)
    prepare_db(app)

    app.register_blueprint(transactions_bp, url_prefix="/transactions")

    return app

