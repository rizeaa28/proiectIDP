from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, get_jwt, get_jti, jwt_required, get_current_user
)
import random
import string

from db.db import get_db
from utils.response_formats import success_response, error_response, success_message_response

bp = Blueprint("accounts", __name__)

@bp.route("/create_banking_account", methods=["POST"])
@jwt_required()
def create_banking_account():
    db = get_db()
    current_user = get_current_user()

    account_name = request.json.get("account_name")
    if not account_name:
        return error_response("Field account_name missing from request.", 400)

    def generate_iban():
        country_code = "RO"
        check_digits = f"{random.randint(10, 99)}"
        bank_code = "BANK"
        account_identifier = ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))
        return f"{country_code}{check_digits}{bank_code}{account_identifier}"

    iban = generate_iban()

    try:
        db.execute(
            "INSERT INTO banking_account (username, account_name, iban) VALUES (?, ?, ?)",
            (current_user["username"], account_name, iban),
        )
        db.commit()
        return jsonify({"message": "Account created successfully", "iban": iban}), 201
    except db.IntegrityError:
        return error_response("Operation failed", 406)

@bp.route("/accounts", methods=["GET"])
@jwt_required()
def accounts():
    db = get_db()
    current_user = get_current_user()

    try:
        accounts = db.execute(
            "SELECT * FROM banking_account WHERE username=? AND is_closed=0",
            (current_user["username"],)
        ).fetchall()
        return success_message_response([dict(x) for x in accounts])
    except db.IntegrityError:
        return error_response("Operation failed", 400)

@bp.route("/inspect_banking_account", methods=["POST"])
@jwt_required()
def inspect_banking_account():
    db = get_db()
    current_user = get_current_user()
    account_id = request.json.get("account_id")

    if not account_id:
        return error_response("Field account_id missing from request.", 400)

    try:
        res = db.execute(
            "SELECT * FROM banking_account WHERE username=? AND id=?",
            (current_user["username"], account_id)
        ).fetchone()

        if res:
            return success_message_response(dict(res))
        else:
            return error_response("Account not found.", 404)
    except db.IntegrityError:
        return error_response("Operation failed", 406)

@bp.route("/close_banking_account", methods=["POST"])
@jwt_required()
def close_banking_account():
    db = get_db()
    current_user = get_current_user()
    account_id = request.json.get("account_id")

    if not account_id:
        return error_response("Field account_id missing from request.", 400)

    try:
        db.execute(
            "UPDATE banking_account SET is_closed=1 WHERE username=? AND id=?",
            (current_user["username"], account_id),
        )
        db.commit()
        return success_response()
    except db.IntegrityError:
        return error_response("Operation failed", 406)

def init_jwt(jwt):
    @jwt.user_lookup_loader
    def load_logged_in_user(jwt_header, jwt_data):
        return {"username": jwt_data["sub"]}

