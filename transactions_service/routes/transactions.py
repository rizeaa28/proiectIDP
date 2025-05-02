from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from db.db import get_db
from utils.response_formats import success_response, error_response, success_message_response

bp = Blueprint("transactions", __name__)

@bp.route("/add_balance", methods=["POST"])
@jwt_required()
def add_balance():
    db = get_db()
    current_user = get_current_user()

    account_id = request.json.get("account_id")
    amount = request.json.get("amount")

    if not account_id:
        return error_response("Field account_id missing from request.", 400)
    if amount is None:
        return error_response("Field amount missing from request.", 400)

    try:
        account = db.execute(
            "SELECT * FROM banking_account WHERE username=? AND id=? AND is_closed=0 AND is_frozen=0",
            (current_user["username"], account_id)
        ).fetchone()

        if not account:
            return error_response("Account not found or access denied.", 404)

        db.execute(
            "UPDATE banking_account SET balance=balance+? WHERE id=?",
            (amount, account_id)
        )
        db.commit()
        return success_response()
    except Exception as e:
        return error_response(f"Operation failed: {str(e)}", 400)

@bp.route("/transfer_balance", methods=["POST"])
@jwt_required()
def transfer_balance():
    db = get_db()
    current_user = get_current_user()

    from_iban = request.json.get("from_account")
    to_iban = request.json.get("to_account")
    amount = request.json.get("amount")

    if not from_iban or not to_iban or amount is None:
        return error_response("Missing fields", 400)

    try:
        from_account = db.execute(
            "SELECT id, balance FROM banking_account WHERE iban=? AND username=? AND is_closed=0 AND is_frozen=0",
            (from_iban, current_user["username"])
        ).fetchone()

        if not from_account:
            return error_response("Source account not found or access denied.", 404)
        if from_account["balance"] < amount:
            return error_response("Insufficient funds.", 406)

        to_account = db.execute(
            "SELECT id FROM banking_account WHERE iban=? AND is_closed=0 AND is_frozen=0",
            (to_iban,)
        ).fetchone()

        to_local = True if to_account else False
        from_id = from_account["id"]
        to_id = to_account["id"] if to_local else -1

        db.execute("UPDATE banking_account SET balance=balance-? WHERE id=?", (amount, from_id))
        if to_local:
            db.execute("UPDATE banking_account SET balance=balance+? WHERE id=?", (amount, to_id))

        db.execute(
            "INSERT INTO bank_transaction (from_banking_account_id, to_banking_account_id, amount, external_to_iban) VALUES (?, ?, ?, ?)",
            (from_id, to_id, amount, None if to_local else to_iban)
        )
        db.commit()
        return success_response()
    except Exception as e:
        return error_response(f"Transaction failed: {str(e)}", 400)

@bp.route("/transactions", methods=["GET"])
@jwt_required()
def transactions():
    db = get_db()
    current_user = get_current_user()

    try:
        results = db.execute("""
            SELECT bt.id, bt.amount, bt.transaction_time,
                   fba.iban AS from_iban, tba.iban AS to_iban,
                   fba.account_name AS from_account, tba.account_name AS to_account,
                   bt.to_banking_account_id, bt.external_to_iban
            FROM bank_transaction bt
            LEFT JOIN banking_account fba ON bt.from_banking_account_id = fba.id
            LEFT JOIN banking_account tba ON bt.to_banking_account_id = tba.id
            WHERE fba.username = ? OR tba.username = ?
            ORDER BY bt.transaction_time DESC
        """, (current_user["username"], current_user["username"])).fetchall()

        transactions = []
        for tx in results:
            tx = dict(tx)
            if tx["to_banking_account_id"] == -1:
                tx["to_iban"] = tx["external_to_iban"]
            transactions.append(tx)

        return success_message_response(transactions)
    except Exception as e:
        return error_response(f"Failed to fetch transactions: {str(e)}", 400)

def init_jwt(jwt):
    @jwt.user_lookup_loader
    def load_logged_in_user(jwt_header, jwt_data):
        return {"username": jwt_data["sub"]}

