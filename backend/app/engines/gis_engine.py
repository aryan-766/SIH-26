import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import LocalFacility, Village
from app.cache.redis_client import cache

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes distance in kilometers between two GPS coordinates using Haversine formula.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def get_gis_facility_analysis(village_id: str, radius_km: float, db: Session) -> Dict[str, Any]:
    """
    Analyzes all local facilities within radius_km around a village.
    Cached in Redis under gis:{village_id}:{radius_km} for 1 hour.
    """
    cache_key = f"gis:{village_id}:{int(radius_km)}"
    
    def fetch_analysis():
        village = db.query(Village).filter(Village.id == village_id).first()
        if not village:
            # Fallback coordinates (Gorakhpur center)
            v_lat, v_lng, v_name = 26.7450, 83.2500, "Bhiti Rawat"
        else:
            v_lat, v_lng, v_name = village.lat, village.lng, village.name

        facilities = db.query(LocalFacility).all()
        nearby = []
        counts = {
            "competitor": 0,
            "chilling_center": 0,
            "mandi": 0,
            "bank": 0,
            "supplier": 0,
            "transport": 0
        }

        for fac in facilities:
            dist = haversine_distance(v_lat, v_lng, fac.lat, fac.lng)
            if dist <= radius_km:
                ftype = fac.facility_type
                if ftype in counts:
                    counts[ftype] += 1
                nearby.append({
                    "id": fac.id,
                    "name": fac.name,
                    "facility_type": ftype,
                    "business_category": fac.business_category,
                    "distance_km": dist,
                    "lat": fac.lat,
                    "lng": fac.lng,
                    "description": fac.description
                })

        # Sort by distance
        nearby.sort(key=lambda x: x["distance_km"])

        # Infrastructure Health Index (0-100)
        # Having at least 1 bank, 1 mandi, 1 supplier, and low competitor density is ideal
        infra_score = 40
        if counts["bank"] >= 1: infra_score += 20
        if counts["mandi"] >= 1: infra_score += 15
        if counts["supplier"] >= 1: infra_score += 15
        if counts["chilling_center"] >= 1: infra_score += 10

        return {
            "village_id": village_id,
            "village_name": v_name,
            "radius_km": radius_km,
            "center": {"lat": v_lat, "lng": v_lng},
            "infrastructure_score": min(100, infra_score),
            "counts": counts,
            "facilities": nearby
        }

    return cache.get_or_set(cache_key, ttl_seconds=3600, fetch_fn=fetch_analysis)
