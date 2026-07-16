import os
from pathlib import Path

from dotenv import load_dotenv
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.db.database import Base

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

TEST_DATABASE_URL = os.environ["TEST_DATABASE_URL"]


def _ensure_test_database():
    base_url = TEST_DATABASE_URL.rsplit("/", 1)[0]
    db_name = TEST_DATABASE_URL.rsplit("/", 1)[1]
    engine = create_engine(base_url)
    with engine.connect() as conn:
        conn.execute(text("COMMIT"))
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": db_name}
        ).scalar()
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{db_name}"'))
    engine.dispose()


_ensure_test_database()

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
