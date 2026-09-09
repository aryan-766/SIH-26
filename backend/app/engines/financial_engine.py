import math
from typing import Dict, Any

def calculate_financial_plan(
    category_id: str,
    total_project_cost: float,
    own_contribution: float,
    interest_rate_pct: float = 9.5,
    tenure_years: int = 5,
    moratorium_months: int = 3,
    is_rural: bool = True,
    social_category: str = "OBC" # General, SC, ST, OBC, Women, Divyangjan
) -> Dict[str, Any]:
    """
    Computes government-standard financial project plan:
    - Capex vs Opex breakdown
    - Subsidy entitlement (25% to 35%)
    - Net bank loan requirement
    - Monthly EMI calculation with moratorium
    - Break-even units and 12-month revenue projection
    """
    # 1. Capex & Working Capital (Opex) Split
    capex = round(total_project_cost * 0.75, 2)
    working_capital_3mo = round(total_project_cost * 0.25, 2)

    # 2. Government Subsidy Percentage (PMEGP / PMFME standard)
    if is_rural:
        if social_category.upper() in ["SC", "ST", "WOMEN", "DIVYANGJAN", "OBC"]:
            subsidy_pct = 35.0
            own_contribution_min_pct = 5.0
        else:
            subsidy_pct = 25.0
            own_contribution_min_pct = 10.0
    else:
        subsidy_pct = 15.0
        own_contribution_min_pct = 10.0

    # Ensure own contribution is at least minimum
    min_own_cash = round(total_project_cost * (own_contribution_min_pct / 100.0), 2)
    actual_own_cash = max(min_own_cash, own_contribution)

    subsidy_amount = round(total_project_cost * (subsidy_pct / 100.0), 2)
    bank_loan = max(0.0, round(total_project_cost - actual_own_cash, 2))

    # 3. Monthly EMI calculation on Loan
    # P = Principal, r = monthly interest, n = total loan months (tenure_years * 12 - moratorium)
    active_months = max(12, (tenure_years * 12) - moratorium_months)
    monthly_r = (interest_rate_pct / 100.0) / 12.0
    
    if bank_loan > 0:
        emi = (bank_loan * monthly_r * ((1 + monthly_r) ** active_months)) / (((1 + monthly_r) ** active_months) - 1)
        monthly_emi = round(emi, 2)
    else:
        monthly_emi = 0.0

    # 4. Revenue & Margin Simulation (Specific to sector)
    if "dairy" in category_id.lower():
        unit_name = "Litres Milk / Day"
        unit_price = 42.0 # ₹ per litre
        unit_cost = 22.0  # Fodder & maintenance
        daily_capacity = 25 # 2 Cattles @ 12.5L each
        monthly_rev = daily_capacity * unit_price * 30
        monthly_cost = (daily_capacity * unit_cost * 30) + (monthly_emi if moratorium_months == 0 else 0)
        break_even_units = round((monthly_emi + 8000) / (unit_price - unit_cost), 1)
    elif "food" in category_id.lower():
        unit_name = "Kg Processed / Day"
        unit_price = 140.0 # Mustard oil / flour pack
        unit_cost = 95.0
        daily_capacity = 40
        monthly_rev = daily_capacity * unit_price * 30
        monthly_cost = (daily_capacity * unit_cost * 30) + monthly_emi
        break_even_units = round((monthly_emi + 10000) / (unit_price - unit_cost), 1)
    else:
        unit_name = "Service Jobs / Month"
        unit_price = 450.0
        unit_cost = 180.0
        daily_capacity = 3
        monthly_rev = daily_capacity * unit_price * 30
        monthly_cost = (daily_capacity * unit_cost * 30) + monthly_emi
        break_even_units = round(monthly_emi / max(1, (unit_price - unit_cost)), 1)

    monthly_profit = round(monthly_rev - monthly_cost, 2)
    annual_profit = round(monthly_profit * 12, 2)
    roi_pct = round((annual_profit / max(1, total_project_cost)) * 100, 1)

    return {
        "total_project_cost": total_project_cost,
        "capex_machinery": capex,
        "working_capital_3mo": working_capital_3mo,
        "own_contribution": actual_own_cash,
        "own_contribution_pct": round((actual_own_cash / total_project_cost) * 100, 1),
        "subsidy_amount": subsidy_amount,
        "subsidy_pct": subsidy_pct,
        "bank_loan_required": bank_loan,
        "interest_rate_pct": interest_rate_pct,
        "tenure_years": tenure_years,
        "moratorium_months": moratorium_months,
        "monthly_emi": monthly_emi,
        "projected_monthly_revenue": monthly_rev,
        "projected_monthly_expense": monthly_cost,
        "projected_monthly_net_profit": monthly_profit,
        "break_even_daily_units": break_even_units,
        "unit_metric": unit_name,
        "estimated_roi_pct": roi_pct
    }
