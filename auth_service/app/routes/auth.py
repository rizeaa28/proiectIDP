from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, get_jwt, jwt_required, get_current_user, get_jti
)
from werkzeug.security import generate_password_hash, check_password_hash

from app.db.db import get_db
from app.utils.response_formats import success_response, error_response, success_message_response

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    db = get_db()
    error = None

    if not "username" in request.json:
        error = "Mail is required."
    elif not "password" in request.json:
        error = "Password is required."
    elif not "real_name" in request.json:
        error = "Name is required."

    if error is None:
        username = request.json["username"]
        password = request.json["password"]
        real_name = request.json["real_name"]
        try:
            db.execute(
                "INSERT INTO user (username, password, real_name) VALUES (?, ?, ?)",
                (username, generate_password_hash(password), real_name),
            )
            db.commit()
        except db.IntegrityError:
            error = f"User {username} is already registered."
        else:
            return success_response()

    return error_response(error, 409)

@auth_bp.route("/login", methods=["POST"])
def login():
    db = get_db()
    error = None

    if "username" not in request.json:
        error = "Missing field username."
    elif "password" not in request.json:
        error = "Mising field password."

    if error is None:
        username = request.json["username"]
        password = request.json["password"]
        user = db.execute(
            "SELECT * FROM user WHERE username = ?", (username,)
        ).fetchone()

        if user is None:
            error = "Incorrect username."
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password."

    if error is None:
        access_token = create_access_token(identity=username)
        try:
            db.execute("INSERT INTO token(jti) VALUES (?)", (get_jti(access_token),))
            db.commit()
        except db.IntegrityError:
            error = f"Token error for user {username}."

        response = success_response()
        response["access_token"] = access_token
        return response

    return error_response(error, 401)

@auth_bp.route("/logout", methods=["POST", "GET"])
@jwt_required()
def logout():
    db = get_db()
    db.execute("UPDATE token SET expired = 1 WHERE jti = ?", (get_jwt()["jti"],))
    db.commit()
    return success_response()

@auth_bp.route("/account_info", methods=["POST", "GET"])
@jwt_required()
def account_info():
    db = get_db()
    current_user = get_current_user()

    data = db.execute("""
        SELECT id, username, is_admin, real_name, address, city, country 
        FROM user 
        WHERE id = ?
    """, (current_user["id"],)).fetchone()

    return success_message_response(dict(data))

@auth_bp.route("/logged_in_check")
@jwt_required(optional=True)
def logged_in_test():
    current_user = get_current_user()

    if current_user:
        response = success_response()
        response["user"] = current_user
        return response

    return error_response("You are not logged in.", 401)

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required()
def refresh():
    db = get_db()
    current_user = get_current_user()
    access_token = create_access_token(identity=current_user)

    db.execute("INSERT INTO token(jti) VALUES (?)", (get_jti(access_token),))
    db.commit()

    response = success_response()
    response["access_token"] = access_token
    return response

@auth_bp.route("/update_profile", methods=["POST"])
@jwt_required()
def update_profile():
    db = get_db()
    current_user = get_current_user()
    data = request.json

    real_name = data.get("real_name")
    address = data.get("address")
    city = data.get("city")
    country = data.get("country")
    new_password = data.get("new_password")
    repeat_password = data.get("repeat_password")

    if new_password and new_password != repeat_password:
        return error_response("Passwords do not match", 400)

    try:
        db.execute(
            """
            UPDATE user
            SET real_name = ?, address = ?, city = ?, country = ?
            WHERE id = ?
            """,
            (real_name, address, city, country, current_user["id"]),
        )

        if new_password:
            db.execute(
                """
                UPDATE user
                SET password = ?
                WHERE id = ?
                """,
                (generate_password_hash(new_password), current_user["id"]),
            )

        db.commit()
        return success_response()
    except db.IntegrityError:
        return error_response("Profile update failed", 400)
    
def init_jwt(jwt):
    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
        db = get_db()
        jti = jwt_payload["jti"]
        token = db.execute("SELECT expired FROM token WHERE jti = ?", (jti,)).fetchone()
        return token is not None and token["expired"] == 1

    @jwt.user_lookup_loader
    def load_logged_in_user(jwt_header, jwt_data):
        username = jwt_data["sub"]
        return dict(get_db().execute(
            "SELECT id, username, is_admin FROM user WHERE username = ?", (username,)
        ).fetchone())

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user

