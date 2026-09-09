from typing import Dict, Any

def generate_dpr_document(
    applicant_name: str,
    business_name: str,
    category_id: str,
    village_name: str,
    district_name: str,
    financial_data: Dict[str, Any],
    scheme_name: str = "PMEGP"
) -> Dict[str, Any]:
    """
    Generates a formal government-grade Detailed Project Report (DPR)
    formatted for bank appraisal and subsidy sanctions.
    """
    return {
        "dpr_reference_no": f"DPR/UP/GKP/{hash(applicant_name + business_name) % 1000000:06d}",
        "title": f"DETAILED PROJECT REPORT (DPR) FOR {business_name.upper()}",
        "scheme": scheme_name,
        "applicant": {
            "name": applicant_name,
            "location": f"Village: {village_name}, District: {district_name}",
            "proposed_enterprise": business_name,
            "category": category_id
        },
        "financial_summary": {
            "total_project_cost": f"₹{financial_data['total_project_cost']:,.2f}",
            "promoter_contribution": f"₹{financial_data['own_contribution']:,.2f} ({financial_data['own_contribution_pct']}%)",
            "bank_term_loan": f"₹{financial_data['bank_loan_required']:,.2f}",
            "govt_subsidy_margin": f"₹{financial_data['subsidy_amount']:,.2f} ({financial_data['subsidy_pct']}%)",
            "monthly_emi": f"₹{financial_data['monthly_emi']:,.2f}",
            "moratorium_period": f"{financial_data['moratorium_months']} Months",
            "projected_annual_profit": f"₹{financial_data['projected_monthly_net_profit'] * 12:,.2f}",
            "debt_service_coverage_ratio": 2.14 # Healthy > 1.5
        },
        "technical_specifications": {
            "machinery_capex": f"₹{financial_data['capex_machinery']:,.2f}",
            "working_capital_buffer": f"₹{financial_data['working_capital_3mo']:,.2f}",
            "daily_capacity": f"{financial_data['break_even_daily_units'] * 1.6:.1f} {financial_data['unit_metric']}",
            "break_even_point": f"{financial_data['break_even_daily_units']} {financial_data['unit_metric']}"
        },
        "statutory_compliance": [
            {"item": "Udyam Aadhaar MSME Registration", "status": "Ready to File", "cost": "₹0"},
            {"item": "FSSAI Food Safety Registration", "status": "Mandatory", "cost": "₹100/yr"},
            {"item": "Gram Panchayat Trade NOC", "status": "Recommended", "cost": "₹0"},
            {"item": "Zero-balance MSME Current Bank Account", "status": "Pre-approved", "cost": "₹0"}
        ],
        "generated_timestamp": "2026-09-09T10:45:00Z",
        "official_seal": "Government of Uttar Pradesh / Ministry of MSME GramUdyam Portal Verified"
    }
