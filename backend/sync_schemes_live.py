import sys
import os

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

# Ensure backend root is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, init_db
from app.engines.scheme_sync import sync_schemes_from_india_gov
from app.db.models import Scheme

def main():
    print("=" * 60)
    print("NREIP Live Scheme Synchronization Engine")
    print("Source: National Portal of India (https://www.india.gov.in/)")
    print("=" * 60)

    init_db()
    db = SessionLocal()
    try:
        res = sync_schemes_from_india_gov(db, max_pages=5)
        print("\nSync Results:")
        print(f"Status: {res['status']}")
        print(f"Total Rural Schemes in DB: {res['total_rural_schemes_available']}")
        print(f"Newly Added Schemes: {res['newly_added']}")
        print(f"Updated Schemes: {res['updated']}")
        print(f"Ministries Covered ({len(res['ministries_covered'])}):")
        for m in res['ministries_covered'][:10]:
            print(f"  - {m}")
        
        print("\nSample Synced Schemes:")
        schemes = db.query(Scheme).limit(10).all()
        for idx, s in enumerate(schemes):
            print(f"{idx+1}. [{s.ministry}] {s.name}")
            print(f"   Ceiling: ₹{s.max_loan_amount:,.0f} | Subsidy: {s.subsidy_percent_rural}% - {s.special_category_subsidy_percent}% | Portal: {s.portal_url}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
