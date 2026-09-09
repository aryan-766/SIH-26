import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    phone = Column(String, index=True, nullable=True)
    email = Column(String, index=True, nullable=True)
    full_name = Column(String, nullable=False)
    role = Column(String, default="entrepreneur", index=True) # entrepreneur, field_officer, district_officer, sca_pwd_officer, super_admin
    district_id = Column(String, ForeignKey("districts.id"), nullable=True)
    block = Column(String, nullable=True)
    village = Column(String, nullable=True)
    social_category = Column(String, default="General") # General, SC, ST, OBC, Women, Divyangjan
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("EntrepreneurProfile", back_populates="user", uselist=False)
    applications = relationship("BusinessApplication", back_populates="user")

class EntrepreneurProfile(Base):
    __tablename__ = "entrepreneur_profiles"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    capital = Column(Float, default=50000.0)
    skills = Column(JSON, default=list) # e.g. ["Dairy", "Food Processing", "Retail"]
    experience_years = Column(Integer, default=1)
    land_sqft = Column(Integer, default=500)
    constraints = Column(String, nullable=True)
    preferred_sector = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

class District(Base):
    __tablename__ = "districts"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    state = Column(String, default="Uttar Pradesh")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    total_entrepreneurs = Column(Integer, default=0)
    active_businesses = Column(Integer, default=0)
    repayment_health_percent = Column(Float, default=92.0)
    at_risk_count = Column(Integer, default=0)

    villages = relationship("Village", back_populates="district")
    facilities = relationship("LocalFacility", back_populates="district")

class Village(Base):
    __tablename__ = "villages"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    district_id = Column(String, ForeignKey("districts.id"))
    block = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    population = Column(Integer, default=3500)
    milk_yield_liters_day = Column(Float, default=1800.0)
    power_availability_hours = Column(Integer, default=18)
    primary_crops = Column(JSON, default=list)

    district = relationship("District", back_populates="villages")
    facilities = relationship("LocalFacility", back_populates="village")

class LocalFacility(Base):
    __tablename__ = "local_facilities"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    facility_type = Column(String, nullable=False) # competitor, chilling_center, mandi, bank, supplier, transport
    business_category = Column(String, nullable=True) # Dairy, Food Processing, etc.
    district_id = Column(String, ForeignKey("districts.id"))
    village_id = Column(String, ForeignKey("villages.id"), nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    description = Column(String, nullable=True)

    district = relationship("District", back_populates="facilities")
    village = relationship("Village", back_populates="facilities")

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    name_hi = Column(String, nullable=False)
    ministry = Column(String, nullable=False)
    max_loan_amount = Column(Float, default=1000000.0)
    subsidy_percent_rural = Column(Float, default=25.0)
    special_category_subsidy_percent = Column(Float, default=35.0) # For SC/ST/Women
    collateral_free = Column(Boolean, default=True)
    eligible_categories = Column(JSON, default=list) # ["General", "SC", "ST", "Women", "OBC"]
    processing_complexity = Column(String, default="Low") # Low, Medium, High
    documents_required = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)

class BusinessApplication(Base):
    __tablename__ = "business_applications"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    applicant_name = Column(String, nullable=False)
    business_name = Column(String, nullable=False)
    business_category = Column(String, nullable=False) # Dairy, Food Processing, Solar Repair, Tailoring
    district_id = Column(String, ForeignKey("districts.id"))
    village_name = Column(String, nullable=False)
    lat = Column(Float, default=26.76)
    lng = Column(Float, default=83.37)
    
    total_project_cost = Column(Float, nullable=False)
    own_contribution = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    subsidy_amount = Column(Float, default=0.0)
    monthly_emi = Column(Float, default=0.0)
    moratorium_months = Column(Integer, default=3)
    
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=True)
    status = Column(String, default="submitted") # draft, submitted, verified, approved, launched, rejected
    repayment_health = Column(String, default="healthy") # healthy, watch, at_risk
    credit_score_estimate = Column(Integer, default=740)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")

class DailyTransaction(Base):
    __tablename__ = "daily_transactions"

    id = Column(String, primary_key=True)
    application_id = Column(String, ForeignKey("business_applications.id"))
    date = Column(String, nullable=False)
    type = Column(String, nullable=False) # income, expense
    category = Column(String, nullable=False) # milk_sale, fodder, equipment_fuel, wage, miscellaneous
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
