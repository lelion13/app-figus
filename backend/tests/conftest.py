import os
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["JWT_SECRET"] = "test-secret"
os.environ["STICKERS_EXCEL_PATH"] = str(
    Path(__file__).resolve().parents[2]
    / "data"
    / "excel-control-album-panini-mundial-2026.xlsx"
)

import app.db.session as db_session
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.seed.seed_stickers import seed_stickers_if_empty

db_session.engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
db_session.SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=db_session.engine
)

Base.metadata.create_all(bind=db_session.engine)
_seed_db = db_session.SessionLocal()
seed_stickers_if_empty(_seed_db)
_seed_db.close()


@pytest.fixture
def db() -> Generator[Session, None, None]:
    session = db_session.SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    db.rollback()
