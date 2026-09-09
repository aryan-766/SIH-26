import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token, require_role, scope_filter
from app.db.session import init_db, SessionLocal
from app.db.models import User, BusinessApplication
from app.db.seed_data import seed_database

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    db = SessionLocal()
    seed_database(db)
    db.close()

def test_jwt_generation_and_verification():
    token = create_access_token(data={
        "sub": "officer_district_gkp",
        "role": "district_officer",
        "district_id": "dist_gorakhpur"
    })
    assert isinstance(token, str)
    assert len(token) > 20

def test_district_officer_scoping(setup_db):
    db = SessionLocal()
    try:
        # Create a mock Gorakhpur officer user object
        gkp_officer = db.query(User).filter(User.id == "officer_district_gkp").first()
        assert gkp_officer is not None
        assert gkp_officer.role == "district_officer"
        assert gkp_officer.district_id == "dist_gorakhpur"

        # Apply scope_filter for District Officer
        base_query = db.query(BusinessApplication)
        scoper = scope_filter(gkp_officer)
        scoped_query = scoper.apply_district(base_query, BusinessApplication)
        results = scoped_query.all()

        # All results MUST belong to Gorakhpur
        for app in results:
            assert app.district_id == "dist_gorakhpur"

        # Now test Super Admin scoping
        super_admin = db.query(User).filter(User.id == "admin_super").first()
        admin_scoper = scope_filter(super_admin)
        admin_scoped_query = admin_scoper.apply_district(base_query, BusinessApplication)
        all_results = admin_scoped_query.all()
        # Super admin sees all districts
        assert len(all_results) >= len(results)
    finally:
        db.close()

def test_application_action_with_officer_token():
    # Login as District Officer
    login_res = client.post("/api/v1/auth/officer-login", json={
        "email": "district_officer_gkp@nic.in",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Take action on app_103
    action_res = client.post(
        "/api/v1/officer/application/app_103/action",
        headers=headers,
        json={"action": "approve", "notes": "Approved in Task Force meeting."}
    )
    assert action_res.status_code == 200
    assert action_res.json()["new_status"] == "approved"
