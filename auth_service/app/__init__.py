import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.routes.auth import auth_bp, init_jwt
from app.db.db import prepare_db

def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "dev"),
        DATABASE=os.environ.get("DATABASE", "instance/armma.sqlite"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=8)
    )

    CORS(app)

    jwt = JWTManager(app)
    init_jwt(jwt)

    if test_config:
        app.config.update(test_config)

    prepare_db(app)
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
