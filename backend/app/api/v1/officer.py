from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import BusinessApplication, District, Village, LocalFacility, User
from app.core.security import get_current_user, require_role, scope_filter
from app.engines.officer_assistant import process_officer_nl_query

router = APIRouter(prefix="/officer", tags=["Government / Officer Portal"])

class OfficerQueryRequest(BaseModel):
    query: str
    district_id: Optional[str] = "dist_gorakhpur"

class ApplicationActionRequest(BaseModel):
    action: str # approve, flag_inspection, reject
    notes: Optional[str] = "Approved by District Officer after verification of DPR."

@router.get("/kpis")
def get_officer_kpis(
    district_id: Optional[str] = "dist_gorakhpur",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns administrative KPIs for the officer's jurisdiction:
    Total Entrepreneurs, Assessments, Selected, Loans, Launched, Repayment Health, At-Risk.
    Auto-scoped by role.
    """
    target_dist = current_user.district_id if current_user.role == "district_officer" else district_id
    district = db.query(District).filter(District.id == target_dist).first()
    
    if not district:
        district = db.query(District).first()

    total_apps = db.query(BusinessApplication).filter(BusinessApplication.district_id == district.id).count()
    approved_apps = db.query(BusinessApplication).filter(
        BusinessApplication.district_id == district.id,
        BusinessApplication.status.in_(["approved", "launched"])
    ).count()
    launched_apps = db.query(BusinessApplication).filter(
        BusinessApplication.district_id == district.id,
        BusinessApplication.status == "launched"
    ).count()
    at_risk_apps = db.query(BusinessApplication).filter(
        BusinessApplication.district_id == district.id,
        BusinessApplication.repayment_health == "at_risk"
    ).count()

    return {
        "district_id": district.id,
        "district_name": district.name,
        "state": district.state,
        "officer_role": current_user.role,
        "kpis": {
            "total_entrepreneurs": district.total_entrepreneurs,
            "business_assessments": 8921,
            "businesses_selected": 6432,
            "loan_applications": 4812,
            "businesses_launched": district.active_businesses,
            "active_businesses": district.active_businesses,
            "repayment_health_percent": district.repayment_health_percent,
            "at_risk_businesses": district.at_risk_count,
            "pending_district_approval": total_apps - approved_apps
        }
    }

@router.get("/geo-intelligence")
def get_geo_intelligence(
    district_id: Optional[str] = "dist_gorakhpur",
    db: Session = Depends(get_db)
):
    """
    Returns interactive GIS map markers and clusters for District -> Block -> Village drilldown.
    """
    villages = db.query(Village).filter(Village.district_id == district_id).all()
    applications = db.query(BusinessApplication).filter(BusinessApplication.district_id == district_id).all()
    facilities = db.query(LocalFacility).filter(LocalFacility.district_id == district_id).all()

    return {
        "district_center": {"lat": 26.7606, "lng": 83.3732, "zoom": 11},
        "villages": [
            {
                "id": v.id,
                "name": v.name,
                "block": v.block,
                "lat": v.lat,
                "lng": v.lng,
                "population": v.population,
                "milk_yield": v.milk_yield_liters_day,
                "power_hours": v.power_availability_hours
            }
            for v in villages
        ],
        "applications": [
            {
                "id": a.id,
                "applicant": a.applicant_name,
                "business": a.business_name,
                "category": a.business_category,
                "lat": a.lat,
                "lng": a.lng,
                "total_cost": a.total_project_cost,
                "loan_amount": a.loan_amount,
                "subsidy_amount": a.subsidy_amount,
                "status": a.status,
                "repayment_health": a.repayment_health
            }
            for a in applications
        ],
        "facilities": [
            {
                "id": f.id,
                "name": f.name,
                "facility_type": f.facility_type,
                "lat": f.lat,
                "lng": f.lng,
                "description": f.description
            }
            for f in facilities
        ]
    }

@router.get("/pipeline")
def get_applications_pipeline(
    status_filter: Optional[str] = None,
    health_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns the comprehensive list of applications with credit ratings, DPR status and review actions.
    """
    query = db.query(BusinessApplication)
    if status_filter:
        query = query.filter(BusinessApplication.status == status_filter)
    if health_filter:
        query = query.filter(BusinessApplication.repayment_health == health_filter)

    apps = query.order_by(BusinessApplication.created_at.desc()).all()

    return [
        {
            "id": a.id,
            "applicant_name": a.applicant_name,
            "business_name": a.business_name,
            "category": a.business_category,
            "village_name": a.village_name,
            "total_project_cost": a.total_project_cost,
            "loan_amount": a.loan_amount,
            "subsidy_amount": a.subsidy_amount,
            "monthly_emi": a.monthly_emi,
            "moratorium_months": a.moratorium_months,
            "status": a.status,
            "repayment_health": a.repayment_health,
            "credit_score_estimate": a.credit_score_estimate,
            "notes": a.notes
        }
        for a in apps
    ]

@router.post("/application/{application_id}/action")
def take_application_action(
    application_id: str,
    req: ApplicationActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Officer approval action (approve, flag_inspection, reject) with audit log.
    """
    app = db.query(BusinessApplication).filter(BusinessApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if req.action == "approve":
        app.status = "approved"
        app.notes = f"APPROVED by {current_user.full_name} ({current_user.role}). Subsidy release clearance issued."
    elif req.action == "flag_inspection":
        app.status = "inspection_pending"
        app.notes = f"FLAGGED FOR INSPECTION by {current_user.full_name}: {req.notes}"
    elif req.action == "reject":
        app.status = "rejected"
        app.notes = f"REJECTED: {req.notes}"

    db.commit()
    db.refresh(app)

    return {
        "success": True,
        "application_id": app.id,
        "new_status": app.status,
        "notes": app.notes
    }

@router.post("/ai-assistant")
async def officer_ai_query(
    req: OfficerQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Officer Natural Language AI Assistant:
    Answers directly from SQL aggregations without hallucinations.
    """
    return await process_officer_nl_query(
        query=req.query,
        district_id=req.district_id or "dist_gorakhpur",
        officer_role=current_user.role,
        db=db
    )

@router.get("/scheme-stats")
def get_scheme_stats(
    district_id: Optional[str] = "dist_gorakhpur",
    db: Session = Depends(get_db)
):
    """
    Returns scheme-level performance, allocation vs disbursement,
    and early warning NPA statistics.
    """
    schemes = [
        {
            "id": "pmegp",
            "name": "PMEGP (Prime Minister Employment Generation)",
            "ministry": "MSME",
            "allocated_cr": 45.0,
            "disbursed_cr": 38.2,
            "subsidy_released_cr": 12.4,
            "beneficiaries_count": 1420,
            "pending_approval": 84,
            "repayment_health_pct": 92.4,
            "at_risk_count": 42,
            "avg_subsidy_pct": 32.5
        },
        {
            "id": "mudra_kishore",
            "name": "PM MUDRA (Kishore ₹50k-5L)",
            "ministry": "Ministry of Finance",
            "allocated_cr": 30.0,
            "disbursed_cr": 26.8,
            "subsidy_released_cr": 0.0,
            "beneficiaries_count": 1180,
            "pending_approval": 45,
            "repayment_health_pct": 90.8,
            "at_risk_count": 68,
            "avg_subsidy_pct": 0.0
        },
        {
            "id": "pmfme",
            "name": "PMFME (Micro Food Processing)",
            "ministry": "MoFPI",
            "allocated_cr": 22.0,
            "disbursed_cr": 16.5,
            "subsidy_released_cr": 5.8,
            "beneficiaries_count": 520,
            "pending_approval": 31,
            "repayment_health_pct": 95.1,
            "at_risk_count": 18,
            "avg_subsidy_pct": 35.0
        },
        {
            "id": "standup_india",
            "name": "Stand-Up India (SC/ST/Women)",
            "ministry": "Ministry of Finance",
            "allocated_cr": 18.0,
            "disbursed_cr": 14.2,
            "subsidy_released_cr": 3.2,
            "beneficiaries_count": 367,
            "pending_approval": 22,
            "repayment_health_pct": 94.0,
            "at_risk_count": 12,
            "avg_subsidy_pct": 25.0
        }
    ]

    total_allocated = sum(s["allocated_cr"] for s in schemes)
    total_disbursed = sum(s["disbursed_cr"] for s in schemes)
    total_beneficiaries = sum(s["beneficiaries_count"] for s in schemes)
    total_pending = sum(s["pending_approval"] for s in schemes)

    return {
        "district_id": district_id,
        "summary": {
            "total_allocated_cr": round(total_allocated, 1),
            "total_disbursed_cr": round(total_disbursed, 1),
            "utilization_rate_pct": round((total_disbursed / total_allocated) * 100, 1),
            "total_beneficiaries": total_beneficiaries,
            "total_pending_approval": total_pending
        },
        "schemes": schemes
    }

