from typing import List, Dict, Any

# Standard catalogue of rural enterprise opportunities
BUSINESS_CATALOGUE = [
    {
        "id": "dairy_farming",
        "name": "Dairy Farming & Milk Production",
        "name_hi": "डेयरी फार्मिंग एवं दुग्ध उत्पादन",
        "sector": "Livestock / Agriculture",
        "min_capital": 50000,
        "recommended_capital": 250000,
        "expected_margin_pct": 28,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 92, # High daily consumption
        "matching_skills": ["Dairy Farming", "Agriculture", "Animal Husbandry"],
        "min_space_sqft": 400,
        "equipment": ["Murrah Cattle / Cow", "Stainless Milk Cans", "Chaff Cutter", "Water Trough", "Bio-gas/Dung pit"],
        "suppliers_nearby": 3,
        "swot": {
            "strengths": "Daily cash inflow, guaranteed purchase by dairy cooperatives, value-add potential (ghee/paneer).",
            "weaknesses": "Requires 24/7 care, vulnerable to cattle disease if unmonitored.",
            "opportunities": "Expansion to milk chilling & branded curd packet delivery to nearby towns.",
            "threats": "Fodder price fluctuations during dry summer months."
        }
    },
    {
        "id": "food_processing",
        "name": "Mini Flour & Mustard Oil Expeller Unit",
        "name_hi": "मिनी आटा एवं सरसों तेल मिल",
        "sector": "Food Processing / Manufacturing",
        "min_capital": 75000,
        "recommended_capital": 350000,
        "expected_margin_pct": 24,
        "risk_level": "Medium",
        "risk_level_hi": "मध्यम",
        "demand_index": 86,
        "matching_skills": ["Food Processing", "Machine Operation", "Agriculture"],
        "min_space_sqft": 300,
        "equipment": ["10HP Mustard Oil Expeller", "Flour Pulverizer", "Seed Cleaner", "Weighing Scale", "Packaging sealer"],
        "suppliers_nearby": 2,
        "swot": {
            "strengths": "Raw materials (wheat/mustard) abundantly grown in local village farms.",
            "weaknesses": "Electricity reliability required (minimum 8-10 hours/day).",
            "opportunities": "PMFME scheme offers 35% capital subsidy for local processing units.",
            "threats": "Seasonal surge in crop prices during non-harvest months."
        }
    },
    {
        "id": "mobile_solar_repair",
        "name": "Mobile & Solar Equipment Service Center",
        "name_hi": "मोबाइल एवं सोलर उपकरण सर्विस केंद्र",
        "sector": "Technical Services",
        "min_capital": 30000,
        "recommended_capital": 150000,
        "expected_margin_pct": 38,
        "risk_level": "Medium",
        "risk_level_hi": "मध्यम",
        "demand_index": 78,
        "matching_skills": ["Solar & Electric Repair", "Electronics", "Mobile Repair"],
        "min_space_sqft": 150,
        "equipment": ["Soldering Station", "Multimeter", "Battery Tester", "SMD Rework Station", "Diagnostic PC"],
        "suppliers_nearby": 4,
        "swot": {
            "strengths": "Low capital requirement, high profit margins on labor & component replacement.",
            "weaknesses": "Requires technical dexterity and continuous learning of new gadget models.",
            "opportunities": "PM Surya Ghar & PM-KUSUM solar pump installations increasing in nearby villages.",
            "threats": "Online delivery of cheap spare parts directly to consumers."
        }
    },
    {
        "id": "agri_tool_rental",
        "name": "Farm Machinery & Custom Hiring Center",
        "name_hi": "कृषि यंत्र एवं कस्टम हायरिंग केंद्र",
        "sector": "Agri Infrastructure",
        "min_capital": 100000,
        "recommended_capital": 450000,
        "expected_margin_pct": 32,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 81,
        "matching_skills": ["Machine Operation", "Agriculture", "Welding"],
        "min_space_sqft": 600,
        "equipment": ["Power Tiller", "Rotavator", "Laser Land Leveler", "Sprayer Pump", "Trailer"],
        "suppliers_nearby": 2,
        "swot": {
            "strengths": "Smallholder farmers prefer renting over buying expensive machinery.",
            "weaknesses": "Peak demand concentrated during sowing and harvest seasons.",
            "opportunities": "Sub-mission on Agricultural Mechanization (SMAM) subsidies up to 40%.",
            "threats": "Breakdown during peak harvest season causes immediate revenue loss."
        }
    },
    {
        "id": "poultry_farming",
        "name": "Commercial Poultry & Egg Production",
        "name_hi": "व्यावसायिक पोल्ट्री व अंडा उत्पादन",
        "sector": "Livestock / Animal Husbandry",
        "min_capital": 60000,
        "recommended_capital": 200000,
        "expected_margin_pct": 26,
        "risk_level": "Medium",
        "risk_level_hi": "मध्यम",
        "demand_index": 88,
        "matching_skills": ["Animal Husbandry", "Agriculture", "Poultry"],
        "min_space_sqft": 500,
        "equipment": ["Brooder Shed", "Automatic Feeders", "Water Drinkers", "Temperature Control Curtains"],
        "suppliers_nearby": 3,
        "swot": {
            "strengths": "Short 35-45 day broiler cycle ensures fast capital turnover.",
            "weaknesses": "Susceptible to heat waves and viral disease outbreaks.",
            "opportunities": "High protein demand in local rural haats and block towns.",
            "threats": "Feed price volatility (maize & soya)."
        }
    },
    {
        "id": "mushroom_cultivation",
        "name": "Oyster & Button Mushroom Cultivation",
        "name_hi": "ऑयस्टर एवं बटन मशरूम उत्पादन इकाई",
        "sector": "Horticulture / Agro",
        "min_capital": 30000,
        "recommended_capital": 120000,
        "expected_margin_pct": 42,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 84,
        "matching_skills": ["Agriculture", "Organic Farming", "Food Processing"],
        "min_space_sqft": 250,
        "equipment": ["Bamboo Racks", "Sprayer Humidifier", "Straw Pasteurizer Drum", "Weighing Scale"],
        "suppliers_nearby": 2,
        "swot": {
            "strengths": "Can be done in dark indoor rooms with minimal land and straw waste.",
            "weaknesses": "Requires strict humidity control (80-85%).",
            "opportunities": "Huge premium pricing in local wedding seasons and hotels.",
            "threats": "Contamination if hygiene protocols are violated."
        }
    },
    {
        "id": "csc_digital_services",
        "name": "CSC Jan Seva Kendra & Banking Point",
        "name_hi": "ग्राहक सेवा केंद्र (CSC) व बैंकिंग कियोस्क",
        "sector": "Digital Services",
        "min_capital": 35000,
        "recommended_capital": 100000,
        "expected_margin_pct": 45,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 90,
        "matching_skills": ["Computers", "Internet", "Banking & Digital Services"],
        "min_space_sqft": 100,
        "equipment": ["Desktop PC / Laptop", "All-in-One Printer/Scanner", "Biometric Scanner", "Inverter UPS"],
        "suppliers_nearby": 4,
        "swot": {
            "strengths": "Essential government scheme registration, DBT cash withdrawals, and PAN/Aadhaar services.",
            "weaknesses": "Internet connectivity dependency.",
            "opportunities": "Adding passport photo, insurance distribution, and train ticketing.",
            "threats": "Smartphone penetration reducing basic utility bill payment walk-ins."
        }
    },
    {
        "id": "garments_tailoring",
        "name": "Readymade Garments & Sewing Cluster",
        "name_hi": "रेडीमेड गारमेंट्स व सिलाई क्लस्टर",
        "sector": "Textiles & Manufacturing",
        "min_capital": 40000,
        "recommended_capital": 180000,
        "expected_margin_pct": 34,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 80,
        "matching_skills": ["Tailoring", "Sewing", "Textiles"],
        "min_space_sqft": 200,
        "equipment": ["Industrial Juki Sewing Machines", "Interlock Machine", "Cutting Table", "Steam Iron"],
        "suppliers_nearby": 3,
        "swot": {
            "strengths": "Year-round steady school uniform and festive clothing demand.",
            "weaknesses": "Seasonal rush before festivals (Diwali, Eid, Chhath).",
            "opportunities": "Supplying school uniforms under government rural school contracts.",
            "threats": "Competition from cheap synthetic mill-made imports."
        }
    },
    {
        "id": "biofloc_fish_farming",
        "name": "Biofloc Aquaculture & High-Density Fish Tank",
        "name_hi": "बायोफ्लॉक मत्स्य पालन एवं मछली नर्सरी",
        "sector": "Fisheries / Aquaculture",
        "min_capital": 70000,
        "recommended_capital": 280000,
        "expected_margin_pct": 36,
        "risk_level": "Medium",
        "risk_level_hi": "मध्यम",
        "demand_index": 87,
        "matching_skills": ["Aquaculture", "Water Quality", "Agriculture"],
        "min_space_sqft": 400,
        "equipment": ["Tarpaulin Biofloc Tanks", "Air Blower Aerator", "DO & pH Meter Kit", "Backup Generator"],
        "suppliers_nearby": 2,
        "swot": {
            "strengths": "Requires 90% less land than traditional ponds; high yield of Tilapia & Pangasius.",
            "weaknesses": "Constant aeration required; power cutoff risk.",
            "opportunities": "PM Matsya Sampada Yojana (PMMSY) provides up to 40-60% subsidy.",
            "threats": "Sudden pH drop if biofloc culture balance is disturbed."
        }
    },
    {
        "id": "bakery_confectionery",
        "name": "Village Bakery & Snacks Production",
        "name_hi": "ग्रामीण बेकरी, बिस्कुट व नमकीन इकाई",
        "sector": "Food Processing",
        "min_capital": 50000,
        "recommended_capital": 220000,
        "expected_margin_pct": 30,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 85,
        "matching_skills": ["Baking", "Food Processing", "Machine Operation"],
        "min_space_sqft": 250,
        "equipment": ["Rotary Baking Oven", "Dough Mixer", "Packaging Band Sealer", "Stainless Trays"],
        "suppliers_nearby": 3,
        "swot": {
            "strengths": "Direct distribution to 20-30 village kirana shops.",
            "weaknesses": "Short shelf-life for bread items without preservatives.",
            "opportunities": "Local branded rusk, biscuits and namkeen replace high-margin city brands.",
            "threats": "Flour and edible oil price spikes."
        }
    },
    {
        "id": "tent_house_catering",
        "name": "Tent House, Sound & Event Supplies",
        "name_hi": "टेंट हाउस, साउंड सिस्टम व शामियाना सेवा",
        "sector": "Event & Rural Services",
        "min_capital": 80000,
        "recommended_capital": 300000,
        "expected_margin_pct": 50,
        "risk_level": "Low",
        "risk_level_hi": "कम",
        "demand_index": 83,
        "matching_skills": ["Event Setup", "Logistics", "Electrical"],
        "min_space_sqft": 400,
        "equipment": ["Waterproof Tents & Pipes", "DJ Sound System & Amplifier", "Plastic Chairs & Tables", "Halwai Cooking Utensils"],
        "suppliers_nearby": 2,
        "swot": {
            "strengths": "Extremely high gross margins (60%+) on rental assets.",
            "weaknesses": "Seasonal peak during marriage 'lagan' months.",
            "opportunities": "Expansion into rural event lighting and generator rental.",
            "threats": "Equipment wear & tear during outdoor monsoon events."
        }
    }
]

def score_opportunities(
    capital: float,
    skills: List[str],
    space_sqft: int,
    competitor_count_nearby: int = 1
) -> List[Dict[str, Any]]:
    """
    Computes weighted multi-factor match score (0-100) for each opportunity:
    - Capital Fit (30%)
    - Skill Fit (30%)
    - Demand Index (20%)
    - Competition Inverse (10%)
    - Infrastructure/Space Fit (10%)
    """
    scored = []
    for biz in BUSINESS_CATALOGUE:
        # 1. Capital score: how well beneficiary capital meets min & recommended capital
        if capital >= biz["recommended_capital"]:
            capital_score = 100.0
        elif capital >= biz["min_capital"]:
            ratio = (capital - biz["min_capital"]) / max(1, (biz["recommended_capital"] - biz["min_capital"]))
            capital_score = 60.0 + (ratio * 40.0)
        else:
            # Under capital - loan required
            capital_score = max(30.0, (capital / biz["min_capital"]) * 60.0)

        # 2. Skill score
        matching_skill_hits = sum(1 for s in skills if s in biz["matching_skills"])
        if matching_skill_hits > 0:
            skill_score = 95.0 if matching_skill_hits > 1 else 85.0
        else:
            skill_score = 45.0  # Training required

        # 3. Demand index
        demand_score = biz["demand_index"]

        # 4. Competition Inverse (more competitors = slightly lower score, but proves demand)
        if competitor_count_nearby <= 1:
            comp_score = 90.0
        elif competitor_count_nearby == 2:
            comp_score = 75.0
        else:
            comp_score = 60.0

        # 5. Space fit
        space_score = 100.0 if space_sqft >= biz["min_space_sqft"] else 60.0

        # Total Weighted Score
        total_score = round(
            (0.30 * capital_score) +
            (0.30 * skill_score) +
            (0.20 * demand_score) +
            (0.10 * comp_score) +
            (0.10 * space_score)
        )

        scored.append({
            **biz,
            "match_score": min(98, max(50, total_score)),
            "capital_fit": "High" if capital_score >= 80 else ("Medium" if capital_score >= 50 else "Requires Loan"),
            "skill_fit": "High" if skill_score >= 80 else "Training Recommended",
            "demand_level": "High" if demand_score >= 80 else "Medium",
            "competition_level": "Low" if competitor_count_nearby <= 1 else "Medium"
        })

    # Sort descending by match score
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored
