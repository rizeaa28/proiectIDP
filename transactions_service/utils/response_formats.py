
def create_message_response(status:str, message:str):
    return {
        "status": status,
        "message": message,
    }

def create_simple_response(status: str):
    return {
        "status": status,
    }

def success_response():
    return create_simple_response("success")

def success_message_response(message: str):
    return create_message_response("success", message)

def error_response(error: str, error_code: int):
    return (create_message_response("error", error), error_code)