import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import BusinessApplication, User, Scheme
from app.core.security import get_current_user
from app.engines.recommendation import BUSINESS_CATALOGUE
from app.engines.financial_engine import calculate_financial_plan
from app.engines.scheme_engine import match_schemes
from app.engines.scheme_sync import sync_schemes_from_india_gov
from app.engines.dpr_generator import generate_dpr_document

router = APIRouter(prefix="/planning", tags=["Module 2: Enterprise Planning & Schemes"])

class FinancialPlanRequest(BaseModel):
    category_id: str = "dairy_farming"
    applicant_name: Optional[str] = "Rural Entrepreneur"
    business_name: Optional[str] = None
    village_name: Optional[str] = "Bhiti Rawat"
    district_name: Optional[str] = "Gorakhpur"
    total_project_cost: float = 250000.0
    own_contribution: float = 50000.0
    interest_rate_pct: float = 9.5
    tenure_years: int = 5
    moratorium_months: int = 3
    is_rural: bool = True
    social_category: str = "OBC"

class SubmitApplicationRequest(BaseModel):
    category_id: str = "dairy_farming"
    business_name: str = "Yadav High-Yield Dairy Unit"
    village_name: str = "Bhiti Rawat"
    total_project_cost: float = 250000.0
    own_contribution: float = 50000.0
    scheme_id: str = "scheme_pmegp"
    notes: Optional[str] = "Applicant has 2 years cattle handling experience and space for shed."

@router.get("/feasibility/{category_id}")
def get_feasibility_analysis(category_id: str):
    """
    Returns deep feasibility analysis: SWOT, market drivers, risks, customer segments.
    Supports both standard catalogue items and dynamic custom user businesses.
    """
    biz = next((b for b in BUSINESS_CATALOGUE if b["id"] == category_id), None)
    if not biz:
        clean_name = category_id.replace("_", " ").title()
        return {
            "category_id": category_id,
            "name": clean_name,
            "name_hi": f"{clean_name} (कस्टम व्यवसाय)",
            "sector": "Micro Enterprise / Services",
            "swot": {
                "strengths": f"High localized community demand for {clean_name}; low overhead costs in rural setting.",
                "weaknesses": "Initial working capital and marketing outreach needed in first 60 days.",
                "opportunities": "Eligible for 25-35% PMEGP / Mudra capital subsidy and priority sector lending.",
                "threats": "Local competition and seasonal fluctuations."
            },
            "demand_indicators": [
                f"Surrounding village population creates recurring demand for {clean_name}",
                "Can serve both retail customers and local institutional buyers",
                "Eligible for credit guarantee coverage under CGTMSE"
            ],
            "pricing_strategy": {
                "procurement_sale_rate": "Competitive rural market rate with 25-35% gross profit margin",
                "direct_retail_rate": "Value-based pricing for immediate local community off-take",
                "byproducts": "Supplementary value additions and customer service retention"
            },
            "critical_success_factors": [
                "Maintain consistent quality and transparent customer pricing",
                "Utilize PMEGP / Mudra collateral-free loan for modern equipment",
                "Maintain digital daily cashbook for bank credit history"
            ]
        }

    return {
        "category_id": category_id,
        "name": biz["name"],
        "name_hi": biz["name_hi"],
        "sector": biz["sector"],
        "swot": biz["swot"],
        "demand_indicators": [
            f"High local rural demand index ({biz.get('demand_index', 85)}/100)",
            f"{biz.get('suppliers_nearby', 3)} raw material / machinery suppliers active within 15 km",
            "Eligible for PMEGP / PMFME / Mudra 35% capital subsidy"
        ],
        "pricing_strategy": {
            "procurement_sale_rate": f"Expected operating margin: ~{biz.get('expected_margin_pct', 30)}%",
            "direct_retail_rate": "Direct local consumption with immediate cash/UPI realization",
            "byproducts": "Value-added local sales & secondary produce monetization"
        },
        "critical_success_factors": [
            f"Equip unit with standard tools: {', '.join(biz.get('equipment', [])[:3])}",
            "Obtain Udyam Registration & Bank Sanction via PMEGP e-Portal",
            "Maintain digital ledger and monitor daily operational cashflow"
        ]
    }

@router.post("/financial-plan")
def simulate_finances(req: FinancialPlanRequest):
    """
    Calculates dynamic Capex, Opex, Subsidy, Loan, EMI and Moratorium schedule.
    """
    plan = calculate_financial_plan(
        category_id=req.category_id,
        total_project_cost=req.total_project_cost,
        own_contribution=req.own_contribution,
        interest_rate_pct=req.interest_rate_pct,
        tenure_years=req.tenure_years,
        moratorium_months=req.moratorium_months,
        is_rural=req.is_rural,
        social_category=req.social_category
    )
    return plan

@router.get("/schemes")
def get_matching_schemes(
    loan_amount: float = Query(200000.0),
    social_category: str = Query("OBC"),
    sector: str = Query("Dairy"),
    is_rural: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Matches and ranks government subsidy and loan schemes.
    """
    return match_schemes(
        loan_amount=loan_amount,
        social_category=social_category,
        sector=sector,
        is_rural=is_rural,
        db=db
    )

@router.post("/schemes/sync-live")
def sync_live_schemes(
    max_pages: int = Query(5, ge=1, le=15),
    db: Session = Depends(get_db)
):
    """
    Fetches and synchronizes real rural entrepreneurship schemes live from
    the National Portal of India (https://www.india.gov.in/).
    """
    return sync_schemes_from_india_gov(db, max_pages=max_pages)

@router.get("/schemes/all")
def get_all_schemes(
    ministry: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Returns full list of available schemes with official guidelines links,
    ministry info, loan ceilings, and subsidy parameters.
    """
    query = db.query(Scheme)
    if ministry and ministry.lower() != "all":
        query = query.filter(Scheme.ministry.ilike(f"%{ministry}%"))
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Scheme.name.ilike(search_pattern)) | 
            (Scheme.description.ilike(search_pattern)) |
            (Scheme.ministry.ilike(search_pattern))
        )
    
    schemes = query.limit(limit).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "name_hi": s.name_hi,
            "ministry": s.ministry,
            "max_loan_amount": s.max_loan_amount,
            "subsidy_percent_rural": s.subsidy_percent_rural,
            "special_category_subsidy_percent": s.special_category_subsidy_percent,
            "collateral_free": s.collateral_free,
            "eligible_categories": s.eligible_categories,
            "processing_complexity": s.processing_complexity,
            "portal_url": s.portal_url or (f"https://www.myscheme.gov.in/schemes/{s.slug}" if s.slug else "https://www.india.gov.in/my-government/schemes"),
            "tags": s.tags or [],
            "source": s.source or "National Portal of India (india.gov.in)",
            "documents_required": s.documents_required,
            "description": s.description,
            "description_hi": s.description_hi,
            "last_synced": s.last_synced.isoformat() if s.last_synced else None
        }
        for s in schemes
    ]

@router.post("/dpr")
def generate_dpr(req: FinancialPlanRequest, db: Session = Depends(get_db)):
    """
    Generates official Detailed Project Report (DPR).
    """
    fin_plan = calculate_financial_plan(
        category_id=req.category_id,
        total_project_cost=req.total_project_cost,
        own_contribution=req.own_contribution,
        interest_rate_pct=req.interest_rate_pct,
        tenure_years=req.tenure_years,
        moratorium_months=req.moratorium_months,
        is_rural=req.is_rural,
        social_category=req.social_category
    )
    biz_title = req.business_name or f"{req.category_id.replace('_', ' ').title()} Enterprise"
    dpr = generate_dpr_document(
        applicant_name=req.applicant_name or "Rural Entrepreneur",
        business_name=biz_title,
        category_id=req.category_id,
        village_name=req.village_name or "Bhiti Rawat",
        district_name=req.district_name or "Gorakhpur",
        financial_data=fin_plan,
        scheme_name="PMEGP (Rural Subsidy 35%)"
    )
    return dpr

@router.get("/launch-checklist")
def get_launch_checklist(category_id: str = "dairy_farming"):
    """
    Provides step-by-step launch countdown tasks with verification requirements.
    """
    return {
        "category_id": category_id,
        "total_steps": 7,
        "steps": [
            {"id": "step_1", "title": "Udyam Aadhaar Registration", "desc": "Free online MSME registration for formal recognition.", "status": "completed", "required": True},
            {"id": "step_2", "title": "FSSAI Food License / Registration", "desc": "Mandatory hygiene registration for milk and food items.", "status": "in_progress", "required": True},
            {"id": "step_3", "title": "Current Bank Account Opening", "desc": "Zero-balance MSME account linked for direct subsidy credit.", "status": "pending", "required": True},
            {"id": "step_4", "title": "Equipment & Cattle Sourcing", "desc": "Purchase verified cattle with veterinary health certificates.", "status": "pending", "required": True},
            {"id": "step_5", "title": "Supplier Agreement with Chilling Center", "desc": "Sign daily supply agreement with Parag Cooperative.", "status": "pending", "required": True},
            {"id": "step_6", "title": "Shed Setup & Biosecurity Check", "desc": "Ensure adequate water supply, ventilation and drainage.", "status": "pending", "required": False},
            {"id": "step_7", "title": "First Commercial Milk Supply", "desc": "Begin daily morning and evening delivery.", "status": "pending", "required": True}
        ]
    }

@router.post("/submit-application")
def submit_business_application(
    req: SubmitApplicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits completed enterprise proposal to District Officer for subsidy approval.
    """
    fin_plan = calculate_financial_plan(
        category_id=req.category_id,
        total_project_cost=req.total_project_cost,
        own_contribution=req.own_contribution,
        is_rural=True,
        social_category=current_user.social_category or "OBC"
    )

    app_id = f"app_{uuid.uuid4().hex[:6]}"
    application = BusinessApplication(
        id=app_id,
        user_id=current_user.id,
        applicant_name=current_user.full_name,
        business_name=req.business_name,
        business_category=req.category_id.replace("_", " ").title(),
        district_id=current_user.district_id or "dist_gorakhpur",
        village_name=req.village_name,
        total_project_cost=fin_plan["total_project_cost"],
        own_contribution=fin_plan["own_contribution"],
        loan_amount=fin_plan["bank_loan_required"],
        subsidy_amount=fin_plan["subsidy_amount"],
        monthly_emi=fin_plan["monthly_emi"],
        moratorium_months=fin_plan["moratorium_months"],
        scheme_id=req.scheme_id,
        status="submitted",
        repayment_health="healthy",
        notes=req.notes
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "application_id": application.id,
        "status": application.status,
        "message": "Enterprise application submitted to District Officer. DPR queued for subsidy appraisal."
    }
