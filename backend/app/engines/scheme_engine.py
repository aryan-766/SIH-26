import hashlib
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Scheme
from app.cache.redis_client import cache

def match_schemes(
    loan_amount: float,
    social_category: str,
    sector: str,
    is_rural: bool,
    db: Session
) -> List[Dict[str, Any]]:
    """
    Evaluates government schemes and ranks them:
    - Easiest / Collateral-free first
    - Highest applicable subsidy
    Cached in Redis under scheme:{profile_hash}
    """
    profile_str = f"{int(loan_amount)}_{social_category}_{sector}_{is_rural}"
    profile_hash = hashlib.md5(profile_str.encode()).hexdigest()
    cache_key = f"scheme:{profile_hash}"

    def evaluate():
        all_schemes = db.query(Scheme).all()
        matched = []

        for s in all_schemes:
            # 1. Eligibility check
            category_eligible = (
                not s.eligible_categories or 
                social_category in s.eligible_categories or 
                "General" in s.eligible_categories
            )
            amount_eligible = loan_amount <= s.max_loan_amount

            if not (category_eligible and amount_eligible):
                continue

            # 2. Determine subsidy
            if is_rural:
                if social_category.upper() in ["SC", "ST", "WOMEN", "OBC", "DIVYANGJAN"]:
                    applicable_subsidy_pct = s.special_category_subsidy_percent
                else:
                    applicable_subsidy_pct = s.subsidy_percent_rural
            else:
                applicable_subsidy_pct = s.subsidy_percent_rural * 0.6 # Urban discount

            estimated_subsidy = round(loan_amount * (applicable_subsidy_pct / 100.0), 2)

            # 3. Fit score
            # Collateral free + high subsidy + low complexity = high score
            score = 70
            if s.collateral_free: score += 15
            if applicable_subsidy_pct >= 25: score += 15
            if s.processing_complexity == "Low": score += 10
            elif s.processing_complexity == "High": score -= 15

            # Sector & demographic specific bonuses
            sec_lower = sector.lower()
            soc_upper = social_category.upper()
            if "pmfme" in s.id and ("food" in sec_lower or "agro" in sec_lower or "flour" in sec_lower or "oil" in sec_lower):
                score += 10
            if "pmegp" in s.id:
                score += 8
            if "svep" in s.id and is_rural:
                score += 12
            if "day_nrlm" in s.id and (soc_upper in ["WOMEN", "SHG", "FEMALE"] or "women" in sec_lower):
                score += 15
            if "vishwakarma" in s.id and any(t in sec_lower for t in ["artisan", "carpenter", "tailor", "blacksmith", "craft", "pottery", "mason"]):
                score += 16
            if "ahidf" in s.id and any(t in sec_lower for t in ["dairy", "cattle", "livestock", "milk", "feed"]):
                score += 14
            if "aif" in s.id and any(t in sec_lower for t in ["storage", "warehouse", "cold", "agro", "post-harvest"]):
                score += 12
            if "sfurti" in s.id and any(t in sec_lower for t in ["cluster", "handicraft", "khadi", "honey", "bamboo"]):
                score += 14

            matched.append({
                "id": s.id,
                "name": s.name,
                "name_hi": s.name_hi,
                "ministry": s.ministry,
                "max_loan_amount": s.max_loan_amount,
                "applicable_subsidy_pct": applicable_subsidy_pct,
                "estimated_subsidy_amount": estimated_subsidy,
                "collateral_free": s.collateral_free,
                "processing_complexity": s.processing_complexity,
                "documents_required": s.documents_required,
                "description": s.description,
                "description_hi": s.description_hi,
                "portal_url": s.portal_url or f"https://www.myscheme.gov.in/schemes/{s.slug}" if s.slug else "https://www.india.gov.in/my-government/schemes",
                "tags": s.tags or [],
                "source": s.source or "National Portal of India (india.gov.in)",
                "slug": s.slug,
                "suitability_score": min(99, score),
                "badge": "Best Match" if score >= 90 else ("Recommended" if score >= 80 else "Alternative")
            })

        # Sort by suitability score descending
        matched.sort(key=lambda x: x["suitability_score"], reverse=True)
        return matched

    return cache.get_or_set(cache_key, ttl_seconds=1800, fetch_fn=evaluate)
