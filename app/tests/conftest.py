import os
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app
from db.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autofludh=False, bind=engine)

@pytest.fixture
def client():
    if os.path.exists("test.db"):
        os.remove("test.db")

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = None
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            if db is not None:
                db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client

    Base.metadata.drop_all(bind=engine)

    if os.path.exists("test.db"):
        os.remove("test.db")