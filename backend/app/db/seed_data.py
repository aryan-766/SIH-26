import datetime
from sqlalchemy.orm import Session
from app.db.models import District, Village, LocalFacility, Scheme, User, EntrepreneurProfile, BusinessApplication, DailyTransaction

def seed_database(db: Session):
    # Check if already seeded
    if db.query(District).first():
        return

    print("Seeding database with realistic rural intelligence data...")

    # 1. Districts
    districts = [
        District(
            id="dist_gorakhpur",
            name="Gorakhpur",
            state="Uttar Pradesh",
            lat=26.7606,
            lng=83.3732,
            total_entrepreneurs=12482,
            active_businesses=3487,
            repayment_health_percent=91.4,
            at_risk_count=182
        ),
        District(
            id="dist_varanasi",
            name="Varanasi",
            state="Uttar Pradesh",
            lat=25.3176,
            lng=82.9739,
            total_entrepreneurs=9820,
            active_businesses=2840,
            repayment_health_percent=93.1,
            at_risk_count=114
        ),
        District(
            id="dist_pune",
            name="Pune Rural",
            state="Maharashtra",
            lat=18.5204,
            lng=73.8567,
            total_entrepreneurs=14200,
            active_businesses=4650,
            repayment_health_percent=94.5,
            at_risk_count=145
        ),
    ]
    for d in districts:
        db.add(d)
    db.commit()

    # 2. Villages in Gorakhpur
    villages = [
        Village(
            id="vil_bhiti",
            name="Bhiti Rawat",
            district_id="dist_gorakhpur",
            block="Sahjanwa",
            lat=26.7450,
            lng=83.2500,
            population=4200,
            milk_yield_liters_day=2400.0,
            power_availability_hours=19,
            primary_crops=["Wheat", "Paddy", "Mustard"]
        ),
        Village(
            id="vil_pipraich",
            name="Pipraich Khurd",
            district_id="dist_gorakhpur",
            block="Pipraich",
            lat=26.8320,
            lng=83.5200,
            population=5600,
            milk_yield_liters_day=3100.0,
            power_availability_hours=20,
            primary_crops=["Sugarcane", "Wheat", "Maize"]
        ),
        Village(
            id="vil_jangal",
            name="Jangal Kauria",
            district_id="dist_gorakhpur",
            block="Kauria",
            lat=26.8500,
            lng=83.3100,
            population=3800,
            milk_yield_liters_day=1950.0,
            power_availability_hours=18,
            primary_crops=["Vegetables", "Paddy", "Lentils"]
        ),
        Village(
            id="vil_campierganj",
            name="Campierganj Rural",
            district_id="dist_gorakhpur",
            block="Campierganj",
            lat=27.0200,
            lng=83.3500,
            population=6200,
            milk_yield_liters_day=2800.0,
            power_availability_hours=17,
            primary_crops=["Banana", "Paddy", "Mustard"]
        ),
    ]
    for v in villages:
        db.add(v)
    db.commit()

    # 3. Local Facilities around Bhiti Rawat (5km / 10km radius)
    facilities = [
        # Competitors
        LocalFacility(
            id="fac_1",
            name="Sharma Dairy Farm (3 Cattles)",
            facility_type="competitor",
            business_category="Dairy Farming",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7480,
            lng=83.2540,
            description="Local competitor selling raw milk to local tea stalls (approx 45 L/day)"
        ),
        LocalFacility(
            id="fac_2",
            name="Verma Flour & Spice Mill",
            facility_type="competitor",
            business_category="Food Processing",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7430,
            lng=83.2470,
            description="Small stone grinder, frequent queue of 2 hours during harvest season"
        ),
        # Chilling Centers & Bulk Coolers
        LocalFacility(
            id="fac_3",
            name="Parag Cooperative Chilling Center (3,000 L capacity)",
            facility_type="chilling_center",
            business_category="Dairy Farming",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7580,
            lng=83.2680,
            description="3.8 km away. Guaranteed daily purchase at ₹38-42/litre based on FAT/SNF testing."
        ),
        # Mandi / Market
        LocalFacility(
            id="fac_4",
            name="Sahjanwa Sub-Mandi & Daily Haat",
            facility_type="mandi",
            business_category="General",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7320,
            lng=83.2380,
            description="5.1 km away. Major hub on Tuesdays & Fridays with 4,000+ footfall."
        ),
        # Banks & Credit
        LocalFacility(
            id="fac_5",
            name="State Bank of India (Rural Branch - Sahjanwa)",
            facility_type="bank",
            business_category="Finance",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7360,
            lng=83.2420,
            description="2.4 km away. Lead bank with dedicated Agriculture & Mudra desk."
        ),
        LocalFacility(
            id="fac_6",
            name="Baroda UP Gramin Bank",
            facility_type="bank",
            business_category="Finance",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7490,
            lng=83.2510,
            description="1.2 km away. Active KCC and PMEGP loan sanction track record."
        ),
        # Suppliers
        LocalFacility(
            id="fac_7",
            name="Kisan Agro Feeds & Vet Meds",
            facility_type="supplier",
            business_category="Dairy Farming",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7410,
            lng=83.2490,
            description="1.8 km away. Stockist for mineral mixtures, silage, and veterinary care."
        ),
        # Transport
        LocalFacility(
            id="fac_8",
            name="Gorakhpur-Lucknow Expressway Pickup Point",
            facility_type="transport",
            business_category="Logistics",
            district_id="dist_gorakhpur",
            village_id="vil_bhiti",
            lat=26.7620,
            lng=83.2300,
            description="Direct cargo pick-up trucks to Lucknow and Varanasi."
        ),
    ]
    for f in facilities:
        db.add(f)
    db.commit()

    # 4. Schemes
    schemes = [
        Scheme(
            id="scheme_pmegp",
            name="PMEGP (Prime Minister Employment Generation Programme)",
            name_hi="प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
            ministry="Ministry of MSME",
            max_loan_amount=5000000.0,
            subsidy_percent_rural=25.0,
            special_category_subsidy_percent=35.0, # SC/ST/Women/OBC/Ex-Servicemen
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women", "Divyangjan"],
            processing_complexity="Medium",
            documents_required=["Aadhaar", "PAN Card", "Project Report (DPR)", "Rural Area Certificate", "EDP Training Certificate"],
            description="Credit-linked subsidy scheme offering 25% subsidy for general rural and 35% for special categories.",
            description_hi="ग्रामीण क्षेत्रों के लिए 25% से 35% तक सरकारी सब्सिडी और बिना कोलैटरल ₹10-50 लाख तक ऋण।"
        ),
        Scheme(
            id="scheme_mudra_kishore",
            name="PM Mudra Yojana (Kishore Category)",
            name_hi="प्रधानमंत्री मुद्रा योजना (किशोर लोन)",
            ministry="Ministry of Finance",
            max_loan_amount=500000.0,
            subsidy_percent_rural=0.0, # Interest subvention & collateral free
            special_category_subsidy_percent=0.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women", "Divyangjan"],
            processing_complexity="Low",
            documents_required=["Aadhaar", "Bank Statement 6 Months", "Quotation of Machinery", "Address Proof"],
            description="Fast-track collateral-free loan from ₹50,000 to ₹5,00,000 for purchasing equipment and stock.",
            description_hi="₹50,000 से ₹5 लाख तक का बिना गारंटी लोन, आसान कागजी प्रक्रिया के साथ।"
        ),
        Scheme(
            id="scheme_pmfme",
            name="PMFME (Micro Food Processing Enterprises Scheme)",
            name_hi="पीएम सूक्ष्म खाद्य उद्यम योजना (PMFME)",
            ministry="Ministry of Food Processing Industries",
            max_loan_amount=1000000.0,
            subsidy_percent_rural=35.0,
            special_category_subsidy_percent=35.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women"],
            processing_complexity="Medium",
            documents_required=["Aadhaar", "FSSAI registration (or intent)", "Project DPR", "Bank Statement", "Electricity Bill"],
            description="35% credit-linked capital subsidy for individual micro-food processing units (flour, mustard oil, pickles, dairy).",
            description_hi="खाद्य प्रसंस्करण इकाइयों (तेल मिल, आटा चक्की, डेयरी) के लिए 35% सब्सिडी (अधिकतम ₹10 लाख)।"
        ),
        Scheme(
            id="scheme_standup_india",
            name="Stand-Up India Scheme",
            name_hi="स्टैंड-अप इंडिया योजना",
            ministry="Ministry of Finance",
            max_loan_amount=10000000.0,
            subsidy_percent_rural=15.0,
            special_category_subsidy_percent=25.0,
            collateral_free=False,
            eligible_categories=["SC", "ST", "Women"],
            processing_complexity="High",
            documents_required=["Caste Certificate", "Aadhaar", "Detailed Business Plan", "ITR/Net Worth Statement"],
            description="Promotes entrepreneurship among SC/ST and Women with bank loans between ₹10 Lakh and ₹1 Crore.",
            description_hi="अनुसूचित जाति (SC), अनुसूचित जनजाति (ST) और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक ऋण।"
        ),
        Scheme(
            id="scheme_svep",
            name="SVEP (Start-up Village Entrepreneurship Programme)",
            name_hi="स्टार्ट-अप विलेज एंटरप्रेन्योरशिप प्रोग्राम (SVEP)",
            ministry="Ministry of Rural Development",
            max_loan_amount=500000.0,
            subsidy_percent_rural=20.0,
            special_category_subsidy_percent=30.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women", "Divyangjan"],
            processing_complexity="Low",
            documents_required=["Aadhaar Card", "Gram Panchayat Resident Certificate", "CRP-EP Endorsed Business Plan", "Bank Passbook", "Passport Photo"],
            description="MoRD flagship sub-scheme under DAY-NRLM to set up rural village micro-enterprises with Community Enterprise Fund (CEF) loans up to ₹5 Lakh and dedicated CRP-EP mentoring.",
            description_hi="ग्रामीण विकास मंत्रालय (MoRD) की प्रमुख ग्रामीण उद्यम योजना। सामुदायिक उद्यम निधि (CEF) से बिना गारंटी ₹5 लाख तक वित्तीय सहायता एवं CRP-EP द्वारा जमीनी सहयोग।"
        ),
        Scheme(
            id="scheme_day_nrlm",
            name="DAY-NRLM Lakhpati Didi Enterprise Scheme",
            name_hi="दीनदयाल अंत्योदय योजना - एनआरएलएम (लखपति दीदी योजना)",
            ministry="Ministry of Rural Development",
            max_loan_amount=1000000.0,
            subsidy_percent_rural=25.0,
            special_category_subsidy_percent=35.0,
            collateral_free=True,
            eligible_categories=["Women", "General", "SC", "ST", "OBC"],
            processing_complexity="Low",
            documents_required=["SHG Member Certificate", "Aadhaar Card", "Bank Passbook", "SHG Resolution", "Micro-Investment Plan (MIP)"],
            description="MoRD initiative enabling rural women SHG members to start micro-enterprises with collateral-free bank credit up to ₹10 Lakh and 7% concessional interest subvention.",
            description_hi="ग्रामीण विकास मंत्रालय का महिला स्व-सहायता समूह उद्यम कार्यक्रम। ₹10 लाख तक बिना गारंटी बैंक ऋण, 7% रियायती ब्याज दर और लखपति दीदी आय सहायता।"
        ),
        Scheme(
            id="scheme_rseti",
            name="RSETI Rural Youth Self-Employment & Credit Linkage",
            name_hi="ग्रामीण स्वरोजगार प्रशिक्षण संस्थान (RSETI) ऋण व कौशल योजना",
            ministry="Ministry of Rural Development",
            max_loan_amount=300000.0,
            subsidy_percent_rural=15.0,
            special_category_subsidy_percent=25.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women", "Rural Youth"],
            processing_complexity="Low",
            documents_required=["RSETI Training Completion Certificate", "Aadhaar Card", "Age Proof (18-45 yrs)", "Gram Panchayat Certificate", "Bank Passbook"],
            description="MoRD institutional programme offering free residential skill training followed by direct bank credit linkage for rural youth in 64+ trades.",
            description_hi="ग्रामीण विकास मंत्रालय द्वारा संचालित। 64+ व्यवसायों में निःशुल्क आवासीय प्रशिक्षण और बैंक से सीधा व्यवसाय ऋण।"
        ),
        Scheme(
            id="scheme_vishwakarma",
            name="PM Vishwakarma Scheme (Artisans & Crafts)",
            name_hi="प्रधानमंत्री विश्वकर्मा योजना (कारीगर व शिल्पकार)",
            ministry="Ministry of MSME",
            max_loan_amount=300000.0,
            subsidy_percent_rural=15.0,
            special_category_subsidy_percent=20.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Women", "Artisans"],
            processing_complexity="Low",
            documents_required=["Aadhaar Card", "Mobile Linked Aadhaar", "Ration Card", "Artisan Trade Self-Declaration", "Bank Account Details"],
            description="MoMSME flagship scheme for 18 traditional crafts offering ₹15,000 modern toolkit grant, daily training stipend, and ₹3 Lakh collateral-free loan @ 5% fixed interest.",
            description_hi="सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MoMSME) द्वारा 18 पारंपरिक शिल्पों हेतु ₹15,000 टूलकिट अनुदान, 5% ब्याज पर ₹3 लाख तक ऋण।"
        ),
        Scheme(
            id="scheme_sfurti",
            name="SFURTI (Regeneration of Traditional Industries Clusters)",
            name_hi="स्फूर्ति योजना (पारंपरिक उद्योग क्लस्टर योजना)",
            ministry="Ministry of MSME",
            max_loan_amount=25000000.0,
            subsidy_percent_rural=90.0,
            special_category_subsidy_percent=95.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Artisans", "SHGs", "FPOs"],
            processing_complexity="Medium",
            documents_required=["Cluster SPV / Trust Registration", "Detailed Project Report (DPR)", "Land Lease / Ownership Proof", "Member Artisans Aadhaar List", "Bank Consent Letter"],
            description="MoMSME grant providing up to 90% assistance (up to ₹2.5-5 Cr) for Common Facility Centres (CFC), modern machinery, and packaging for rural artisan clusters.",
            description_hi="सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय की क्लस्टर योजना। ग्रामीण दस्तकारों, खादी, शहद, बांस समूहों को साझा सुविधा केंद्र हेतु 90% तक सरकारी अनुदान।"
        ),
        Scheme(
            id="scheme_aspire",
            name="ASPIRE (Rural Industries & Livelihood Business Incubators)",
            name_hi="एस्पायर योजना (ग्रामीण नवाचार व आजीविका इनक्यूबेटर)",
            ministry="Ministry of MSME",
            max_loan_amount=10000000.0,
            subsidy_percent_rural=80.0,
            special_category_subsidy_percent=90.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Youth", "Entrepreneurs"],
            processing_complexity="Medium",
            documents_required=["Agro-Rural Business Proposal", "Institution / Agency Registration", "DPR for Machinery & Training", "Space Availability Proof", "Bank Mandate"],
            description="MoMSME scheme to set up Livelihood Business Incubators (LBIs) and promote agro-rural entrepreneurship and local value addition.",
            description_hi="सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय की नवाचार योजना। कृषि व ग्रामीण मूल्य संवर्धन उद्योग हेतु इनक्यूबेशन व वित्तीय सहायता।"
        ),
        Scheme(
            id="scheme_ahidf",
            name="AHIDF (Animal Husbandry Infrastructure Development Fund)",
            name_hi="पशुपालन अवसंरचना विकास निधि (AHIDF)",
            ministry="Dept of Animal Husbandry & Dairying (DAHD)",
            max_loan_amount=50000000.0,
            subsidy_percent_rural=15.0,
            special_category_subsidy_percent=20.0,
            collateral_free=False,
            eligible_categories=["General", "SC", "ST", "OBC", "FPO", "SHG", "Private Enterprise"],
            processing_complexity="High",
            documents_required=["Techno-Economic DPR", "Land Title / 10-Yr Lease", "Pollution Control NOC", "Audited Financials", "Bank Sanction Letter"],
            description="DAHD scheme for dairy processing, milk chilling centers, and animal feed plants with 3% interest subvention and 25% credit guarantee by NABARD.",
            description_hi="डेयरी प्रसंस्करण, मिल्क चिलिंग प्लांट, पशु आहार निर्माण हेतु 3% ब्याज छूट, नाबार्ड द्वारा 25% क्रेडिट गारंटी और 2 वर्ष का मोरेटोरियम।"
        ),
        Scheme(
            id="scheme_aif",
            name="AIF (Agriculture Infrastructure Fund)",
            name_hi="कृषि अवसंरचना कोष (AIF)",
            ministry="Ministry of Agriculture & Farmers Welfare",
            max_loan_amount=20000000.0,
            subsidy_percent_rural=15.0,
            special_category_subsidy_percent=18.0,
            collateral_free=True,
            eligible_categories=["General", "SC", "ST", "OBC", "Farmers", "FPO", "SHG"],
            processing_complexity="Medium",
            documents_required=["Aadhaar & PAN Card", "AIF DPR / Machinery Quotations", "Land Records / Khatauni", "Bank Account Statement", "Local Authority NOC"],
            description="Post-harvest infrastructure and community farming assets financing with 3% interest subvention up to ₹2 Crore and CGTMSE fee coverage.",
            description_hi="फसल कटाई उपरांत प्रबंधन (कोल्ड रूम, ग्रेडिंग-पैकिंग यूनिट, गोदाम) हेतु ₹2 करोड़ तक 3% ब्याज छूट व CGTMSE गारंटी कवर।"
        ),
    ]
    for s in schemes:
        db.add(s)
    db.commit()

    # 5. Users & Sample Applications
    # Citizen Ramesh (Beneficiary)
    u_ramesh = User(
        id="user_ramesh",
        phone="9876543210",
        email=None,
        full_name="Ramesh Kumar Yadav",
        role="entrepreneur",
        district_id="dist_gorakhpur",
        block="Sahjanwa",
        village="Bhiti Rawat",
        social_category="OBC"
    )
    db.add(u_ramesh)
    
    p_ramesh = EntrepreneurProfile(
        id="prof_ramesh",
        user_id="user_ramesh",
        capital=80000.0,
        skills=["Dairy Farming", "Agriculture"],
        experience_years=2,
        land_sqft=800,
        constraints="Needs daily cashflow for family expenses",
        preferred_sector="Dairy"
    )
    db.add(p_ramesh)

    # Officer Users
    u_district_officer = User(
        id="officer_district_gkp",
        phone="9988776655",
        email="district.gorakhpur@gramudyam.gov.in",
        full_name="Rajeshwar Prasad (IAS)",
        role="district_officer",
        district_id="dist_gorakhpur",
        block="District HQ",
        village=None,
        social_category="General"
    )
    db.add(u_district_officer)

    u_field_officer = User(
        id="officer_field_sahjanwa",
        phone="9911223344",
        email="field.sahjanwa@gramudyam.gov.in",
        full_name="Sanjay Verma (VDO)",
        role="field_officer",
        district_id="dist_gorakhpur",
        block="Sahjanwa",
        village="Bhiti Rawat",
        social_category="General"
    )
    db.add(u_field_officer)

    u_sca_officer = User(
        id="officer_sca_welfare",
        phone="9955443322",
        email="sca.welfare@gramudyam.gov.in",
        full_name="Dr. Sunita Bharti",
        role="sca_pwd_officer",
        district_id="dist_gorakhpur",
        block="District HQ",
        village=None,
        social_category="SC"
    )
    db.add(u_sca_officer)

    u_super_admin = User(
        id="admin_super",
        phone="9999999999",
        email="admin@gramudyam.gov.in",
        full_name="National Platform Administrator",
        role="super_admin",
        district_id=None,
        block=None,
        village=None,
        social_category="General"
    )
    db.add(u_super_admin)
    db.commit()

    # 6. Sample Applications to populate Officer Dashboard & Map
    apps = [
        BusinessApplication(
            id="app_101",
            user_id="user_ramesh",
            applicant_name="Ramesh Kumar Yadav",
            business_name="Yadav High-Yield Dairy Unit",
            business_category="Dairy Farming",
            district_id="dist_gorakhpur",
            village_name="Bhiti Rawat",
            lat=26.7450,
            lng=83.2500,
            total_project_cost=250000.0,
            own_contribution=50000.0,
            loan_amount=200000.0,
            subsidy_amount=70000.0, # 35% under PMEGP for rural OBC
            monthly_emi=4250.0,
            moratorium_months=3,
            scheme_id="scheme_pmegp",
            status="launched",
            repayment_health="healthy",
            credit_score_estimate=760,
            notes="2 Murrah Buffaloes purchased. Daily supply of 24L to Parag collection center active."
        ),
        BusinessApplication(
            id="app_102",
            user_id="user_ramesh",
            applicant_name="Sunita Devi",
            business_name="Maa Durga Mustard Oil Expeller",
            business_category="Food Processing",
            district_id="dist_gorakhpur",
            village_name="Pipraich Khurd",
            lat=26.8320,
            lng=83.5200,
            total_project_cost=350000.0,
            own_contribution=70000.0,
            loan_amount=280000.0,
            subsidy_amount=98000.0,
            monthly_emi=5900.0,
            moratorium_months=4,
            scheme_id="scheme_pmfme",
            status="approved",
            repayment_health="healthy",
            credit_score_estimate=740,
            notes="35% PMFME subsidy sanctioned by Baroda UP Bank Pipraich branch."
        ),
        BusinessApplication(
            id="app_103",
            user_id="user_ramesh",
            applicant_name="Anil Paswan",
            business_name="Paswan Solar Pump Repair & Spares",
            business_category="Solar & Electric Repair",
            district_id="dist_gorakhpur",
            village_name="Jangal Kauria",
            lat=26.8500,
            lng=83.3100,
            total_project_cost=150000.0,
            own_contribution=25000.0,
            loan_amount=125000.0,
            subsidy_amount=43750.0,
            monthly_emi=2700.0,
            moratorium_months=2,
            scheme_id="scheme_mudra_kishore",
            status="launched",
            repayment_health="at_risk",
            credit_score_estimate=620,
            notes="Irregular payment in last 2 cycles due to seasonal demand drop. Field officer follow-up recommended."
        ),
        BusinessApplication(
            id="app_104",
            user_id="user_ramesh",
            applicant_name="Gita Rawat",
            business_name="Kauria Organic Spice Packing Unit",
            business_category="Food Processing",
            district_id="dist_gorakhpur",
            village_name="Jangal Kauria",
            lat=26.8530,
            lng=83.3140,
            total_project_cost=200000.0,
            own_contribution=30000.0,
            loan_amount=170000.0,
            subsidy_amount=59500.0,
            monthly_emi=3600.0,
            moratorium_months=3,
            scheme_id="scheme_pmegp",
            status="submitted",
            repayment_health="healthy",
            credit_score_estimate=710,
            notes="DPR submitted. Ready for District Officer review and subsidy approval."
        ),
        BusinessApplication(
            id="app_105",
            user_id="user_ramesh",
            applicant_name="Mohammad Irfan",
            business_name="Kisan Agro Tool Rental & Welding",
            business_category="Agri Equipment Rental",
            district_id="dist_gorakhpur",
            village_name="Campierganj Rural",
            lat=27.0200,
            lng=83.3500,
            total_project_cost=400000.0,
            own_contribution=80000.0,
            loan_amount=320000.0,
            subsidy_amount=80000.0,
            monthly_emi=6800.0,
            moratorium_months=4,
            scheme_id="scheme_pmegp",
            status="launched",
            repayment_health="watch",
            credit_score_estimate=680,
            notes="Operating at 75% capacity. Watch list due to pending invoice clearance from local farmers."
        ),
    ]
    for a in apps:
        db.add(a)
    db.commit()

    # 7. Sample Copilot Daily Transactions for Ramesh's Dairy unit (app_101)
    txs = [
        DailyTransaction(id="tx_1", application_id="app_101", date="2026-09-01", type="income", category="milk_sale", amount=960.0, description="24 Litres milk sold to Parag Chilling Center @ ₹40/L"),
        DailyTransaction(id="tx_2", application_id="app_101", date="2026-09-02", type="expense", category="fodder", amount=350.0, description="Green fodder & dry husk purchased from Kisan Agro"),
        DailyTransaction(id="tx_3", application_id="app_101", date="2026-09-03", type="income", category="milk_sale", amount=1000.0, description="25 Litres morning & evening milk collection"),
        DailyTransaction(id="tx_4", application_id="app_101", date="2026-09-04", type="expense", category="vet_care", amount=200.0, description="Calcium supplement and mineral mixture"),
        DailyTransaction(id="tx_5", application_id="app_101", date="2026-09-05", type="income", category="milk_sale", amount=960.0, description="24 Litres milk sold @ ₹40/L"),
        DailyTransaction(id="tx_6", application_id="app_101", date="2026-09-06", type="income", category="dung_cake_sale", amount=300.0, description="Bio-fertilizer dung sold to local nursery"),
        DailyTransaction(id="tx_7", application_id="app_101", date="2026-09-07", type="expense", category="emi_payment", amount=4250.0, description="Monthly loan EMI paid to Baroda UP Gramin Bank"),
    ]
    for t in txs:
        db.add(t)
    db.commit()

    print("Database seeding completed successfully!")
