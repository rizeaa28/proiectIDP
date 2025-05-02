import os
import tempfile

import pytest
import json

from werkzeug.datastructures import Authorization

from armma import create_app
from armma.db.db import get_db
from armma.db.db import create_db


# read in SQL for populating test data
with open(os.path.join(os.path.dirname(__file__), "db", "data.sql"), "rb") as f:
    _data_sql = f.read().decode("utf8")


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    # create the app with common test config
    app = create_app({"TESTING": True, "DATABASE": db_path})

    # create the database and load test data
    with app.app_context():
        create_db()
        get_db().executescript(_data_sql)

    yield app

    # close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


class AuthActions:
    """Facilitates sending authenticated requests."""
    def __init__(self, client):
        self._client = client
        self._token = ""

    def login(self, username="test", password="test"):
        response = self._client.post("/login", data={"username": username, "password": password})

        response_data = json.loads(response.data)

        if "access_token" in response_data:
            self._token = response_data["access_token"]

        return response

    def get(self, *args, **kwargs):
        """Simply a wrapper over the client's get() method that adds the bearer token."""
        if self._token:
            kwargs["auth"] = Authorization("bearer", token=self._token)
        return self._client.get(*args, **kwargs)

    def post(self, *args, **kwargs):
        """Simply a wrapper over the client's post() method that adds the bearer token."""
        if self._token:
            kwargs["auth"] = Authorization("bearer", token=self._token)
        return self._client.post(*args, **kwargs)

    def logout(self):
        return self.get("/logout")


@pytest.fixture
def auth(client):
    return AuthActions(client)
