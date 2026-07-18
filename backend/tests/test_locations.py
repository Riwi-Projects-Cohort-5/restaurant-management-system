import uuid

from fastapi.testclient import TestClient

from app.core.security import create_access_token, get_password_hash
from app.db.database import get_db
from app.db.models.location import Location
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


class TestGetLocations:
    def test_get_locations_empty(self, db_session):
        response = client.get("/api/v1/api/v1/locations/")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_locations_with_data(self, db_session):
        loc = Location(name="Terraza")
        db_session.add(loc)
        db_session.commit()

        response = client.get("/api/v1/api/v1/locations/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Terraza"

    def test_get_location_by_id(self, db_session):
        loc = Location(name="Interior")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        response = client.get(f"/api/v1/api/v1/locations/{loc.id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Interior"

    def test_get_location_by_id_not_found(self, db_session):
        fake_id = uuid.uuid4()
        response = client.get(f"/api/v1/api/v1/locations/{fake_id}")
        assert response.status_code == 404


class TestCreateLocation:
    def test_create_location(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        response = client.post(
            "/api/v1/api/v1/locations/",
            json={"name": "Barra"},
            headers=headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Barra"
        assert "id" in data

    def test_create_location_duplicate(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        client.post("/api/v1/api/v1/locations/", json={"name": "Barra"}, headers=headers)
        response = client.post("/api/v1/api/v1/locations/", json={"name": "Barra"}, headers=headers)
        assert response.status_code == 409

    def test_create_location_no_auth(self, db_session):
        response = client.post("/api/v1/api/v1/locations/", json={"name": "SinAuth"})
        assert response.status_code == 401


class TestUpdateLocation:
    def test_update_location(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        loc = Location(name="ViejoNombre")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        response = client.put(
            f"/api/v1/api/v1/locations/{loc.id}",
            json={"name": "NuevoNombre"},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["name"] == "NuevoNombre"

    def test_update_location_not_found(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        fake_id = uuid.uuid4()
        response = client.put(
            f"/api/v1/api/v1/locations/{fake_id}",
            json={"name": "NoExiste"},
            headers=headers,
        )
        assert response.status_code == 404


class TestDeleteLocation:
    def test_delete_location(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        loc = Location(name="ParaBorrar")
        db_session.add(loc)
        db_session.commit()
        db_session.refresh(loc)

        response = client.delete(f"/api/v1/api/v1/locations/{loc.id}", headers=headers)
        assert response.status_code == 204

        response = client.get(f"/api/v1/api/v1/locations/{loc.id}")
        assert response.status_code == 404

    def test_delete_location_not_found(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)

        fake_id = uuid.uuid4()
        response = client.delete(f"/api/v1/api/v1/locations/{fake_id}", headers=headers)
        assert response.status_code == 404
