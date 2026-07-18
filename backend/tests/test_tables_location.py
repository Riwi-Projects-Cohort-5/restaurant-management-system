import uuid

from fastapi.testclient import TestClient

from app.core.security import create_access_token, get_password_hash
from app.db.database import get_db
from app.db.models.location import Location
from app.db.models.table import Table, TableStatus
from app.db.models.user import User, UserRole
from app.main import app
from tests.conftest import TestingSessionLocal


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def _create_test_user(db) -> User:
    user = User(
        id=uuid.uuid4(),
        username="testadmin",
        email="test@test.com",
        hashed_password=get_password_hash("test123"),
        full_name="Test Admin",
        role=UserRole.ADMIN,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _auth_header(user_id: uuid.UUID) -> dict:
    token = create_access_token(data={"sub": str(user_id)})
    return {"Authorization": f"Bearer {token}"}


class TestTableWithLocation:
    def test_create_table_with_location_id(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        loc = Location(name="Terraza")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        response = client.post(
            "/api/v1/api/v1/tables/",
            json={"number": 10, "capacity": 4, "location_id": str(loc.id)},
            headers=headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["number"] == 10
        assert data["location_id"] == str(loc.id)

    def test_create_table_without_location(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        response = client.post(
            "/api/v1/api/v1/tables/",
            json={"number": 11, "capacity": 2},
            headers=headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["number"] == 11
        assert data["location_id"] is None

    def test_get_table_includes_location_ref(self, db_session):
        loc = Location(name="Interior")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        table = Table(number=20, capacity=6, location_id=loc.id, status=TableStatus.AVAILABLE)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        response = client.get(f"/api/v1/api/v1/tables/{table.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["location_id"] == str(loc.id)
        assert data["location_ref"] is not None
        assert data["location_ref"]["name"] == "Interior"

    def test_update_table_location_id(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        loc1 = Location(name="Interior")
        loc2 = Location(name="Terraza")
        db_session.add_all([loc1, loc2])
        db_session.commit()
        db_session.refresh(loc1)
        db_session.refresh(loc2)

        table = Table(number=30, capacity=4, location_id=loc1.id, status=TableStatus.AVAILABLE)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        response = client.put(
            f"/api/v1/api/v1/tables/{table.id}",
            json={"location_id": str(loc2.id)},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["location_id"] == str(loc2.id)

    def test_get_tables_returns_location_ref(self, db_session):
        loc = Location(name="Barra")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        table1 = Table(number=40, capacity=2, location_id=loc.id, status=TableStatus.AVAILABLE)
        table2 = Table(number=41, capacity=4, status=TableStatus.AVAILABLE)
        db_session.add_all([table1, table2])
        db_session.commit()

        response = client.get("/api/v1/api/v1/tables/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

        with_loc = [t for t in data if t["location_id"] is not None]
        without_loc = [t for t in data if t["location_id"] is None]
        assert len(with_loc) == 1
        assert len(without_loc) == 1
        assert with_loc[0]["location_ref"]["name"] == "Barra"
        assert without_loc[0]["location_ref"] is None

    def test_delete_location_sets_tables_null(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        loc = Location(name="Temporal")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        table = Table(number=50, capacity=4, location_id=loc.id, status=TableStatus.AVAILABLE)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        response = client.delete(f"/api/v1/api/v1/locations/{loc.id}", headers=headers)
        assert response.status_code == 204

        db_session.refresh(table)
        assert table.location_id is None

    def test_location_ref_resolves_correctly(self, db_session):
        loc = Location(name="VIP")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        table = Table(number=60, capacity=8, location_id=loc.id, status=TableStatus.AVAILABLE)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        response = client.get(f"/api/v1/api/v1/tables/{table.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["location_id"] == str(loc.id)
        assert data["location_ref"]["name"] == "VIP"
