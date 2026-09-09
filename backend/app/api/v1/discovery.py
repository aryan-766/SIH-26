from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.engines.recommendation import score_opportunities, BUSINESS_CATALOGUE
from app.engines.gis_engine import get_gis_facility_analysis

router = APIRouter(prefix="/discovery", tags=["Module 1: Business Discovery"])

class DiscoveryRequest(BaseModel):
    capital: float = 80000.0
    skills: List[str] = ["Dairy Farming", "Agriculture"]
    space_sqft: int = 500
    village_id: Optional[str] = "vil_bhiti"

@router.post("/opportunities")
def discover_opportunities(req: DiscoveryRequest, db: Session = Depends(get_db)):
    """
    Returns ranked business opportunities scored against user's profile and nearby competitor count.
    """
    gis_info = get_gis_facility_analysis(village_id=req.village_id or "vil_bhiti", radius_km=5.0, db=db)
    comp_count = gis_info["counts"]["competitor"]

    scored_businesses = score_opportunities(
        capital=req.capital,
        skills=req.skills,
        space_sqft=req.space_sqft,
        competitor_count_nearby=comp_count
    )

    return {
        "user_capital": req.capital,
        "village_analyzed": gis_info["village_name"],
        "nearby_competitors": comp_count,
        "opportunities": scored_businesses
    }

@router.get("/gis-radar")
def get_facility_radar(
    village_id: str = Query("vil_bhiti", description="Target village ID"),
    radius_km: float = Query(5.0, description="Analysis radius in KM (e.g. 5 or 10)"),
    db: Session = Depends(get_db)
):
    """
    Returns 5km or 10km GIS facility analysis:
    Competitors, Chilling Centers, Mandis, Banks, Suppliers, Transport.
    """
    return get_gis_facility_analysis(village_id=village_id, radius_km=radius_km, db=db)

@router.get("/compare")
def compare_businesses(category_ids: str = Query("dairy_farming,food_processing,mobile_solar_repair")):
    """
    Returns side-by-side comparative matrix of selected businesses.
    """
    ids = [cid.strip() for cid in category_ids.split(",")]
    matched = [b for b in BUSINESS_CATALOGUE if b["id"] in ids]

    comparison_factors = [
        {"factor": "Local Demand", "key": "demand_index", "format": lambda x: f"{x}/100 (High)" if x >= 80 else f"{x}/100 (Medium)"},
        {"factor": "Recommended Investment", "key": "recommended_capital", "format": lambda x: f"₹{x:,}"},
        {"factor": "Minimum Investment", "key": "min_capital", "format": lambda x: f"₹{x:,}"},
        {"factor": "Expected Profit Margin", "key": "expected_margin_pct", "format": lambda x: f"{x}%"},
        {"factor": "Risk Profile", "key": "risk_level", "format": lambda x: x},
        {"factor": "Space Required", "key": "min_space_sqft", "format": lambda x: f"{x} sq.ft"},
        {"factor": "Key Equipment", "key": "equipment", "format": lambda x: ", ".join(x[:3])}
    ]

    matrix = []
    for factor in comparison_factors:
        row = {"factor": factor["factor"], "values": {}}
        for b in matched:
            raw_val = b.get(factor["key"])
            row["values"][b["id"]] = factor["format"](raw_val)
        matrix.append(row)

    return {
        "businesses": matched,
        "comparison_matrix": matrix
    }
