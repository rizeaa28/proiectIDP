import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.accounts import bp as accounts_bp
from db.db import prepare_db
from routes.accounts import init_jwt

def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "dev"),
        DATABASE=os.environ.get("DATABASE", "instance/armma.sqlite"),  # <- folosește DB partajată
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=8)
    )

    CORS(app)

    jwt = JWTManager(app)
    init_jwt(jwt)

    if test_config:
        app.config.update(test_config)

    prepare_db(app)
    app.register_blueprint(accounts_bp, url_prefix="/accounts")

    return app

