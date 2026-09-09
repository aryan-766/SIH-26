import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db, SessionLocal
from app.db.seed_data import seed_database

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    db = SessionLocal()
    seed_database(db)
    db.close()

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["health"] == "operational"
    assert "modules" in data

def test_health_check_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data
    assert "database" in data
    assert "cache_layer" in data
    assert "dpdp_compliance" in data

def test_auth_otp_flow():
    # 1. Send OTP
    send_res = client.post("/api/v1/auth/send-otp", json={"phone": "9876543210"})
    assert send_res.status_code == 200
    assert send_res.json()["success"] is True

    # 2. Verify OTP
    verify_res = client.post("/api/v1/auth/verify-otp", json={
        "phone": "9876543210",
        "otp": "123456",
        "full_name": "Ramesh Yadav"
    })
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert "access_token" in verify_data
    assert verify_data["user"]["phone"] == "9876543210"

def test_officer_login():
    res = client.post("/api/v1/auth/officer-login", json={
        "email": "district_officer_gkp@nic.in",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "district_officer"

def test_discovery_opportunities():
    res = client.post("/api/v1/discovery/opportunities", json={
        "capital": 80000,
        "skills": ["Dairy Farming"],
        "space_sqft": 500,
        "village_id": "vil_bhiti"
    })
    assert res.status_code == 200
    data = res.json()
    assert "opportunities" in data
    assert len(data["opportunities"]) > 0

def test_discovery_gis_radar():
    res = client.get("/api/v1/discovery/gis-radar?village_id=vil_bhiti&radius_km=5.0")
    assert res.status_code == 200
    data = res.json()
    assert data["radius_km"] == 5.0
    assert "facilities" in data

def test_discovery_compare():
    res = client.get("/api/v1/discovery/compare?category_ids=dairy_farming,food_processing")
    assert res.status_code == 200
    data = res.json()
    assert len(data["businesses"]) >= 2
    assert "comparison_matrix" in data or "matrix" in data

def test_planning_feasibility():
    res = client.get("/api/v1/planning/feasibility/dairy_farming")
    assert res.status_code == 200
    data = res.json()
    assert data["category_id"] == "dairy_farming"
    assert "swot" in data

def test_planning_financial_plan():
    res = client.post("/api/v1/planning/financial-plan", json={
        "category_id": "dairy_farming",
        "total_project_cost": 250000,
        "own_contribution": 50000,
        "social_category": "OBC",
        "moratorium_months": 3
    })
    assert res.status_code == 200
    data = res.json()
    assert data["total_project_cost"] == 250000
    assert data["subsidy_pct"] == 35.0
    assert data["bank_loan_required"] == 200000

def test_planning_schemes():
    res = client.get("/api/v1/planning/schemes?loan_amount=200000&social_category=OBC&sector=Dairy&is_rural=true")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0

def test_copilot_dashboard():
    res = client.get("/api/v1/copilot/dashboard/app_101")
    assert res.status_code == 200
    data = res.json()
    assert "health_score" in data
    assert "total_revenue_recorded" in data

def test_officer_kpis():
    res = client.get("/api/v1/officer/kpis?district_id=dist_gorakhpur")
    assert res.status_code == 200
    data = res.json()
    assert data["district_id"] == "dist_gorakhpur"
    assert "kpis" in data
    assert data["kpis"]["total_entrepreneurs"] > 0

def test_officer_geo_intelligence():
    res = client.get("/api/v1/officer/geo-intelligence?district_id=dist_gorakhpur")
    assert res.status_code == 200
    data = res.json()
    assert "villages" in data
    assert "applications" in data
    assert "facilities" in data

def test_officer_pipeline():
    res = client.get("/api/v1/officer/pipeline")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_officer_scheme_stats():
    res = client.get("/api/v1/officer/scheme-stats?district_id=dist_gorakhpur")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert len(data["schemes"]) >= 4

def test_officer_ai_assistant():
    res = client.post("/api/v1/officer/ai-assistant", json={
        "query": "Show businesses with repayment risk",
        "district_id": "dist_gorakhpur"
    })
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "sql_context" in data
