import pytest
from app.engines.financial_engine import calculate_financial_plan
from app.engines.gis_engine import haversine_distance, get_gis_facility_analysis
from app.engines.scheme_engine import match_schemes
from app.engines.dpr_generator import generate_dpr_document
from app.db.session import SessionLocal, init_db
from app.db.seed_data import seed_database

@pytest.fixture(scope="module")
def db_session():
    init_db()
    db = SessionLocal()
    seed_database(db)
    yield db
    db.close()

def test_financial_engine_capex_opex_split():
    total_cost = 250000.0
    plan = calculate_financial_plan(
        category_id="dairy_farming",
        total_project_cost=total_cost,
        own_contribution=50000.0,
        social_category="OBC",
        is_rural=True
    )
    # Check Capex + Opex = Total
    assert plan["capex_machinery"] + plan["working_capital_3mo"] == total_cost
    # OBC in rural area gets 35% subsidy
    assert plan["subsidy_pct"] == 35.0
    assert plan["subsidy_amount"] == 87500.0
    # Bank loan required = Total - Own contribution
    assert plan["bank_loan_required"] == 200000.0
    # Monthly EMI is positive and non-zero
    assert plan["monthly_emi"] > 0
    # Moratorium months preserved
    assert plan["moratorium_months"] == 3

def test_financial_engine_general_category_subsidy():
    total_cost = 200000.0
    plan = calculate_financial_plan(
        category_id="food_processing",
        total_project_cost=total_cost,
        own_contribution=30000.0,
        social_category="General",
        is_rural=True
    )
    # General in rural area gets 25% subsidy
    assert plan["subsidy_pct"] == 25.0
    assert plan["subsidy_amount"] == 50000.0

def test_haversine_distance():
    # Distance between Bhiti Rawat and Gorakhpur center is approx 12-14 km
    d = haversine_distance(26.7450, 83.2500, 26.7606, 83.3732)
    assert 10.0 <= d <= 15.0
    # Distance to same point is 0
    assert haversine_distance(26.76, 83.37, 26.76, 83.37) == 0.0

def test_gis_facility_analysis(db_session):
    res_5km = get_gis_facility_analysis(village_id="vil_bhiti", radius_km=5.0, db=db_session)
    assert res_5km["radius_km"] == 5.0
    assert res_5km["village_name"] == "Bhiti Rawat"
    assert "counts" in res_5km
    assert res_5km["infrastructure_score"] > 0
    # All returned facilities must be within 5 km
    for fac in res_5km["facilities"]:
        assert fac["distance_km"] <= 5.0

    res_15km = get_gis_facility_analysis(village_id="vil_bhiti", radius_km=15.0, db=db_session)
    # 15km must contain at least as many facilities as 5km
    assert len(res_15km["facilities"]) >= len(res_5km["facilities"])

def test_scheme_engine_matching(db_session):
    matches = match_schemes(
        loan_amount=200000.0,
        social_category="OBC",
        sector="Dairy Farming",
        is_rural=True,
        db=db_session
    )
    assert len(matches) > 0
    # Top match should have suitability score
    top_scheme = matches[0]
    assert "suitability_score" in top_scheme
    assert top_scheme["applicable_subsidy_pct"] >= 25.0
    assert top_scheme["estimated_subsidy_amount"] > 0

def test_dpr_document_generation():
    plan = calculate_financial_plan("dairy_farming", 250000, 50000, is_rural=True, social_category="OBC")
    dpr = generate_dpr_document(
        applicant_name="Ramesh Kumar Yadav",
        business_name="Adarsh Dairy Farm",
        category_id="dairy_farming",
        village_name="Bhiti Rawat",
        district_name="Gorakhpur",
        financial_data=plan,
        scheme_name="PMEGP"
    )
    assert "DPR/UP/GKP/" in dpr["dpr_reference_no"]
    assert dpr["scheme"] == "PMEGP"
    assert dpr["financial_summary"]["total_project_cost"] == "₹250,000.00"
    assert len(dpr["statutory_compliance"]) >= 3
